import { Controller, Request, Post, Get, UseGuards, Body, Param, BadRequestException } from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users/users.service';
import { UniqueEmail } from 'src/users/validators';
import { LocalhostGuard } from './common/guards/localhost.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { User, STATUSES } from './users/user.entity';

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
  @Validate(UniqueEmail)
  @Length(3, 255)
  email: string;
  
  @IsNotEmpty()
  @Length(6, 255)
  password: string;
  
  password_hash: string;
  verification_token: string;
}

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private readonly mailerService: MailerService

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
    type: Boolean
  })
  async signup(@Body() signUpDto: SignUpDto): Promise<boolean> {
    const model = await this.usersService.createNewSignUp(signUpDto);
    this
    .mailerService
    .sendMail({
      to: model.email,
      from: 'info@dobot.uz',
      bcc: 'info@dobot.uz',
      subject: 'DoBot: Успешная регистрация      ',
      template: 'registration', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
      context: {  // Data to be sent to template engine.
        first_name: model.first_name,
        email: model.email,
        activation_link: `${process.env.FRONTEND_HOST}/pages/complete-registration?token=${model.verification_token}`,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

    return true;
  }

  @Get('auth/isemailunique/:email')
  @ApiOkResponse({
    description: "Is email unique?",
    type: Boolean
  })
  async isEmailUnique(@Param('email') email: string): Promise<boolean> {
    return await this.usersService.isEmailUnique(email);
  }

  @Post('/verify-email-token/:token')
  @ApiOkResponse({
    description: "Active user acc by token",
    type: LoginResDto
  })
  async verifyToken(@Param('token') token: string): Promise<LoginResDto> {
    const user = await this.usersService.findOneByToken(token);
    if (!user) {
      throw new BadRequestException('404');
    }
    user.status = STATUSES.ACTIVE;
    user.verification_token = null;
    this.usersService.updateOneModel(user);
    return this.authService.login(user);
  }

  @Get()
  index(): string {
    return "Hello world";
  }
}

