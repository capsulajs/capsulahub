import { prepareComponent } from './utils';
import bootstrap from '..';

prepareComponent(bootstrap, 'web-test', 'web-test').catch((error) => {
  console.info('Error while preparing a component: ', error.message);
});
