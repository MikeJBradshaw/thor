import type { SoilMoistureAndTemperaturePayload } from 'payloads'

export const BED_TWO_SOIL_MOISTURE_TEMPERATURE = 'BED_TWO_SOIL_MOISTURE_TEMPERATURE'
export interface BedTwoSoilMoistureTemperatureAction {
  type: typeof BED_TWO_SOIL_MOISTURE_TEMPERATURE
  payload: SoilMoistureAndTemperaturePayload
}
export const bedTwoSoilMoistureTemperature = (
  payload: SoilMoistureAndTemperaturePayload
): BedTwoSoilMoistureTemperatureAction => ({ type: BED_TWO_SOIL_MOISTURE_TEMPERATURE, payload })

export type GardenBedAction = BedTwoSoilMoistureTemperatureAction
