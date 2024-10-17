import { BadRequestException } from "@nestjs/common";
import { isValidBoolean } from "./isValidBoolean";
import { isValidNumber } from "./isValidNumber";
import { isValidString } from "./isValidString";

// Validation for Array values (assuming array of strings for now)
// only accounting for arrays who's elements are all of the same data type
// the assumption is that 99% of arrays in js will be of identical element types
export function isValidArray(
  paramName: string,
  queryValue: any,
  itemType: string,
  type: "Body Property" | "Query" | "Param" | any,
): any[] {
  if (!Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `${type} '${paramName}' must be of type 'Array`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Array",
    });
  }
  let invalidItems: any[] = [];
  let validatedArray = queryValue
    .map((item: any, index: number) => {
      try {
        // Check the type of array items
        if (itemType === "boolean") {
          return isValidBoolean(paramName, item, type);
        }
        if (itemType === "number") {
          return isValidNumber(paramName, item, type);
        }
        if (itemType === "string") {
          return isValidString(paramName, item, type);
        }
      } catch (error: any) {
        // If validation fails, push the index and value of the invalid item
        // TODO: decide if we want more specific error messaging here. i'm sure there are drawbacks to doing that
        invalidItems.push({ index, value: item, error: error.message });
        return null;
      }
    })
    .filter((i) => i !== null);

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
