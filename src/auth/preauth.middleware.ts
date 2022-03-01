import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PreauthMiddleware.name);

  private firebaseApp: any;

  constructor() {
    this.firebaseApp = firebase.initializeApp();
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.firebaseApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
            const user = {
                email: decodedToken.email,
                uid: decodedToken.uid,
                name: decodedToken.name,
            };
            req['user'] = user;
            next();
        })
        .catch(error => {
            this.logger.log(`Error while authenticating a user on ${req.url}: ${error}`)
            this.accessDenied(req.url, res);
        });
    } else {
        this.accessDenied(req.url, res);
    }
  }

  private accessDenied(url: string, res: Response) {
    this.logger.log(`Access denied to ${url}`);
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
