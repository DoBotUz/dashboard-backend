import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationException } from '../validation-exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password'});
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(String(email), String(password));
    if (!user) {
      throw new ValidationException([
      {
        property: 'email', constraints: 'Email or Password is wrong'
      },
      {
        property: 'password', constraints: 'Email or Password is wrong'
      }
      ]);
    }
    return user;
  }
}