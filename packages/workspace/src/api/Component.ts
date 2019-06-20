import { ComponentType, CustomWebComponent } from './index';

export default interface Component {
  componentName: string;
  nodeId: string;
  reference: CustomWebComponent;
  type: ComponentType;
}
