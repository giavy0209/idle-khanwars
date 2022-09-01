/** @format */

import { Inject } from '@nestjs/common';
import {
  InjectMethod,
  InjectMethodFactory,
  Method,
  MethodFactory,
  TOKEN,
} from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { BuildingService } from 'modules/building/building.service';
import { DEFAULT_BUILDING } from 'modules/default-building/default-building.enum';
import { ResourceService } from 'modules/resource/resource.service';
import { Training } from 'modules/training/training.schema';
import { Unit } from 'modules/unit/unit.schema';
import { UnitService } from 'modules/unit/unit.service';
import { User } from 'modules/user/user.schema';
import { CASTLE_POPULATE } from './castle.constant';
import { Castle } from './castle.schema';
import { GetMapDto } from './dto/get-map.dto';
import { PlaceCastleDto } from './dto/place-castle.dto';
import { Types } from 'mongoose';

export class CastleService {
  @Inject(TOKEN.USER) user: JWTPayload;
  @Inject(TOKEN.TENANT) tenant: string;
  @Inject() resourceService: ResourceService;
  @Inject() buildingService: BuildingService;
  @Inject() unitService: UnitService;
  @InjectMethod(User.collectionName) readonly userMethod: Method<User>;
  @InjectMethod(Unit.collectionName) readonly unitMethod: Method<Unit>;
  @InjectMethod(Training.collectionName)
  readonly trainingMethod: Method<Training>;
  @InjectMethod(Castle.collectionName) readonly castleMethod: Method<Castle>;
  @InjectMethodFactory(Castle.collectionName)
  readonly castleMethodFactory: MethodFactory<Castle>;
  async create(user: DataId, tenant: string) {
    const castleMethod = this.castleMethodFactory(tenant);
    const coordinate = {
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
    };
    return await castleMethod.model.create({
      user,
      coordinate,
      isCapital: true,
    });
  }

  async placeCastle({ x, y }: PlaceCastleDto) {
    await this.castleMethod.exists(
      {
        $or: [{ coordinate: { x, y } }, { user: this.user._id }],
      },
      { throwCase: 'IF_EXISTS' },
    );
    const coordinate = { x, y };
    const castle = await this.castleMethod.model.create({
      user: this.user._id,
      coordinate,
      isCapital: true,
    });
    await this.buildingService.init(castle, this.tenant);
    await this.resourceService.init(castle, this.tenant);
    await this.unitService.init(castle, this.tenant);
    await this.userMethod.findByIdAndUpdate(this.user._id, {
      isPlaceCastle: true,
    });
    return castle;
  }

  async get() {
    const castle = await this.castleMethod.find({
      query: { user: this.user._id },
      count: false,
      lean: true,
    });
    return castle;
  }

  async getDetail(castleId: DataId) {
    const castle = await this.castleMethod.findById(
      new Types.ObjectId(castleId),
      {
        isThrow: true,
        populate: CASTLE_POPULATE,
      },
    );

    return castle;
  }

  async getMap({ fromX, fromY, toX, toY }: GetMapDto) {
    const data = await this.castleMethod.find({
      query: {
        $and: [
          { 'coordinate.x': { $gte: fromX } },
          { 'coordinate.x': { $lte: toX } },
          { 'coordinate.y': { $gte: fromY } },
          { 'coordinate.y': { $lte: toY } },
        ],
      },
      count: false,
    });
    return data;
  }

  async populationLeft(castle: DataId) {
    const dwellings = await this.buildingService.findBuildingByKey(
      DEFAULT_BUILDING.KEY.DWELLINGS,
      castle,
    );
    const units = await this.unitMethod.model.aggregate<{ total: number }>([
      {
        $match: {
          castle: castle,
          $or: [{ total: { $gt: 0 } }, { inTower: { $gt: 0 } }],
        },
      },
      ...this.unitMethod.generateLookup([
        {
          from: COLLECTION.default_units,
          localField: 'default',
        },
      ]),
      {
        $addFields: {
          population: {
            $add: [
              { $multiply: ['$default.population', '$total'] },
              { $multiply: ['$default.population', '$inTower'] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$population',
          },
        },
      },
    ]);

    const trainings = await this.trainingMethod.model.aggregate<{
      total: number;
    }>([
      {
        $match: {
          deletedAt: { $exists: false },
        },
      },
      ...this.unitMethod.generateLookup([
        {
          from: COLLECTION.units,
          localField: 'unit',
          lookup: [
            {
              from: COLLECTION.default_units,
              localField: 'default',
            },
          ],
        },
      ]),
      {
        $addFields: {
          population: { $multiply: ['$unit.default.population', '$left'] },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$population',
          },
        },
      },
    ]);

    const population = units[0]?.total || 0 + trainings[0]?.total || 0;
    return dwellings.upgrade.current.generate - population;
  }
}
