import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;

  constructor(private configService: ConfigService) {}

  private getEncryptionKey(): Buffer {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key || key.length !== this.keyLength) {
      throw new Error('Invalid encryption key. Must be 32 characters long.');
    }
    return Buffer.from(key, 'utf8');
  }

  encrypt(text: string): string {
    try {
      const key = this.getEncryptionKey();
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      cipher.setAAD(Buffer.from('additional-data'));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Combine iv + tag + encrypted data
      return iv.toString('hex') + tag.toString('hex') + encrypted;
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const key = this.getEncryptionKey();
      
      // Extract components
      const iv = Buffer.from(encryptedData.slice(0, this.ivLength * 2), 'hex');
      const tag = Buffer.from(encryptedData.slice(this.ivLength * 2, (this.ivLength + this.tagLength) * 2), 'hex');
      const encrypted = encryptedData.slice((this.ivLength + this.tagLength) * 2);
      
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAAD(Buffer.from('additional-data'));
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  compareHash(data: string, hash: string): boolean {
    const dataHash = this.hash(data);
    return crypto.timingSafeEqual(Buffer.from(dataHash), Buffer.from(hash));
  }
}