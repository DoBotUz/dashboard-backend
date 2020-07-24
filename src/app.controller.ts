import { Controller, Request, Post, Get, UseGuards, Body, Param } from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users/users.service';

class LoginResDto {
  @IsNotEmpty()
  access_token: string;
}

class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsNotEmpty()
  @Length(6, 255)
  password: string;
}

class SignUpDto {
  @IsNotEmpty()
  @Length(1, 255)
  first_name: string;

  @IsNotEmpty()
  @Length(1, 255)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(3, 255)
  email: string;
  
  @IsNotEmpty()
  @Length(6, 255)
  password: string;
}

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Sucessfuly logged in',
    type: LoginResDto
  })
  async login(@Request() req): Promise<LoginResDto> {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    description: 'Sucessfuly Signed up',
    type: Object
  })
  async signup(@Body() signUpDto: SignUpDto): Promise<boolean> {
    return this.authService.signup(signUpDto);
  }

  @Get('auth/isemailunique/:email')
  @ApiOkResponse({
    description: "Is email unique?",
    type: Boolean
  })
  async isEmailUnique(@Param('email') email: string): Promise<boolean> {
    return await this.usersService.isEmailUnique(email);
  }

  @Get()
  index(): string {
    return "Hello world";
  }
}

