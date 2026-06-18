import express from "express";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { contactRouter } from "./routes/contact.routes.js";
import { corsMiddleware, helmetMiddleware } from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { logger } from "./utils/logger.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: env.maxJsonBodySize }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok"
  });
});

app.use("/api/contact", contactRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info({ port: env.port, nodeEnv: env.nodeEnv }, "Contact API listening");
});
