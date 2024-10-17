import { BadRequestException } from "@nestjs/common";

export function isValidString(
  paramName: string,
  queryValue: string,
  type: "Body Property" | "Query" | "Param" | any,
): string {
  if (Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `${type} '${paramName}' allows only one use of this ${type}`,
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
      message: `${type} '${paramName}' must be a valid String`,
      parameter: paramName,
      received: queryValue,
      receivedType: typeof queryValue,
      expectedType: "String",
    });
  }
}
