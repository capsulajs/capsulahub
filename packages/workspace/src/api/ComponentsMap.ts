import { Component } from './index';

export default interface ComponentsMap {
  /** Each promise will be resolved when the corresponding component will be registered */
  [nodeId: string]: Promise<Component>;
}
