import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
import winston from 'winston'

// Create a Logtail client
const logtail = new Logtail(process.env.BETTERSTACK_LOG_TOKEN as string)

// Create a Winston logger - passing in the Logtail transport
export const logger = winston.createLogger({
  transports: [new LogtailTransport(logtail)],
})
