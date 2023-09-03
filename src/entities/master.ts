import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { ofEvent } from 'helpers/rxjs'
import { lightOn, lightOff } from 'data/actions'
import type { LightOnAction, LightOffAction } from 'data/actions'
import type { MotionSensorEvent } from 'data/events'

const RED = '#FF0000'
const BRIGHTNESS_OFF = 0
const BRIGHTNESS_LOW = 15
const BRIGHTNESS_HIGH = 255
const DAY_END = '21:00:00'
const DAY_START = '06:45:00'

const isNight = (date: string): boolean => date >= DAY_END || date <= DAY_START

const MASTER_BATH_LIGHTS = [
  'z2m/home/master_bath/light/light_1/set',
  'z2m/home/master_bath/light/light_2/set'
]
type MasterBathroomMotionDetectorEventReturnType = Observable<LightOnAction | LightOffAction>
export const masterBathroomMotionDetectorEvent = (
  event$: Observable<MotionSensorEvent>
): MasterBathroomMotionDetectorEventReturnType => event$.pipe(
  ofEvent({ master_bath: ['motion_sensor'] }),
  map(({ payload: { occupancy } }) => {
    if (occupancy) {
      const date = new Date().toLocaleTimeString('en', { hour12: false })
      return lightOn(
        MASTER_BATH_LIGHTS,
        isNight(date)
          ? { brightness: BRIGHTNESS_LOW, color: { hex: `${RED}` } }
          : { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }
      )
    }
    return lightOff(MASTER_BATH_LIGHTS, { brightness: BRIGHTNESS_OFF })
  })
)
