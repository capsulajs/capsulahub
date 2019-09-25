import { Layout } from './index';

interface UpdatedLayout {
  layout?: Layout;
}

export type EventType = 'drop' | 'resize' | 'resizestop' | 'reorder' | 'move' | 'select' | 'update' | 'remove';

export interface OnUpdateEvent extends UpdatedLayout {
  event: EventType;
  data?: any;
}
