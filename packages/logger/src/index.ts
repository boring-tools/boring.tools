import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
import { createLogger, format, transports } from 'winston'
import { consoleFormat } from 'winston-console-format'
import LokiTransport from 'winston-loki'

// Create a Winston logger - passing in the Logtail transport
export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.ms(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      silent: import.meta.env.NODE_ENV === 'test',
      format: format.combine(
        format.colorize({ all: true }),
        format.padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ['timestamp', 'service'],
          inspectOptions: {
            depth: Number.POSITIVE_INFINITY,
            colors: true,
            maxArrayLength: Number.POSITIVE_INFINITY,
            breakLength: 120,
            compact: Number.POSITIVE_INFINITY,
          },
        }),
      ),
    }),
    new LokiTransport({
      silent: import.meta.env.NODE_ENV === 'test',
      host: 'http://localhost:9100',
      json: true,
      labels: { service: import.meta.env.SERVICE_NAME ?? 'unknown' },
      format: format.json(),
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
