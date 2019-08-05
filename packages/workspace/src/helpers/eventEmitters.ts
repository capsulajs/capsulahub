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
  nodeId,
  type,
  id,
}: {
  nodeId: string;
  type: ExtensionEventType;
  id: string;
}) => {
  return `COMPONENT_FOR_${nodeId.toUpperCase()}_${type.toUpperCase()}_${id}`;
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

export const emitComponentRegistrationSuccessEvent = ({ nodeId, id }: { nodeId: string; id: string }) => {
  document.dispatchEvent(
    new CustomEvent(generateComponentEventType({ nodeId, type: extensionsEventTypes.registered, id }))
  );
};

export const emitComponentRegistrationFailedEvent = ({
  nodeId,
  error,
  id,
}: {
  nodeId: string;
  error: string;
  id: string;
}) => {
  document.dispatchEvent(
    new CustomEvent(generateComponentEventType({ nodeId, type: extensionsEventTypes.registrationFailed, id }), {
      detail: error,
    })
  );
};
