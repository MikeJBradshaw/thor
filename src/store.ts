import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import bedroomOneReducer from 'reducers/bedroomOne'
import mqttPublishClientReducer from 'reducers/mqttClient'
import laundryReducer from 'reducers/laundry'
import masterReducer from 'reducers/master'
import chickenCoopReducer from 'reducers/chickenCoop'
import bedroomOneEpic from 'epics/bedroomOne'
import laundryEpic from 'epics/laundry'
import masterEpic from 'epics/master'
import chickenCoopEpic from 'epics/chickenCoop'

const reducers = combineReducers({
  bedroomOneReducer,
  chickenCoopReducer,
  mqttPublishClientReducer,
  laundryReducer,
  masterReducer
})
const epicMiddleware = createEpicMiddleware()

const store = createStore(reducers, applyMiddleware(epicMiddleware))
epicMiddleware.run(
  combineEpics(
    bedroomOneEpic,
    chickenCoopEpic,
    laundryEpic,
    masterEpic
  )
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
