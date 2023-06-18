import { BadRequestException, NotFoundException } from "@nestjs/common"
import { FilterQuery, HydratedDocument, MergeType, Model, PipelineStage, PopulateOptions, ProjectionType, QueryOptions, Types, UnpackedIntersection, UpdateQuery, isValidObjectId } from "mongoose"
type OptionalQueryOption = {
  skip?: number,
  limit?: number,
  sort?: any,
  lean?: boolean,
  idsOnly?: boolean,
  count?: boolean,
  exportColumns?: {
    label: string,
    value: string,
  }[],
  populate?: string[] | PopulateOptions | PopulateOptions[] | false,
  projection?: ProjectionType<any>
}
export abstract class AbstractService<I, PullPopulate = {}> {
  populate: PopulateOptions | PopulateOptions[] | string[] = []
  model: Model<I>
  constructor(model: Model<I>) {
    this.model = model
  }

  generateLookup(
    pipelines: GeneratePipeline,
    prefix: string = ''
  ) {
    const mappedPipeline: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[] = []
    pipelines.forEach((pipeline) => {
      const { unwind = true, keepNull = false } = pipeline
      const localField = `${prefix}${String(pipeline.localField)}`
      const as = `${prefix}${String(pipeline.as || pipeline.localField)}`
      const from =  pipeline.from
      const lookupStage: PipelineStage.Lookup = {
        $lookup: {
          from: from,
          localField: localField,
          foreignField: pipeline.foreignField || '_id',
          as: as,
        }
      }

      if (pipeline.pipeline) {
        lookupStage.$lookup.pipeline = pipeline.pipeline
      }

      mappedPipeline.push(lookupStage)
      if (unwind) {
        mappedPipeline.push({
          $unwind: {
            path: `$${as}`,
            preserveNullAndEmptyArrays: keepNull
          }
        })
      }
      if (pipeline.lookup) {
        const nestedLookup = this.generateLookup(pipeline.lookup,)
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push(...nestedLookup)
        } else {
          lookupStage.$lookup.pipeline = nestedLookup
        }
      }
    })
    return mappedPipeline
  }

  find(input: { query: FilterQuery<I>, idsOnly: true } & OptionalQueryOption): Promise<Types.ObjectId[]>

  find(input: { query: FilterQuery<I>, count: false, populate: false } & OptionalQueryOption): Promise<HydratedDocument<I, {}, {}>[]>
  find(input: { query: FilterQuery<I>, populate: false } & OptionalQueryOption): Promise<{ data: HydratedDocument<I, {}, {}>[], total: number, next: Pagination, pre: Pagination }>

  find<P = PullPopulate>(input: { query: FilterQuery<I>, count: false } & OptionalQueryOption): Promise<(Omit<HydratedDocument<I, {}, {}>, keyof P> & P)[]>

  find<P = PullPopulate>(input: { query: FilterQuery<I> } & OptionalQueryOption): Promise<{ data: (Omit<HydratedDocument<I, {}, {}>, keyof P> & P)[], total: number, next: Pagination, pre: Pagination }>
  async find<P = PullPopulate>({
    query,
    skip,
    limit,
    sort,
    lean,
    count,
    populate,
    idsOnly,
    projection,
  }: MergeType<{ query: FilterQuery<I>, }, OptionalQueryOption>) {
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
      return (await this.model.find(query).select('_id')).map(o => o._id)
    }

    let promiseFind: Promise<(HydratedDocument<I, {}, {}> | (Omit<HydratedDocument<I, {}, {}>, keyof P> & P))[]> = this.model.find(query, projection, options).populate<P>(populate || []).exec()

    if (populate === false) {
      promiseFind = this.model.find(query, projection, options).exec()
    }
    if (count === false) {
      return await promiseFind
    }
    const promises: [
      Promise<(HydratedDocument<I, {}, {}> | (Omit<HydratedDocument<I, {}, {}>, keyof P> & P))[]>,
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

  findById<P = never>(id: string | Types.ObjectId, options: { isThrow: true }): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, P extends never ? PullPopulate : P>>
  findById<P = never>(id: string | Types.ObjectId): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, P extends never ? PullPopulate : P> | null>
  async findById(id: string | Types.ObjectId, options?: { isThrow?: boolean, message?: string }) {
    const { isThrow, message } = options || {}
    const data = await this.model.findById(id).populate<PullPopulate>(this.populate).exec()
    if (isThrow === true) {
      if (!data) {
        throw new NotFoundException(this.model.name, message || 'Not found')
      }
    }
    return data
  }

  findOne<P = never>(query: FilterQuery<I>, options: { isThrow: true }): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, P extends never ? PullPopulate : P>>
  findOne<P = never>(query: FilterQuery<I>): Promise<UnpackedIntersection<HydratedDocument<I, {}, {}>, P extends never ? PullPopulate : P> | null>
  async findOne(query: FilterQuery<I>, options?: { isThrow?: boolean, message?: string }) {
    const { isThrow, message } = options || {}
    const data = await this.model.findOne(query).populate<PullPopulate>(this.populate).exec()
    if (isThrow === true) {
      if (!data) new NotFoundException(this.model.name, message || 'Not found')
    }
    return data
  }
  async exists(query: FilterQuery<I>, options: { throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS', message?: string }) {
    const { throwCase } = options || {}
    const isExists = await this.model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new BadRequestException(this.model.name, 'Not found')
        }
        break
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new BadRequestException(this.model.name, 'Not found')
        }
        break
      default:
        return !!isExists
    }
  }

  isValidObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invaid', 'invalid objectid')
    }
    return new Types.ObjectId(id)
  }

  public async findByIdAndUpdate(id: string | Types.ObjectId, input: UpdateQuery<I>, { isThrow, message }: { isThrow?: boolean, message?: string } = {}) {
    const data = await this.model.findByIdAndUpdate(id, input, { new: true }).populate<PullPopulate>(this.populate)
    if (!data) {
      if (isThrow) {
        throw new NotFoundException(this.model.name, message || 'Not found')
      }
    }
    return data
  }

  public async findOneAndUpdate(query: FilterQuery<I>, input: UpdateQuery<I>, { isThrow, message }: { isThrow?: boolean, message?: string } = {}) {
    const data = await this.model.findOneAndUpdate(query, input, { new: true })
    if (!data) {
      if (isThrow) {
        throw new NotFoundException(this.model.name, message || 'Not found')
      }
    }
    return data
  }

  public async findByIdAndDelete(id: string | Types.ObjectId, { isThrow, message }: { isThrow?: boolean, message?: string } = {}) {
    const data = await this.model.findByIdAndDelete(id)
    if (!data) {
      if (isThrow) {
        throw new NotFoundException(this.model.name, message || 'Not found')
      }
    }
    return data
  }

  public async findOneAndDelete(query: FilterQuery<I>, { isThrow, message }: { isThrow?: boolean, message?: string } = {}) {
    const data = await this.model.findOneAndDelete(query)
    if (!data) {
      if (isThrow) {
        throw new NotFoundException(this.model.name, message || 'Not found')
      }
    }
    return data
  }

  async findByPipeline(pipeline: PipelineStage[], {
    skip,
    limit,
    sort
  }: QueryParams) {
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
            $count: {}
          },
          data: {
            $push: "$$ROOT"
          }
        },
      },
      {
        $addFields: {
          data: {
            $slice: [
              '$data',
              skip,
              (!limit || limit === Number.MAX_SAFE_INTEGER) ? { $size: '$data' } : limit
            ]
          }
        }
      }
    )
    const [result] = await this.model.aggregate(pipeline)
    const { data, total } = result || { data: [], total: 0 }
    return {
      data,
      total
    }
  }
}