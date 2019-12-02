import { ExtensionEventType } from './types';
import { extensionsEventTypes } from './const';

export const generateServiceEventType = ({
  serviceName,
  type,
  id,
}: {
  serviceName: any;
  type: ExtensionEventType;
  id: string;
}) => {
  return `${
    typeof serviceName === 'string' ? serviceName.toUpperCase() : 'UNKNOWN_SERVICE'
  }_${type.toUpperCase()}_${id}`;
};

export const generateComponentEventType = ({
  componentName,
  type,
  id,
}: {
  componentName: string;
  type: ExtensionEventType;
  id: string;
}) => {
  return `COMPONENT_${componentName.toUpperCase()}_${type.toUpperCase()}_${id}`;
};

export const emitServiceRegistrationSuccessEvent = ({ serviceName, id }: { serviceName: string; id: string }) => {
  document.dispatchEvent(
    new CustomEvent(generateServiceEventType({ serviceName, type: extensionsEventTypes.registered, id }))
  );
};

export const emitServiceRegistrationFailedEvent = ({
  serviceName,
  error,
  id,
}: {
  serviceName: string;
  error: string;
  id: string;
}) => {
  document.dispatchEvent(
    new CustomEvent(generateServiceEventType({ serviceName, type: extensionsEventTypes.registrationFailed, id }), {
      detail: error,
    })
  );
};

export const emitComponentRegistrationSuccessEvent = ({ componentName, id }: { componentName: string; id: string }) => {
  document.dispatchEvent(
    new CustomEvent(generateComponentEventType({ componentName, type: extensionsEventTypes.registered, id }))
  );
};

export const emitComponentRegistrationFailedEvent = ({
  componentName,
  error,
  id,
}: {
  componentName: string;
  error: string;
  id: string;
}) => {
  document.dispatchEvent(
    new CustomEvent(generateComponentEventType({ componentName, type: extensionsEventTypes.registrationFailed, id }), {
      detail: error,
    })
  );
};
