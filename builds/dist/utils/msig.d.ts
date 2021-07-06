import { MessagePartial } from "../providers/Types";
export declare const createProposeMessage: (multisigAddress: string, senderAddressOfProposeMsg: string, recipientAddress: string, value: string, method: number, params: any[]) => Promise<MessagePartial>;
export declare const createApproveMessage: (multisigAddress: string, senderAddressOfApproveMsg: string, proposedMessageId: number, proposerId: string, recipientAddress: string, method: number, value: string, values: any[]) => Promise<MessagePartial>;
export declare const createCancelMessage: (multisigAddress: string, senderAddressOfApproveMsg: string, proposedMessageId: number, proposerId: string, recipientAddress: string, method: number, value: string, values: any[]) => Promise<MessagePartial>;
export declare const createApproveOrCancelMessage: (type: number, multisigAddress: string, senderAddressOfApproveMsg: string, proposedMessageId: number, proposerId: string, recipientAddress: string, method: number, value: string, values: any[]) => Promise<MessagePartial>;
//# sourceMappingURL=msig.d.ts.map