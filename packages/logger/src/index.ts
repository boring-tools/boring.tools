import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
import winston from 'winston'
import LokiTransport from 'winston-loki'

// Create a Winston logger - passing in the Logtail transport
export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
    new LokiTransport({
      host: 'http://localhost:9100',
      labels: { app: 'api' },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
  ],
})

if (import.meta.env.NODE_ENV === 'production') {
  // Create a Logtail client
  const logtail = new Logtail(process.env.BETTERSTACK_LOG_TOKEN as string)
  logger.add(new LogtailTransport(logtail))
}
