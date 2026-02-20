import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { OFFER_MEETING } from '../constants/offer-meeting.const';

@ValidatorConstraint({ name: 'FutureDate', async: false })
export class FutureDate implements ValidatorConstraintInterface {
  validate(
    date: Date,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (!(date instanceof Date)) {
      return false;
    }

    const minAllowed = new Date(Date.now() + OFFER_MEETING.AT.BUFFER_MS);
    return date >= minAllowed;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `DATE_MUST_BE_AT_LEAST_${OFFER_MEETING.AT.BUFFER_MINUTES}_MINUTES_IN_THE_FUTURE`;
  }
}
