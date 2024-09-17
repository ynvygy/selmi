var H = Object.defineProperty;
var _ = (t, e, n) => e in t ? H(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var w = (t, e, n) => _(t, typeof e != "symbol" ? e + "" : e, n);
import g from "tweetnacl-util";
import m from "tweetnacl";
async function B(t, e) {
  const n = t.getReader();
  let r;
  for (; !(r = await n.read()).done; )
    e(r.value);
}
function F(t) {
  let e, n, r, o = !1;
  return function(c) {
    e === void 0 ? (e = c, n = 0, r = -1) : e = W(e, c);
    const i = e.length;
    let a = 0;
    for (; n < i; ) {
      o && (e[n] === 10 && (a = ++n), o = !1);
      let d = -1;
      for (; n < i && d === -1; ++n)
        switch (e[n]) {
          case 58:
            r === -1 && (r = n - a);
            break;
          case 13:
            o = !0;
          case 10:
            d = n;
            break;
        }
      if (d === -1)
        break;
      t(e.subarray(a, d), r), a = n, r = -1;
    }
    a === i ? e = void 0 : a !== 0 && (e = e.subarray(a), n -= a);
  };
}
function R(t, e, n) {
  let r = P();
  const o = new TextDecoder();
  return function(c, i) {
    if (c.length === 0)
      n == null || n(r), r = P();
    else if (i > 0) {
      const a = o.decode(c.subarray(0, i)), d = i + (c[i + 1] === 32 ? 2 : 1), l = o.decode(c.subarray(d));
      switch (a) {
        case "data":
          r.data = r.data ? r.data + `
` + l : l;
          break;
        case "event":
          r.event = l;
          break;
        case "id":
          t(r.id = l);
          break;
        case "retry":
          const u = parseInt(l, 10);
          isNaN(u) || e(r.retry = u);
          break;
      }
    }
  };
}
function W(t, e) {
  const n = new Uint8Array(t.length + e.length);
  return n.set(t), n.set(e, t.length), n;
}
function P() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
var J = function(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(t); o < r.length; o++)
      e.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[o]) && (n[r[o]] = t[r[o]]);
  return n;
};
const T = "text/event-stream", D = 1e3, K = "last-event-id";
function U(t, e) {
  var { signal: n, headers: r, onopen: o, onmessage: s, onclose: c, onerror: i, openWhenHidden: a, fetch: d } = e, l = J(e, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
  return new Promise((u, I) => {
    const f = Object.assign({}, r);
    f.accept || (f.accept = T);
    let p;
    function A() {
      p.abort(), document.hidden || k();
    }
    a || document.addEventListener("visibilitychange", A);
    let C = D, v = 0;
    function O() {
      document.removeEventListener("visibilitychange", A), window.clearTimeout(v), p.abort();
    }
    n == null || n.addEventListener("abort", () => {
      O(), u();
    });
    const L = d ?? window.fetch, j = o ?? M;
    async function k() {
      var E;
      p = new AbortController();
      try {
        const b = await L(t, Object.assign(Object.assign({}, l), { headers: f, signal: p.signal }));
        await j(b), await B(b.body, F(R((y) => {
          y ? f[K] = y : delete f[K];
        }, (y) => {
          C = y;
        }, s))), c == null || c(), O(), u();
      } catch (b) {
        if (!p.signal.aborted)
          try {
            const y = (E = i == null ? void 0 : i(b)) !== null && E !== void 0 ? E : C;
            window.clearTimeout(v), v = window.setTimeout(k, y);
          } catch (y) {
            O(), I(y);
          }
      }
    }
    k();
  });
}
function M(t) {
  const e = t.headers.get("content-type");
  if (!(e != null && e.startsWith(T)))
    throw new Error(`Expected content-type to be ${T}, Actual: ${e}`);
}
function q(t, e) {
  const n = g.encodeBase64(t);
  return e ? encodeURIComponent(n) : n;
}
function z(t, e) {
  return e && (t = decodeURIComponent(t)), g.decodeBase64(t);
}
function G(t, e = !1) {
  let n;
  return t instanceof Uint8Array ? n = t : (typeof t != "string" && (t = JSON.stringify(t)), n = g.decodeUTF8(t)), q(n, e);
}
function V(t, e = !1) {
  const n = z(t, e);
  return {
    toString() {
      return g.encodeUTF8(n);
    },
    toObject() {
      try {
        return JSON.parse(g.encodeUTF8(n));
      } catch {
        return null;
      }
    },
    toUint8Array() {
      return n;
    }
  };
}
const ne = {
  encode: G,
  decode: V
};
function Y(t, e) {
  const n = new Uint8Array(t.length + e.length);
  return n.set(t), n.set(e, t.length), n;
}
function Q(t, e) {
  if (e >= t.length)
    throw new Error("Index is out of buffer");
  const n = t.slice(0, e), r = t.slice(e);
  return [n, r];
}
function S(t) {
  let e = "";
  return t.forEach((n) => {
    e += ("0" + (n & 255).toString(16)).slice(-2);
  }), e;
}
function h(t) {
  if (t.length % 2 !== 0)
    throw new Error(`Cannot convert ${t} to bytesArray`);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < t.length; n += 2)
    e[n / 2] = parseInt(t.slice(n, n + 2), 16);
  return e;
}
function re() {
  var t;
  return !!((t = process == null ? void 0 : process.versions) != null && t.node);
}
class $ {
  constructor(e) {
    w(this, "nonceLength", 24);
    w(this, "keyPair");
    w(this, "sessionId");
    this.keyPair = e ? this.createKeypairFromString(e) : this.createKeypair(), this.sessionId = S(this.keyPair.publicKey);
  }
  createKeypair() {
    return m.box.keyPair();
  }
  createKeypairFromString(e) {
    return {
      publicKey: h(e.publicKey),
      secretKey: h(e.secretKey)
    };
  }
  createNonce() {
    return m.randomBytes(this.nonceLength);
  }
  encrypt(e, n) {
    const r = new TextEncoder().encode(e), o = this.createNonce(), s = m.box(r, o, n, this.keyPair.secretKey);
    return Y(o, s);
  }
  decrypt(e, n) {
    const [r, o] = Q(e, this.nonceLength), s = m.box.open(
      o,
      r,
      n,
      this.keyPair.secretKey
    );
    if (!s)
      throw new Error(
        `Decryption error: 
 message: ${e.toString()} 
 sender pubkey: ${n.toString()} 
 keypair pubkey: ${this.keyPair.publicKey.toString()} 
 keypair secretkey: ${this.keyPair.secretKey.toString()}`
      );
    return new TextDecoder().decode(s);
  }
  stringifyKeypair() {
    return {
      publicKey: S(this.keyPair.publicKey),
      secretKey: S(this.keyPair.secretKey)
    };
  }
}
const X = new AbortController(), x = "https://bridge.mz.xyz", N = {
  CONNECT: "[MizuWallet SSE Connect]"
}, oe = async (t) => {
  const e = new URLSearchParams(), n = new $();
  e.append("client_id", n.sessionId.toString()), e.append("to", t.to.toString()), e.append("ttl", t.ttl.toString());
  const r = JSON.stringify(t.content), o = h(t.to.toString()), s = n.encrypt(r, o), c = S(s);
  await U(`${x}/bridge/message?${e.toString()}`, {
    method: "POST",
    openWhenHidden: !1,
    headers: {
      Accept: "text/event-stream"
    },
    onopen(i) {
      return i.ok && i.status === 200 ? (console.log("Connection made ", i), Promise.resolve()) : (console.log("Client side error ", i), Promise.reject());
    },
    onmessage() {
    },
    onclose() {
      console.log("Connection closed by the server");
    },
    onerror(i) {
      console.log("There was an error from server", i);
    },
    body: c,
    signal: X.signal
  });
}, ie = async (t) => {
  const e = new URLSearchParams();
  return e.append("client_id", t.keypair.publicKey.toString()), new Promise(async (n, r) => {
    await U(`${x}/bridge/events?${e.toString()}`, {
      openWhenHidden: !1,
      onopen(o) {
        return o.status === 200 ? (console.info(`${N.CONNECT} Opened`), Promise.resolve()) : (console.error(`${N.CONNECT} Failed to open`), Promise.reject());
      },
      onmessage(o) {
        try {
          if (o.data && o.data.startsWith("{")) {
            const s = JSON.parse(o.data);
            if (s.message) {
              const c = new $({
                ...t.keypair
              }), i = s.message, a = h(i), d = c.decrypt(
                a,
                h(s.from.toString())
              ), l = JSON.parse(d);
              n(l);
            }
          }
        } catch (s) {
          console.error(s), r(s);
        }
      }
    });
  });
};
export {
  ne as Base64,
  $ as SessionCrypto,
  ie as SessionListener,
  oe as SessionPost,
  Y as concatUint8Arrays,
  h as hexToByteArray,
  re as isNode,
  Q as splitToUint8Arrays,
  S as toHexString
};
