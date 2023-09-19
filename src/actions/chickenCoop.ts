import type { TemperatureAndHumdityPayload } from 'types/payloads'

export const TEMPERATURE_HUMIDITY = 'CHICKEN_COOP_TEMPERATURE_HUMIDITY'
export interface TemperatureHumidity { type: typeof TEMPERATURE_HUMIDITY, payload: TemperatureAndHumdityPayload }
export const temperatureHumidity = (
  payload: TemperatureAndHumdityPayload
): TemperatureHumidity => ({ type: TEMPERATURE_HUMIDITY, payload })

export type ChickenCoopAction = TemperatureHumidity
