import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { getBodyType } from "../utils/getBodyType";
import { isValidBoolean } from "../validators/isValidBoolean";
import { isValidNumber } from "../validators/isValidNumber";
import { isValidString } from "../validators/isValidString";
import { isValidArray } from "../validators/isValidArray";
import { validateObject } from "../validators/isValidObject";

export var Body = createParamDecorator(
  (paramName: any, ctx: ExecutionContext) => {
    const expectedType = getBodyType(ctx, paramName); // Infer the body type dynamically
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    if (!expectedType) {
      throw new BadRequestException('Cannot infer body type.');
    }

    if (!body) {
      throw new BadRequestException('Body cannot be empty.');
    }

    // If a specific paramName is provided, validate that specific field in the body
    if (paramName) {
      if (body[paramName] === undefined) {
        throw new BadRequestException(`Field '${paramName}' is missing in the body.`);
      }
      return validateField(expectedType, body[paramName], paramName);
    }

    if (typeof expectedType === 'string') {
      return console.log(
      'WTF'
      )
    }
    // Validate the entire body
    return validateObject(body, expectedType);
  },
);

/**
 * Helper function to validate individual fields in the body.
 */
function validateField(expectedType: any, value: any, paramName: string) {
  if (expectedType === 'boolean') {
    return isValidBoolean(paramName, value, 'Body Property');
  }

  if (expectedType === 'number') {
    return isValidNumber(paramName, value, 'Body Property');
  }

  if (expectedType === 'string') {
    return isValidString(paramName, value, 'Body Property');
  }

  if (expectedType.endsWith('[]')) {
    const elementType = expectedType.slice(0, -2); // Extract element type (e.g., number, string)
    return isValidArray(paramName, value, elementType, 'Body Property');
  }

  if (expectedType === 'object') {
    return validateObject(value, expectedType); // Recursively validate nested objects
  }

  throw new BadRequestException(`Invalid body type: ${expectedType}`);
}
