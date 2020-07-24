import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    const userId = payload.sub;
    const user = await this.usersService.findOne(userId);
    if (!user || user.status !== User.STATUSES.ACTIVE){
      return false;
    }
    user.last_seen = Math.floor((new Date().getTime()));
    await user.save();
    return { 
      id: userId,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
    };
  }
}