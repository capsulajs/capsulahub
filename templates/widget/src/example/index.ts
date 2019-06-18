import { helpers } from '@capsulajs/capsulahub-utils';
import bootstrap from '..';

helpers.prepareWebComponent(bootstrap, 'web-test', 'web-test').catch((error: Error) => {
  console.info('Error while preparing a component: ', error.message);
});
