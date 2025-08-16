const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Clean REST API",
    description: "Auto-generated API documentation",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../../app.js"]; // entry for all routes

swaggerAutogen(outputFile, endpointsFiles, doc);
