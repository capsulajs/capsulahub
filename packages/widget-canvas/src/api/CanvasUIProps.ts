import { Layout, OnUpdateEvent } from '.';

export default interface CanvasProps {
  /* Canvas layout */
  layout: Layout;
  /* Callback that will be triggered after a user has updated a canvas layout */
  onUpdate: (onUpdateEvent: OnUpdateEvent) => void;
}
