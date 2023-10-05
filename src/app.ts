import { connect } from 'mqtt'
import { webSocketListener, createWebSocketServer } from '@marblejs/websockets'
import type { IO } from 'fp-ts/lib/IO'
import type { MqttClient } from 'mqtt'

import {
  bedroomOneButtonClick,
  bedroomOneButtonHold,
  bedroomOneButtonRelease
} from 'actions/bedroomOne'
import { motionSensor } from 'actions/laundry' // TODO: fix this naming
import {
  guestBathButtonClick,
  guestBathButtonHold,
  guestBathButtonRelease,
  guestBathMotionSensor
} from 'actions/guestBath'
import { masterBathMotionSensor } from 'actions/master'
import { livingRoomButtonClick } from 'actions/livingRoom'
import { temperatureHumidity } from 'actions/chickenCoop' // TODO: fix this naming
import { supervisorInit } from 'actions/supervisor'
import {
  getEntities,
  masterBathChangeRedLight,
  masterBathChangeWhiteLight,
  masterBathNormal,
  masterBathManual,
  masterBathShower
} from 'websocket/effects'
import {
  BEDROOM_ONE,
  BUTTON,
  BUTTON_STATE_DOUBLE,
  BUTTON_STATE_HOLD,
  BUTTON_STATE_RELEASE,
  BUTTON_STATE_SINGLE,
  CHICKEN_COOP,
  GUEST_BATH,
  LAUNDRY,
  LIVING_ROOM,
  MASTER_BATH,
  MOTION_SENSOR,
  PRODUCTION,
  TEMP_HUMIDITY,
  TEST
} from 'consts'
import store from 'store'
import config from 'configuration.json'

global.fetch = fetch

/**************
 * ZIBGEE
 * ***********/
const TEST_ADDRESS = '10.243.31.95'
const LOCALHOST = 'localhost'
const LEVEL = process.env.level
if (LEVEL !== TEST && LEVEL !== PRODUCTION) {
  process.exitCode = -2
  console.error(`Env "${PRODUCTION}" is not of "${TEST}" or "production"`)
  process.exit()
}
const CONNECTION_STRING = `mqtt://${LEVEL === 'test' ? TEST_ADDRESS : LOCALHOST}:1883`
const DEBUG_STATE = process.env.debug_state === 'true'
const LOG_PUBLISH = process.env.log_publish === 'true'
const LOG_ACTION = process.env.log_action === 'true'
const SHOW_SUB_MESSAGE = process.env.show_sub_msg === 'true'

console.log('###########################################################')
console.log('LEVEL:            ', LEVEL)
console.log('DEBUG_STATE:      ', DEBUG_STATE)
console.log('LOG_PUBLISH:      ', LOG_PUBLISH)
console.log('LOG_ACTION:       ', LOG_ACTION)
console.log('SHOW_SUB_MESSAGE: ', SHOW_SUB_MESSAGE)
console.log('CONNECTION_STRING:', CONNECTION_STRING)
console.log('###########################################################')

export const guestBathRouter = (device: string, buffer: Buffer): void => {
  const data = JSON.parse(buffer.toString())
  if (device === BUTTON) {
    switch (data.action) {
      case BUTTON_STATE_SINGLE:
      case BUTTON_STATE_DOUBLE:
        store.dispatch(guestBathButtonClick(data))
        return

      case BUTTON_STATE_HOLD:
        store.dispatch(guestBathButtonHold(data))
        return

      case BUTTON_STATE_RELEASE:
        store.dispatch(guestBathButtonRelease(data))
    }
  }

  if (device === MOTION_SENSOR) {
    store.dispatch(guestBathMotionSensor(data))
  }
}

export const bedroomOneRouter = (device: string, buffer: Buffer): void => {
  const data = JSON.parse(buffer.toString())
  if (device === BUTTON) {
    switch (data.action) {
      case BUTTON_STATE_SINGLE:
      case BUTTON_STATE_DOUBLE:
        store.dispatch(bedroomOneButtonClick(data))
        return

      case BUTTON_STATE_HOLD:
        store.dispatch(bedroomOneButtonHold(data))
        return

      case BUTTON_STATE_RELEASE:
        store.dispatch(bedroomOneButtonRelease(data))
    }
  }
}

export const chickenCoopRouter = (device: string, buffer: Buffer): void => {
  if (device === TEMP_HUMIDITY) { store.dispatch(temperatureHumidity(JSON.parse(buffer.toString()))) }
}

export const laundryRouter = (device: string, buffer: Buffer): void => {
  if (device === MOTION_SENSOR) { store.dispatch(motionSensor(JSON.parse(buffer.toString()))) }
}

const livingRoomRouter = (device: string, buffer: Buffer): void => {
  const data = JSON.parse(buffer.toString())

  if (device === BUTTON) {
    switch (data.action) {
      case BUTTON_STATE_SINGLE:
      case BUTTON_STATE_DOUBLE:
        store.dispatch(livingRoomButtonClick(data))
    }
  }
}

export const masterBathRouter = (device: string, buffer: Buffer): void => {
  const data = JSON.parse(buffer.toString())
  if (device === MOTION_SENSOR) {
    store.dispatch(masterBathMotionSensor(data))
  }
}

let previousConnection = false

const client: MqttClient = connect(CONNECTION_STRING)
client.on('connect', () => {
  console.log('SUBSCRIPTION CLIENT connected...')

  if (!previousConnection) {
    store.dispatch(supervisorInit())
    previousConnection = true
  }

  client.subscribe('z2m/source/#', err => {
    if (err !== null) {
      console.error(`testing subscription error ${err.message}`)
      // observer.error(err) // TODO: handle this error
    }

    client.on('message', (topic, buffer) => {
      const [_, __, entity, device] = topic.split('/')
      if (SHOW_SUB_MESSAGE) {
        console.log('topic:', topic, 'buffer:', JSON.stringify(buffer.toString()))
      }

      switch (entity) {
        case BEDROOM_ONE:
          bedroomOneRouter(device, buffer)
          break

        case CHICKEN_COOP:
          chickenCoopRouter(device, buffer)
          break

        case GUEST_BATH:
          guestBathRouter(device, buffer)
          break

        case LAUNDRY:
          laundryRouter(device, buffer)
          break

        case LIVING_ROOM:
          livingRoomRouter(device, buffer)
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

client.on('disconnect', () => {
  console.log('MQTT client disconnected')
})

client.on('reconnect', () => {
  console.log('MQTT client reconnected')
})

console.log('SUBSCRIPTION TO ZIGBEE PIPE')
store.subscribe(() => {
  if (!DEBUG_STATE) {
    return
  }

  const { mqttPublishClientReducer, ...printableState } = store.getState()
  console.log(printableState)
})

/****************
 * MARBLE
 * *************/
if (config.websocketServer !== undefined) {
  const effects = [
    getEntities,
    masterBathChangeRedLight,
    masterBathChangeWhiteLight,
    masterBathNormal,
    masterBathManual,
    masterBathShower
  ]

  const { host, port } = config.websocketServer
  const webSocketServer = createWebSocketServer({
    options: { port, host },
    listener: webSocketListener({ effects })
  })

  const wsMain: IO<void> = async () => await (await webSocketServer)()
  wsMain()
}

/***************
 * PROCESS HANDLERS
 * ************/
process.on('SIGINT', () => {
  console.log('\nCAUGHT SHUTDOWN SIGNAL, SHUTTING DOWN...')
  // future messaging that its going down
  process.exit()
})
