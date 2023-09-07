import type { Reducer } from 'redux'

import type { SoilMoistureAndTemperaturePayload } from 'payloads'
import type { GardenBedAction } from 'actions/gardenBeds'

interface GardenBedsState {
  bedTwoSoilMoistureState: SoilMoistureAndTemperaturePayload
}

const initState: GardenBedsState = {
  bedTwoSoilMoistureState: {
    battery: -1,
    batteryState: '',
    linkQuality: -1,
    soilMoisture: -1,
    temperature: -1
  }
}

const gardenBedsReducer: Reducer<GardenBedsState, GardenBedAction> = (state = initState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default gardenBedsReducer
