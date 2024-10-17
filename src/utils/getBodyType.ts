import { ExecutionContext, BadRequestException } from "@nestjs/common";
import { Project, PropertyDeclaration, PropertySignature } from "ts-morph"; // For TypeScript AST manipulation

export function getBodyType(
  ctx: ExecutionContext,
  paramName?: string,
): string | { name: string; type: any; isOptional: boolean }[] | null {
  const className = ctx.getClass().name;
  const methodName = ctx.getHandler().name;
  const project = new Project({ tsConfigFilePath: "./tsconfig.json" });
  const sourceFile = project
    .getSourceFiles()
    .find((file) => file.getClass(className));

  if (!sourceFile) {
    throw new BadRequestException(
      `Class '${className}' not found in source files.`,
    );
  }

  const classDeclaration = sourceFile.getClassOrThrow(className);
  const method = classDeclaration.getMethodOrThrow(methodName);

  // Get all parameters for the method
  const parameters = method.getParameters();
  console.log("bdoy param name: ", paramName);

  // If `paramName` is provided, we're looking for a specific field in the body
  if (paramName) {
    const param = parameters.find((param) => param.getName() === paramName);
    if (!param) {
      throw new BadRequestException(
        `Parameter '${paramName}' not found in method '${methodName}'.`,
      );
    }
    return param.getType().getText();
  }

  // Look for the parameter that is decorated with `@Body()`
  const bodyParam = parameters.find((param) =>
    param.getDecorators().some((decorator) => decorator.getName() === "Body"),
  );

  console.log(bodyParam);

  if (!bodyParam) {
    throw new BadRequestException(
      `Body parameter not found in method '${methodName}'.`,
    );
  }

  // Return the inferred type of the body
  const paramType = bodyParam.getType().getText();
  console.log(paramType);

  const bodyType = bodyParam.getType();
  const properties = bodyType.getProperties();
  // Map properties with their types and check if optional
  return properties.map((prop) => {
    const propType = prop.getTypeAtLocation(bodyParam);
    const declaration = prop.getDeclarations()[0];
    // Check if the declaration is a PropertySignature or PropertyDeclaration and has a question token (optional)
    const isOptional =
      (declaration instanceof PropertySignature || declaration instanceof PropertyDeclaration) &&
      declaration.hasQuestionToken();

    return {
      name: prop.getName(),
      type: propType.getText(),
      isOptional,
    };
  });
}
