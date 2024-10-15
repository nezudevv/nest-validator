# Nest Validator
***Status***: Pre-alpha (Work in Progress)

Nest Validator is a simple, yet powerful validation library designed to streamline the validation of incoming data and generate Swagger documentation automatically for NestJS applications. Although still in its early stages, this package aims to deliver a lightweight, performant solution that integrates seamlessly into your NestJS workflows.

Note: While currently in pre-alpha, the goal is to reach full functionality and performance efficiency by version 1.0, including comprehensive testing. One of the key performance challenges lies in the use of ts-morph for interacting with the TypeScript AST, which can impact speed.

## Roadmap
### Validation Features
- ***Parameters***: Basic validation for route parameters is implemented.
- ***Query***: Initial support for query parameter validation is available.
- ***Body***: Planned for future implementation.
- ***Headers***: Potential support based on community requests and feasibility.

## Swagger Documentation Generation
### Support for generating Swagger docs for:
- GET, POST, PUT, PATCH, DELETE
### Once basic verb handling is complete, we will expand documentation to cover:
- ***Route parameters***
- ***Query parameters***
- ***Request body payloads***
- ***Expected return types***
### Performance Optimizations
- ***Testing for Large Payloads***: Introducing tests to ensure the library performs efficiently with larger payloads.
- ***Bottleneck Identification***: The primary bottleneck currently is ts-morph usage for TypeScript AST manipulation. Future iterations will focus on reducing this overhead.
### Full Testing of the Application
To ensure the stability and correctness of Nest Validator, the following steps will be taken to conduct full tests of the application:

- ***Unit Testing***: Validate core functionalities of the library, including validation logic and Swagger documentation generation for different HTTP methods.
- ***Integration Testing***: Test the library in a full NestJS application to ensure seamless integration and correct behavior across parameters, queries, and request bodies.
- ***Performance Testing***: Assess the performance of the library with large payloads and real-world scenarios, identifying bottlenecks and optimizing as needed.
- ***Automated Test Coverage***: Aim for high test coverage by writing extensive test cases using tools like Jest to validate the library's functionality and detect potential edge cases.

To run tests:

```bash
npm run test
```
