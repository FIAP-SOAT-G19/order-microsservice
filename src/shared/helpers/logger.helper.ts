import pino from 'pino'
import pretty from 'pino-pretty'

const stream = pretty({
  colorize: true
})

const logger = pino({
  enabled: true,
  level: process.env.TS_NODE_ENV === 'dev' ? 'silent' : 'info'
}, stream)

export { logger }
