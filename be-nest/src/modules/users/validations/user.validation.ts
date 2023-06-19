import { Inject, Injectable, forwardRef } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { UserModel } from '../user.schema'

@ValidatorConstraint({ name: 'IsExistUserValidator', async: true })
@Injectable()
export class IsExistUserValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => UserModel))
    private readonly user: UserModel
  ) {}
  async validate(ids: StringOrObjectId | StringOrObjectId[]) {
    if (Array.isArray(ids)) {
      const total = await this.user.model
        .countDocuments({ _id: { $in: ids } })
        .lean()
      if (total !== ids.length) return false
    } else {
      const user = await this.user.model.exists({ _id: ids }).lean()
      if (!user) return false
    }
    return true
  }

  defaultMessage() {
    return `User(s) not found`
  }
}
