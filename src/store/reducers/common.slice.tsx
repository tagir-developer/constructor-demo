import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  DEFAULT_ARTBOARD_HEIGHT_PX,
  DEFAULT_CANVAS_HEIGHT_PX,
} from 'common/constants';
import {
  IElement,
  IGuide,
  ISettingPanel,
  ThemeAccentColors,
  ThemeTypes,
  TypeObjectProps,
} from 'common/interfaces';
import ActionsHistoryService from 'services/ActionsHistoryService';
import BreakpointsService from 'services/BreakpointsService';
import CollectionService from 'services/CollectionService';

import { IInitialElemsState } from './elems.slice';
import { IInitialGuidesState } from './guides.slice';

export interface IStateHistoryItem
  extends IInitialElemsState,
    IInitialGuidesState {}

export interface IStateHistory {
  before: IStateHistoryItem[];
  after: IStateHistoryItem[];
}

export interface IArtboardProps {
  width: number;
  height: number;
  paddings: {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  };
}
export interface IBreakpoint {
  breakpoint: number;
  elems: IElement[];
  guides: IGuide[];
  // artboardProps: Omit<IArtboardProps, 'width'>;
  artboardProps: IArtboardProps;
}

export interface IThemeConfig {
  themeType: ThemeTypes;
  accentColor: ThemeAccentColors;
}

interface IInitialCommonState {
  settingsPanels: ISettingPanel[];
  pressedKeys: string[];
  // canvasRef: React.MutableRefObject<HTMLDivElement> | null;
  canvasRef: any;
  isMultipleStateUpdateEvent: boolean;
  history: IStateHistory;
  breakpoints: IBreakpoint[];
  activeBreakpoint: IBreakpoint | null;
  isBreakpointUpdateFreezing: boolean;
  artboardProps: IArtboardProps;
  canvasHeight: number;
  isColorPickerOpen: boolean;
  themeConfig: IThemeConfig;
}

