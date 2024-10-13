import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { getParamType } from "../utils/getParamType"; // Your `ts-morph` logic here

export var Param = (paramName: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    let dec = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
      // Using ts-morph to infer the type at compile-time
      let expectedType = getParamType(target, propertyKey, paramName);
      let request = ctx.switchToHttp().getRequest();
      let paramValue = request.params[paramName];

      // Perform runtime validation based on the inferred type
      if (expectedType === "boolean") {
        if (paramValue === "true") {
          return true;
        }
        if (paramValue === "false") {
          return false;
        }
        throw new BadRequestException({
          message: `Parameter '${paramName}' must be 'true' or 'false')`,
          parameter: paramName,
          received: paramValue,
          receivedType: typeof paramValue,
          expectedType,
        });
      }

      if (expectedType === "number") {
        const paramAsNumber = Number(paramValue);
        if (!isNaN(paramAsNumber)) {
          return paramAsNumber;
        }
      }

      if (expectedType === "string") {
        return String(paramValue);
      }

      throw new BadRequestException({
        message: `Parameter '${paramName}' must be a valid ${expectedType}`,
        parameter: paramName,
        received: paramValue,
        receivedType: typeof paramValue,
        expectedType,
      });
    })();

    return dec(target, propertyKey, parameterIndex);
  };
};
