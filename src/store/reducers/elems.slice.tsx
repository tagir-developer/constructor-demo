import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { parseInt } from 'common/helpers';
import {
  IChangeGroupStyles,
  IElement,
  IStylesByElemId,
  MovementDirectionType,
  TypeChangeStylesHandler,
} from 'common/interfaces';
import { CSSProperties } from 'react';
import CollectionService from 'services/CollectionService';
import ElemsService from 'services/ElemsService';
import LayersService from 'services/LayersService';

export interface IGroupAgainItem {
  groupId: string;
  childrenIds: string[];
}

export interface IInitialElemsState {
  elems: IElement[];
  elemsBuffer: IElement[];
  selectedElemsIds: string[];
  isLayersDragDisabled: boolean;
  isLayersRenderDisabled: boolean;
  needToGroupAgainCollection: IGroupAgainItem[];
}

const initialState: IInitialElemsState = {
  elems: [],
  elemsBuffer: [],
  selectedElemsIds: [],
  isLayersDragDisabled: false,
  isLayersRenderDisabled: false,
  needToGroupAgainCollection: [],
};

export const UPDATE_ALL_ELEMS_STATE = 'updateAllElemsState';
export const COPY_ELEM_WHEN_DRAG_AND_DROP = 'copyElemWhenDragAndDrop';

