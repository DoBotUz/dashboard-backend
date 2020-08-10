import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, STATUSES } from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await this.usersService.comparePasswords(pass, user.password_hash) && user.status === STATUSES.ACTIVE) {
      return user;
    }
    return null;
  }

  login(user: User): any {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(data: any): Promise<boolean> {
    await this.usersService.createNew(data);
    return true;
  }
}