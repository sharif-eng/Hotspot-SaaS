import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AirtelService {
  private readonly logger = new Logger(AirtelService.name);
  private readonly apiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('AIRTEL_API_URL');
    this.clientId = this.configService.get<string>('AIRTEL_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('AIRTEL_CLIENT_SECRET');
  }

  async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/auth/oauth2/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get Airtel access token', error);
      throw error;
    }
  }

  async requestPayment(phoneNumber: string, amount: number, currency = 'UGX'): Promise<any> {
    const accessToken = await this.getAccessToken();
    const transactionId = `TXN_${Date.now()}`;

    try {
      const response = await axios.post(
        `${this.apiUrl}/merchant/v1/payments/`,
        {
          reference: transactionId,
          subscriber: {
            country: 'UG',
            currency,
            msisdn: phoneNumber,
          },
          transaction: {
            amount,
            country: 'UG',
            currency,
            id: transactionId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Country': 'UG',
            'X-Currency': currency,
          },
        },
      );

      return {
        transactionId,
        status: 'PENDING',
        airtelResponse: response.data,
      };
    } catch (error) {
      this.logger.error('Airtel payment request failed', error);
      throw error;
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.apiUrl}/standard/v1/payments/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Country': 'UG',
            'X-Currency': 'UGX',
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to check Airtel payment status', error);
      throw error;
    }
  }
}