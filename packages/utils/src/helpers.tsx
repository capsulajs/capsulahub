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

  dataComponentHoc<Data>(Component: React.ComponentClass<Data, any>, data$: Observable<Data>) {
    // tslint:disable:max-classes-per-file
    return class HOC extends React.Component<any, Data> {
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

  getTimeoutPromise<PromiseResponse>({
    promise,
    timeout,
    errorMessage,
  }: {
    promise: Promise<PromiseResponse>;
    timeout: number;
    errorMessage: string;
  }): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeout);
      promise
        .then((response: PromiseResponse) => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  },
};
