import { BadRequestException } from "@nestjs/common";

export function isValidBoolean(
  paramName: string,
  queryValue: string,
  type: "Body Property" | "Query" | "Param" | any,
): boolean {
  if (Array.isArray(queryValue)) {
    throw new BadRequestException({
      message: `${type} '${paramName}' allows only one use of this ${type}`,
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
    message: `${type} '${paramName}' must be 'true' or 'false'`,
    parameter: paramName,
    received: queryValue,
    receivedType: typeof queryValue,
    expectedType: "Boolean",
  });
}
