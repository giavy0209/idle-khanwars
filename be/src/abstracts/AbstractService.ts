import { AbstractModel } from "abstracts"
import { IUser, IWorld } from "interfaces"
import { FilterQuery, HydratedDocument, Model, PopulateOption, PopulateOptions, QueryOptions, Types, UnpackedIntersection } from "mongoose"
import { AdvancedError } from "utils"

export default abstract class AbstractService<I, PullPopulate = {}> {
  model: Model<I>
  user: IUser & { world: IWorld }
  tenant: string
  populate: PopulateOptions | PopulateOptions[] | string[]
  sort?: { [k: string]: any } = undefined
  constructor(Model: new (tenantId?: string) => AbstractModel<I>, user: IUser & { world: IWorld }) {
    this.user = user
    this.tenant = this.user.world.tenant
    this.model = new Model(this.tenant).getInstance()
  }
  async find(
    query: FilterQuery<I>,
    {
      skip,
      limit,
      sort,
      lean,
      populate
    }: {
      skip?: number,
      limit?: number,
      sort?: any,
      lean?: boolean,
    } & PopulateOption) {
    const options: QueryOptions = {
      populate: populate || this.populate
    }
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
      this.model.find(query, null, options),
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
        throw new AdvancedError({
          [this.model.name]: {
            kind: 'not.found',
            message: `${this.model.name} not found`
          }
        })
      }
    }
    return data
  }
}