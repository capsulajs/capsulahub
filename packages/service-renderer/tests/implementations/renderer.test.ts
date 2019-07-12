import bootstrap from '../../src';
import Renderer from '../../src/api/Renderer';
import { callRenderLayoutsBefore, invalidNodeId, notFoundComponent, notFoundNode } from '../../src/helpers/const';

let renderService: Renderer;

beforeEach(async () => {
  const mock = jest.fn();
  // @ts-ignore
  const workspace = {
    components: () => Promise.resolve({}),
    registerService: mock,
  };
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(workspace, {});
  renderService = mock.mock.calls[0][0].reference;
});

test('Call renderItems when layout is not rendered  is rejected with error', () => {
  expect(renderService.renderItems({})).rejects.toEqual(new Error(callRenderLayoutsBefore));
});

test('Call renderItem with invalid nodeId is rejected with error', () => {
  // @ts-ignore
  [{}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1].forEach((nodeId) => {
    // @ts-ignore
    expect(renderService.renderItem({ nodeId })).rejects.toEqual(new Error(invalidNodeId));
  });
});

test('Call renderItem with an nodeId which does not exist in configuration is rejected with error', async () => {
  await renderService.renderLayouts({});
  expect(renderService.renderItem({ nodeId: 'not-found' })).rejects.toThrow(notFoundComponent);
});

test('Calling renderItem with nodeId which node not exist rejects the with error', async () => {
  const mock = jest.fn();
  // @ts-ignore
  const customWorkspace = {
    components: () =>
      Promise.resolve({
        ItemA: Promise.resolve({
          nodeId: 'item-a',
          type: 'item',
          componentName: 'item-a',
          reference: null,
        }),
      }),
    registerService: mock,
  };
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(customWorkspace, {});
  renderService = mock.mock.calls[0][0].reference;
  expect(renderService.renderItem({ nodeId: 'item-a' })).rejects.toThrow(notFoundNode);
});
