import { filter, map, pairwise, startWith, tap } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { ofEvent } from 'helpers/rxjs'
import { plugPower } from 'data/actions'
import type { PlugPowerAction } from 'data/actions'
import type { TemperatureHumidityEvent } from 'data/events'

const FAN_THRESHOLD_HIGH = 25.95
const FAN_THRESHOLD_LOW = 23.95
const FROSTBITE_THREAT = 3
const HUMIDITY_THRESHOLD = 50

export const chickenCoopTempHumidityEpic = (
  event$: Observable<TemperatureHumidityEvent>
): Observable<PlugPowerAction> => event$.pipe(
  ofEvent({ chicken_coop: ['temp_humidity'] }),
  startWith({ payload: { humidity: -1, temperature: -1 } }),
  pairwise(),
  filter(([{ payload: { humidity: ph, temperature: pt } }, { payload: { humidity, temperature } }]) =>
    ((ph | pt) === -1) || // start, need to know if we start a fan or not
    (pt <= FAN_THRESHOLD_HIGH && temperature > FAN_THRESHOLD_HIGH) || // temperature increases above fan threshold -- on
    (pt >= FAN_THRESHOLD_LOW && temperature < FAN_THRESHOLD_LOW) || // temperature decreases below fan threshold -- off
    (temperature <= FROSTBITE_THREAT && humidity >= HUMIDITY_THRESHOLD) || // temperature is low and humidity is high, need to bleed humidity
    (temperature <= FROSTBITE_THREAT && humidity < HUMIDITY_THRESHOLD) // temperature is low, but humidity has been bled off
  ),
  map(([{ payload: { humidity: ph, temperature: pt } }, { payload: { humidity, temperature } }]) => {
    if ((ph | pt) === -1) {
      return (temperature > FAN_THRESHOLD_HIGH) ? plugPower(['123'], { state: 'on' }) : plugPower(['123'], { state: 'off' })
    }
    if (pt <= FAN_THRESHOLD_HIGH && temperature > FAN_THRESHOLD_HIGH) {
      return plugPower(['123'], { state: 'on' })
    }
    if (pt >= FAN_THRESHOLD_LOW && temperature < FAN_THRESHOLD_LOW) {
      return plugPower(['123'], { state: 'off' })
    }
    if (temperature <= FROSTBITE_THREAT && humidity >= HUMIDITY_THRESHOLD) {
      return plugPower(['123'], { state: 'on' })
    }
    return plugPower(['123'], { state: 'off' })
  })
)

