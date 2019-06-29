import { BehaviorSubject, Observable } from 'rxjs';
import { API } from '@capsulajs/capsulahub-workspace';

declare var publicExports: object;

const messageId = 'component-a-message';

const bootstrap = (_: API.Workspace, config: { name: string }) => {
  return new Promise((resolve) => {
    class ComponentA extends HTMLElement {
      private props$: BehaviorSubject<{ message: string }>;

      constructor() {
        super();
        this.innerHTML = `
          <div id="component-a">
            <h2>Hello from ${config.name}</h2>
            <h3 id="${messageId}"></h3>
          </div>
        `;

        this.props$ = new BehaviorSubject({ message: '' });
      }

      public connectedCallback() {
        this.props$.subscribe((props: { message: string }) => {
          document.getElementById(messageId)!.innerText = props.message;
        });
      }

      public setProps(additionalProps$: Observable<{ message: string }>) {
        additionalProps$.subscribe((props: { message: string }) => this.props$.next(props));
      }
    }
    resolve(ComponentA);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
