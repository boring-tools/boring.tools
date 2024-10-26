import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
import winston from 'winston'

// Create a Winston logger - passing in the Logtail transport
export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
})

if (import.meta.env.NODE_ENV === 'production') {
  // Create a Logtail client
  const logtail = new Logtail(process.env.BETTERSTACK_LOG_TOKEN as string)
  logger.add(new LogtailTransport(logtail))
}
