import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { randomBytes } from 'crypto';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: any) {
    const res = context.switchToHttp().getResponse();
    const nonce = randomBytes(32).toString('hex');

    res.cookie('oauth_state', nonce, { path: '/', sameSite: 'lax', maxAge: 5 * 60 * 1000 }); //5 min
    return { scope: ['email', 'profile'], state: nonce };
  }
}