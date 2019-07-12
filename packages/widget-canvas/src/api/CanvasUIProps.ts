import { Layout } from './index';

export default interface CanvasProps {
  /* Canvas layout */
  layout: Layout;
  /* Callback that will be triggered after a user has updated a canvas layout */
  onUpdate: (newLayout: Layout) => void;
}
