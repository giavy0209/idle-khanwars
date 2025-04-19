/** @format */

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@vypham0209/nestjs-common';
import { CONTROLLER } from 'enum/controller.enum';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from './user.service';
@Controller(CONTROLLER.USER)
@ApiTags('User api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async get() {
    const data = await this.userService.get();
    return {
      data,
      message: 'Get user successfully',
    };
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    console.log(123);
    
    const data = await this.userService.signup(body);

    return {
      data,
      message: 'Create user successfully',
    };
  }

  @Public()
  @Post('signin')
  async signin(@Body() body: SigninDto) {
    const data = await this.userService.signin(body);

    return {
      data,
      message: 'Signin successfully',
    };
  }
}
