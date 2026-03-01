import { createReducer, on } from '@ngrx/store';
import { SocketState } from './socket.state';
import { SocketActions } from './socket.actions';

const initialState: SocketState = {
  initialized: false,
};

export const socketReducer = createReducer(
  initialState,
  on(SocketActions.initializedSocket, (state) => {
    return {
      ...state,
      initialized: true,
    };
  }),
);
