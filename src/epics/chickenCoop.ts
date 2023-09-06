import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { TEMPERATURE_HUMIDITY } from 'actions/chickenCoop'
import { noop } from 'actions/mqttClient'
import type { RootState } from 'store'
import type { TemperatureHumidity } from 'actions/chickenCoop'
import type { Noop } from 'actions/mqttClient'

// TODO: right now, this is a noop. need to develop the database client
type TemperatureAndHumidityEpicReturnType = Observable<Noop>
const temperatureAndHumidityEpic = (
  action$: Observable<TemperatureHumidity>,
  state$: StateObservable<RootState>
): TemperatureAndHumidityEpicReturnType => action$.pipe(
  ofType(TEMPERATURE_HUMIDITY),
  switchMap(({ payload: { humidity, temperature } }) => of(noop()))
)

export default combineEpics(temperatureAndHumidityEpic as any)
