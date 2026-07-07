const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GOV E-Services API",
      version: "1.0.0",
      description: "Complete API documentation for Government e-Services Portal",
    },
    servers: [
      {
        url: "/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // files containing annotations as above
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
