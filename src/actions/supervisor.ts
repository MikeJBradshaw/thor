import type { SunData } from 'types/payloads'

export const SUPERVISON_ERROR = 'SUPERVISON_ERROR'
export interface SupervisorErrorAction { type: typeof SUPERVISON_ERROR, err: Error }
export const supervisorError = (err: Error): SupervisorErrorAction => ({ type: SUPERVISON_ERROR, err })

export const SUPERVISOR_INIT = 'SUPERVISOR_INIT'
export interface SupervisorInitAction { type: typeof SUPERVISOR_INIT }
export const supervisorInit = (): SupervisorInitAction => ({ type: SUPERVISOR_INIT })

export const SUPERVISOR_NETWORK_CHECK = 'SUPERVISOR_NETWORK_CHECK'
export interface SupervisorNetworkCheckAction { type: typeof SUPERVISOR_NETWORK_CHECK, responseTime: Date }
export const supervisorNetworkCheck = (
  responseTime: Date
): SupervisorNetworkCheckAction => ({ type: SUPERVISOR_NETWORK_CHECK, responseTime })

export const SUPERVISOR_NETWORK_ERROR = 'SUPERVISOR_NETWORK_ERROR'
export interface SupervisorNetworkErrorAction { type: typeof SUPERVISOR_NETWORK_ERROR }
export const supervisorNetworkError = (): SupervisorNetworkErrorAction => ({ type: SUPERVISOR_NETWORK_ERROR })

export const SUPERVISOR_SET_SUNRISE_SUNSET = 'SUPERVISOR_SET_SUNRISE_SUNSET'
export interface SupervisorSetSunriseSunsetAction {
  type: typeof SUPERVISOR_SET_SUNRISE_SUNSET
  data: SunData
}
export const supervisorSetSunriseSunset = (
  data: SunData
): SupervisorSetSunriseSunsetAction => ({ type: SUPERVISOR_SET_SUNRISE_SUNSET, data })

export type SupervisorAction = SupervisorInitAction
| SupervisorErrorAction
| SupervisorNetworkCheckAction
| SupervisorNetworkErrorAction
| SupervisorSetSunriseSunsetAction
