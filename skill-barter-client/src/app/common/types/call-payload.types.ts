import { CallPayloadType } from '../enums/call-payload-type.enum';

export type CallPayload =
  | {
      type: CallPayloadType;
      callId: string;
      offer?: any;
      answer?: never;
      candidate?: never;
    }
  | {
      type: CallPayloadType;
      callId: string;
      offer?: never;
      answer?: any;
      candidate?: never;
    }
  | {
      type: CallPayloadType;
      callId: string;
      offer?: never;
      answer?: never;
      candidate?: any;
    };

export type CallData = CallPayload & { from: string };
