import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import bedroomOneReducer from 'reducers/bedroomOne'
import mqttPublishClientReducer from 'reducers/mqttClient'
import laundryReducer from 'reducers/laundry'
import masterReducer from 'reducers/master'
import chickenCoopReducer from 'reducers/chickenCoop'
import guestBathReducer from 'reducers/guestBath'
import supervisorReducer from 'reducers/supervisor'
import livingRoomReducer from 'reducers/livingRoom'
import bedroomOneEpic from 'epics/bedroomOne'
import laundryEpic from 'epics/laundry'
import masterEpic from 'epics/master'
import chickenCoopEpic from 'epics/chickenCoop'
import guestBathEpic from 'epics/guestBath'
import supervisorEpic from 'epics/supervisor'
import livingRoomEpic from 'epics/livingRoom'

const reducers = combineReducers({
  bedroomOneReducer,
  chickenCoopReducer,
  guestBathReducer,
  laundryReducer,
  mqttPublishClientReducer,
  masterReducer,
  supervisorReducer,
  livingRoomReducer
})
const epicMiddleware = createEpicMiddleware()

const store = createStore(reducers, applyMiddleware(epicMiddleware))
epicMiddleware.run(
  combineEpics(
    bedroomOneEpic,
    chickenCoopEpic,
    guestBathEpic,
    laundryEpic,
    masterEpic,
    supervisorEpic,
    livingRoomEpic
  )
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
