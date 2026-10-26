const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const iniciarBase = require("./config/iniciarBase");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/health", (req, res) => res.json({ ok: true }));
// En Vercel no pasa por server.js: la base se prepara con la primera petición a la API.
app.use("/api", (req, res, next) => iniciarBase().then(() => next(), next));
app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
