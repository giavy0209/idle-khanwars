import { AbstractModel } from "abstracts"
import { HTTPSTATUS } from "constant"
import { IDefaultBuilding, IDefaultEnhance, IDefaultResources, IDefaultUnits, IDefaultUnitType, IDefaultUpgrade } from "interfaces"
import { IUserFullyPopulate } from "interfaces/IUser"
import { DefaultBuildings, DefaultEnhances, DefaultResources, DefaultUnits, DefaultUnitTypes, DefaultUpgrades } from "models"
import { FilterQuery, HydratedDocument, MergeType, Model, PopulateOptions, QueryOptions, Types, UnpackedIntersection } from "mongoose"
import { AdvancedError } from "utils"
type OptionalQueryOption = {
  skip?: number,
  limit?: number,
  sort?: any,
  lean?: boolean,
  idsOnly?: boolean,
  count?: boolean,
  populate?: string[] | PopulateOptions | PopulateOptions[] | false,
}
export default abstract class AbstractService<M extends AbstractModel<any>, PullPopulate = {}> {
  Model: new (tenantId: string) => M
  model: ReturnType<M['getInstance']>
  user: IUserFullyPopulate
  tenant: string = ""
  populate: PopulateOptions | PopulateOptions[] | string[]

  DefaultBuildings: Model<IDefaultBuilding>
  DefaultUnits: Model<IDefaultUnits>
  DefaultResources: Model<IDefaultResources>
  DefaultUnitTypes: Model<IDefaultUnitType>
  DefaultUpgrades: Model<IDefaultUpgrade>
  DefaultEnhances: Model<IDefaultEnhance>
  constructor(Model: new (tenantId: string) => M, user?: IUserFullyPopulate) {
    if (user) {
      this.user = user
      this.tenant = this.user.world.tenant
      this.DefaultBuildings = new DefaultBuildings(this.tenant).getInstance()
      this.DefaultUnits = new DefaultUnits(this.tenant).getInstance()
      this.DefaultResources = new DefaultResources(this.tenant).getInstance()
      this.DefaultUnitTypes = new DefaultUnitTypes(this.tenant).getInstance()
      this.DefaultUpgrades = new DefaultUpgrades(this.tenant).getInstance()
      this.DefaultEnhances = new DefaultEnhances(this.tenant).getInstance()
    }
    this.Model = Model
    this.model = new Model(this.tenant).getInstance() as ReturnType<M['getInstance']>
  }

  find(input: { query: FilterQuery<M['Doc']>, idsOnly: true } & OptionalQueryOption): Promise<Types.ObjectId[]>

  find(input: { query: FilterQuery<M['Doc']>, count: false, populate: false } & OptionalQueryOption): Promise<HydratedDocument<M['Doc'], {}, {}>[]>
  find(input: { query: FilterQuery<M['Doc']>, populate: false } & OptionalQueryOption): Promise<{ data: HydratedDocument<M['Doc'], {}, {}>[], total: number, next: Pagination, pre: Pagination }>

  find<P = PullPopulate>(input: { query: FilterQuery<M['Doc']>, count: false } & OptionalQueryOption): Promise<(Omit<HydratedDocument<M['Doc'], {}, {}>, keyof P> & P)[]>

  find<P = PullPopulate>(input: { query: FilterQuery<M['Doc']> } & OptionalQueryOption): Promise<{ data: (Omit<HydratedDocument<M['Doc'], {}, {}>, keyof P> & P)[], total: number, next: Pagination, pre: Pagination }>
  async find<P = PullPopulate>({
    query,
    skip,
    limit,
    sort,
    lean,
    count,
    populate,
    idsOnly,
  }: MergeType<{ query: FilterQuery<M['Doc']>, }, OptionalQueryOption>) {
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
    if (typeof lean === 'boolean') {
      options.lean = lean
    }

    if (idsOnly) {
      return (await this.model.find(query).select('_id')).map(o => o._id)
    }

    let promiseFind: Promise<(HydratedDocument<M['Doc'], {}, {}> | (Omit<HydratedDocument<M['Doc'], {}, {}>, keyof P> & P))[]> = this.model.find(query, null, options).populate<P>(populate || this.populate).exec()

    if (populate === false) {
      promiseFind = this.model.find(query, null, options).exec()
    }
    if (count === false) {
      return await promiseFind
    }
    const promises: [
      Promise<(HydratedDocument<M['Doc'], {}, {}> | (Omit<HydratedDocument<M['Doc'], {}, {}>, keyof P> & P))[]>,
      Promise<number>,
    ] = [
        promiseFind,
        this.model.countDocuments(query).exec()
      ]
    const [data, total] = await Promise.all(promises)
    const next: Pagination = {
      page: null,
      limit: null
    }
    const pre: Pagination = {
      page: null,
      limit: null
    }
    if (skip !== undefined && limit !== undefined && Number.isInteger(skip) && Number.isInteger(limit)) {
      next.page = skip + limit >= total ? null : ((skip + limit) / limit) + 1
      next.limit = limit
      pre.page = skip - limit >= 0 ? ((skip - limit) / limit) + 1 : null
      pre.limit = limit
    }
    return {
      data, total, next, pre
    }
  }

  findById(id: string | Types.ObjectId, isThrow: boolean): Promise<UnpackedIntersection<HydratedDocument<M['Doc'], {}, {}>, PullPopulate>>;
  findById(id: string | Types.ObjectId): Promise<UnpackedIntersection<HydratedDocument<M['Doc'], {}, {}>, PullPopulate> | null>;
  async findById(id: string | Types.ObjectId, isThrow?: boolean) {
    const data = await this.model.findById(id).populate<PullPopulate>(this.populate).exec()
    if (typeof isThrow === 'boolean' && isThrow) {
      if (!data) {
        throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: `${this.Model.name} not found`, })
      }
    }
    return data
  }

  findOne(query: FilterQuery<M['Doc']>, isThrow: boolean): Promise<UnpackedIntersection<HydratedDocument<M['Doc'], {}, {}>, PullPopulate>>;
  findOne(query: FilterQuery<M['Doc']>): Promise<UnpackedIntersection<HydratedDocument<M['Doc'], {}, {}>, PullPopulate> | null>;
  async findOne(query: FilterQuery<M['Doc']>, isThrow?: boolean) {
    const data = await this.model.findOne(query).populate<PullPopulate>(this.populate).exec()
    if (typeof isThrow === 'boolean' && isThrow) {
      if (!data) {
        throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: `${this.Model.name} not found`, })
      }
    }
    return data
  }

  async exists(query: FilterQuery<M['Doc']>, throwCase: 'IF_EXISTS' | 'IF_NOT_EXISTS', message?: string) {
    const isExists = await this.model.exists(query)

    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new AdvancedError({ message: message || `${this.Model.name} already exists` })
        }
        break;
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new AdvancedError({ statusCode: HTTPSTATUS.NOT_FOUND, message: message || `${this.Model.name} not found`, })
        }
      default:
        break;
    }
  }
}