import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseApp } from './infra/firebase.module';
import { FirebaseAuthStrategy } from './auth/firebase-auth.strategy';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, FirebaseApp, FirebaseAuthStrategy],
})
export class AppModule {}

