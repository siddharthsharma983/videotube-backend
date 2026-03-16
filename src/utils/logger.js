import winston from "winston";

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  transports: [
    // error logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // all logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Development console logging
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
