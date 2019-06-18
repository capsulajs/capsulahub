import { Workspace } from '.';

type ModuleBootstrap<BootstrapResponse> = (workspace: Workspace, moduleConfig: any) => Promise<BootstrapResponse>;

export default ModuleBootstrap;
