import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';

import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSortableColumn<T>(
  entity: EntityTarget<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [entity],
      options: validationOptions,
      validator: IsSortableColumnConstraint<T>,
    });
  };
}

@ValidatorConstraint({ name: 'IsSortableColumn', async: false })
@Injectable()
export class IsSortableColumnConstraint<T>
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  validate(value: string, args: ValidationArguments): boolean {
    const allowedColumns = this.getAllowedColumns(args);

    return allowedColumns.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const allowedColumns = this.getAllowedColumns(args);

    return `INVALID_SORT_COLUMN_ALLOWED_COLUMNS: ${allowedColumns.join(', ')}`;
  }

  private getAllowedColumns(args: ValidationArguments) {
    const [entity] = args.constraints as [EntityTarget<T>];

    const metadata = this.dataSource.getMetadata(entity);

    const allowedColumns = metadata.columns
      .filter((col) => !col.relationMetadata && !col.isVirtual)
      .map((col) => col.propertyName);

    return allowedColumns;
  }
}
