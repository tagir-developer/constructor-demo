import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GuideTypes, IGuide, IStickyPoints } from 'common/interfaces';
import { v4 } from 'uuid';

export interface IInitialGuidesState {
  guides: IGuide[];
  stickyPoints: IStickyPoints[];
  selectedGuidesIds: string[];
  isGuidesVisible: boolean;
}

const initialState: IInitialGuidesState = {
  guides: [],
  stickyPoints: [],
  selectedGuidesIds: [],
  isGuidesVisible: true,
};

export const UPDATE_ALL_GUIDES_STATE = 'updateAllGuidesState';

const guidesSlice = createSlice({
  name: 'guides',
  initialState,
  reducers: {
    [UPDATE_ALL_GUIDES_STATE]: (
      state,
      action: PayloadAction<IInitialGuidesState>,
    ) => {
      return action.payload;
    },

    updateGuidesWhenBreakpointChanged: (
      state,
      action: PayloadAction<IGuide[]>,
    ) => {
      return { ...initialState, guides: action.payload };
    },

    toggleGuidesVisibility: (state, action: PayloadAction<void>) => {
      state.isGuidesVisible = !state.isGuidesVisible;
    },

    setStickyPoints: (state, action: PayloadAction<IStickyPoints[]>) => {
      state.stickyPoints = action.payload;
    },

    deleteGuidesByIds: (state, action: PayloadAction<string[]>) => {
      state.guides = state.guides.filter(
        (item) => !action.payload.includes(item.id) || item.isBlocked,
      );
      state.selectedGuidesIds = state.selectedGuidesIds.filter(
        (id) => !action.payload.includes(id),
      );
    },

    addNewGuide: (state, action: PayloadAction<GuideTypes>) => {
      const newGuide: IGuide = {
        id: v4(),
        type: action.payload,
        isBlocked: false,
        x:
          action.payload === GuideTypes.VERTICAL
            ? document.documentElement.scrollWidth / 2
            : 0,
        y:
          action.payload === GuideTypes.HORIZONTAL
            ? document.documentElement.scrollHeight / 2
            : 0,
      };

      state.guides.push(newGuide);
    },

    selectGuidesByIds: (state, action: PayloadAction<string[]>) => {
      state.selectedGuidesIds = action.payload;
    },

    addGuideToSelected: (state, action: PayloadAction<string>) => {
      state.selectedGuidesIds.push(action.payload);
    },

    clearSelectedGuidesIds: (state, action: PayloadAction<void>) => {
      state.selectedGuidesIds = [];
    },

    moveSelectedGuides: (
      state,
      action: PayloadAction<{ xOffset: number; yOffset: number }>,
    ) => {
      state.guides = state.guides.map((guide) => {
        if (state.selectedGuidesIds.includes(guide.id) && !guide.isBlocked) {
          return {
            ...guide,
            x: guide.x + action.payload.xOffset,
            y: guide.y + action.payload.yOffset,
          };
        }
        return guide;
      });
    },

    updateGuideProps: (
      state,
      action: PayloadAction<{
        id: string;
        updatedProps: { [key in keyof IGuide]?: IGuide[key] };
      }>,
    ) => {
      state.guides = state.guides.map((item): IGuide => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload.updatedProps };
        }

        return item;
      });
    },

    copyGuide: (state, action: PayloadAction<IGuide>) => {
      state.guides.push({ ...action.payload, id: v4() });
    },

    lockSelectedGuides: (state, action: PayloadAction<void>) => {
      state.guides = state.guides.map((item): IGuide => {
        if (state.selectedGuidesIds.includes(item.id)) {
          return { ...item, isBlocked: true };
        }

        return item;
      });
    },

    unlockSelectedGuides: (state, action: PayloadAction<void>) => {
      state.guides = state.guides.map((item): IGuide => {
        if (state.selectedGuidesIds.includes(item.id)) {
          return { ...item, isBlocked: false };
        }

        return item;
      });
    },
  },
});

export const {
  updateAllGuidesState,
  toggleGuidesVisibility,
  setStickyPoints,
  deleteGuidesByIds,
  addNewGuide,
  selectGuidesByIds,
  addGuideToSelected,
  updateGuideProps,
  clearSelectedGuidesIds,
  moveSelectedGuides,
  copyGuide,
  lockSelectedGuides,
  unlockSelectedGuides,
  updateGuidesWhenBreakpointChanged,
} = guidesSlice.actions;

export default guidesSlice.reducer;
