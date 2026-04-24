const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Multivendor Ecommerce API",
      version: "1.0.0",
      description:
        "REST API documentation for a scalable multivendor ecommerce platform (MERN Stack)",
      contact: {
        name: "Sourov Karmokar",
        email: "sourovkarmokar020@gmail.com",
      },
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
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

  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;