/***
 * Scheduler is different from the rest of the modules. Essentially, there are preset every time scheduled events
 * i.e. sunrise/sunset. There are also ad-hoc events, at this time, at this day, fire off one event
 * This module doesnt follow normal naming conventions
 *
 * Actions are called from another module and acted upon in the reducer
 * Events are called from sucheduler and external modules act upon the message
 **/
interface AdhocEventWithoutPayload {
  eventType: string
  triggerEpoch: number
}

interface AdhocEventWithPayload {
  stringifiedEvent: string
  triggerEpoch: number
}

export interface AdhocWithoutPayload extends Object { [key: number]: string[] }
export interface AdhocWithPayload extends Object { [key: number]: string[] }

export const SCHEDULE_ADHOC_EVENT_WITHOUT_PAYLOAD = 'SCHEDULER_ADHOC_EVENT_WITHOUT_PAYLOAD'
export interface ScheduleAdhocEventWithoutPayload {
  type: typeof SCHEDULE_ADHOC_EVENT_WITHOUT_PAYLOAD
  data: AdhocEventWithoutPayload
}
export const scheduleAdhocEventWithoutPayload = (
  data: AdhocEventWithoutPayload
): ScheduleAdhocEventWithoutPayload => ({ type: SCHEDULE_ADHOC_EVENT_WITHOUT_PAYLOAD, data })

export const SCHEDULE_ADHOC_EVENT_WITH_PAYLOAD = 'SCHEDULER_ADHOC_EVENT_WITH_PAYLOAD'
export interface ScheduleAdhocEventWithPayload {
  type: typeof SCHEDULE_ADHOC_EVENT_WITH_PAYLOAD
  data: AdhocEventWithPayload
}
export const scheduleAdhocEventWithPayload = (
  data: AdhocEventWithPayload
): ScheduleAdhocEventWithPayload => ({ type: SCHEDULE_ADHOC_EVENT_WITH_PAYLOAD, data })

export type SchedulerAction = ScheduleAdhocEventWithoutPayload
| ScheduleAdhocEventWithPayload
