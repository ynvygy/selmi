import { KeyPair } from './session-crypto';

/**
 * Sent Message to Bridge
 *
 * @param args.to receiver
 * @param args.ttl time to live
 * @param args.content message content
 */
export declare const SessionPost: (args: {
    to: string | number;
    ttl: string | number;
    content: any;
}) => Promise<void>;
/**
 * Listen to the server for message
 *
 * @param args.keypair KeyPair
 * @returns
 */
export declare const SessionListener: (args: {
    keypair: KeyPair;
}) => Promise<unknown>;
