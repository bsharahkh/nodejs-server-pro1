const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const { CORS_ORIGIN, NODE_ENV } = require("./config");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security & utils
app.use(helmet());

// Allow inline scripts (quick fix — for dev only)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com;"
  );
  next();
});



app.use(
  cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN, credentials: true })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// swagger
if (NODE_ENV === "development") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerFile = require("./config/swagger/swagger-output.json");

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

// Basic rate limit for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/auth", authLimiter);

// API routes
app.use("/api", router);

// Serve static Angular (optional) — put your built app under public/www
app.use(express.static(path.join(__dirname, "../public/www")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/www/index.html"))
);

// Error handler (keep last)
app.use(errorHandler);


module.exports = app;
