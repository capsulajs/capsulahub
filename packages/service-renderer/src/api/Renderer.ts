import { RenderLayoutsRequest, RenderItemsRequest, RenderItemRequest } from './methods';

/**
 * Renderer is the core service of Capsula Hub responsible for :
 * - Rendering in the DOM all layouts registered in the Workspace
 * - Rendering in the DOM all items registered in the Workspace
 * - Rendering in the DOM item registered in the Workspace
 */
export default interface Renderer {
  /**
   * Rendering in the DOM all layouts registered in the Workspace
   * Reject in case :
   * - DOM node not exist
   * @param renderLayoutsRequest
   */
  renderLayouts(renderLayoutsRequest: RenderLayoutsRequest): Promise<void>;
  /**
   * Rendering in the DOM all items registered in the Workspace
   * Reject in case :
   * - Call before render layouts
   * - DOM node not exist
   * @param renderLayoutsRequest
   */
  renderItems(renderItemsRequest: RenderItemsRequest): Promise<void>;
  /**
   * Rendering in the DOM item registered in the Workspace
   * Reject in case :
   * - Invalid request
   * - Call before render layouts
   * - Component not found
   * - DOM node not exist
   * @param renderItemRequest
   */
  renderItem(renderItemRequest: RenderItemRequest): Promise<void>;
}
