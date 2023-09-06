import { connect } from 'mqtt'
import { createServer, httpListener } from '@marblejs/http'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$ } from '@marblejs/middleware-body'
import type { MqttClient } from 'mqtt'
import type { IO } from 'fp-ts/lib/IO'

import { buttonClick, buttonHold, buttonRelease } from 'actions/bedroomOne' // TODO: fix this naming
import { motionSensor } from 'actions/laundry' // TODO: fix this naming
import {
  masterBathButtonClick,
  masterBathButtonHold,
  masterBathButtonRelease,
  masterBathMotionSensor
} from 'actions/master'
import { temperatureHumidity } from 'actions/chickenCoop' // TODO: fix this naming
import {
  BEDROOM_ONE,
  BUTTON,
  CHICKEN_COOP,
  LAUNDRY,
  MASTER_BATH,
  MOTION_SENSOR,
  PRODUCTION,
  TEMP_HUMIDITY,
  TEST
} from 'consts'
import { ButtonState } from 'payloads'
import routes from 'routes'
import store from 'store'

/**************
 * ZIBGEE
 * ***********/
const TEST_ADDRESS = '10.243.31.95'
const LOCALHOST = 'localhost'
const LEVEL = process.env.level
if (LEVEL !== TEST && LEVEL !== PRODUCTION) {
  process.exitCode = -2
  console.error('Env "level" is not of "test" or "production"')
  process.exit()
}
const CONNECTION_STRING = `mqtt://${LEVEL === 'test' ? TEST_ADDRESS : LOCALHOST}:1883`
const DEBUG_STATE = process.env.debug_state === 'true'
const LOG_PUBLISH = process.env.log_publish === 'true'

console.log('###########################################################')
console.log('LEVEL:            ', LEVEL)
console.log('DEBUG_STATE:      ', DEBUG_STATE)
console.log('LOG_PUBLISH:      ', LOG_PUBLISH)
console.log('CONNECTION_STRING:', CONNECTION_STRING)
console.log('###########################################################')

export const bedroomOneRouter = (device: string, buffer: Buffer): void => {
  const data = JSON.parse(buffer.toString())
  if (device === BUTTON) {
    switch (data.action) {
      case ButtonState.Single:
      case ButtonState.Double:
        store.dispatch(buttonClick(data))
        return
      case ButtonState.Hold:
        store.dispatch(buttonHold())
        return
      case ButtonState.Release:
        store.dispatch(buttonRelease())
    }
  }
}

export const chickenCoopRouter = (device: string, buffer: Buffer): void => {
  if (device === TEMP_HUMIDITY) { store.dispatch(temperatureHumidity(JSON.parse(buffer.toString()))) }
}

export const laundryRouter = (device: string, buffer: Buffer): void => {
  if (device === MOTION_SENSOR) { store.dispatch(motionSensor(JSON.parse(buffer.toString()))) }
}

export const masterBathRouter = (device: string, buffer: Buffer): void => {
  const data = JSON.parse(buffer.toString())
  if (device === MOTION_SENSOR) {
    store.dispatch(masterBathMotionSensor(data))
    return
  }

  if (device === BUTTON) {
    switch (data.action) {
      case ButtonState.Single:
      case ButtonState.Double:
        store.dispatch(masterBathButtonClick(data))
        return
      case ButtonState.Hold:
        store.dispatch(masterBathButtonHold(data))
        return
      case ButtonState.Release:
        store.dispatch(masterBathButtonRelease(data))
    }
  }
}

const client: MqttClient = connect(CONNECTION_STRING)
client.on('connect', () => {
  console.log('SUBSCRIPTION CLIENT connected...')

  client.subscribe('z2m/home/#', err => {
    if (err !== null) {
      console.error(`testing subscription error ${err.message}`)
      // observer.error(err) // TODO: handle this error
    }

    client.on('message', (topic, buffer) => {
      const [_, __, entity, device] = topic.split('/')
      const data = JSON.parse(buffer.toString())

      switch (entity) {
        case BEDROOM_ONE:
          bedroomOneRouter(device, buffer)
          break

        case CHICKEN_COOP:
          chickenCoopRouter(device, buffer)
          break

        case LAUNDRY:
          laundryRouter(device, buffer)
          break

        case MASTER_BATH:
          masterBathRouter(device, buffer)
          break

        default:
          break
      }
    })
  })
})

console.log('SUBSCRIPTION TO ZIGBEE PIPE')
const unsubscribe = store.subscribe(() => {
  if (!DEBUG_STATE) {
    return
  }

  const { mqttPublishClientReducer, ...printableState } = store.getState()
  console.log(printableState)
})

/****************
 * MARBLE
 * *************/
const middlewares = [logger$(), bodyParser$()]
const server = createServer({
  listener: httpListener({ middlewares, effects: [routes] }),
  hostname: '0.0.0.0',
  port: 3000
})

const main: IO<void> = async () => await (await server)()

main()
