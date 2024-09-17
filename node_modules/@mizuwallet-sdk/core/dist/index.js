var k = Object.defineProperty;
var y = (r, e, t) => e in r ? k(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var s = (r, e, t) => y(r, typeof e != "symbol" ? e + "" : e, t);
import { Network as l } from "@aptos-labs/ts-sdk";
import a, { gql as i } from "graphql-request";
import { jwtDecode as m } from "jwt-decode";
const $ = (r) => {
  var t;
  if (!r) return new Error("JWT Token not found. ");
  const e = m(r);
  if ((e == null ? void 0 : e.exp) < Date.now() / 1e3)
    throw new Error("JWT Token expired. Please login again! ");
  if ((t = e == null ? void 0 : e["https://hasura.io/jwt/claims"]) != null && t["x-hasura-user-id"])
    return [e["https://hasura.io/jwt/claims"]["x-hasura-user-id"], r];
  throw new Error("User id not found in JWT Token");
}, p = (r) => r.arguments ? {
  function: r.function,
  functionArguments: r.arguments,
  typeArguments: r.type_arguments
} : r.functionArguments ? r : null, f = i`
  mutation TGLoginMutation($appId: String = "", $initData: String = "") {
    tgLogin(appId: $appId, initData: $initData)
  }
`, T = i`
  mutation TGLoginMutation($appId: String = "", $initData: String = "", $shortId: String = "") {
    tgLogin(appId: $appId, initData: $initData, shortId: $shortId)
  }
`, E = i`
  mutation tgWidgetLoginMutation($appId: String = "", $authData: String = "") {
    tgWidgetLogin(appId: $appId, authData: $authData)
  }
`, q = i`
  mutation tgWidgetLoginMutation(
    $appId: String = ""
    $authData: String = ""
    $shortId: String = ""
  ) {
    tgWidgetLogin(appId: $appId, authData: $authData, shortId: $shortId)
  }
`, S = i`
  query CheckUserIsExistQueryByTgId {
    telegramUser {
      walletUserId
      tgId
    }
  }
`, g = i`
  query UserWalletAddressQuery($id: uuid = "") {
    walletUserByPk(id: $id) {
      sub_wallets {
        address
        publicKey
      }
      google_user {
        email
      }
      telegram_user {
        firstName
        lastName
        photoUrl
        userName
      }
      twitter_user {
        name
        userName
      }
    }
  }
`, W = i`
  mutation CreateOrderQuery($appId: String = "", $payload: String = "") {
    createOrder(appId: $appId, payload: $payload)
  }
`, z = i`
  mutation createSignatureMutation($appId: String = "", $transactionHex: String = "") {
    createSignature(appId: $appId, transactionHex: $transactionHex)
  }
`, P = i`
  mutation createSignMessageMutation(
    $appId: String = ""
    $message: String = ""
    $nonce: String = ""
  ) {
    createSignMessage(appId: $appId, nonce: $nonce, message: $message) {
      fullMessage
      message
      nonce
      prefix
      signature
    }
  }
`, C = i`
  query simulateOrderQuery($payload: String = "") {
    simulateOrder(payload: $payload)
  }
`, O = i`
  mutation confirmOrderQuery($orderId: String = "") {
    confirmOrder(orderId: $orderId)
  }
`, L = i`
  query fetchOrderQuery($id: uuid = "") {
    orderByPk(id: $id) {
      id
      createdAt
      payload
      status
      type
      updatedAt
      walletUserId
      applicationId
      hash
      type
      transactions {
        hash
        type
      }
    }
  }
`;
i`
  query fetchOrderHashQuery($orderId: String = "") {
    getOrderHash(orderId: $orderId)
  }
`;
const b = i`
  query fetchOrderListQuery(
    $walletUserId: uuid = ""
    $limit: Int = 10
    $offset: Int = 0
    $status: [Int] = []
  ) {
    order(
      where: { walletUserId: { _eq: $walletUserId } }
      limit: $limit
      offset: $offset
      orderBy: { createdAt: DESC }
    ) {
      applicationId
      createdAt
      id
      payload
      status
      transactionSeqNo
      type
      updatedAt
      walletUserId
      hash
      gasFee
      transactions {
        hash
        gasFee
        createdAt
        status
        type
      }
    }
    orderAggregate(where: { walletUserId: { _eq: $walletUserId } }) {
      aggregate {
        count
      }
    }
  }
`, A = i`
  mutation bindGoogleQuery($address: String = "", $idToken: String = "") {
    googleBind(address: $address, idToken: $idToken)
  }
`, D = i`
  mutation createOrderWithCodeMutation(
    $appId: String = ""
    $authCode: String = ""
    $payload: String = ""
  ) {
    createOrderWithCode(appId: $appId, authCode: $authCode, payload: $payload)
  }
`;
var d = /* @__PURE__ */ ((r) => (r[r.PENDING = 0] = "PENDING", r[r.CONFIRMED = 1] = "CONFIRMED", r[r.EXECUTED = 2] = "EXECUTED", r[r.SUCCESS = 3] = "SUCCESS", r[r.FAIL = 4] = "FAIL", r[r.CANCELED = 5] = "CANCELED", r))(d || {});
const I = {
  testnet: "https://hasura-wallet.mizu.one/v1/graphql",
  mainnet: "https://api.mz.xyz/v1/graphql/"
}, J = "https://mizu.io/keyless_google";
class h {
  /**
   * Initialize MizuWallet SDK Core Client
   *
   * @param args.appId - Application ID
   * @param args.network - Network.MAINNET | Network.TESTNET
   */
  constructor(e) {
    s(this, "appId");
    s(this, "network");
    s(this, "graphqlEndPoint", "");
    s(this, "userId", "");
    s(this, "jwtToken", "");
    s(this, "initialized", !1);
    if (!e.appId) throw new Error("appId is required");
    if (!e.network) throw new Error("network is required");
    this.appId = e.appId, this.network = e.network, this.graphqlEndPoint = I[this.network], this.initialized = !0;
  }
  /**
   * Check if MizuWallet SDK Core Client is initialized
   */
  checkInitialized() {
    if (!this.initialized) throw new Error("MizuWallet SDK Core Client not initialized");
  }
  /**
   * Check if JWT Token is available
   */
  checkJWTToken() {
    if (!this.jwtToken) throw new Error("JWT Token not found. Please login first.");
  }
  /**
   * Decode JWT Token
   */
  static decodeJWTToken(e) {
    const [t, n] = $(e);
    return [t, n];
  }
  /**
   * Clone MizuWallet SDK Core Client
   *
   * @param args.appId - Application ID
   * @param args.network - Network.MAINNET | Network.TESTNET
   * @param args.jwtToken - JWT Token
   */
  static clone(e) {
    if (!e.appId) throw new Error("appId is required");
    if (!e.network) throw new Error("network is required");
    if (!e.jwtToken) throw new Error("jwtToken is required");
    const t = new h({ appId: e.appId, network: e.network });
    return [t.userId, t.jwtToken] = h.decodeJWTToken(e.jwtToken), t;
  }
  /**
   * Update network
   * @param network - Network.MAINNET | Network.TESTNET
   */
  updateNetwork(e) {
    this.checkInitialized(), this.network = e, this.graphqlEndPoint = I[this.network];
  }
  /**
   * Get network info
   */
  get networkInfo() {
    return {
      name: this.network,
      chainId: this.network === l.MAINNET ? 1 : 2,
      url: this.network === l.MAINNET ? "https://fullnode.mainnet.aptoslabs.com/v1" : "https://fullnode.testnet.aptoslabs.com/v1"
    };
  }
  /**
   *
   *
   */
  login() {
    this.checkInitialized();
  }
  /**
   * Login in TG
   *
   * @param data - initial data of TG, or stringified widget user object
   * @param opt.isWidget - is from login widget
   */
  async loginInTG(e, t) {
    this.checkInitialized();
    let n = "";
    t != null && t.isWidget ? n = (await a({
      url: this.graphqlEndPoint,
      document: t != null && t.shortID ? q : E,
      variables: {
        appId: this.appId,
        authData: window.btoa(e),
        ...t != null && t.shortID ? { shortId: t.shortID } : {}
      }
    })).tgWidgetLogin : n = (await a({
      url: this.graphqlEndPoint,
      document: t != null && t.shortID ? T : f,
      variables: {
        appId: this.appId,
        initData: e,
        ...t != null && t.shortID ? { shortId: t.shortID } : {}
      }
    })).tgLogin;
    try {
      [this.userId, this.jwtToken] = h.decodeJWTToken(n);
    } catch {
      this.logout();
    }
  }
  /**
   * Check if user exist by TG ID
   *
   * @param tgId
   * @returns
   */
  async isUserExistByTgID(e) {
    var n;
    if (this.checkInitialized(), !e) throw new Error("tgId is required");
    const t = await a({
      url: this.graphqlEndPoint,
      document: S,
      variables: {},
      requestHeaders: {
        "x-hasura-tg-id": e
      }
    });
    return ((n = t == null ? void 0 : t.telegramUser) == null ? void 0 : n.length) > 0;
  }
  /**
   * fetch user wallet address
   *
   * @returns
   */
  async getUserWalletAddress() {
    return this.checkInitialized(), this.checkJWTToken(), (await a({
      url: this.graphqlEndPoint,
      document: g,
      variables: {
        id: this.userId
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    })).walletUserByPk.sub_wallets[0].address;
  }
  /**
   * fetch user wallet address
   *
   * @returns
   */
  async getUserInfo() {
    return this.checkInitialized(), this.checkJWTToken(), (await a({
      url: this.graphqlEndPoint,
      document: g,
      variables: {
        id: this.userId
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    })).walletUserByPk;
  }
  /**
   * Logout
   */
  logout() {
    this.userId = "", this.jwtToken = "";
  }
  /**
   *
   * @param args.redirect_uri
   */
  async startBindGoogle(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = new URLSearchParams({
      token: this.jwtToken,
      appId: this.appId,
      ...e
    });
    window.open(`${J}?${t.toString()}`, "_blank");
  }
  /**
   *
   * @param args.address keyless address
   * @param args.idToken google jwt
   * @returns
   */
  async bindGoogleAccount(e) {
    return this.checkInitialized(), this.checkJWTToken(), await a({
      url: this.graphqlEndPoint,
      document: A,
      variables: {
        ...e
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
  }
  /**
   * Simulate Order
   *
   * @param args.payload TransactionPayload
   */
  async simulateOrder(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = await a({
      url: this.graphqlEndPoint,
      document: C,
      variables: {
        payload: window.btoa(JSON.stringify(e.payload))
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    return t == null ? void 0 : t.simulateOrder;
  }
  /**
   * Create Order
   *
   * @param args.payload TransactionPayload
   * @returns
   */
  async createOrder(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = await a({
      url: this.graphqlEndPoint,
      document: W,
      variables: {
        appId: this.appId,
        payload: window.btoa(JSON.stringify(p(e.payload)))
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    return t == null ? void 0 : t.createOrder;
  }
  /**
   * Create Order with Code
   *
   * @param args.payload
   * @param args.code
   * @returns
   */
  async createOrderWithCode(e) {
    this.checkInitialized();
    const t = await a({
      url: this.graphqlEndPoint,
      document: D,
      variables: {
        appId: this.appId,
        authCode: e.code,
        payload: window.btoa(JSON.stringify(p(e.payload)))
      },
      requestHeaders: {}
    });
    return t == null ? void 0 : t.createOrderWithCode;
  }
  /**
   * Create Signature
   *
   * @param args.transactionHex AnyRawTransaction.bscToHex().toStringWithoutPrefix()
   * @returns
   */
  async createSignature(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = await a({
      url: this.graphqlEndPoint,
      document: z,
      variables: {
        appId: this.appId,
        transactionHex: e.transactionHex
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    return t == null ? void 0 : t.createSignature;
  }
  /**
   * Sign Message
   *
   * @param args.message message to sign
   * @param args.nonce nonce
   * @returns
   */
  async signMessage(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = await a({
      url: this.graphqlEndPoint,
      document: P,
      variables: {
        appId: this.appId,
        ...e
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    return t == null ? void 0 : t.createSignMessage;
  }
  /**
   * User interactive
   *
   * @param args.orderId Order ID
   * return bool
   */
  async confirmOrder(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = await a({
      url: this.graphqlEndPoint,
      document: O,
      variables: {
        orderId: e.orderId
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    return t == null ? void 0 : t.confirmOrder;
  }
  /**
   * Fetch Order By ID
   *
   * @param args.id order.id
   * @returns
   */
  async fetchOrder(e) {
    this.checkInitialized(), this.checkJWTToken();
    const t = await a({
      url: this.graphqlEndPoint,
      document: L,
      variables: {
        id: e.id
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    if (!t.orderByPk) throw new Error("Order not found");
    return {
      ...t.orderByPk,
      payload: JSON.parse(window.atob(t.orderByPk.payload))
    };
  }
  /**
   * Wait for order
   *
   * @param args.orderId order.id
   * @returns
   */
  async waitForOrder(e) {
    let t = await this.fetchOrder({
      id: e.orderId
    }), n = 20;
    for (; n-- > 0 && ![d.SUCCESS, d.FAIL, d.CANCELED].includes(t.status); )
      await new Promise((o) => setTimeout(o, 5e3)), t = await this.fetchOrder({
        id: e.orderId
      });
    if (t.status === d.FAIL)
      throw new Error("Order failed");
    return t;
  }
  /**
   * fetch order list
   *
   * @param args.walletUserId
   * @param args.limit
   * @param args.offset
   *
   * @returns
   */
  async fetchOrderList(e) {
    this.checkInitialized(), this.checkJWTToken();
    const { limit: t = 10, offset: n = 0 } = e || {}, o = await a({
      url: this.graphqlEndPoint,
      document: b,
      variables: {
        walletUserId: this.userId,
        limit: t,
        offset: n
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });
    return {
      data: o == null ? void 0 : o.order.map((u) => {
        let c = {};
        try {
          c = JSON.parse(window.atob(u.payload));
        } catch (w) {
          console.error(w);
        }
        return {
          ...u,
          payload: c
        };
      }),
      pagination: {
        total: o == null ? void 0 : o.orderAggregate.aggregate.count,
        limit: t,
        offset: n
      }
    };
  }
}
export {
  h as Mizu,
  d as ORDER_STATUS,
  $ as decodeJWT
};
