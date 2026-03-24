import { SnackbarType } from "./types";

type State = {
  message: string;
  type: SnackbarType;
  open: boolean;
};

let state: State = {
  message: '',
  type: SnackbarType.SUCCESS,
  open: false,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
let listeners: Function[] = [];

const notify = () => {
  listeners.forEach((l) => l(state));
};

export const snackbarStore = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  subscribe(fn: Function) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },

  show(message: string, type: SnackbarType = SnackbarType.SUCCESS) {
    state = { message, type, open: true };
    notify();
  },

  close() {
    state = { ...state, open: false };
    notify();
  },
};