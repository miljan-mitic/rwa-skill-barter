import { createActionGroup, emptyProps } from '@ngrx/store';

export const SocketActions = createActionGroup({
  source: 'Socket',
  events: {
    'Initialized socket': emptyProps(),
  },
});
