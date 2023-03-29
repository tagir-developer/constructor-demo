import { IElement, IGuide } from 'common/interfaces';
import { IArtboardProps, IBreakpoint } from 'store/reducers/common.slice';

import CollectionService from './CollectionService';

class BreakpointsService {
  _findActiveBreakpoint(
    breakpoints: IBreakpoint[],
    currentArtboardWidth: number,
  ): IBreakpoint | undefined {
    return breakpoints.find(
      (item, index, array) =>
        item.breakpoint < currentArtboardWidth &&
        currentArtboardWidth <= (array[index + 1]?.breakpoint ?? 100000),
    );
  }

  addBreakpoints(
    breakpoints: IBreakpoint[],
    newBreakpoints: IBreakpoint[],
    currentArtboardWidth: number,
  ): {
    updatedBreakpoints: IBreakpoint[];
    newActiveBreakpoint: IBreakpoint | null;
  } {
    const updatedBreakpoints = CollectionService.orderBy(
      [...breakpoints, ...newBreakpoints],
      'breakpoint',
    );

    const activeBreakpointCandidate = this._findActiveBreakpoint(
      updatedBreakpoints,
      currentArtboardWidth,
    );

    return {
      updatedBreakpoints,
      newActiveBreakpoint: activeBreakpointCandidate ?? null,
    };
  }

  deleteBreakpoint(
    breakpoints: IBreakpoint[],
    deletedBreakpointValue: number,
    currentArtboardWidth: number,
  ): {
    updatedBreakpoints: IBreakpoint[];
    newActiveBreakpoint: IBreakpoint | null | undefined;
  } {
    let updatedBreakpoints = breakpoints
      .map((item, index, array): IBreakpoint => {
        const nextBreakpoint = array[index + 1];

        if (nextBreakpoint?.breakpoint === deletedBreakpointValue) {
          return {
            ...item,
            elems: nextBreakpoint.elems,
            guides: nextBreakpoint.guides,
            artboardProps: nextBreakpoint.artboardProps,
          };
        }

        return item;
      })
      .filter((item) => item.breakpoint !== deletedBreakpointValue);

    updatedBreakpoints =
      updatedBreakpoints.length > 1 ? updatedBreakpoints : [];

    if (updatedBreakpoints.length <= 1) {
      return {
        updatedBreakpoints,
        newActiveBreakpoint: null,
      };
    }

    const activeBreakpointCandidate = this._findActiveBreakpoint(
      updatedBreakpoints,
      currentArtboardWidth,
    );

    return {
      updatedBreakpoints,
      newActiveBreakpoint: activeBreakpointCandidate,
    };
  }

  changeActiveBreakpointIfNeeded(
    breakpoints: IBreakpoint[],
    breakpointValueToUpdate: number,
    newArtboardWidth: number,
    elems: IElement[],
    guides: IGuide[],
    artboardProps: IArtboardProps,
    stateActiveBreakpoint: IBreakpoint | null,
    isBreakpointUpdateFreezing: boolean,
  ): {
    updatedBreakpoints: IBreakpoint[];
    newActiveBreakpoint: IBreakpoint;
  } | null {
    const activeBreakpointCandidate = CollectionService.orderBy(
      breakpoints,
      'breakpoint',
    ).find(
      (item, index, array) =>
        item.breakpoint < newArtboardWidth &&
        newArtboardWidth <= (array[index + 1]?.breakpoint ?? 100000),
    );

    if (
      !activeBreakpointCandidate ||
      activeBreakpointCandidate.breakpoint === stateActiveBreakpoint?.breakpoint
    ) {
      return null;
    }

    // сохраняем изменения в старом эндпоинте при переключении на другой активный эндпоинт
    const updatedBreakpoints = isBreakpointUpdateFreezing
      ? breakpoints
      : breakpoints.map((item): IBreakpoint => {
          if (item.breakpoint === breakpointValueToUpdate) {
            return {
              ...item,
              elems,
              guides,
              artboardProps,
            };
          }

          return item;
        });

    return {
      updatedBreakpoints,
      newActiveBreakpoint: activeBreakpointCandidate,
    };
  }
}

export default new BreakpointsService();
