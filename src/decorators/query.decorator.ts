import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { getParamOrQueryType } from "../utils/getParamOrQueryType";

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
      return isValidBoolean(paramName, queryValue);
    }
    if (expectedType === "number") {
      return isValidNumber(paramName, queryValue);
    }
    if (expectedType === "string") {
      return isValidString(paramName, queryValue);
    }
    if (expectedType.endsWith("[]")) {
      const elementType = expectedType.slice(0, -2); // Extract the element type (e.g., "number", "string")
      return isValidArray(paramName, queryValue, elementType);
    }

    throw new BadRequestException({
      message: `Query parameter '${paramName}' must be a primitive type or array`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Array | Boolean | Number | String",
    });
  },
);

// Validation for Boolean values
function isValidBoolean(paramName: string, queryValue: string): boolean {
  if (Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `Query parameter '${paramName}' allows only one use of this query.`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Boolean",
    });
  }

  if (queryValue === "true") {
    return true;
  }
  if (queryValue === "false") {
    return false;
  }

  throw new BadRequestException({
    message: `Query parameter '${paramName}' must be 'true' or 'false'`,
    parameter: paramName,
    received: queryValue,
    receivedType: typeof queryValue,
    expectedType: "Boolean",
  });
}

// Validation for Number values
function isValidNumber(paramName: string, queryValue: string): number {
  if (Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `Query parameter '${paramName}' allows only one use of this query.`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Number",
    });
  }

  const parsedNumber = Number(queryValue);

  // Use Number.isNaN to check if the result is NaN
  if (Number.isNaN(parsedNumber)) {
    throw new BadRequestException({
      message: `Query parameter '${paramName}' must be a valid Number`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Number",
    });
  }

  return parsedNumber; // Return the valid number
}

// Validation for String values
function isValidString(paramName: string, queryValue: string): string {
  if (Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `Query parameter '${paramName}' allows only one use of this query.`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "String",
    });
  }

  try {
    return String(queryValue);
  } catch (error) {
    throw new BadRequestException({
      message: `Parameter '${paramName}' must be a valid String`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "String",
    });
  }
}

// Validation for Array values (assuming array of strings for now)
// only accounting for arrays who's elements are all of the same data type
function isValidArray(
  paramName: string,
  queryValue: any,
  itemType: string,
): any[] {
  if (!Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `Query parameter '${paramName}' must be of type 'Array`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Array",
    });
  }
  let invalidItems: any[] = [];
  let validatedArray = queryValue.map((item: any, index: number) => {
    try {
      // Check the type of array items
      if (itemType === "boolean") {
        return isValidBoolean(paramName, item);
      }
      if (itemType === "number") {
        return isValidNumber(paramName, item);
      }
      if (itemType === "string") {
        return isValidString(paramName, item);
      }
    } catch (error: any) {
      // If validation fails, push the index and value of the invalid item
      // TODO: decide if we want more specific error messaging here. i'm sure there are drawbacks to doing that
      invalidItems.push({ index, value: item, error: error.message });
      return null;
    }
  }).filter(i => i !== null);

  // If there are invalid items, throw a BadRequestException with detailed feedback
  if (invalidItems.length > 0) {
    throw new BadRequestException({
      message: `Array validation failed for query parameter '${paramName}'`,
      parameter: paramName,
      receivedType: invalidItems,
      expectedType: `Array of ${itemType}`,
    });
  }

  return validatedArray;
}
