import { ValidationOptions, registerDecorator } from 'class-validator'
import { IsExistUserValidator } from '../validations/user.validation'

export function IsExistUser(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExistUser',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsExistUserValidator,
    })
  }
}
