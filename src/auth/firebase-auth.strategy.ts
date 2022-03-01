import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { FirebaseApp } from '../infra/firebase.module';
import * as firebase from 'firebase-admin';


@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private readonly logger = new Logger(FirebaseAuthStrategy.name);

  constructor(private readonly firebaseApp: FirebaseApp) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    const firebaseUser: any = await this.firebaseApp
      .getAuth()
      .verifyIdToken(token, true)
      .catch((err) => {
        this.logger.log(`Error while authenticating user: ${err}`)
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }
    return firebaseUser;
  }
}