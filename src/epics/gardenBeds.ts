// import { filter, map, pairwise, startWith } from 'rxjs/operators'
// import type { Observable } from 'rxjs'

// const BATTERY_ALERT_THRESHOLD = 30
// const BATTERY_CRITICAL_THRESHOLD = 10
// const SOIL_MOISTURE_THRESHOLD = 75
// const TEMPERATURE_THRESHOLD = 10

// type BedSoilMoistureTemperatureReturnType = Observable<WaterOnAction | WaterOffAction>
// export const bedTwoSoilMoistureTemperature = (
//   event$: Observable<SoilMoistureAndTemperatureEvent>
// ): BedSoilMoistureTemperatureReturnType => event$.pipe(
//   ofEvent({ bed_2: ['soil_moisture'] }),
//   startWith({ payload: { soilMoisture: -1, temperature: -1 } }),
//   pairwise(),
//   filter(
//     ([{ payload: { soilMoisture: psm, temperature: pt } }, { payload: { soilMoisture, temperature } }]) =>
//       ((psm | pt) === -1) || // startup/restart, need to send initial signal
//       (psm <= SOIL_MOISTURE_THRESHOLD && soilMoisture > SOIL_MOISTURE_THRESHOLD) || // watering/rain has increased soil mositure to good level
//       (psm >= SOIL_MOISTURE_THRESHOLD && soilMoisture < SOIL_MOISTURE_THRESHOLD) || // '                                       ' to low level
//       (temperature < TEMPERATURE_THRESHOLD) // dont water when its cold out
//   ),
//   map(([{ payload: { soilMoisture: psm, temperature: pt } }, { payload: { soilMoisture, temperature } }]) => {
//     if (temperature < TEMPERATURE_THRESHOLD) {
//       return waterOff(['all'])
//     }
//     if ((psm | pt) === -1) {
//       return soilMoisture > SOIL_MOISTURE_THRESHOLD ? waterOff(['2']) : waterOn(['2'])
//     }
//     if (psm <= SOIL_MOISTURE_THRESHOLD && soilMoisture > SOIL_MOISTURE_THRESHOLD) {
//       return waterOff(['2'])
//     }
//     return waterOn(['2'])
//   })
// )
