import { BadRequestException } from '@nestjs/common'
import { SchemaFactory } from '@nestjs/mongoose'
import {
  Connection,
  FilterQuery,
  HydratedDocument,
  MergeType,
  Model,
  PipelineStage,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  Schema,
  Types,
  UnpackedIntersection,
  UpdateQuery,
  isValidObjectId,
} from 'mongoose'
import { getDbName } from 'utils'
type Group = {
  asObject: {
    [k: string]: number
  }
  asArray: {
    status: string
    total: number
  }[]
}
type OptionalQueryOption = {
  skip?: number
  limit?: number
  sort?: any
  lean?: boolean
  idsOnly?: boolean
  count?: boolean
  exportColumns?: {
    label: string
    value: string
  }[]
  populate?: PopulateOptions[] | false
  projection?: ProjectionType<any>
}
interface AbstractServiceOptions<D, PullPopulate> {
  hooks?: (service: AbstractService<D, PullPopulate>) => void
  user?: JWTPayload
  staticHook?: (service: AbstractService<D, PullPopulate>) => void
  shortLookup?: GeneratePipeline<AbstractService<D>['Doc']>
  populate?: PopulateOptions[]
}
export abstract class AbstractService<D, PullPopulate = {}> {
  Doc: D & { _id: Types.ObjectId }
  tenant?: string
  name: string
  schema: Schema<D>
  model: Model<D>
  connection: Connection
  user: JWTPayload
  populate: PopulateOptions[] = []
  lookup: PipelineStage[] = []
  shortLookup: GeneratePipeline<AbstractService<D>['Doc']> = []
  
