import { BadRequestException } from "@nestjs/common";

export function isValidNumber(
  paramName: string,
  queryValue: string,
  type: "Body Property" | "Query" | "Param" | any,
): number {
  if (Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `${type} '${paramName}' allows only one use of this ${type}`,
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
      message: `${type} '${paramName}' must be a valid Number`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "Number",
    });
  }

  return parsedNumber; // Return the valid number
}
