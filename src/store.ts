import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import bedroomOneReducer from 'reducers/bedroomOne'
import mqttPublishClientReducer from 'reducers/mqttClient'
import laundryReducer from 'reducers/laundry'
import masterReducer from 'reducers/master'
import chickenCoopReducer from 'reducers/chickenCoop'
import guestBathReducer from 'reducers/guestBath'
import bedroomOneEpic from 'epics/bedroomOne'
import laundryEpic from 'epics/laundry'
import masterEpic from 'epics/master'
import chickenCoopEpic from 'epics/chickenCoop'
import guestBathEpic from 'epics/guestBath'

const reducers = combineReducers({
  bedroomOneReducer,
  chickenCoopReducer,
  guestBathReducer,
  laundryReducer,
  mqttPublishClientReducer,
  masterReducer
})
const epicMiddleware = createEpicMiddleware()

const store = createStore(reducers, applyMiddleware(epicMiddleware))
epicMiddleware.run(
  combineEpics(
    bedroomOneEpic,
    chickenCoopEpic,
    guestBathEpic,
    laundryEpic,
    masterEpic
  )
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
