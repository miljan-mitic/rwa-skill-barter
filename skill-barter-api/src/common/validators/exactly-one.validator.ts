import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ExactlyOne(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: undefined,
      options: validationOptions,
      constraints: properties,
      validator: ExactlyOneConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ExactlyOne', async: false })
class ExactlyOneConstraint implements ValidatorConstraintInterface {
  validate(_: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const object = args.object as any;
    const properties = args.constraints as string[];

    const definedCount = properties.filter(
      (prop) => object[prop] !== undefined && object[prop] !== null,
    ).length;

    return definedCount === 1;
  }

  defaultMessage(args?: ValidationArguments): string {
    const properties = args.constraints as string[];
    return `EXACTLY_ONE_OF_[${properties.join(',')}]_MUST_BE_PROVIDED`;
  }
}
