import { BadRequestException } from "@nestjs/common";

export function validateObject(body: any, expectedProperties: any[]) {
  if (typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Expected an object in the body.');
  }

  // Loop through the expected properties from the inferred type
  expectedProperties.forEach(({ name, type, isOptional }) => {
    const value = body[name];

    // If the value is missing but optional, skip validation
    if (value === undefined && isOptional) {
      return;
    }

    if (value === undefined) {
      throw new BadRequestException(`Missing required property: ${name}`);
    }

    // Validate based on type
    if (type === 'boolean' && typeof value !== 'boolean') {
      throw new BadRequestException(`Expected boolean for property '${name}'`);
    }
    if (type === 'number' && typeof value !== 'number') {
      throw new BadRequestException(`Expected number for property '${name}'`);
    }
    if (type === 'string' && typeof value !== 'string') {
      throw new BadRequestException(`Expected string for property '${name}'`);
    }

    // Handle nested objects
    if (type === 'object' && typeof value === 'object') {
      validateObject(value, expectedProperties.find((prop) => prop.name === name).type.getProperties());
    }

    // Handle arrays
    if (type.endsWith('[]') && Array.isArray(value)) {
      const elementType = type.slice(0, -2); // Extract element type (e.g., number, string)
      value.forEach((element) => {
        if (typeof element !== elementType) {
          throw new BadRequestException(`Expected array of ${elementType} for property '${name}'`);
        }
      });
    }
  });

  return body; // Return validated object
}