const initialState: IInitialCommonState = {
  settingsPanels: [],
  pressedKeys: [],
  canvasRef: null,
  isMultipleStateUpdateEvent: false,
  history: {
    before: [],
    after: [],
  },
  breakpoints: [],
  activeBreakpoint: null,
  isBreakpointUpdateFreezing: false,
  artboardProps: {
    width: 1500,
    height: DEFAULT_ARTBOARD_HEIGHT_PX,
    paddings: {
      paddingTop: 0,
      paddingRight: 30,
      paddingBottom: 0,
      paddingLeft: 30,
    },
  },
  canvasHeight: DEFAULT_CANVAS_HEIGHT_PX,
  isColorPickerOpen: false,
  themeConfig: {
    themeType: ThemeTypes.DARK,
    accentColor: ThemeAccentColors.BLUE_GREEN,
  },
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    addPressedKeys: (state, action: PayloadAction<string>) => {
      state.pressedKeys = [...new Set([...state.pressedKeys, action.payload])];
    },

    deletePressedKeys: (state, action: PayloadAction<string>) => {
      state.pressedKeys = state.pressedKeys.filter(
        (item) => item !== action.payload,
      );
    },

    setCanvasRef: (
      state,
      action: PayloadAction<React.RefObject<HTMLDivElement>>,
    ) => {
      state.canvasRef = action.payload;
    },

    changeCanvasHeightOnValue: (state, action: PayloadAction<number>) => {
      state.canvasHeight = state.canvasHeight + action.payload;
    },

    setIsMultipleStateUpdateEvent: (state, action: PayloadAction<boolean>) => {
      state.isMultipleStateUpdateEvent = action.payload;
    },

    saveStateInHistory: (state, action: PayloadAction<IStateHistoryItem>) => {
      state.history = ActionsHistoryService.saveStateInHistory(
        action.payload,
        state.history,
      );
    },

    undoAction: (state) => {
      state.history = ActionsHistoryService.undoAction(state.history);
    },

    redoAction: (state) => {
      state.history = ActionsHistoryService.redoAction(state.history);
    },

    addBreakpoints: (state, action: PayloadAction<IBreakpoint[]>) => {
      const { updatedBreakpoints, newActiveBreakpoint } =
        BreakpointsService.addBreakpoints(
          state.breakpoints,
          action.payload,
          state.artboardProps.width,
        );

      state.breakpoints = updatedBreakpoints;

      if (newActiveBreakpoint) {
        state.activeBreakpoint = newActiveBreakpoint;
      }
    },

    deleteBreakpoint: (state, action: PayloadAction<number>) => {
      const { updatedBreakpoints, newActiveBreakpoint } =
        BreakpointsService.deleteBreakpoint(
          state.breakpoints,
          action.payload,
          state.artboardProps.width,
        );

      state.breakpoints = updatedBreakpoints;

      if (newActiveBreakpoint || newActiveBreakpoint === null) {
        state.activeBreakpoint = newActiveBreakpoint;
      }
    },

    setIsBreakpointUpdateFreezing: (state, action: PayloadAction<boolean>) => {
      state.isBreakpointUpdateFreezing = action.payload;
    },

    changeActiveBreakpointIfNeeded: (
      state,
      action: PayloadAction<{
        breakpointValue: number;
        width: number;
        elems: IElement[];
        guides: IGuide[];
      }>,
    ) => {
      if (!state.breakpoints.length) return;

      const result = BreakpointsService.changeActiveBreakpointIfNeeded(
        state.breakpoints,
        action.payload.breakpointValue,
        action.payload.width,
        action.payload.elems,
        action.payload.guides,
        state.artboardProps,
        state.activeBreakpoint,
        state.isBreakpointUpdateFreezing,
      );

      if (!result) return;

      state.breakpoints = result.updatedBreakpoints;
      state.activeBreakpoint = result.newActiveBreakpoint;
      state.isBreakpointUpdateFreezing = true;
    },

    changeArtboardProps: (
      state,
      action: PayloadAction<TypeObjectProps<IArtboardProps>>,
    ) => {
      state.artboardProps = CollectionService.updateObjectProps(
        state.artboardProps,
        action.payload,
      );
    },

    updateArtboardPropsWhenBreakpointChanged: (
      state,
      action: PayloadAction<IArtboardProps>,
    ) => {
      const artboardHeightDiff =
        action.payload.height - DEFAULT_ARTBOARD_HEIGHT_PX;
      const newCanvasHeight = DEFAULT_CANVAS_HEIGHT_PX + artboardHeightDiff;

      state.artboardProps = {
        ...action.payload,
        width: state.artboardProps.width,
      };
      state.canvasHeight = newCanvasHeight;
    },

    setIsColorPickerOpen: (state, action: PayloadAction<boolean>) => {
      state.isColorPickerOpen = action.payload;
    },

    changeThemeType: (state, action: PayloadAction<ThemeTypes>) => {
      state.themeConfig.themeType = action.payload;
    },

    changeThemeAccentColor: (
      state,
      action: PayloadAction<ThemeAccentColors>,
    ) => {
      state.themeConfig.accentColor = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(toggleGuidesVisibility, (state, action) => {
  //     state.history = ElemsService.saveStateInHistory(state, state.history);
  //   });
  // },
});

export const {
  addPressedKeys,
  deletePressedKeys,
  setCanvasRef,
  setIsMultipleStateUpdateEvent,
  saveStateInHistory,
  undoAction,
  redoAction,
  addBreakpoints,
  deleteBreakpoint,
  changeArtboardProps,
  changeActiveBreakpointIfNeeded,
  setIsBreakpointUpdateFreezing,
  changeCanvasHeightOnValue,
  updateArtboardPropsWhenBreakpointChanged,
  setIsColorPickerOpen,
  changeThemeType,
  changeThemeAccentColor,
} = commonSlice.actions;

export default commonSlice.reducer;
