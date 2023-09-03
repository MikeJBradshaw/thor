import { distinctUntilChanged, map } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { ofEvent } from 'helpers/rxjs'
import { lightOn, lightOff } from 'data/actions'
import type { LightOnAction, LightOffAction } from 'data/actions'
import type { MotionSensorEvent } from 'data/events'

const BRIGHTNESS_HIGH = 255

const LAUNDRY_LIGHTS = [
  'z2m/home/laundry/light/light_1/set',
  'z2m/home/laundry/light/light_2/set'
]

type LaundryMotionDetectorEventReturnType = Observable<LightOnAction | LightOffAction>
export const laundryMotionDetectorEvent = (
  event$: Observable<MotionSensorEvent>
): LaundryMotionDetectorEventReturnType => event$.pipe(
  ofEvent({ laundry: ['motion_sensor'] }),
  distinctUntilChanged(),
  map(({ payload: { occupancy } }) => {
    if (occupancy) {
      return lightOn(LAUNDRY_LIGHTS, { brightness: BRIGHTNESS_HIGH, color_temp: 'coolest' })
    }
    return lightOff(LAUNDRY_LIGHTS, { state: 'OFF' })
  })
)
