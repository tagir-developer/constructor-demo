import { ITestObj } from 'common/interfaces';

import CollectionService from './CollectionService';

describe('Testing CollectionService', () => {
  test('findByIdsAndUpdate method', () => {
    const testObject: ITestObj[] = [
      {
        id: '1',
        name: 'Pete',
        isDead: false,
        children: [
          { id: '2', name: 'Mars', isDead: false, children: null },
          { id: '3', name: 'Joe', isDead: true, children: null },
          { id: '4', name: 'Max', isDead: false, children: null },
        ],
      },
      { id: '5', name: 'Alex', isDead: true, children: null },
    ];

    const updatedTestObject: ITestObj[] = [
      {
        id: '1',
        name: 'Pete',
        isDead: true,
        children: [
          { id: '2', name: 'Mars', isDead: true, children: null },
          { id: '3', name: 'Joe', isDead: true, children: null },
          { id: '4', name: 'Max', isDead: false, children: null },
        ],
      },
      { id: '5', name: 'Alex', isDead: true, children: null },
    ];

    const result = CollectionService.findByIdsAndUpdate<ITestObj>(
      testObject,
      ['1', '2'],
      {
        isDead: true,
      },
    );

    expect(result).toEqual(updatedTestObject);
  });

  test('findByIdsAndUpdateWithHandler method', () => {
    const testObject: ITestObj[] = [
      {
        id: '1',
        name: 'Pete',
        isDead: false,
        children: [
          { id: '2', name: 'Mars', isDead: false, children: null },
          { id: '3', name: 'Joe', isDead: true, children: null },
          { id: '4', name: 'Max', isDead: false, children: null },
        ],
      },
      { id: '5', name: 'Alex', isDead: true, children: null },
    ];

    const updatedTestObject: ITestObj[] = [
      {
        id: '1',
        name: 'PeteNEW',
        isDead: true,
        children: [
          { id: '2', name: 'MarsNEW', isDead: true, children: null },
          { id: '3', name: 'Joe', isDead: true, children: null },
          { id: '4', name: 'Max', isDead: false, children: null },
        ],
      },
      { id: '5', name: 'Alex', isDead: true, children: null },
    ];

    const result = CollectionService.findByIdsAndUpdateWithHandler<ITestObj>(
      testObject,
      ['1', '2'],
      {
        isDead: (value) => !value,
        name: (value) => value + 'NEW',
      },
    );

    expect(result).toEqual(updatedTestObject);
  });
});
