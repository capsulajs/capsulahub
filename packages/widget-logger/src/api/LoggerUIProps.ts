import { Observable } from 'rxjs';
import { LogEvent } from './index';

export default interface LoggerUIProps {
  logs$: Observable<LogEvent>;
}
