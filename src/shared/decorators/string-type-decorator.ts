import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function IsStringType(validationOptions?: ValidationOptions) {
  return function (entity: object, propertyName: string) {
    registerDecorator({
      name: 'stringTypeDecorator',
      target: entity.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isNaN(Number(value)) && typeof value === 'string'
        },
        defaultMessage(args: ValidationArguments) {
          // Custom error message to be displayed when validation fails
          return `${args.property} must be a string`
        },
      },
    })
  }
}
