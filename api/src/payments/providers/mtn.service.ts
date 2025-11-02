import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

interface PaymentRequest {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

@Injectable()
export class MtnService {
  private readonly logger = new Logger(MtnService.name);
  private readonly apiUrl: string;
  private readonly subscriptionKey: string;
  private readonly apiUserId: string;
  private readonly apiKey: string;
  private readonly callbackUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.apiUrl = this.configService.get('MTN_API_URL');
    this.subscriptionKey = this.configService.get('MTN_SUBSCRIPTION_KEY');
    this.apiUserId = this.configService.get('MTN_API_USER_ID');
    this.apiKey = this.configService.get('MTN_API_KEY');
    this.callbackUrl = this.configService.get('MTN_CALLBACK_URL');
  }

  private async getAccessToken(): Promise<string> {
    try {
      const credentials = Buffer.from(`${this.apiUserId}:${this.apiKey}`).toString('base64');
      
      const response = await fetch(`${this.apiUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      this.logger.error(`Failed to get MTN access token: ${error.message}`);
      throw error;
    }
  }

  async requestToPay(phoneNumber: string, amount: number, currency: string = 'UGX', reference?: string) {
    try {
      const accessToken = await this.getAccessToken();
      const externalId = reference || uuidv4();
      const referenceId = uuidv4();

      const paymentRequest: PaymentRequest = {
        amount: amount.toString(),
        currency,
        externalId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.replace(/^\+/, ''), // Remove + prefix
        },
        payerMessage: 'WiFi Access Payment',
        payeeNote: `Payment for WiFi access - ${amount} ${currency}`,
      };

      const response = await fetch(`${this.apiUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment request failed: ${response.status} - ${errorText}`);
      }

      // Store payment in database
      const payment = await this.prisma.payment.create({
        data: {
          id: referenceId,
          userId: 'guest', // For guest payments
          amount,
          currency,
          method: 'MOBILE_MONEY',
          provider: 'MTN',
          externalId,
          status: 'PENDING',
          description: 'WiFi Access Payment',
          metadata: {
            phoneNumber,
            referenceId,
            paymentRequest,
          },
        },
      });

      this.logger.log(`Payment request created: ${referenceId} for ${phoneNumber}`);

      return {
        success: true,
        referenceId,
        externalId,
        message: 'Payment request sent successfully',
        instructions: {
          dial: '*165#',
          steps: [
            'Dial *165# on your MTN phone',
            'Select MoMoPay',
            'Enter merchant code when prompted',
            'Enter amount and confirm payment',
          ],
        },
      };
    } catch (error) {
      this.logger.error(`MTN payment request failed: ${error.message}`);
      throw error;
    }
  }

  async checkPaymentStatus(referenceId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.apiUrl}/collection/v1_0/requesttopay/${referenceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check payment status: ${response.statusText}`);
      }

      const paymentData = await response.json();
      
      // Update payment status in database
      await this.prisma.payment.update({
        where: { id: referenceId },
        data: {
          status: paymentData.status === 'SUCCESSFUL' ? 'COMPLETED' : 
                 paymentData.status === 'FAILED' ? 'FAILED' : 'PENDING',
          completedAt: paymentData.status === 'SUCCESSFUL' ? new Date() : null,
          metadata: {
            ...paymentData,
          },
        },
      });

      return {
        success: true,
        status: paymentData.status,
        amount: paymentData.amount,
        currency: paymentData.currency,
        referenceId,
        financialTransactionId: paymentData.financialTransactionId,
      };
    } catch (error) {
      this.logger.error(`Failed to check MTN payment status: ${error.message}`);
      throw error;
    }
  }

  async handleCallback(callbackData: any) {
    try {
      const { referenceId, status, financialTransactionId } = callbackData;

      // Update payment status
      const payment = await this.prisma.payment.update({
        where: { id: referenceId },
        data: {
          status: status === 'SUCCESSFUL' ? 'COMPLETED' : 'FAILED',
          completedAt: status === 'SUCCESSFUL' ? new Date() : null,
          metadata: callbackData,
        },
      });

      if (status === 'SUCCESSFUL') {
        this.logger.log(`Payment completed: ${referenceId} - ${financialTransactionId}`);
        
        // Trigger voucher generation
        return {
          success: true,
          payment,
          shouldGenerateVoucher: true,
        };
      }

      return {
        success: true,
        payment,
        shouldGenerateVoucher: false,
      };
    } catch (error) {
      this.logger.error(`Failed to handle MTN callback: ${error.message}`);
      throw error;
    }
  }

  async getAccountBalance() {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.apiUrl}/collection/v1_0/account/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get account balance: ${response.statusText}`);
      }

      const balanceData = await response.json();
      return {
        success: true,
        balance: balanceData.availableBalance,
        currency: balanceData.currency,
      };
    } catch (error) {
      this.logger.error(`Failed to get MTN account balance: ${error.message}`);
      throw error;
    }
  }
}