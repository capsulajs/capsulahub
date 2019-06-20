import { Selector as SelectorInterface } from '../../src/api/Selector';
import { avengers, beatles } from '../mocks/items';
import { Character, ComplexCharacterKey, SimpleCharacterKey } from '../types';
import { Selector } from '../../src';
import { errorMessages, validationMessages } from '../../src/helpers/messages';

describe('Selector service test suite', () => {
  let selector: SelectorInterface<Character, SimpleCharacterKey>;

  beforeEach(() => {
    selector = new Selector<Character, SimpleCharacterKey>();
  });

  it('Call setItems with items and get items at subscription after one emission', async () => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    selector.items$({}).subscribe((items) => {
      expect(items).toEqual(beatles);
    });
  });

  it('Call setItems with items successively and get items after subscription', async () => {
    expect.assertions(2);
    await selector.setItems({ items: beatles });

    let count = 0;

    selector.items$({}).subscribe((items) => {
      switch (count) {
        case 0:
          expect(items).toEqual(beatles);
          break;
        case 1:
          expect(items).toEqual(avengers);
      }
      count = count + 1;
    });

    await selector.setItems({ items: avengers });
  });

  const invalidItems = [null, undefined, 123, true, {}, { test: 'test' }];

  it.each(invalidItems)('Call setItems with invalid items: %j', async (items) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(selector.setItems({ items })).rejects.toEqual(new Error(validationMessages.invalidSetItemsRequest));
  });

  it('selectItem selects one of the stored items in the Selector by key', async () => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    await selector.selectItem({ key: { name: 'Paul' } });
    selector.selectedItem$({}).subscribe((item) => {
      expect(item).toEqual(beatles[1]);
    });
  });

  const invalidSelectItemRequestKey = [null, undefined, 123, [], true, {}];

  it.each(invalidSelectItemRequestKey)('Call selectItem with invalid key: %j', async (key) => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    // @ts-ignore
    return expect(selector.selectItem({ key })).rejects.toEqual(new Error(validationMessages.invalidSelectItemRequest));
  });

  const nonExistentKeys = [{ test: 'test' }, { name: 'Freddy' }, { test: 'test', name: 'Ringo' }];

  it.each(nonExistentKeys)('Call selectItem with a non-existent key: %j', async (key) => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    // @ts-ignore
    return expect(selector.selectItem({ key })).rejects.toEqual(new Error(errorMessages.itemNotFound));
  });

  const nonExistentComplexKeys = [{ name: 'John', birth: 1941 }, { name: 'John', birth: 1940, test: 42 }];

  it.each(nonExistentComplexKeys)('Call selectItem with a non-existent complex key: %j', async (key) => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    // @ts-ignore
    return expect(selector.selectItem({ key })).rejects.toEqual(new Error(errorMessages.itemNotFound));
  });

  it('selectedItems$ returns the selected item', async () => {
    expect.assertions(4);
    await selector.setItems({ items: beatles });
    let count = 0;
    selector.selectedItem$({}).subscribe((item) => {
      switch (count) {
        case 0:
          expect(item).toEqual(undefined);
          break;
        case 1:
          expect(item).toEqual(beatles[0]);
          break;
        case 2:
          expect(item).toEqual(beatles[1]);
          break;
        case 3:
          expect(item).toEqual(beatles[2]);
      }
      count = count + 1;
    });
    await selector.selectItem({ key: { name: 'John' } });
    await selector.selectItem({ key: { name: 'Paul' } });
    await selector.selectItem({ key: { name: 'George' } });
  });

  it('selectedItems$ returns the selected item (complex key)', async () => {
    expect.assertions(4);
    const selectorWithComplexKey = new Selector<Character, ComplexCharacterKey>();
    await selectorWithComplexKey.setItems({ items: beatles });
    let count = 0;
    selectorWithComplexKey.selectedItem$({}).subscribe((item) => {
      switch (count) {
        case 0:
          expect(item).toEqual(undefined);
          break;
        case 1:
          expect(item).toEqual(beatles[0]);
          break;
        case 2:
          expect(item).toEqual(beatles[1]);
          break;
        case 3:
          expect(item).toEqual(beatles[2]);
      }
      count = count + 1;
    });
    await selectorWithComplexKey.selectItem({ key: { name: 'John', birth: 1940 } });
    await selectorWithComplexKey.selectItem({ key: { name: 'Paul', birth: 1942 } });
    await selectorWithComplexKey.selectItem({ key: { name: 'George', birth: 1943 } });
  });

  it('Call selectItem with currently selected item', async () => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    await selector.selectItem({ key: { name: 'Ringo' } });
    return expect(selector.selectItem({ key: { name: 'Ringo' } })).rejects.toEqual(
      new Error(errorMessages.itemAlreadySelected)
    );
  });

  it('Call selectItem when no data in selector', () => {
    expect.assertions(1);
    return expect(selector.selectItem({ key: { name: 'Ringo' } })).rejects.toEqual(new Error(errorMessages.noData));
  });

  it('Preserve selectedItem$ after setItems if the selected item is in the new set', async (done) => {
    expect.assertions(3);
    await selector.setItems({ items: avengers });
    let count = 0;
    selector.selectedItem$({}).subscribe((item) => {
      switch (count) {
        case 0:
          expect(item).toEqual(undefined);
          break;
        case 1:
          expect(item).toEqual(avengers[2]);
          break;
        case 2:
          expect(item).toEqual(asgardians[1]);
          done();
      }
      count = count + 1;
    });
    await selector.selectItem({ key: { name: 'Chris Hemsworth' } });
    const asgardians = [
      { name: 'Chris Hemsworth', birth: 1983, role: 'Thor' },
      { name: 'Anthony Hopkins', birth: 1937, role: 'Odin' },
    ];
    await selector.setItems({ items: asgardians });
    await selector.selectItem({ key: { name: 'Anthony Hopkins' } });
  });

  it('Reset selectedItem$ after setItems if the selected item is not in the new set', async () => {
    expect.assertions(4);
    await selector.setItems({ items: avengers });
    let count = 0;
    selector.selectedItem$({}).subscribe((item) => {
      switch (count) {
        case 0:
          expect(item).toEqual(undefined);
          break;
        case 1:
          expect(item).toEqual(avengers[2]);
          break;
        case 2:
          expect(item).toEqual(undefined);
          break;
        case 3:
          expect(item).toEqual(asgardians[1]);
      }
      count = count + 1;
    });
    await selector.selectItem({ key: { name: 'Chris Hemsworth' } });
    const asgardians = [
      { name: 'Idris Elba', birth: 1972, role: 'Heimdall' },
      { name: 'Anthony Hopkins', birth: 1937, role: 'Odin' },
    ];
    await selector.setItems({ items: asgardians });
    await selector.selectItem({ key: { name: 'Anthony Hopkins' } });
  });
});
