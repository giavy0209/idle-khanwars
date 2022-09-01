/** @format */

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { QueryOptionDto, QueryOptions } from '@vypham0209/nestjs-common';
import { CONTROLLER } from 'enum/controller.enum';
import { ClanService } from './clan.service';
import { PatchClanDto } from './dto/patch-clan.dto';
import { PostClanDto } from './dto/post-clan.dto';
import { RequestApprovalDto } from './dto/request-approval.dto';

@Controller(CONTROLLER.CLAN)
export class ClanController {
  @Inject() clanService: ClanService;

  @Post()
  async post(@Body() body: PostClanDto) {
    const data = await this.clanService.post(body);
    return {
      data,
      message: 'Create clan successfully',
    };
  }

  @ApiQuery({ type: QueryOptionDto })
  @Get()
  async get(@QueryOptions() queryParams: QueryParams) {
    const { data, total } = await this.clanService.get(queryParams);
    return {
      data,
      total,
      message: 'Get clan successfully',
    };
  }

  @Patch()
  async patch(@Body() body: PatchClanDto) {
    const data = await this.clanService.patch(body);
    return {
      data,
      message: 'Update clan successfully',
    };
  }

  @Get('member')
  @ApiQuery({ type: QueryOptionDto })
  async getClanMember(@QueryOptions() queryParams: QueryParams) {
    const { data, total } = await this.clanService.getClanMember(queryParams);
    return {
      data,
      total,
      message: 'Get clan member successfully',
    };
  }

  @Get('request')
  @ApiQuery({ type: QueryOptionDto })
  async getMyClanRequest(@QueryOptions() queryParams: QueryParams) {
    const { data, total } = await this.clanService.getMyClanRequest(
      queryParams,
    );
    return {
      data,
      total,
      message: 'Get clan request successfully',
    };
  }

  @Delete('')
  async deleteMyClan() {
    const data = await this.clanService.deleteMyClan();
    return {
      data,
      message: 'Delete clan successfully',
    };
  }

  @Post('request/:clanId')
  async requestJoin(@Param('clanId') clanId: string) {
    const data = await this.clanService.requestJoin(clanId);
    return {
      data,
      message: 'Send join request successfully',
    };
  }

  @Delete('request/:clanId')
  async deleteRequest(@Param('clanId') clanId: string) {
    await this.clanService.deleteRequest(clanId);
    return {
      message: 'Delete request successfully',
    };
  }

  @Post('request/approval/:id')
  async requestApproval(
    @Param('id') id: string,
    @Body() body: RequestApprovalDto,
  ) {
    await this.clanService.requestApproval(id, body);
    return {
      message: `${body.status} request successfully`,
    };
  }

  @Delete('member/:memberId')
  async deleteMember(@Param('memberId') memberId: string) {
    await this.clanService.deleteMember(memberId);
    return {
      message: 'Kick member successfully',
    };
  }
}
