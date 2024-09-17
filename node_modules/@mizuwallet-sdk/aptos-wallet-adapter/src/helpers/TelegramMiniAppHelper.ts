import {
  AccountAddress,
  AnyRawTransaction,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { SessionCrypto, SessionListener } from '@mizuwallet-sdk/protocol';
import { DEFAULT_MINI_APP_URL, MizuSupportNetwork, MZ_MSG_TYPE } from '../config';
import { openTelegramLink } from '../utils';
import ActionHelper from '../utils/ActionHelper';

const MZ_STORAGE_ADDRESS = 'mizuwallet-address';
const MZ_STORAGE_PUBLICKEY = 'mizuwallet-publickey';

class TelegramMiniAppHelper {
  /**
   * @param manifestURL
   */
  manifestURL: string;
  miniAppURL: string;

  /**
   *
   * @param args.manifestURL Manifest URL
   */
  constructor(args: { manifestURL: string; network: MizuSupportNetwork }) {
    if (!args.manifestURL) throw new Error('manifestURL is required');

    this.manifestURL = args.manifestURL;
    this.miniAppURL = DEFAULT_MINI_APP_URL(args.network);
  }

  /**
   * Connect
   *
   * Open MizuWallet MiniApp to connect
   * Try to get Address info back
   *
   *
   * @returns
   */
  async connect() {
    if (
      window?.localStorage &&
      window.localStorage?.getItem(MZ_STORAGE_ADDRESS) &&
      window.localStorage?.getItem(MZ_STORAGE_PUBLICKEY)
    ) {
      return {
        address: window.localStorage.getItem(MZ_STORAGE_ADDRESS)?.toString() || '',
        publicKey: window.localStorage.getItem(MZ_STORAGE_PUBLICKEY)?.toString() || '',
      };
    }

    const sc = new SessionCrypto();
    const startapp = ActionHelper.buildAction({
      prefix: 'R_',
      action: 'miniapp-connect',
      params: [sc.sessionId, this.manifestURL],
    });

    openTelegramLink(`${this.miniAppURL}?startapp=${startapp}`);

    const result: any = await SessionListener({
      keypair: sc.stringifyKeypair(),
    });

    if (
      window?.localStorage &&
      AccountAddress.isValid({
        input: result?.address,
        strict: true,
      })
    ) {
      window.localStorage.setItem(MZ_STORAGE_ADDRESS, result?.address);
      window.localStorage.setItem(MZ_STORAGE_PUBLICKEY, result?.publicKey);
      return {
        address: result?.address,
        publicKey: result?.publicKey,
      };
    } else {
      throw new Error(`${MZ_MSG_TYPE.CONNECT} Error`);
    }
  }

  disconnect() {
    if (window?.localStorage.getItem(MZ_STORAGE_ADDRESS)) {
      window?.localStorage.removeItem(MZ_STORAGE_ADDRESS);
    }

    if (window?.localStorage.getItem(MZ_STORAGE_PUBLICKEY)) {
      window?.localStorage.removeItem(MZ_STORAGE_PUBLICKEY);
    }
  }

  async signAndSubmitTransaction(transaction: InputGenerateTransactionPayloadData) {
    if (window?.localStorage.getItem(MZ_STORAGE_ADDRESS)) {
      const sc = new SessionCrypto();
      const startapp = ActionHelper.buildAction({
        prefix: 'R_',
        action: 'miniapp-transaction',
        params: [sc.sessionId, this.manifestURL, window?.btoa(JSON.stringify(transaction))],
      });

      openTelegramLink(`${this.miniAppURL}?startapp=${startapp}`);

      const result: any = await SessionListener({
        keypair: sc.stringifyKeypair(),
      });

      if (result.cancel) {
        throw new Error('User Canceled');
      }

      return {
        hash: result.hash,
      };
    } else {
      throw new Error(`${MZ_MSG_TYPE.TRANSACTION} No address found`);
    }
  }

  async signTransaction(transaction: AnyRawTransaction) {
    if (window?.localStorage.getItem(MZ_STORAGE_ADDRESS)) {
      const sc = new SessionCrypto();
      const startapp = ActionHelper.buildAction({
        prefix: 'R_',
        action: 'miniapp-signtransaction',
        params: [sc.sessionId, this.manifestURL, transaction.bcsToHex().toStringWithoutPrefix()],
      });

      openTelegramLink(`${this.miniAppURL}?startapp=${startapp}`);

      const result: any = await SessionListener({
        keypair: sc.stringifyKeypair(),
      });

      if (result.cancel) {
        throw new Error('User Canceled');
      }

      return {
        signature: result,
      };
    } else {
      throw new Error(`${MZ_MSG_TYPE.TRANSACTION} No address found`);
    }
  }

  async signMessage(args: { message: string; nonce: string }) {
    if (window?.localStorage.getItem(MZ_STORAGE_ADDRESS)) {
      const sc = new SessionCrypto();
      const startapp = ActionHelper.buildAction({
        prefix: 'R_',
        action: 'miniapp-signmessage',
        params: [sc.sessionId, this.manifestURL, window?.btoa(JSON.stringify(args))],
      });

      openTelegramLink(`${this.miniAppURL}?startapp=${startapp}`);

      const result: any = await SessionListener({
        keypair: sc.stringifyKeypair(),
      });

      if (result.cancel) {
        throw new Error('User Canceled');
      }

      return {
        data: result,
      };
    } else {
      throw new Error(`${MZ_MSG_TYPE.TRANSACTION} No address found`);
    }
  }
}

export default TelegramMiniAppHelper;

