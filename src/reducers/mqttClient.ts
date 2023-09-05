import { connect } from 'mqtt'
import type { MqttClient } from 'mqtt'
import type { Reducer } from 'redux'

import { LIGHT_ON_PUBLISH, POWER_ON, POWER_OFF } from 'actions/mqttClient'
import type { MqttClientAction } from 'actions/mqttClient'

interface MqttClientState {
  client: MqttClient
}

const LEVEL = process.env.level
const LOG_PUBLISH = process.env.log_publish === 'true'
const CONNECTION_STRING = `mqtt://${LEVEL === 'test' ? '10.243.31.95:1883' : 'localhost'}:1883`
const mqttClient = connect(CONNECTION_STRING)

mqttClient.on('connect', () => console.log('PUBLISH CLIENT connected...'))

const initState = {
  client: mqttClient
}

const mqttPublishClientReducer: Reducer<MqttClientState, MqttClientAction> = (state = initState, action) => {
  if (LEVEL === 'test') {
    console.log('TEST SKIP PUBLISH OF: ', JSON.stringify(action))
    return state
  }

  switch (action.type) {
    case LIGHT_ON_PUBLISH:
      if (LOG_PUBLISH) {
        console.log('PUBLISH:', action)
      }

      state.client.publish(`${action.path}/set`, JSON.stringify(action.payload))
      return state

    case POWER_ON:
    case POWER_OFF: {
      if (LOG_PUBLISH) {
        console.log('PUBLISH:', action)
      }

      state.client.publish(`${action.path}/set`, JSON.stringify(action.payload))
      return state
    }

    default:
      return state
  }
}

export default mqttPublishClientReducer
