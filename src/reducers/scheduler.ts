import type { Reducer } from 'redux'

import { SCHEDULE_ADHOC_EVENT_WITHOUT_PAYLOAD, SCHEDULE_ADHOC_EVENT_WITH_PAYLOAD } from 'actions/scheduler'
import type { AdhocWithPayload, AdhocWithoutPayload, SchedulerAction } from 'actions/scheduler'

interface SchedulerState {
  adhocWithPayload: AdhocWithPayload
  adhocWithoutPayload: AdhocWithoutPayload
}

const initState: SchedulerState = {
  adhocWithPayload: { },
  adhocWithoutPayload: { }
}

const schedulerReducer: Reducer<SchedulerState, SchedulerAction> = (state = initState, action) => { // eslint-disable-line
  switch (action.type) {
    case SCHEDULE_ADHOC_EVENT_WITHOUT_PAYLOAD: {
      const { eventType, triggerEpoch } = action.data
      const hasPreviousEvents = state.adhocWithoutPayload[triggerEpoch]

      if (hasPreviousEvents === undefined) {
        return { ...state, adhocWithoutPayload: { ...state.adhocWithoutPayload, triggerEpoch: [eventType] } }
      }

      return {
        ...state,
        adhocWithoutPayload: {
          ...state.adhocWithoutPayload,
          triggerEpoch: [...state.adhocWithoutPayload[triggerEpoch], eventType]
        }
      }
    }

    case SCHEDULE_ADHOC_EVENT_WITH_PAYLOAD: {
      const { stringifiedEvent, triggerEpoch } = action.data
      const hasPreviousEvents = state.adhocWithPayload[triggerEpoch]

      if (hasPreviousEvents === undefined) {
        return { ...state, adhocWithPayload: { ...state.adhocWithPayload, triggerEpoch: [stringifiedEvent] } }
      }

      return {
        ...state,
        adhocWithPayload: {
          ...state.adhocWithPayload,
          triggerEpoch: [...state.adhocWithPayload[triggerEpoch], stringifiedEvent]
        }
      }
    }

    default:
      return state
  }
}

export default schedulerReducer
