export type NotificationsSeenDto =
  | {
      ids: number[];
      markAll?: never;
    }
  | {
      ids?: never;
      markAll: boolean;
    };
