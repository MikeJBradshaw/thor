import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import bedroomOne from 'reducers/bedroomOne'
import mqttPublishClient from 'reducers/mqttClient'
import masterBath from 'reducers/master'
import chickenCoop from 'reducers/chickenCoop'
import guestBath from 'reducers/guestBath'
import hallway from 'reducers/hallway'
import kitchen from 'reducers/kitchen'
import laundry from 'reducers/laundry'
import livingRoom from 'reducers/livingRoom'
import scheduler from 'reducers/scheduler'
import supervisor from 'reducers/supervisor'
import weather from 'reducers/weather'
import bedroomOneEpic from 'epics/bedroomOne'
import chickenCoopEpic from 'epics/chickenCoop'
import guestBathEpic from 'epics/guestBath'
import kitchenEpic from 'epics/kitchen'
import laundryEpic from 'epics/laundry'
import livingRoomEpic from 'epics/livingRoom'
import masterEpic from 'epics/master'
import supervisorEpic from 'epics/supervisor'
import weatherEpic from 'epics/weather'

const reducers = combineReducers({
  bedroomOne,
  chickenCoop,
  guestBath,
  hallway,
  kitchen,
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
    kitchenEpic,
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
