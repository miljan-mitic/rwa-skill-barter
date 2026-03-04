import { CALL_PAYLOAD_TYPE } from '../enums/call-payload-type.enum';

export type CallPayload = {
  type: CALL_PAYLOAD_TYPE;
  callId: string;
  offer?: any;
  answer?: any;
  candidate?: any;
};
