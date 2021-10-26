import { Selection } from "./selection/selection";
import { CursorLocation, StateContext } from "./types";

export const initState = (): StateContext => ({
  visibleIds: [],
  cursorLocation: null,
  editingId: null,
  selection: {
    data: null,
    ids: [],
  },
});

export const setCursorLocation = (location: CursorLocation | null) => ({
  type: "SET_CURSOR_LOCATION" as "SET_CURSOR_LOCATION",
  location,
});

export const setVisibleIds = (
  ids: string[], // index to id
  idMap: { [id: string]: number } // id to index
) => ({
  type: "SET_VISIBLE_IDS" as "SET_VISIBLE_IDS",
  ids,
  idMap,
});

export const select = (
  index: number | null,
  meta: boolean,
  shift: boolean
) => ({
  type: "SELECT" as "SELECT",
  index,
  meta,
  shift,
});

export const selectId = (id: string) => ({
  type: "SELECT_ID" as "SELECT_ID",
  id,
});

export const edit = (id: string | null) => ({
  type: "EDIT" as "EDIT",
  id,
});

export const stepUp = (shift: boolean, ids: string[]) => ({
  type: "STEP_UP" as "STEP_UP",
  shift,
});

export const stepDown = (shift: boolean, ids: string[]) => ({
  type: "STEP_DOWN" as "STEP_DOWN",
  shift,
});

export type Action =
  | ReturnType<typeof setCursorLocation>
  | ReturnType<typeof select>
  | ReturnType<typeof setVisibleIds>
  | ReturnType<typeof selectId>
  | ReturnType<typeof edit>
  | ReturnType<typeof stepUp>
  | ReturnType<typeof stepDown>;

export function reducer(state: StateContext, action: Action): StateContext {
  switch (action.type) {
    case "EDIT":
      return {
        ...state,
        editingId: action.id,
      };
    case "SET_CURSOR_LOCATION":
      if (equal(state.cursorLocation, action.location)) {
        return state;
      } else {
        return { ...state, cursorLocation: action.location };
      }
    case "SELECT":
      var s = Selection.parse(state.selection.data, state.visibleIds);
      if (action.index === null) {
        s.clear();
      } else if (action.meta) {
        if (s.contains(action.index)) {
          s.deselect(action.index);
        } else {
          s.multiSelect(action.index);
        }
      } else if (action.shift) {
        s.extend(action.index);
      } else {
        s.select(action.index);
      }
      return {
        ...state,
        selection: {
          data: s.serialize(),
          ids: s.getSelectedItems(),
        },
      };
    case "SELECT_ID":
      return {
        ...state,
        selection: {
          ...state.selection,
          ids: [action.id],
        },
      };
    case "STEP_UP":
      var s3 = Selection.parse(state.selection.data, state.visibleIds);
      var f = s3.getFocus();
      if (action.shift) {
        s3.extend(f - 1);
      } else {
        s3.select(f - 1);
      }
      return {
        ...state,
        selection: {
          data: s3.serialize(),
          ids: s3.getSelectedItems(),
        },
      };
    case "STEP_DOWN":
      var s6 = Selection.parse(state.selection.data, state.visibleIds);
      var f2 = s6.getFocus();
      if (action.shift) {
        s6.extend(f2 + 1);
      } else {
        s6.select(f2 + 1);
      }
      return {
        ...state,
        selection: {
          data: s6.serialize(),
          ids: s6.getSelectedItems(),
        },
      };
    case "SET_VISIBLE_IDS":
      var ids = state.selection.ids;
      var s2 = new Selection([], null, "none", state.visibleIds);
      for (let id of ids) {
        if (id in action.idMap) s2.multiSelect(action.idMap[id]);
      }
      return {
        ...state,
        visibleIds: action.ids,
        selection: {
          ids,
          data: s2.serialize(),
        },
      };
    default:
      return state;
  }
}

function equal(a: CursorLocation | null, b: CursorLocation | null) {
  if (a === b) return true;
  if (a === null || b === null) return false;
  return (
    a.parentId === b.parentId && a.index === b.index && a.level === b.level
  );
}
