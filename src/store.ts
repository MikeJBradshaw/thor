import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import bedroomOneReducer from 'reducers/bedroomOne'
import mqttPublishClientReducer from 'reducers/mqttClient'
import laundryReducer from 'reducers/laundry'
import masterReducer from 'reducers/master'
import bedroomOneEpic from 'epics/bedroomOne'
import laundryEpic from 'epics/laundry'
import masterEpic from 'epics/master'

const reducers = combineReducers({
  bedroomOneReducer,
  mqttPublishClientReducer,
  laundryReducer,
  masterReducer
})
const epicMiddleware = createEpicMiddleware()

const store = createStore(reducers, applyMiddleware(epicMiddleware))
epicMiddleware.run(
  combineEpics(
    bedroomOneEpic,
    laundryEpic,
    masterEpic
  )
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
