import { Inject, Injectable, forwardRef } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Model } from 'mongoose'
import { User } from '../user.schema'

@ValidatorConstraint({ name: 'IsExistUserValidator', async: true })
@Injectable()
export class IsExistUserValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => Model<User>))
    private readonly userModel: Model<User>
  ) {}
  async validate(ids: StringOrObjectId | StringOrObjectId[]) {
    if (Array.isArray(ids)) {
      const total = await this.userModel
        .countDocuments({ _id: { $in: ids } })
        .lean()
      if (total !== ids.length) return false
    } else {
      const user = await this.userModel.exists({ _id: ids }).lean()
      if (!user) return false
    }
    return true
  }

  defaultMessage() {
    return `User(s) not found`
  }
}
