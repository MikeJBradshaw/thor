export const SUPERVISON_ERROR = 'SUPERVISON_ERROR'
export interface SupervisorErrorAction { type: typeof SUPERVISON_ERROR, err: Error }
export const supervisorError = (err: Error): SupervisorErrorAction => ({ type: SUPERVISON_ERROR, err })

export const SUPERVISOR_INIT = 'SUPERVISOR_INIT'
export interface SupervisorInitAction { type: typeof SUPERVISOR_INIT }
export const supervisorInit = (): SupervisorInitAction => ({ type: SUPERVISOR_INIT })

export const HOME_LOW_ENERGY = 'SUPERVISOR_HOME_LOW_ENERGY'
export interface HomeLowEnergyAction { type: typeof HOME_LOW_ENERGY }
export const homeLowEnergy = (): HomeLowEnergyAction => ({ type: HOME_LOW_ENERGY })

export const HOME_SET_BEDTIME = 'SUPERVISOR_HOME_SET_BEDTIME'
export interface HomeSetBedtimeAction { type: typeof HOME_SET_BEDTIME }
export const homeSetBedtime = (): HomeSetBedtimeAction => ({ type: HOME_SET_BEDTIME })

export const HOME_EVENING_MODE = 'SUPERVISOR_HOME_EVENING_MODE'
export interface HomeEveningModeAction { type: typeof HOME_EVENING_MODE }
export const homeEveningMode = (): HomeEveningModeAction => ({ type: HOME_EVENING_MODE })

export const IS_SUNRISE = 'SCHEDULER_IS_SUNRISE'
export interface IsSunriseAction { type: typeof IS_SUNRISE }
export const eventIsDay = (): IsSunriseAction => ({ type: IS_SUNRISE })

export const NETWORK_CHECK = 'SUPERVISOR_NETWORK_CHECK'
export interface NetworkCheckAction { type: typeof NETWORK_CHECK, responseEpoch: number }
export const networkCheck = (responseEpoch: number): NetworkCheckAction => ({ type: NETWORK_CHECK, responseEpoch })

export const NETWORK_END_RESTART = 'SUPERVISOR_NETWORK_END_RESTART'
export interface NetworkEndRestartAction { type: typeof NETWORK_END_RESTART }
export const networkEndRestart = (): NetworkEndRestartAction => ({ type: NETWORK_END_RESTART })

export const NETWORK_ERROR = 'SUPERVISOR_NETWORK_ERROR'
export interface NetworkErrorAction { type: typeof NETWORK_ERROR }
export const networkError = (): NetworkErrorAction => ({ type: NETWORK_ERROR })

export const NETWORK_RESTART = 'SUPERVISOR_NETWORK_RESTART'
export interface NetworkRestartAction { type: typeof NETWORK_RESTART }
export const networkRestart = (): NetworkRestartAction => ({ type: NETWORK_RESTART })

export const SET_SUNRISE_SUNSET = 'SUPERVISOR_SET_SUNRISE_SUNSET'
export interface SetSunriseSunsetAction {
  type: typeof SET_SUNRISE_SUNSET
  payload: {
    sunrise: string
    sunset: string
    solarNoon: string
    civilTwilightBegin: string
    civilTwilightEnd: string
  }
}
export const setSunriseSunset = (
  sunrise: string,
  sunset: string,
  solarNoon: string,
  civilTwilightBegin: string,
  civilTwilightEnd: string
): SetSunriseSunsetAction => ({
  type: SET_SUNRISE_SUNSET,
  payload: { sunrise, sunset, solarNoon, civilTwilightBegin, civilTwilightEnd }
})

export type SupervisorAction = SupervisorInitAction
| SupervisorErrorAction
| HomeLowEnergyAction
| HomeSetBedtimeAction
| HomeEveningModeAction
| IsSunriseAction
| NetworkCheckAction
| NetworkEndRestartAction
| NetworkErrorAction
| NetworkRestartAction
| SetSunriseSunsetAction
