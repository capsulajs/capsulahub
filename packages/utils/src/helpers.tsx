import { Observable } from 'rxjs';
import * as React from 'react';
import * as TYPES from './types';

export default {
  prepareWebComponent({ bootstrap, mountId, name }: TYPES.PrepareWebComponentRequest) {
    return bootstrap().then((Component) => {
      customElements.define(name, Component);
      const customElement = new Component();
      document.getElementById(mountId)!.appendChild(customElement);
    });
  },

  mountWebComponent(mountRequest: TYPES.MountWebComponentRequest) {
    const elementToMountTo = document.getElementById(mountRequest.mountId)!;
    if (!mountRequest.props$) {
      customElements.define(mountRequest.name, mountRequest.WebComponent);
      elementToMountTo.appendChild(new mountRequest.WebComponent());
    } else {
      class WebComponentWithData extends mountRequest.WebComponent {
        public props$?: Observable<any>;

        public setProps() {
          this.props$ = mountRequest.props$;
        }
      }

      customElements.define(mountRequest.name, WebComponentWithData);
      const webComponent = new WebComponentWithData();
      webComponent.setProps();
      elementToMountTo.appendChild(webComponent);
    }
  },

  dataComponentHoc<Data extends {}>(Component: React.ComponentClass, data$: Observable<Data>) {
    // tslint:disable:max-classes-per-file
    return class HOC extends React.Component {
      public componentDidMount() {
        data$.subscribe((data) => {
          this.setState(data);
        });
      }

      public render() {
        if (!this.state) {
          return null;
        }
        return <Component {...this.state} />;
      }
    };
  },
};
