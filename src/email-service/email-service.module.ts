import { Module } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { EmailServiceController } from './email-service.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [EmailServiceController],
  providers: [EmailServiceService],
  exports: [EmailServiceService],
})
export class EmailServiceModule {}
