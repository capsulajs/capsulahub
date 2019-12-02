import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Layout, CanvasUIProps, OnUpdateEvent } from '../api';
import defaultLayout from './layout';
import { Canvas } from '../Canvas';

const subject = new BehaviorSubject(defaultLayout);
export const props$: Observable<CanvasUIProps> = subject
  .asObservable()
  .pipe(
    map((layout: Layout) => ({ layout, onUpdate: (data: OnUpdateEvent) => data.layout && subject.next(data.layout) }))
  );

export const mountWebComponentRequest = {
  WebComponent: Canvas,
  props$,
  name: 'web-canvas',
  mountId: 'web-canvas',
};
