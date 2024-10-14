import { ExecutionContext } from "@nestjs/common";
import { Project } from "ts-morph";

export function getParamOrQueryType(
  ctx: ExecutionContext,
  paramName: string,
): string {
  let className = ctx.getClass().name;
  let methodName = ctx.getHandler().name;
  let project = new Project({ tsConfigFilePath: "./tsconfig.json" });
  let sourceFile = project
    .getSourceFiles()
    .find((file) => file.getClass(className));

  if (!sourceFile) {
    throw new Error(`Class "${className}" not found in any controller files`);
  }

  let classDeclaration = sourceFile.getClassOrThrow(className);
  let method = classDeclaration.getMethodOrThrow(methodName);

  console.log('paramName: ', paramName)

  let param = method.getParameter(paramName);

  if (!param) {
    throw new Error(
      `Parameter "${paramName}" not found in class: ${className}'s method "${methodName}"`,
    );
  }

  let paramType = param.getType().getText();

  return paramType;
}
