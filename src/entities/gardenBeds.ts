import { filter, map, pairwise, startWith } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { ofEvent } from 'helpers/rxjs'
import { batteryWarning, batteryCritical, waterOn, waterOff } from 'data/actions'
import type { BatteryCriticalAction, BatteryWarningAction, WaterOnAction, WaterOffAction } from 'data/actions'
import type { SoilMoistureAndTemperatureEvent } from 'data/events'

const BATTERY_ALERT_THRESHOLD = 30
const BATTERY_CRITICAL_THRESHOLD = 10

type BedTwoBatteryEpicReturnType = Observable<BatteryWarningAction | BatteryCriticalAction>
export const bedTwoBatteryEpic = (
  event$: Observable<SoilMoistureAndTemperatureEvent>
): BedTwoBatteryEpicReturnType => event$.pipe(
  ofEvent('chicken_coop', 'temp_humidity'),
  filter(({ payload: { battery } }) => battery < BATTERY_ALERT_THRESHOLD),
  map(({
    payload: { battery },
    entity,
    device
  }) => battery >= BATTERY_CRITICAL_THRESHOLD
    ? batteryCritical(battery, entity, device)
    : batteryWarning(battery, entity, device))
)

const SOIL_MOISTURE_THRESHOLD = 75
const TEMPERATURE_THRESHOLD = 10
type BedSoilMoistureTemperatureReturnType = Observable<WaterOnAction | WaterOffAction>
export const bedTwoSoilMoistureTemperature = (
  event$: Observable<SoilMoistureAndTemperatureEvent>
): BedSoilMoistureTemperatureReturnType => event$.pipe(
  ofEvent('bed_2', 'soil_moisture'),
  startWith({ payload: { soilMoisture: -1, temperature: -1 } }),
  pairwise(),
  filter(
    ([{ payload: { soilMoisture: psm, temperature: pt } }, { payload: { soilMoisture, temperature } }]) =>
      ((psm | pt) === -1) || // startup/restart, need to send initial signal
      (psm <= SOIL_MOISTURE_THRESHOLD && soilMoisture > SOIL_MOISTURE_THRESHOLD) || // watering/rain has increased soil mositure to good level
      (psm >= SOIL_MOISTURE_THRESHOLD && soilMoisture < SOIL_MOISTURE_THRESHOLD) || // '                                       ' to low level
      (temperature < TEMPERATURE_THRESHOLD) // dont water when its cold out
  ),
  map(([{ payload: { soilMoisture: psm, temperature: pt } }, { payload: { soilMoisture, temperature } }]) => {
    if (temperature < TEMPERATURE_THRESHOLD) {
      return waterOff(['all'])
    }
    if ((psm | pt) === -1) {
      return soilMoisture > SOIL_MOISTURE_THRESHOLD ? waterOff(['2']) : waterOn(['2'])
    }
    if (psm <= SOIL_MOISTURE_THRESHOLD && soilMoisture > SOIL_MOISTURE_THRESHOLD) {
      return waterOff(['2'])
    }
    return waterOn(['2'])
  })
)
