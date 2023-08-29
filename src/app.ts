import { connect } from 'mqtt'
import { Observable, merge } from 'rxjs'
import { createServer, httpListener } from '@marblejs/http'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$ } from '@marblejs/middleware-body'
import type { MqttClient } from 'mqtt'
import type { IO } from 'fp-ts/lib/IO'

import routes from 'routes'
import {
  chickenCoopTempHumidityEpic
  // chickenCoopBatteryEpic
} from 'entities/chickenCoop'
// import { bedTwoBatteryEpic, bedTwoSoilMoistureTemperature } from 'entities/gardenBeds'
import { masterBathroomMotionDetectorEvent } from 'entities/master'
import { laundryMotionDetectorEvent } from 'entities/laundry'

/**************
 * ZIBGEE 
 * ***********/
const subscriptions$: any = new Observable(observer => {
  const client: MqttClient = connect('mqtt://localhost:1883')
  try {
    client.on('connect', () => {
      console.log('Connected to MQTT broker')
      client.subscribe(['z2m/property/#', 'z2m/home/#'], error => {
        console.log('Reading Subscription')
        if (error !== null) {
          observer.error(error)
        } else {
          client.on('message', (topic, message) => {
            const [_, __, entity, device] = topic.split('/')
            observer.next({
              topic,
              entity,
              device,
              payload: JSON.parse(message.toString())
            })
          })
        }
      })
    })
  } catch (error) {
    observer.error(error)
  }

  return () => {
    if (!client.disconnected) {
      client.end()
    }
  }
})

const pubClient = connect('mqtt://localhost:1883')
pubClient.on('connect', () => console.log('pubClient connected'))

const main$ = merge(
  chickenCoopTempHumidityEpic(subscriptions$),
  // chickenCoopBatteryEpic(subscriptions$),
  // bedTwoBatteryEpic(subscriptions$),
  // bedTwoSoilMoistureTemperature(subscriptions$),
  laundryMotionDetectorEvent(subscriptions$),
  masterBathroomMotionDetectorEvent(subscriptions$)
).subscribe(data => {
  console.log(data)

  const { type, topics, payload } = data
  for (const topic of topics) {
    pubClient.publish(topic, JSON.stringify(payload))
  }
})

/****************
 * MARBLE
 * *************/
const middlewares = [
  logger$(),
  bodyParser$()
]

const server = createServer({
  listener: httpListener({ middlewares, effects: [routes] }),
  hostname: '0.0.0.0',
  port: 3000
})

const main: IO<void> = async () => await (await server)()

main()
