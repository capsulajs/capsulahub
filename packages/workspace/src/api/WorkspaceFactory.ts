import { CreateWorkspaceRequest, Workspace } from './index';

export default interface WorkspaceFactory {
  /**
   * Creating a workspace and loading all services and components included in its configuration.
   * CAPSULAHUB_WORKSPACE and CAPSULAHUB_CONFIGURATION variables are available for loaded services and components,
   * this way they can access the workspace methods and their configuration without using global scope.
   * Reject in case :
   * - Invalid request
   * - An error with importing a service occurred
   * - An error with importing a component occurred
   * - An error with registering a component occurred
   * @param createWorkspaceRequest
   */
  createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace>;
}
