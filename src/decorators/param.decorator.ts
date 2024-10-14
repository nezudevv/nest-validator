import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { getParamOrQueryType } from "../utils/getParamOrQueryType";

export var Param = createParamDecorator(
  (paramName: string, ctx: ExecutionContext) => {
    let expectedType = getParamOrQueryType(ctx, paramName);
    let request = ctx.switchToHttp().getRequest();
    let paramValue = request.params[paramName];

    /**
     * Perform runtime validation based on the inferred type
     */
    if (expectedType === "boolean") {
      return isValidBoolean(paramName, paramValue);
    }
    if (expectedType === "number") {
      return isValidNumber(paramName, paramValue);
    }

    if (expectedType === "string") {
      return isValidString(paramName, paramValue);
    }

    throw new BadRequestException({
      message: `Parameter '${paramName}' must be a primitive type`,
      parameter: paramName,
      received: paramValue,
      receivedType: typeof paramValue,
      expectedType: "Boolean | Number | String",
    });
  },
);

function isValidBoolean(
  paramName: string,
  paramValue: string,
): boolean | BadRequestException {
  if (paramValue === "true") {
    return true;
  }
  if (paramValue === "false") {
    return false;
  }

  throw new BadRequestException({
    message: `Parameter '${paramName}' must be 'true' or 'false'`,
    parameter: paramName,
    received: paramValue,
    receivedType: typeof paramValue,
    expectedType: "Boolean",
  });
}

function isValidNumber(
  paramName: string,
  paramValue: string,
): number | BadRequestException {
  const parsedNumber = Number(paramValue);

  if (Number.isNaN(parsedNumber)) {
    throw new BadRequestException({
      message: `Query parameter '${paramName}' must be a valid Number`,
      parameter: paramName,
      received: paramValue,
      receivedType: typeof paramValue,
      expectedType: "Number",
    });
  }

  return parsedNumber;
}

function isValidString(
  paramName: string,
  paramValue: string,
): string | BadRequestException {
  try {
    return String(paramValue);
  } catch (error) {
    throw new BadRequestException({
      message: `Parameter '${paramName}' must be a valid String`,
      parameter: paramName,
      received: paramValue,
      receivedType: typeof paramValue,
      expectedType: "String",
    });
  }
}
