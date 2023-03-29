import { cloneDeep, isEqual, orderBy } from 'lodash';

class CollectionService {
  cloneDeep<T>(obj: T): T {
    return cloneDeep(obj);
  }

  orderBy<T>(arr: T[], value: keyof T, orderType?: 'asc' | 'desc'): T[] {
    return orderBy(arr, value, orderType ?? 'asc');
  }

  omit<T, B extends keyof T>(obj: T, keys: Array<B>): Omit<T, B> {
    const result = this.cloneDeep(obj);

    for (const key in result) {
      const value = key as any;
      if (keys.includes(value)) {
        delete result[key];
      }
    }

    return result;
  }

  isEqual<T, B>(obj1: T, obj2: B): boolean {
    return isEqual(obj1, obj2);
  }

  getAllByIds<T extends { id: string | number }>(
    array: T[],
    ids: string[],
  ): T[] {
    if (ids.length === 1) return array.filter((item) => item.id === ids[0]);

    const result: T[] = [];

    for (const id of ids) {
      const elem = array.find((item) => item.id === id);

      if (elem) {
        result.push(elem);
      }
    }

    return result;
  }

  findElemById<T extends { id: string; children: T[] | null }>(
    elems: T[],
    id: string,
  ): T | null {
    const targetElem = elems.find((item) => item.id === id);

    if (targetElem) {
      return targetElem;
    } else {
      for (const elem of elems) {
        if (elem.children) {
          const foundedElem = this.findElemById(elem.children, id);

          if (foundedElem) {
            return foundedElem;
          }
        }
      }

      return null;
    }
  }

  updateObjectProps<T>(
    object: T,
    updatedFields: { [key in keyof T]?: T[key] },
  ): T {
    return { ...object, ...updatedFields };
  }

  findByIdsAndUpdate<T extends { id: string; children: T[] | null }>(
    items: T[],
    ids: string[],
    updatedFields: { [key in keyof T]?: T[key] },
  ): T[] {
    return items.map((item): T => {
      if (ids.includes(item.id)) {
        return {
          ...item,
          ...updatedFields,
          children: item.children
            ? this.findByIdsAndUpdate(item.children, ids, updatedFields)
            : null,
        };
      }

      if (item.children) {
        return {
          ...item,
          children: this.findByIdsAndUpdate(item.children, ids, updatedFields),
        };
      }

      return item;
    });
  }

  findByIdsAndUpdateWithHandler<T extends { id: string; children: T[] | null }>(
    items: T[],
    ids: string[],
    updatedFields: { [key in keyof T]?: (value: T[key]) => T[key] },
  ): T[] {
    return items.map((item): T => {
      if (ids.includes(item.id)) {
        const itemClone = this.cloneDeep<T>(item);
        const updatedItemValues = {} as { [key in keyof T]?: T[key] };

        for (const [key, value] of Object.entries(updatedFields)) {
          const itemFieldValue = itemClone[key];
          const newValue = value(itemFieldValue);
          updatedItemValues[key] = newValue;
        }

        return {
          ...item,
          ...updatedItemValues,
          children: item.children
            ? this.findByIdsAndUpdateWithHandler(
                item.children,
                ids,
                updatedFields,
              )
            : null,
        };
      }

      if (item.children) {
        return {
          ...item,
          children: this.findByIdsAndUpdateWithHandler(
            item.children,
            ids,
            updatedFields,
          ),
        };
      }

      return item;
    });
  }
}

export default new CollectionService();
