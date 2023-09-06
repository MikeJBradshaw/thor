import { connect } from 'mqtt'
import { createServer, httpListener } from '@marblejs/http'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$ } from '@marblejs/middleware-body'
import type { MqttClient } from 'mqtt'
import type { IO } from 'fp-ts/lib/IO'

import { buttonClick, buttonHold, buttonRelease } from 'actions/bedroomOne'
import { motionSensor } from 'actions/laundry'
import {
  masterBathButtonClick,
  masterBathButtonHold,
  masterBathButtonRelease,
  masterBathMotionSensor
} from 'actions/master'
import routes from 'routes'
import store from 'store'

/**************
 * ZIBGEE
 * ***********/
const TEST_ADDRESS = '10.243.31.95'
const LOCALHOST = 'localhost'
const LEVEL = process.env.level === 'test' ? 'test' : 'production' // TODO: exit if not test or production
const CONNECTION_STRING = `mqtt://${LEVEL === 'test' ? TEST_ADDRESS : LOCALHOST}:1883`
const DEBUG_STATE = process.env.debug_state === 'true'
const LOG_PUBLISH = process.env.log_publish === 'true'

console.log('###########################################################')
console.log('LEVEL:            ', LEVEL)
console.log('DEBUG_STATE:      ', DEBUG_STATE)
console.log('LOG_PUBLISH:      ', LOG_PUBLISH)
console.log('CONNECTION_STRING:', CONNECTION_STRING)
console.log('###########################################################')

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
        case 'bedroom_1':

          switch (data.action) {
            case 'hold':
              store.dispatch(buttonHold())
              break
            case 'release':
              store.dispatch(buttonRelease())
              break
            case 'single':
            case 'double':
              store.dispatch(buttonClick(data.action))
              break
            default:
              break
          }
          break

        case 'laundry':
          switch (device) {
            case 'motion_sensor':
              store.dispatch(motionSensor(data))
              break
            default:
              break
          }
          break

        case 'master_bath':
          switch (device) {
            case 'motion_sensor':
              store.dispatch(masterBathMotionSensor(data))
              break

            case 'button':
              switch (data.action) {
                case 'hold':
                  store.dispatch(masterBathButtonHold(data))
                  break
                case 'release':
                  store.dispatch(masterBathButtonRelease(data))
                  break
                case 'single':
                // case 'double':
                  store.dispatch(masterBathButtonClick(data))
                  break
                default:
                  break
              }
              break

            default:
              break
          }
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
