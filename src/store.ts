import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import bedroomOne from 'reducers/bedroomOne'
import mqttPublishClient from 'reducers/mqttClient'
import laundry from 'reducers/laundry'
import masterBath from 'reducers/master'
import chickenCoop from 'reducers/chickenCoop'
import guestBath from 'reducers/guestBath'
import scheduler from 'reducers/scheduler'
import supervisor from 'reducers/supervisor'
import livingRoom from 'reducers/livingRoom'
import weather from 'reducers/weather'
import bedroomOneEpic from 'epics/bedroomOne'
import laundryEpic from 'epics/laundry'
import masterEpic from 'epics/master'
import chickenCoopEpic from 'epics/chickenCoop'
import guestBathEpic from 'epics/guestBath'
import supervisorEpic from 'epics/supervisor'
import livingRoomEpic from 'epics/livingRoom'
import weatherEpic from 'epics/weather'

const reducers = combineReducers({
  bedroomOne,
  chickenCoop,
  guestBath,
  laundry,
  livingRoom,
  mqttPublishClient,
  masterBath,
  scheduler,
  supervisor,
  weather
})
const epicMiddleware = createEpicMiddleware()

const store = createStore(reducers, applyMiddleware(epicMiddleware))
epicMiddleware.run(
  combineEpics(
    bedroomOneEpic,
    chickenCoopEpic,
    guestBathEpic,
    laundryEpic,
    livingRoomEpic,
    masterEpic,
    supervisorEpic,
    weatherEpic
  )
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
