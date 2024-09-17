import { AnyRawTransaction, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { MizuSupportNetwork } from '../config';

declare class TelegramMiniAppHelper {
    /**
     * @param manifestURL
     */
    manifestURL: string;
    miniAppURL: string;
    /**
     *
     * @param args.manifestURL Manifest URL
     */
    constructor(args: {
        manifestURL: string;
        network: MizuSupportNetwork;
    });
    /**
     * Connect
     *
     * Open MizuWallet MiniApp to connect
     * Try to get Address info back
     *
     *
     * @returns
     */
    connect(): Promise<{
        address: any;
        publicKey: any;
    }>;
    disconnect(): void;
    signAndSubmitTransaction(transaction: InputGenerateTransactionPayloadData): Promise<{
        hash: any;
    }>;
    signTransaction(transaction: AnyRawTransaction): Promise<{
        signature: any;
    }>;
    signMessage(args: {
        message: string;
        nonce: string;
    }): Promise<{
        data: any;
    }>;
}
export default TelegramMiniAppHelper;
