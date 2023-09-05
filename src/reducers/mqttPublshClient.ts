import { connect } from 'mqtt'
import type { MqttClient } from 'mqtt'
import type { Reducer } from 'redux'

import { LIGHT_ON_PUBLISH } from 'actions/mqttPublishClient'
import type { MqttClientAction } from 'actions/mqttPublishClient'

interface MqttClientState {
  client: MqttClient
}

const LEVEL = process.env.level
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
      state.client.publish(action.path, JSON.stringify(action.payload))
      return state

    default:
      return state
  }
}

export default mqttPublishClientReducer
