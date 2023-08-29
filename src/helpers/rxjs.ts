import { filter } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import type { MqttSubscriptionEvent } from 'data/events'

export const ofEvent = <T = MqttSubscriptionEvent>(
  entity: string,
  device: string
) => (source: Observable<T>): typeof source => source.pipe(
  filter(({ device: dev, entity: ent }: any) => ent === entity && dev === device)
)
