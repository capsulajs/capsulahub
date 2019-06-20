import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, first } from 'rxjs/operators';
import isMatch from 'lodash/isMatch';
import {
  ItemsRequest,
  SelectedItemRequest,
  SelectItemRequest,
  SelectorInterface,
  SetItemsRequest,
  SelectedItem,
} from './api';
import { validationMessages, errorMessages } from './helpers/messages';
import { isObjectRequest, isValidSelectRequest, isValidSetItemsRequest } from './helpers/validators';

export class Selector<Item extends Key, Key extends object> implements SelectorInterface<Item, Key> {
  private readonly data$: BehaviorSubject<Item[]>;
  private readonly selected$: BehaviorSubject<Item | undefined>;

  constructor() {
    this.data$ = new BehaviorSubject<Item[]>([]);
    this.selected$ = new BehaviorSubject<Item | undefined>(undefined);
  }

  public setItems(setItemsRequest: SetItemsRequest<Item>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isValidSetItemsRequest(setItemsRequest)) {
        return reject(new Error(validationMessages.invalidSetItemsRequest));
      }
      this.resetSelected(setItemsRequest.items);
      this.data$.next(setItemsRequest.items);
      return resolve();
    });
  }

  public items$(itemsRequest: ItemsRequest): Observable<Item[]> {
    if (!isObjectRequest(itemsRequest)) {
      return throwError(validationMessages.invalidObjectRequest);
    }
    return this.data$.asObservable();
  }

  public selectItem(selectItemRequest: SelectItemRequest<Key>): Promise<void> {
    return new Promise((resolve, reject) => {
      // Reject case: no data has been set in Selector
      if (this.data$.getValue().length === 0) {
        return reject(new Error(errorMessages.noData));
      }
      // Reject case: selectItemRequest is not valid
      if (!isValidSelectRequest(selectItemRequest)) {
        return reject(new Error(validationMessages.invalidSelectItemRequest));
      }
      // Reject case: Item is already selected
      if (this.selected$.getValue() && isMatch(this.selected$.getValue() as Item, selectItemRequest.key)) {
        return reject(new Error(errorMessages.itemAlreadySelected));
      }

      this.data$
        .pipe(
          first(),
          map((items) =>
            items.find((item: Item) => {
              return isMatch(item, selectItemRequest.key);
            })
          )
        )
        .subscribe((item: Item | undefined) => {
          if (!item) {
            // Rejection case: wanted Item not found
            return reject(new Error(errorMessages.itemNotFound));
          }
          this.selected$.next(item);
          return resolve();
        });
    });
  }

  public selectedItem$(selectedItemRequest: SelectedItemRequest): Observable<SelectedItem<Item>> {
    if (!isObjectRequest(selectedItemRequest)) {
      return throwError(validationMessages.invalidObjectRequest);
    }
    return this.selected$.asObservable();
  }

  private resetSelected(items: Item[]): void {
    const selected = this.selected$.getValue();
    if (selected) {
      const shouldKeepSelection = items.some((item) => isMatch(item, selected));
      if (!shouldKeepSelection) {
        this.selected$.next(undefined);
      }
    }
  }
}