const elemsSlice = createSlice({
  name: 'elems',
  initialState,
  reducers: {
    [UPDATE_ALL_ELEMS_STATE]: (
      state,
      action: PayloadAction<IInitialElemsState>,
    ) => {
      return action.payload;
    },

    updateElemsWhenBreakpointChanged: (
      state,
      action: PayloadAction<IElement[]>,
    ) => {
      return { ...initialState, elems: action.payload };
    },

    addNewElem: (state, action: PayloadAction<IElement>) => {
      state.elems = [...state.elems, action.payload];
    },

    updateElems: (state, action: PayloadAction<IElement[]>) => {
      state.elems = action.payload;
      state.selectedElemsIds = [];
    },

    deleteElemById: (state, action: PayloadAction<string>) => {
      state.elems = state.elems.filter((elem) => elem.id !== action.payload);
    },

    deleteSelectedElems: (state, action: PayloadAction<string[]>) => {
      const data = LayersService.deleteSelectedElems(
        state.elems,
        action.payload,
        state.needToGroupAgainCollection,
      );

      state.elems = data.filteredElems;
      state.selectedElemsIds = [];
      state.isLayersRenderDisabled = false;
      state.needToGroupAgainCollection = data.updatedNeedToGroupAgain;
    },

    addSelectedElemId: (state, action: PayloadAction<string>) => {
      state.selectedElemsIds = [...state.selectedElemsIds, action.payload];
    },

    setSelectedElemsIds: (state, action: PayloadAction<string[]>) => {
      state.selectedElemsIds = action.payload;
    },

    addSelectedChildElem: (state, action: PayloadAction<IElement>) => {
      const data = ElemsService.addSelectedChildElem(
        state.elems,
        state.selectedElemsIds,
        state.needToGroupAgainCollection,
        action.payload,
      );

      if (!data) return;

      state.isLayersRenderDisabled = true;
      state.selectedElemsIds = data.newSelectedElemsIds;
      state.elems = data.updatedElems;
      state.needToGroupAgainCollection = data.needToGroupAgain;
    },

    setSelectedChildElem: (state, action: PayloadAction<IElement>) => {
      const data = ElemsService.setSelectedChildElem(
        state.elems,
        action.payload,
        state.selectedElemsIds,
        state.isLayersRenderDisabled,
      );

      if (!data) return;

      if (data.updatedSelectedElemsIds) {
        state.selectedElemsIds = data.updatedSelectedElemsIds;
      }

      if (data.updatedElems && data.needToGroupAgain) {
        state.isLayersRenderDisabled = true;
        state.selectedElemsIds = [action.payload.id];
        state.elems = data.updatedElems;
        state.needToGroupAgainCollection = data.needToGroupAgain;
      }
    },

    groupElemsWhenChildElemTransformStop: (
      state,
      action: PayloadAction<void>,
    ) => {
      const data = ElemsService.groupElemsWhenChildElemTransformStop(
        state.elems,
        state.needToGroupAgainCollection,
      );

      state.isLayersRenderDisabled = false;
      state.elems = data.newElems;
      state.needToGroupAgainCollection = [];
    },

    removeSelectedElemId: (state, action: PayloadAction<string>) => {
      state.selectedElemsIds = state.selectedElemsIds.filter(
        (id) => id !== action.payload,
      );
    },

    setElemsToBufferByIds: (state, action: PayloadAction<string[]>) => {
      const elems = CollectionService.getAllByIds(state.elems, action.payload);
      state.elemsBuffer = elems;
    },

    addElemsFromBuffer: (state, action: PayloadAction<void>) => {
      const elemsFromBuffer = ElemsService.prepareElemsForInsertion(
        state.elemsBuffer,
      );
      state.selectedElemsIds = elemsFromBuffer.map((item) => item.id);
      state.elems = [...state.elems, ...elemsFromBuffer];
    },

    [COPY_ELEM_WHEN_DRAG_AND_DROP]: (state, action: PayloadAction<string>) => {
      const draggableElem = state.elems.find(
        (item) => item.id === action.payload,
      );

      if (!draggableElem) return;

      state.elems = ElemsService.insertDraggableElemCopy(
        draggableElem,
        state.elems,
      );
    },

    changeElemStyles: (
      state,
      action: PayloadAction<{ id: string; styles: CSSProperties }>,
    ) => {
      state.elems = state.elems.map((elem) => {
        if (elem.id === action.payload.id) {
          return {
            ...elem,
            styles: { ...elem.styles, ...action.payload.styles },
          };
        }
        return elem;
      });
    },

    findElemsAndChangeStylesWithHandler: (
      state,
      action: PayloadAction<{
        ids: string[];
        handler: TypeChangeStylesHandler;
      }>,
    ) => {
      state.elems = ElemsService.findElemsAndChangeStylesWithHandler(
        state.elems,
        action.payload.ids,
        action.payload.handler,
      );
    },

    changeElemsStylesByIds: (
      state,
      action: PayloadAction<{ ids: string[]; styles: CSSProperties }>,
    ) => {
      state.elems = state.elems.map((elem) => {
        if (action.payload.ids.includes(elem.id)) {
          return {
            ...elem,
            styles: { ...elem.styles, ...action.payload.styles },
          };
        }
        return elem;
      });
    },

    moveSelectedElemsByIds: (
      state,
      action: PayloadAction<{
        ids: string[];
        offset: { left: number; top: number };
      }>,
    ) => {
      state.elems = state.elems.map((elem) => {
        if (action.payload.ids.includes(elem.id)) {
          return {
            ...elem,
            styles: {
              ...elem.styles,
              left: parseInt(elem.styles.left) + action.payload.offset.left,
              top: parseInt(elem.styles.top) + action.payload.offset.top,
            },
          };
        }
        return elem;
      });
    },

    changeEverySelectedElemByOwnStyles: (
      state,
      action: PayloadAction<IStylesByElemId[]>,
    ) => {
      state.elems = ElemsService.updateElemsWhenResizeSelection(
        state.elems,
        action.payload,
      );
    },

    changeGroupElemStyles: (
      state,
      action: PayloadAction<IChangeGroupStyles>,
    ) => {
      state.elems = ElemsService.changeGroupElemsStyles(
        state.elems,
        action.payload,
      );
    },

    groupElemsByIds: (state, action: PayloadAction<string[]>) => {
      const { groupElemId, updatedElems } = ElemsService.groupElemsByIds(
        state.elems,
        action.payload,
      );

      state.elems = updatedElems;
      state.selectedElemsIds = [groupElemId];
    },

    ungroupElemsByIds: (state, action: PayloadAction<string[]>) => {
      const { updatedElems, newSelectedElemsIds } =
        ElemsService.ungroupElemsByIds(
          state.elems,
          state.selectedElemsIds,
          action.payload,
        );

      state.elems = updatedElems;
      state.selectedElemsIds = newSelectedElemsIds;
    },

    moveSelectedElemsDown: (state, action: PayloadAction<string[]>) => {
      state.elems = LayersService.moveSelectedElemsDown(
        state.elems,
        action.payload,
      );
    },

    sendSelectedElemsToBack: (state, action: PayloadAction<string[]>) => {
      state.elems = LayersService.sendSelectedElemsToBack(
        state.elems,
        action.payload,
      );
    },

    bringSelectedElemsToFront: (state, action: PayloadAction<string[]>) => {
      state.elems = LayersService.bringSelectedElemsToFront(
        state.elems,
        action.payload,
      );
    },

    moveSelectedElemsUp: (state, action: PayloadAction<string[]>) => {
      state.elems = LayersService.moveSelectedElemsUp(
        state.elems,
        action.payload,
      );
    },

    toggleNestedLayersVisibility: (state, action: PayloadAction<string>) => {
      state.elems = LayersService.toggleNestedLayersVisibility(
        state.elems,
        action.payload,
      );
    },

    toggleLayersVisibility: (state, action: PayloadAction<string[]>) => {
      state.elems = LayersService.toggleLayersVisibility(
        state.elems,
        action.payload,
      );
      state.selectedElemsIds = LayersService.removeFromSelectedByIds(
        state.selectedElemsIds,
        action.payload,
      );
    },

    toggleLayersLocking: (state, action: PayloadAction<string[]>) => {
      state.elems = LayersService.toggleLayersLocking(
        state.elems,
        action.payload,
      );
      state.selectedElemsIds = LayersService.removeFromSelectedByIds(
        state.selectedElemsIds,
        action.payload,
      );
    },

    lockSelectedElems: (state, action: PayloadAction<void>) => {
      state.elems = state.elems.map((item): IElement => {
        if (state.selectedElemsIds.includes(item.id)) {
          return { ...item, isBlocked: true };
        }

        return item;
      });
    },

    unlockSelectedElems: (state, action: PayloadAction<void>) => {
      state.elems = state.elems.map((item): IElement => {
        if (state.selectedElemsIds.includes(item.id)) {
          return { ...item, isBlocked: false };
        }

        return item;
      });
    },

    setIsLayersDragDisabled: (state, action: PayloadAction<boolean>) => {
      state.isLayersDragDisabled = action.payload;
    },

    moveSelectedElemsOnKeyDown: (
      state,
      action: PayloadAction<{
        direction: MovementDirectionType;
        withShiftKey: boolean;
      }>,
    ) => {
      state.elems = ElemsService.moveSelectedElemsOnKeyDown(
        state.elems,
        state.selectedElemsIds,
        action.payload.direction,
        action.payload.withShiftKey,
      );
    },
  },
});

export const {
  updateAllElemsState,
  addNewElem,
  deleteElemById,
  changeElemStyles,
  addSelectedElemId,
  removeSelectedElemId,
  addElemsFromBuffer,
  changeElemsStylesByIds,
  deleteSelectedElems,
  moveSelectedElemsByIds,
  changeEverySelectedElemByOwnStyles,
  setElemsToBufferByIds,
  copyElemWhenDragAndDrop,
  setSelectedElemsIds,
  groupElemsByIds,
  changeGroupElemStyles,
  ungroupElemsByIds,
  moveSelectedElemsDown,
  moveSelectedElemsUp,
  sendSelectedElemsToBack,
  bringSelectedElemsToFront,
  updateElems,
  toggleNestedLayersVisibility,
  toggleLayersVisibility,
  toggleLayersLocking,
  setIsLayersDragDisabled,
  findElemsAndChangeStylesWithHandler,
  addSelectedChildElem,
  setSelectedChildElem,
  groupElemsWhenChildElemTransformStop,
  lockSelectedElems,
  unlockSelectedElems,
  moveSelectedElemsOnKeyDown,
  updateElemsWhenBreakpointChanged,
} = elemsSlice.actions;

export default elemsSlice.reducer;
