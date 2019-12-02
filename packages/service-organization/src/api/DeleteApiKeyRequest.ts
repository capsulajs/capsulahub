import { AddApiKeyRequest } from './AddApiKeyRequest';

export type DeleteApiKeyRequest = Omit<AddApiKeyRequest, 'claims'>;
