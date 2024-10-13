import { Project } from "ts-morph";

// maybe cache this somewhere
var project = new Project({ tsConfigFilePath: "./tsconfig.json" });
var controllerFiles = project.getSourceFiles("src/**/*.controller.ts");

export function getParamType(
  target: any,
  propertyKey: string,
  paramName: string,
) {
  for (let sourceFile of controllerFiles) {
    const classDeclaration = sourceFile.getClass(target.constructor.name);

    if (classDeclaration) {
      // We've found the correct class, now find the method
      const method = classDeclaration.getMethodOrThrow(propertyKey);

      if (!method) {
        throw new Error(
          `Method "${propertyKey}" not found in class "${target.constructor.name}"`,
        );
      }

      const param = method.getParameter(paramName);

      if (!param) {
        throw new Error(
          `Parameter "${paramName}" not found in method "${propertyKey}"`,
        );
      }

      return param.getType().getText(); // Return the type as a string
    }
    throw new Error(
      `Class "${target.constructor.name}" not found in any controller files`,
    );
  }
}
