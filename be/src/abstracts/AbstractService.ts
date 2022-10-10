import { HTTPSTATUS } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { DefaultBuildings, DefaultResources, DefaultUnits, DefaultUnitTypes, DefaultUpgrades } from "models"
import { FilterQuery, HydratedDocument, Model, models, PopulateOption, PopulateOptions, QueryOptions, Types, UnpackedIntersection } from "mongoose"
import { AdvancedError } from "utils"

export default abstract class AbstractService<I, PullPopulate = {}> {
  model: Model<I>
  user: IUserFullyPopulate | undefined
  tenant: string | undefined
  populate: PopulateOptions | PopulateOptions[] | string[]
  sort?: { [k: string]: any } = undefined
  name: string
  DefaultBuildings = new DefaultBuildings().getInstance()
  DefaultUnits = new DefaultUnits().getInstance()
  DefaultResources = new DefaultResources().getInstance()
  DefaultUnitTypes = new DefaultUnitTypes().getInstance()
  DefaultUpgrade = new DefaultUpgrades().getInstance()
  constructor(modelName: string, user?: IUserFullyPopulate) {
    this.user = user
    this.tenant = this.user ? this.user.world.tenant : undefined
    this.name = modelName
    this.model = models[this.getCollectionName(modelName)]
  }
  getCollectionName(name: string) {
    if (this.tenant) {
      return `${this.tenant}_${name}`
    } else {
      return name
    }
  }
  async find(
    query: FilterQuery<I>,
    {
      skip,
      limit,
      sort,
      lean,
    }: {
      skip?: number,
      limit?: number,
      sort?: any,
      lean?: boolean,
    } & PopulateOption) {
    const options: QueryOptions = {}
    if (skip) {
      options.skip = skip
    }
    if (limit) {
      options.limit = limit
    }
    if (sort) {
      options.sort = sort
    }
    if (typeof lean === 'boolean' && lean) {
      options.lean = lean
    }

    const [data, total] = await Promise.all([
      this.model.find(query, null, options).populate<PullPopulate>(this.populate),
      this.model.countDocuments(query)
    ])
    return { data, total }
  }
  findById(id: string | Types.ObjectId, isThrow: boolean): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, PullPopulate>>;
  findById(id: string | Types.ObjectId): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, PullPopulate> | null>;
  async findById(id: string | Types.ObjectId, isThrow?: boolean) {
    const data = await this.model.findById(id).populate<PullPopulate>(this.populate).exec()
    if (typeof isThrow === 'boolean' && isThrow) {
      if (!data) {
        throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: `${this.name} not found`, })
      }
    }
    return data
  }

  findOne(query: FilterQuery<I>, isThrow: boolean): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, PullPopulate>>;
  findOne(query: FilterQuery<I>): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, PullPopulate> | null>;
  async findOne(query: FilterQuery<I>, isThrow?: boolean) {
    const data = await this.model.findOne(query).populate<PullPopulate>(this.populate).exec()
    if (typeof isThrow === 'boolean' && isThrow) {
      if (!data) {
        throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: `${this.name} not found`, })
      }
    }
    return data
  }

  async exists(query: FilterQuery<I>, throwCase: 'IF_EXISTS' | 'IF_NOT_EXISTS') {
    const isExists = await this.model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new AdvancedError({ message: `${this.name} already exists` })
        }
        break;
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: `${this.name} not found`, })
        }
      default:
        break;
    }
  }
}