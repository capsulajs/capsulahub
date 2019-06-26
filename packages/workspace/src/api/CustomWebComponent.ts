import { Observable } from 'rxjs';

export default interface CustomWebComponent<Props = any> extends HTMLElement {
  setProps?: (setPropsRequest?: Observable<Props>) => void;
}
