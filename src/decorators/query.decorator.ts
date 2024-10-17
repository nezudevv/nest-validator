import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { getParamOrQueryType } from "../utils/getParamOrQueryType";
import { isValidString } from "../validators/isValidString";
import { isValidBoolean } from "../validators/isValidBoolean";
import { isValidNumber } from "../validators/isValidNumber";
import { isValidArray } from "../validators/isValidArray";

export const Query = createParamDecorator(
  (paramName: string, ctx: ExecutionContext) => {
    const expectedType = getParamOrQueryType(ctx, paramName);
    const request = ctx.switchToHttp().getRequest();
    const queryValue = request.query[paramName];
    console.log("1111", expectedType);
    console.log(2222, paramName, queryValue);

    /**
     * Perform runtime validation based on the inferred type
     */
    if (expectedType === "boolean") {
      return isValidBoolean(paramName, queryValue, 'Query');
    }
    if (expectedType === "number") {
      return isValidNumber(paramName, queryValue, 'Query');
    }
    if (expectedType === "string") {
      return isValidString(paramName, queryValue, 'Query');
    }
    if (expectedType.endsWith("[]")) {
      const elementType = expectedType.slice(0, -2); // Extract the element type (e.g., "number", "string")
      return isValidArray(paramName, queryValue, elementType, 'Query');
    }

    throw new BadRequestException({
      message: `Query '${paramName}' must be a primitive type or array of a single primitive type`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Array | Boolean | Number | String",
    });
  },
);


