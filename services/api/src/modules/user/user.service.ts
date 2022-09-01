/** @format */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  InjectMethod,
  InjectMethodFactory,
  Method,
  MethodFactory,
  TOKEN,
} from '@vypham0209/nestjs-common';
import { compareSync, hashSync } from 'bcrypt';
import { World } from 'modules/world/world.schema';
import { Types } from 'mongoose';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { USER_POPULATE } from './user.constant';
import { User } from './user.schema';

@Injectable()
export class UserService {
  @InjectMethodFactory(User.collectionName)
  readonly userMethodFactory: MethodFactory<User>;
  @InjectMethod(World.collectionName) readonly worldMethod: Method<World>;
  @InjectMethod(User.collectionName) readonly userMethod: Method<User>;
  @Inject(TOKEN.USER) user: JWTPayload;
  @Inject() readonly jwtService: JwtService;

  async get() {
    const user = await this.userMethod.findById(this.user._id, {
      isThrow: true,
      populate: USER_POPULATE,
    });
    return user;
  }

  async signup({
    world,
    username,
    password,
    _id,
  }: SignupDto & { _id?: DataId }) {
    const findWorld = await this.worldMethod.findById(
      new Types.ObjectId(world),
      { isThrow: true },
    );
    const method = this.userMethodFactory(findWorld.tenant);
    await method.exists(
      { username },
      { throwCase: 'IF_EXISTS', message: 'Email already exists' },
    );

    const hashPassword = hashSync(password, 10);
    const data = await method.model.create({
      _id: _id || new Types.ObjectId(),
      username,
      password: hashPassword,
    });
    return data;
  }

  async signin({ world, username, password }: SigninDto) {
    const findWorld = await this.worldMethod.findById(
      new Types.ObjectId(world),
      { isThrow: true },
    );
    const method = this.userMethodFactory(findWorld.tenant);

    const user = await method.findOne({ username }, { isThrow: true });
    const isValid = compareSync(password, user.password);
    if (!isValid) throw new BadRequestException('Incorrect password');

    const token = await this.jwtService.signAsync(
      {
        _id: user._id,
        tenant: findWorld.tenant,
      },
      {
        secret: global.Config.JWT_SECRET,
      },
    );

    return {
      token,
    };
  }
}
