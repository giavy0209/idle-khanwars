import { HTTPSTATUS } from "constant"
import { IDefaultBuilding, IDefaultResources, IDefaultUnits, IDefaultUnitType, IDefaultUpgrade } from "interfaces"
import { IUserFullyPopulate } from "interfaces/IUser"
import { DefaultBuildings, DefaultResources, DefaultUnits, DefaultUnitTypes, DefaultUpgrades } from "models"
import { FilterQuery, HydratedDocument, Model, models, PopulateOption, PopulateOptions, QueryOptions, Types, UnpackedIntersection } from "mongoose"
import { AdvancedError } from "utils"

interface IQueryOptions extends PopulateOption {
  skip?: number,
  limit?: number,
  sort?: any,
  lean?: boolean,
  count?: boolean
}
export default abstract class AbstractService<I, PullPopulate = {}> {
  model: Model<I>
  user: IUserFullyPopulate
  tenant: string | undefined
  populate: PopulateOptions | PopulateOptions[] | string[]
  sort?: { [k: string]: any } = undefined
  name: string
  DefaultBuildings: Model<IDefaultBuilding>
  DefaultUnits: Model<IDefaultUnits>
  DefaultResources: Model<IDefaultResources>
  DefaultUnitTypes: Model<IDefaultUnitType>
  DefaultUpgrade: Model<IDefaultUpgrade>
  constructor(modelName: string, user?: IUserFullyPopulate) {
    if (user) {
      this.user = user
      this.tenant = this.user.world.tenant
    }
    this.name = modelName
    this.model = models[this.getCollectionName(modelName)]

    this.DefaultBuildings = new DefaultBuildings(this.tenant || '').getInstance()
    this.DefaultUnits = new DefaultUnits(this.tenant || '').getInstance()
    this.DefaultResources = new DefaultResources(this.tenant || '').getInstance()
    this.DefaultUnitTypes = new DefaultUnitTypes(this.tenant || '').getInstance()
    this.DefaultUpgrade = new DefaultUpgrades(this.tenant || '').getInstance()
  }
  getCollectionName(name: string) {
    if (this.tenant) {
      return `${this.tenant}_${name}`
    } else {
      return name
    }
  }


  find(query: FilterQuery<I>, queryOptions?: IQueryOptions): Promise<{
    data: (Omit<HydratedDocument<I, {}, {}>, keyof PullPopulate> & PullPopulate)[]
    total: number
  }>
  find(query: FilterQuery<I>, queryOptions: false,): Promise<(Omit<HydratedDocument<I, {}, {}>, keyof PullPopulate> & PullPopulate)[]>
  async find(
    query: FilterQuery<I>,
    queryOptions?: IQueryOptions | false,
  ) {
    const {
      skip,
      limit,
      sort,
      lean,
    } = queryOptions || {}
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
    const promises: [
      Promise<(Omit<HydratedDocument<I, {}, {}>, keyof PullPopulate> & PullPopulate)[]>,
      Promise<number>?
    ] = [
        this.model.find(query, null, options).populate<PullPopulate>(this.populate).exec(),
      ]

    const isCount = queryOptions !== false
    if (isCount) {
      promises.push(this.model.countDocuments(query).exec())
    }
    const [data, total] = await Promise.all(promises)
    if (isCount) {
      return { data, total }
    }
    return data
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

  async exists(query: FilterQuery<I>, throwCase: 'IF_EXISTS' | 'IF_NOT_EXISTS', message?: string) {
    const isExists = await this.model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new AdvancedError({ message: message || `${this.name} already exists` })
        }
        break;
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: message || `${this.name} not found`, })
        }
      default:
        break;
    }
  }
}