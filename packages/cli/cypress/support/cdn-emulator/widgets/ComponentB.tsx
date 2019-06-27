import { BehaviorSubject, Observable } from 'rxjs';
import { API } from '@capsulajs/capsulahub-workspace';

declare var publicExports: object;

const messageId = 'component-b-message';

const bootstrap = (_: API.Workspace) => {
  return new Promise((resolve) => {
    class ComponentB extends HTMLElement {
      private props$: BehaviorSubject<{ message: string }>;

      constructor() {
        super();
        this.innerHTML = `
          <div id="component-b">
            <h2>I am ComponentB!</h2>
            <h3 id="${messageId}"></h3>
          </div>
        `;

        this.props$ = new BehaviorSubject({ message: '' });
      }

      connectedCallback() {
        this.props$.subscribe((props: { message: string }) => {
          document.getElementById(messageId)!.innerText = props.message;
        });
      }

      public setProps(additionalProps$: Observable<{ message: string }>) {
        additionalProps$.subscribe((props: { message: string }) => this.props$.next(props));
      }
    }
    resolve(ComponentB);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
