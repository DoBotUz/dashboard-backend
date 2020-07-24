import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  public validationErrors;
  constructor(errors: any) {
    super('Validation Fail', HttpStatus.OK);
    this.validationErrors = errors.map((el) => {
      return {property: el.property, fails: el.constraints}
    });
  }
}