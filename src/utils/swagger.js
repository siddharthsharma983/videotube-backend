import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VideoTube API",
      version: "1.0.0",
      description: "YouTube-style backend API documentation",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

export default swaggerDocs;
