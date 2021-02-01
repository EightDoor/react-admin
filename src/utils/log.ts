import { Debugout } from 'debugout.js'

const Ulog = new Debugout({
  realTimeLoggingOn: true,
  useTimestamps: true,
  includeSessionMetadata: true,
})

export { Ulog }
