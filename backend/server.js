require("dotenv").config();
require("./services/SentryService");
require("./database/connectDBs");

const cors = require("cors");
const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");

// NodeJS Strategies
const compression = require("compression");
const rateLimitter = require("express-rate-limit");
const responseTime = require("response-time");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

///////////////////////////////////////////////////////////// APP /////////////////////////////////////////////////////////////////

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(morgan("dev"));
app.use(cors());

app.use(
  compression({
    level: parseInt(process.env.COMPRESSION_LEVEL, 10),
    threshold: parseInt(process.env.COMPRESSION_THRESHOLD, 10),
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.use(
  rateLimitter({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10), // user should be able to make RATE_LIMIT_MAX requests every RATE_LIMIT_WINDOW_MS seconds
    max: parseInt(process.env.RATE_LIMIT_MAX, 10), // limit each IP to RATE_LIMIT_MAX requests per windowMs
    message: {
      code: 429,
      message: "Too many requests, please try again later",
    },
  })
);

app.use(responseTime({ digits: 2 }));

///////////////////////////////////////////////////////////// ROUTES /////////////////////////////////////////////////////////////////
app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api", require("./routes/api.route"));
app.use("/productApi", require("./routes/ProductRoutes"));

///////////////////////////////////////////////////////////// ERROR HANDLING /////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