  constructor(
    connection: Connection,
    decoratorSchema: new () => D,
    name: string,
    tenant = '',
    {
      user,
      hooks,
      staticHook,
      shortLookup,
      populate,
    }: AbstractServiceOptions<D, PullPopulate> = {}
  ) {
    this.schema = SchemaFactory.createForClass(decoratorSchema)
    this.tenant = tenant || ''
    this.name = name
    if(user) {
      this.user = user
    }

    this.connection = connection.useDb(getDbName(this.tenant))
    if (staticHook) {
      staticHook(this)
    }

    if (hooks) {
      hooks(this)
    }

    this.model = this.getModel()
    if (shortLookup) {
      this.shortLookup = shortLookup
      this.lookup = this.generateLookup(this.shortLookup)
    }
    if (populate) {
      this.populate = populate
    }
  }
  generateLookup(pipelines: GeneratePipeline, prefix = '') {
    const mappedPipeline: Exclude<
      PipelineStage,
      PipelineStage.Merge | PipelineStage.Out
    >[] = []
    pipelines.forEach((pipeline) => {
      const { unwind = true, keepNull = false } = pipeline
      const localField = `${prefix}${String(pipeline.localField)}`
      const as = `${prefix}${String(pipeline.as || pipeline.localField)}`
      const from = pipeline.global
        ? pipeline.from
        : this.getCollectionName(pipeline.from)
      const lookupStage: PipelineStage.Lookup = {
        $lookup: {
          from: from,
          localField: localField,
          foreignField: pipeline.foreignField || '_id',
          as: as,
        },
      }

      if (pipeline.pipeline) {
        lookupStage.$lookup.pipeline = pipeline.pipeline
      }

      mappedPipeline.push(lookupStage)
      if (unwind) {
        mappedPipeline.push({
          $unwind: {
            path: `$${as}`,
            preserveNullAndEmptyArrays: keepNull,
          },
        })
      }
      if (pipeline.lookup) {
        const nestedLookup = this.generateLookup(pipeline.lookup)
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push(...nestedLookup)
        } else {
          lookupStage.$lookup.pipeline = nestedLookup
        }
      }
    })
    return mappedPipeline
  }
  getCollectionName(name?: string) {
    if (name) {
      return `${this.tenant ? this.tenant + '_' : ''}${name}`
    }
    return `${this.tenant ? this.tenant + '_' : ''}${this.name}`
  }
  getModel() {
    const collectionName = this.getCollectionName()
    let modelObject = this.connection.models[collectionName]
    if (!modelObject) {
      modelObject = this.connection.model<D>(collectionName, this.schema)
    }
    return modelObject
  }
  find(
    input: { query?: FilterQuery<D>; idsOnly: true } & OptionalQueryOption
  ): Promise<Types.ObjectId[]>

  find(
    input: {
      query?: FilterQuery<D>
      count: false
      populate: false
    } & OptionalQueryOption
  ): Promise<HydratedDocument<D, {}, {}>[]>
  find(
    input: {
      query?: FilterQuery<D>
      populate: false
    } & OptionalQueryOption
  ): Promise<{
    data: HydratedDocument<D, {}, {}>[]
    total: number
    next: Pagination
    pre: Pagination
  }>

  find<P = PullPopulate>(
    input: { query?: FilterQuery<D>; count: false } & OptionalQueryOption
  ): Promise<(Omit<HydratedDocument<D, {}, {}>, keyof P> & P)[]>

  find<P = PullPopulate>(
    input: { query?: FilterQuery<D> } & OptionalQueryOption
  ): Promise<{
    data: (Omit<HydratedDocument<D, {}, {}>, keyof P> & P)[]
    total: number
    next: Pagination
    pre: Pagination
  }>
  async find<P = PullPopulate>({
    query = {},
    skip,
    limit,
    sort,
    lean,
    count,
    populate,
    idsOnly,
    projection,
  }: MergeType<{ query?: FilterQuery<D> }, OptionalQueryOption>) {
    const options: QueryOptions = {}
    if (skip) {
      options.skip = skip
    }
    if (limit) {
      options.limit = limit
    }
    if (sort) {
      options.sort = sort
    } else {
      options.sort = { _id: -1 }
    }
    if (typeof lean === 'boolean') {
      options.lean = lean
    }

    if (idsOnly) {
      return (await this.model.find(query).select('_id')).map((o) => o._id)
    }

    let promiseFind: Promise<
      (
        | HydratedDocument<D, {}, {}>
        | (Omit<HydratedDocument<D, {}, {}>, keyof P> & P)
      )[]
    > = this.model
      .find(query, projection, options)
      .populate<P>(populate || [])
      .exec()

    if (populate === false) {
      promiseFind = this.model.find(query, projection, options).exec()
    }
    if (count === false) {
      return await promiseFind
    }
    const promises: [
      Promise<
        (
          | HydratedDocument<D, {}, {}>
          | (Omit<HydratedDocument<D, {}, {}>, keyof P> & P)
        )[]
      >,
      Promise<number>
    ] = [promiseFind, this.model.countDocuments(query).exec()]
    const [data, total] = await Promise.all(promises)
    const next: Pagination = {
      page: null,
      limit: null,
    }
    const pre: Pagination = {
      page: null,
      limit: null,
    }
    if (
      skip !== undefined &&
      limit !== undefined &&
      Number.isInteger(skip) &&
      Number.isInteger(limit)
    ) {
      next.page = skip + limit >= total ? null : (skip + limit) / limit + 1
      next.limit = limit
      pre.page = skip - limit >= 0 ? (skip - limit) / limit + 1 : null
      pre.limit = limit
    }
    return {
      data,
      total,
      next,
      pre,
    }
  }

  findById<P = never>(
    id: string | Types.ObjectId,
    options: { isThrow: true; populate: (PopulateOptions | string)[] }
  ): Promise<
    UnpackedIntersection<
      HydratedDocument<D, {}, {}>,
      P extends never ? PullPopulate : P
    >
  >
  findById<P = never>(
    id: string | Types.ObjectId,
    options: { populate: (PopulateOptions | string)[] }
  ): Promise<UnpackedIntersection<
    HydratedDocument<D, {}, {}>,
    P extends never ? PullPopulate : P
  > | null>
  findById<P = PullPopulate>(
    id: string | Types.ObjectId
  ): Promise<UnpackedIntersection<
    HydratedDocument<D, {}, {}>,
    P extends never ? PullPopulate : P
  > | null>
  findById<P = PullPopulate>(
    id: string | Types.ObjectId,
    options: { isThrow: true }
  ): Promise<
    UnpackedIntersection<
      HydratedDocument<D, {}, {}>,
      P extends never ? PullPopulate : P
    >
  >
  async findById<P>(
    id: string | Types.ObjectId,
    options?: {
      isThrow?: boolean
      message?: string
      populate?: (PopulateOptions | string)[]
    }
  ) {
    const { isThrow, message, populate } = options || {}
    const data = await this.model
      .findById(id)
      .populate<P extends never ? PullPopulate : P>(populate || this.populate)
      .exec()
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  findOne<P = never>(
    query: FilterQuery<D>,
    options: { isThrow: true; populate: (PopulateOptions | string)[] }
  ): Promise<
    UnpackedIntersection<
      HydratedDocument<D, {}, {}>,
      P extends never ? PullPopulate : P
    >
  >
  findOne<P = never>(
    query: FilterQuery<D>,
    options: { populate: (PopulateOptions | string)[] }
  ): Promise<UnpackedIntersection<
    HydratedDocument<D, {}, {}>,
    P extends never ? PullPopulate : P
  > | null>
  findOne<P = PullPopulate>(
    query: FilterQuery<D>
  ): Promise<UnpackedIntersection<
    HydratedDocument<D, {}, {}>,
    P extends never ? PullPopulate : P
  > | null>
  findOne<P = PullPopulate>(
    query: FilterQuery<D>,
    options: { isThrow: true }
  ): Promise<
    UnpackedIntersection<
      HydratedDocument<D, {}, {}>,
      P extends never ? PullPopulate : P
    >
  >
  async findOne<P>(
    query: FilterQuery<D>,
    options?: {
      isThrow?: boolean
      message?: string
      populate?: (PopulateOptions | string)[]
    }
  ) {
    const { isThrow, message, populate } = options || {}
    const data = await this.model
      .findOne(query)
      .populate<P extends never ? PullPopulate : P>(populate || this.populate)
      .exec()
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }
  async exists(
    query: FilterQuery<D>,
    options?: { throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS'; message?: string }
  ) {
    const { throwCase, message } = options || {}
    const isExists = await this.model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new BadRequestException(message || `${this.name} already exist`)
        }
        break
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new BadRequestException(message || `${this.name} not found`)
        }
        break
    }
    return !!isExists
  }

  async existsAll(
    ids: StringOrObjectId[],
    options?: {
      throwCase?:
      | 'IF_ONE_EXISTS'
      | 'IF_ONE_NOT_EXISTS'
      | 'IF_ALL_EXISTS'
      | 'IF_ALL_NOT_EXISTS'
      message?: string
    }
  ) {
    const hashTypes: { [k: string]: 1 } = {}
    ids.forEach((o) => {
      hashTypes[o.toString()] = 1
    })
    ids = Object.keys(hashTypes)
    const { throwCase, message } = options || {}
    const totalDocs = await this.model.countDocuments({ _id: { $in: ids } })
    const isExistsOne = totalDocs > 0
    const isExistsAll = totalDocs === ids.length
    switch (throwCase) {
      case 'IF_ONE_EXISTS':
        if (isExistsOne) {
          throw new BadRequestException(
            message || `One of ${this.name} already exist`
          )
        }
        break
      case 'IF_ONE_NOT_EXISTS':
        if (!isExistsAll) {
          throw new BadRequestException(
            message || `One of ${this.name} not found`
          )
        }
        break
      case 'IF_ALL_EXISTS':
        if (isExistsAll) {
          throw new BadRequestException(
            message || `All ${this.name} already exist`
          )
        }
        break
      case 'IF_ALL_NOT_EXISTS':
        if (!isExistsOne) {
          throw new BadRequestException(message || `All ${this.name} not found`)
        }
        break
    }
    return {
      isExistsOne,
      isExistsAll,
    }
  }

  async groupBy(pipeline: PipelineStage[], keys: string[]) {
    const rawData = await this.model.aggregate(pipeline)
    const data: Group = {
      asObject: {},
      asArray: [],
    }
    rawData.forEach(({ _id, total }) => {
      data.asObject[_id] = total
      data.asArray.push({
        status: _id,
        total,
      })
    })
    keys.forEach((status) => {
      if (!data.asObject[status]) {
        data.asObject[status] = 0
        data.asArray.push({
          status,
          total: 0,
        })
      }
    })
    return data
  }

  isValidObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId')
    }
    return new Types.ObjectId(id)
  }

  public async findByIdAndUpdate(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await this.model
      .findByIdAndUpdate(id, input, { new: true })
      .populate<PullPopulate>(this.populate)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  public async findOneAndUpdate(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await this.model.findOneAndUpdate(query, input, { new: true })
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  public async findByIdAndDelete(
    id: string | Types.ObjectId,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await this.model.findByIdAndDelete(id)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  public async findOneAndDelete(
    query: FilterQuery<D>,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await this.model.findOneAndDelete(query)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  async findByPipeline(
    { skip, limit, sort }: QueryParams,
    lookup: GeneratePipeline<D> = [],
    ...pipelines: PipelineStage[][]
  ) {
    let pipeline: PipelineStage[] = this.generateLookup(lookup)
    pipeline = pipeline.concat(pipelines.flat(1))
    if (!Number.isInteger(skip)) {
      skip = 0
    }
    if (sort) {
      pipeline.push({ $sort: sort })
    }
    pipeline.push(
      {
        $group: {
          _id: null,
          total: {
            $count: {},
          },
          data: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $addFields: {
          data: {
            $slice: [
              '$data',
              skip,
              !limit || limit === Number.MAX_SAFE_INTEGER
                ? { $size: '$data' }
                : limit,
            ],
          },
        },
      }
    )
    const [result] = await this.model.aggregate(pipeline)
    const { data, total } = result || { data: [], total: 0 }
    return {
      data,
      total,
    }
  }
}
