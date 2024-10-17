import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { getParamOrQueryType } from "../utils/getParamOrQueryType";
import { isValidBoolean } from "../validators/isValidBoolean";
import { isValidNumber } from "../validators/isValidNumber";
import { isValidString } from "../validators/isValidString";

export var Param = createParamDecorator(
  (paramName: string, ctx: ExecutionContext) => {
    let expectedType = getParamOrQueryType(ctx, paramName);
    let request = ctx.switchToHttp().getRequest();
    let paramValue = request.params[paramName];

    /**
     * Perform runtime validation based on the inferred type
     */
    if (expectedType === "boolean") {
      return isValidBoolean(paramName, paramValue, "Param");
    }
    if (expectedType === "number") {
      return isValidNumber(paramName, paramValue, "Param");
    }

    if (expectedType === "string") {
      return isValidString(paramName, paramValue, "Param");
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
