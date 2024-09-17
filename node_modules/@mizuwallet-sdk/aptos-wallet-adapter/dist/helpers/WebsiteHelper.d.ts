import { AnyRawTransaction, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { Mizu } from '@mizuwallet-sdk/core';
import { MizuSupportNetwork } from '../config';

declare class WebsiteHelper {
    authCode: string;
    manifestURL: string;
    network: string;
    mizuClient: Mizu;
    provider: any;
    origin: string;
    /**
     *
     * @param args.manifestURL Manifest URL
     */
    constructor(args: {
        manifestURL: string;
        network: MizuSupportNetwork;
        mizuClient: Mizu;
    });
    connect(): Promise<{
        address: string;
        publicKey: string;
    }>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: InputGenerateTransactionPayloadData): Promise<{
        hash: string;
    }>;
    signTransaction(transaction: AnyRawTransaction): Promise<any>;
    signMessage(args: {
        message: string;
        nonce: string;
    }): Promise<any>;
}
export default WebsiteHelper;
