/** @format */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectMethod, Method, TOKEN } from '@vypham0209/nestjs-common';
import { SocketGateway } from 'modules/socket/socket.gateway';
import {
  USER_POPULATE,
  USER_POPULATE_CASTLE,
  USER_SIMPLE_SELECT,
} from 'modules/user/user.constant';
import { User, UserPullPopulate } from 'modules/user/user.schema';
import { ClanRequest } from './clan-request.schema';
import { CLAN_POPULATE, CLAN_REQUEST_POPULATE } from './clan.constant';
import { CLAN } from './clan.enum';
import { Clan } from './clan.schema';
import { PatchClanDto } from './dto/patch-clan.dto';
import { PostClanDto } from './dto/post-clan.dto';
import { RequestApprovalDto } from './dto/request-approval.dto';
import { Types } from 'mongoose';

@Injectable()
export class ClanService {
  @Inject(TOKEN.USER) user: JWTPayload;
  @Inject() socketGateway: SocketGateway;
  @InjectMethod(ClanRequest.collectionName)
  clanRequestMethod: Method<ClanRequest>;
  @InjectMethod(Clan.collectionName) clanMethod: Method<Clan>;
  @InjectMethod(User.collectionName) userMethod: Method<User>;

  async getOwnClan() {
    return await this.clanMethod.findOne(
      { owner: this.user._id },
      { isThrow: true, message: 'You are not own any clan' },
    );
  }

  async post({ name, description }: PostClanDto) {
    const user = await this.userMethod.findById(this.user._id, {
      isThrow: true,
    });
    if (user.clan) {
      throw new BadRequestException('You already join clan');
    }

    const clan = await this.clanMethod.model.create({
      name,
      description,
      owner: user._id,
    });
    user.clan = new Types.ObjectId(clan._id);
    await user.save();
    this.socketGateway.emitUser(
      await user.populate<UserPullPopulate>(USER_POPULATE),
    );
    return clan;
  }

  async get(queryParams: QueryParams) {
    const { data, total } = await this.clanMethod.find({
      query: {},
      populate: CLAN_POPULATE,
      lean: true,
      ...queryParams,
    });

    return { data, total };
  }

  async patch({ description }: PatchClanDto) {
    const ownClan = await this.getOwnClan();
    const clan = await this.clanMethod.findByIdAndUpdate(
      ownClan._id,
      { description },
      { isThrow: true },
    );
    return clan;
  }

  async deleteMyClan() {
    const user = await this.userMethod.findById(this.user._id, {
      isThrow: true,
    });
    const clan = await this.clanMethod.findById(user.clan, { isThrow: true });

    if (clan.owner.toString() === user._id.toString()) {
      clan.deletedAt = new Date();
      await clan.save();
      const users = await this.userMethod.find<UserPullPopulate>({
        query: { clan: clan._id },
        count: false,
        populate: USER_POPULATE,
      });
      await this.userMethod.model.updateMany(
        { clan: clan._id },
        { $unset: { clan: 1 } },
      );
      await this.clanRequestMethod.model.deleteMany({ clan: clan._id });

      users.forEach((u) => {
        u.set({ clan: undefined });
        this.socketGateway.emitUser(u);
      });
    } else {
      user.set({ clan: undefined });
      await user.save();
      this.socketGateway.emitUser(
        await user.populate<UserPullPopulate>(USER_POPULATE),
      );
    }

    return clan;
  }

  async requestJoin(clanId: DataId) {
    const user = await this.userMethod.findById(this.user._id, {
      isThrow: true,
    });
    if (user.clan) {
      throw new BadRequestException('You already have clan');
    }
    await this.clanMethod.exists(
      { _id: clanId },
      { throwCase: 'IF_NOT_EXISTS' },
    );
    await this.clanRequestMethod.exists(
      {
        clan: clanId,
        user: this.user._id,
        status: CLAN.REQUEST.APPROVAL.PENDING,
      },
      {
        throwCase: 'IF_EXISTS',
        message: 'You already send request to this clan',
      },
    );
    const data = await this.clanRequestMethod.model.create({
      clan: clanId,
      user: this.user._id,
    });
    return data;
  }

  async deleteRequest(clanId: DataId) {
    await this.clanRequestMethod.findOneAndDelete(
      { clan: clanId, user: this.user._id },
      { isThrow: true },
    );
  }

  async requestApproval(id: DataId, { status }: RequestApprovalDto) {
    const request = await this.clanRequestMethod.findById(id, {
      isThrow: true,
    });
    request.status = status;
    await request.save();
    switch (status) {
      case CLAN.REQUEST.APPROVAL.APPROVED:
        const user = await this.userMethod.findByIdAndUpdate<UserPullPopulate>(
          request.user,
          { clan: request.clan },
          { isThrow: true, populate: USER_POPULATE },
        );
        this.socketGateway.emitUser(user);
        break;
      default:
        break;
    }
  }

  async getMyClanRequest(queryParams: QueryParams) {
    const clan = await this.getOwnClan();
    const request = await this.clanRequestMethod.find({
      query: {
        clan: clan._id,
        status: CLAN.REQUEST.APPROVAL.PENDING,
      },
      populate: CLAN_REQUEST_POPULATE,
      lean: true,
      ...queryParams,
    });
    return request;
  }

  async getClanMember(queryParams: QueryParams) {
    const user = await this.userMethod.findById(this.user._id, {
      isThrow: true,
    });
    if (!user.clan) {
      throw new BadRequestException('You do not have any clan');
    }
    const { data, total } = await this.userMethod.find({
      query: {
        clan: user.clan,
      },
      ...queryParams,
      lean: true,
      projection: USER_SIMPLE_SELECT,
      populate: USER_POPULATE_CASTLE,
    });

    return { data, total };
  }

  async deleteMember(memberId: DataId) {
    const clan = await this.getOwnClan();
    const member = await this.userMethod.findOne(
      {
        clan: clan._id,
        _id: memberId,
      },
      {
        isThrow: true,
        message: 'Member not found',
      },
    );

    member.set({ clan: undefined });
    await member.save();
    const memberPopulated = await member.populate<UserPullPopulate>(
      USER_POPULATE,
    );
    this.socketGateway.emitUser(memberPopulated);
  }
}
