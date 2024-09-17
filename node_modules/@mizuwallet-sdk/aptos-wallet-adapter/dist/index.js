var we = Object.defineProperty;
var ye = (w, s, h) => s in w ? we(w, s, { enumerable: !0, configurable: !0, writable: !0, value: h }) : w[s] = h;
var xt = (w, s, h) => ye(w, typeof s != "symbol" ? s + "" : s, h);
import { Network as ce, AccountAddress as ge, Deserializer as me, AccountAuthenticator as Ee } from "@aptos-labs/ts-sdk";
import { Mizu as be } from "@mizuwallet-sdk/core";
var Be = "aptos:devnet", Ie = "aptos:testnet", Ue = "aptos:localnet", ve = "aptos:mainnet", Re = [Be, Ie, Ue, ve], qr = ((w) => (w[w.Unauthorized = 4100] = "Unauthorized", w[w.InternalError = -30001] = "InternalError", w))(qr || {}), ee = Object.freeze({ 4100: { status: "Unauthorized", message: "The requested method and/or account has not been authorized by the user." }, [-30001]: { status: "Internal error", message: "Something went wrong within the wallet." } }), ne = class he extends Error {
  constructor(s, h) {
    var x, d;
    super(h ?? ((x = ee[s]) == null ? void 0 : x.message) ?? "Unknown error occurred"), this.code = s, this.status = ((d = ee[s]) == null ? void 0 : d.status) ?? "Unknown error", this.name = "AptosWalletError", Object.setPrototypeOf(this, he.prototype);
  }
}, Gt = ((w) => (w.APPROVED = "Approved", w.REJECTED = "Rejected", w))(Gt || {}), Ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Se(w) {
  return w && w.__esModule && Object.prototype.hasOwnProperty.call(w, "default") ? w.default : w;
}
function Te(w) {
  if (w.__esModule) return w;
  var s = w.default;
  if (typeof s == "function") {
    var h = function x() {
      return this instanceof x ? Reflect.construct(s, arguments, this.constructor) : s.apply(this, arguments);
    };
    h.prototype = s.prototype;
  } else h = {};
  return Object.defineProperty(h, "__esModule", { value: !0 }), Object.keys(w).forEach(function(x) {
    var d = Object.getOwnPropertyDescriptor(w, x);
    Object.defineProperty(h, x, d.get ? d : {
      enumerable: !0,
      get: function() {
        return w[x];
      }
    });
  }), h;
}
var ue = {}, jr = {};
jr.byteLength = Le;
jr.toByteArray = ke;
jr.fromByteArray = De;
var _t = [], jt = [], Ne = typeof Uint8Array < "u" ? Uint8Array : Array, Jr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var mr = 0, Fe = Jr.length; mr < Fe; ++mr)
  _t[mr] = Jr[mr], jt[Jr.charCodeAt(mr)] = mr;
jt[45] = 62;
jt[95] = 63;
function le(w) {
  var s = w.length;
  if (s % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var h = w.indexOf("=");
  h === -1 && (h = s);
  var x = h === s ? 0 : 4 - h % 4;
  return [h, x];
}
function Le(w) {
  var s = le(w), h = s[0], x = s[1];
  return (h + x) * 3 / 4 - x;
}
function Oe(w, s, h) {
  return (s + h) * 3 / 4 - h;
}
function ke(w) {
  var s, h = le(w), x = h[0], d = h[1], I = new Ne(Oe(w, x, d)), R = 0, l = d > 0 ? x - 4 : x, j;
  for (j = 0; j < l; j += 4)
    s = jt[w.charCodeAt(j)] << 18 | jt[w.charCodeAt(j + 1)] << 12 | jt[w.charCodeAt(j + 2)] << 6 | jt[w.charCodeAt(j + 3)], I[R++] = s >> 16 & 255, I[R++] = s >> 8 & 255, I[R++] = s & 255;
  return d === 2 && (s = jt[w.charCodeAt(j)] << 2 | jt[w.charCodeAt(j + 1)] >> 4, I[R++] = s & 255), d === 1 && (s = jt[w.charCodeAt(j)] << 10 | jt[w.charCodeAt(j + 1)] << 4 | jt[w.charCodeAt(j + 2)] >> 2, I[R++] = s >> 8 & 255, I[R++] = s & 255), I;
}
function Me(w) {
  return _t[w >> 18 & 63] + _t[w >> 12 & 63] + _t[w >> 6 & 63] + _t[w & 63];
}
function Pe(w, s, h) {
  for (var x, d = [], I = s; I < h; I += 3)
    x = (w[I] << 16 & 16711680) + (w[I + 1] << 8 & 65280) + (w[I + 2] & 255), d.push(Me(x));
  return d.join("");
}
function De(w) {
  for (var s, h = w.length, x = h % 3, d = [], I = 16383, R = 0, l = h - x; R < l; R += I)
    d.push(Pe(w, R, R + I > l ? l : R + I));
  return x === 1 ? (s = w[h - 1], d.push(
    _t[s >> 2] + _t[s << 4 & 63] + "=="
  )) : x === 2 && (s = (w[h - 2] << 8) + w[h - 1], d.push(
    _t[s >> 10] + _t[s >> 4 & 63] + _t[s << 2 & 63] + "="
  )), d.join("");
}
var Vr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
Vr.read = function(w, s, h, x, d) {
  var I, R, l = d * 8 - x - 1, j = (1 << l) - 1, et = j >> 1, ct = -7, dt = h ? d - 1 : 0, vt = h ? -1 : 1, At = w[s + dt];
  for (dt += vt, I = At & (1 << -ct) - 1, At >>= -ct, ct += l; ct > 0; I = I * 256 + w[s + dt], dt += vt, ct -= 8)
    ;
  for (R = I & (1 << -ct) - 1, I >>= -ct, ct += x; ct > 0; R = R * 256 + w[s + dt], dt += vt, ct -= 8)
    ;
  if (I === 0)
    I = 1 - et;
  else {
    if (I === j)
      return R ? NaN : (At ? -1 : 1) * (1 / 0);
    R = R + Math.pow(2, x), I = I - et;
  }
  return (At ? -1 : 1) * R * Math.pow(2, I - x);
};
Vr.write = function(w, s, h, x, d, I) {
  var R, l, j, et = I * 8 - d - 1, ct = (1 << et) - 1, dt = ct >> 1, vt = d === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, At = x ? 0 : I - 1, Bt = x ? 1 : -1, Dt = s < 0 || s === 0 && 1 / s < 0 ? 1 : 0;
  for (s = Math.abs(s), isNaN(s) || s === 1 / 0 ? (l = isNaN(s) ? 1 : 0, R = ct) : (R = Math.floor(Math.log(s) / Math.LN2), s * (j = Math.pow(2, -R)) < 1 && (R--, j *= 2), R + dt >= 1 ? s += vt / j : s += vt * Math.pow(2, 1 - dt), s * j >= 2 && (R++, j /= 2), R + dt >= ct ? (l = 0, R = ct) : R + dt >= 1 ? (l = (s * j - 1) * Math.pow(2, d), R = R + dt) : (l = s * Math.pow(2, dt - 1) * Math.pow(2, d), R = 0)); d >= 8; w[h + At] = l & 255, At += Bt, l /= 256, d -= 8)
    ;
  for (R = R << d | l, et += d; et > 0; w[h + At] = R & 255, At += Bt, R /= 256, et -= 8)
    ;
  w[h + At - Bt] |= Dt * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(w) {
  const s = jr, h = Vr, x = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  w.Buffer = l, w.SlowBuffer = nr, w.INSPECT_MAX_BYTES = 50;
  const d = 2147483647;
  w.kMaxLength = d, l.TYPED_ARRAY_SUPPORT = I(), !l.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function I() {
    try {
      const f = new Uint8Array(1), r = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(f, r), f.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(l.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (l.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(l.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (l.isBuffer(this))
        return this.byteOffset;
    }
  });
  function R(f) {
    if (f > d)
      throw new RangeError('The value "' + f + '" is invalid for option "size"');
    const r = new Uint8Array(f);
    return Object.setPrototypeOf(r, l.prototype), r;
  }
  function l(f, r, e) {
    if (typeof f == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return dt(f);
    }
    return j(f, r, e);
  }
  l.poolSize = 8192;
  function j(f, r, e) {
    if (typeof f == "string")
      return vt(f, r);
    if (ArrayBuffer.isView(f))
      return Bt(f);
    if (f == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof f
      );
    if (kt(f, ArrayBuffer) || f && kt(f.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (kt(f, SharedArrayBuffer) || f && kt(f.buffer, SharedArrayBuffer)))
      return Dt(f, r, e);
    if (typeof f == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const c = f.valueOf && f.valueOf();
    if (c != null && c !== f)
      return l.from(c, r, e);
    const p = er(f);
    if (p) return p;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof f[Symbol.toPrimitive] == "function")
      return l.from(f[Symbol.toPrimitive]("string"), r, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof f
    );
  }
  l.from = function(f, r, e) {
    return j(f, r, e);
  }, Object.setPrototypeOf(l.prototype, Uint8Array.prototype), Object.setPrototypeOf(l, Uint8Array);
  function et(f) {
    if (typeof f != "number")
      throw new TypeError('"size" argument must be of type number');
    if (f < 0)
      throw new RangeError('The value "' + f + '" is invalid for option "size"');
  }
  function ct(f, r, e) {
    return et(f), f <= 0 ? R(f) : r !== void 0 ? typeof e == "string" ? R(f).fill(r, e) : R(f).fill(r) : R(f);
  }
  l.alloc = function(f, r, e) {
    return ct(f, r, e);
  };
  function dt(f) {
    return et(f), R(f < 0 ? 0 : Kt(f) | 0);
  }
  l.allocUnsafe = function(f) {
    return dt(f);
  }, l.allocUnsafeSlow = function(f) {
    return dt(f);
  };
  function vt(f, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !l.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const e = lr(f, r) | 0;
    let c = R(e);
    const p = c.write(f, r);
    return p !== e && (c = c.slice(0, p)), c;
  }
  function At(f) {
    const r = f.length < 0 ? 0 : Kt(f.length) | 0, e = R(r);
    for (let c = 0; c < r; c += 1)
      e[c] = f[c] & 255;
    return e;
  }
  function Bt(f) {
    if (kt(f, Uint8Array)) {
      const r = new Uint8Array(f);
      return Dt(r.buffer, r.byteOffset, r.byteLength);
    }
    return At(f);
  }
  function Dt(f, r, e) {
    if (r < 0 || f.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (f.byteLength < r + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let c;
    return r === void 0 && e === void 0 ? c = new Uint8Array(f) : e === void 0 ? c = new Uint8Array(f, r) : c = new Uint8Array(f, r, e), Object.setPrototypeOf(c, l.prototype), c;
  }
  function er(f) {
    if (l.isBuffer(f)) {
      const r = Kt(f.length) | 0, e = R(r);
      return e.length === 0 || f.copy(e, 0, 0, r), e;
    }
    if (f.length !== void 0)
      return typeof f.length != "number" || cr(f.length) ? R(0) : At(f);
    if (f.type === "Buffer" && Array.isArray(f.data))
      return At(f.data);
  }
  function Kt(f) {
    if (f >= d)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + d.toString(16) + " bytes");
    return f | 0;
  }
  function nr(f) {
    return +f != f && (f = 0), l.alloc(+f);
  }
  l.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== l.prototype;
  }, l.compare = function(r, e) {
    if (kt(r, Uint8Array) && (r = l.from(r, r.offset, r.byteLength)), kt(e, Uint8Array) && (e = l.from(e, e.offset, e.byteLength)), !l.isBuffer(r) || !l.isBuffer(e))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === e) return 0;
    let c = r.length, p = e.length;
    for (let g = 0, b = Math.min(c, p); g < b; ++g)
      if (r[g] !== e[g]) {
        c = r[g], p = e[g];
        break;
      }
    return c < p ? -1 : p < c ? 1 : 0;
  }, l.isEncoding = function(r) {
    switch (String(r).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, l.concat = function(r, e) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return l.alloc(0);
    let c;
    if (e === void 0)
      for (e = 0, c = 0; c < r.length; ++c)
        e += r[c].length;
    const p = l.allocUnsafe(e);
    let g = 0;
    for (c = 0; c < r.length; ++c) {
      let b = r[c];
      if (kt(b, Uint8Array))
        g + b.length > p.length ? (l.isBuffer(b) || (b = l.from(b)), b.copy(p, g)) : Uint8Array.prototype.set.call(
          p,
          b,
          g
        );
      else if (l.isBuffer(b))
        b.copy(p, g);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      g += b.length;
    }
    return p;
  };
  function lr(f, r) {
    if (l.isBuffer(f))
      return f.length;
    if (ArrayBuffer.isView(f) || kt(f, ArrayBuffer))
      return f.byteLength;
    if (typeof f != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof f
      );
    const e = f.length, c = arguments.length > 2 && arguments[2] === !0;
    if (!c && e === 0) return 0;
    let p = !1;
    for (; ; )
      switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return Ar(f).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return ar(f).length;
        default:
          if (p)
            return c ? -1 : Ar(f).length;
          r = ("" + r).toLowerCase(), p = !0;
      }
  }
  l.byteLength = lr;
  function Vt(f, r, e) {
    let c = !1;
    if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, r >>>= 0, e <= r))
      return "";
    for (f || (f = "utf8"); ; )
      switch (f) {
        case "hex":
          return $t(this, r, e);
        case "utf8":
        case "utf-8":
          return pr(this, r, e);
        case "ascii":
          return Ir(this, r, e);
        case "latin1":
        case "binary":
          return Xt(this, r, e);
        case "base64":
          return Fr(this, r, e);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Lr(this, r, e);
        default:
          if (c) throw new TypeError("Unknown encoding: " + f);
          f = (f + "").toLowerCase(), c = !0;
      }
  }
  l.prototype._isBuffer = !0;
  function Rt(f, r, e) {
    const c = f[r];
    f[r] = f[e], f[e] = c;
  }
  l.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < r; e += 2)
      Rt(this, e, e + 1);
    return this;
  }, l.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < r; e += 4)
      Rt(this, e, e + 3), Rt(this, e + 1, e + 2);
    return this;
  }, l.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < r; e += 8)
      Rt(this, e, e + 7), Rt(this, e + 1, e + 6), Rt(this, e + 2, e + 5), Rt(this, e + 3, e + 4);
    return this;
  }, l.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? pr(this, 0, r) : Vt.apply(this, arguments);
  }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(r) {
    if (!l.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : l.compare(this, r) === 0;
  }, l.prototype.inspect = function() {
    let r = "";
    const e = w.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (r += " ... "), "<Buffer " + r + ">";
  }, x && (l.prototype[x] = l.prototype.inspect), l.prototype.compare = function(r, e, c, p, g) {
    if (kt(r, Uint8Array) && (r = l.from(r, r.offset, r.byteLength)), !l.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (e === void 0 && (e = 0), c === void 0 && (c = r ? r.length : 0), p === void 0 && (p = 0), g === void 0 && (g = this.length), e < 0 || c > r.length || p < 0 || g > this.length)
      throw new RangeError("out of range index");
    if (p >= g && e >= c)
      return 0;
    if (p >= g)
      return -1;
    if (e >= c)
      return 1;
    if (e >>>= 0, c >>>= 0, p >>>= 0, g >>>= 0, this === r) return 0;
    let b = g - p, W = c - e;
    const ut = Math.min(b, W), ht = this.slice(p, g), pt = r.slice(e, c);
    for (let ft = 0; ft < ut; ++ft)
      if (ht[ft] !== pt[ft]) {
        b = ht[ft], W = pt[ft];
        break;
      }
    return b < W ? -1 : W < b ? 1 : 0;
  };
  function Ft(f, r, e, c, p) {
    if (f.length === 0) return -1;
    if (typeof e == "string" ? (c = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, cr(e) && (e = p ? 0 : f.length - 1), e < 0 && (e = f.length + e), e >= f.length) {
      if (p) return -1;
      e = f.length - 1;
    } else if (e < 0)
      if (p) e = 0;
      else return -1;
    if (typeof r == "string" && (r = l.from(r, c)), l.isBuffer(r))
      return r.length === 0 ? -1 : Ht(f, r, e, c, p);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? p ? Uint8Array.prototype.indexOf.call(f, r, e) : Uint8Array.prototype.lastIndexOf.call(f, r, e) : Ht(f, [r], e, c, p);
    throw new TypeError("val must be string, number or Buffer");
  }
  function Ht(f, r, e, c, p) {
    let g = 1, b = f.length, W = r.length;
    if (c !== void 0 && (c = String(c).toLowerCase(), c === "ucs2" || c === "ucs-2" || c === "utf16le" || c === "utf-16le")) {
      if (f.length < 2 || r.length < 2)
        return -1;
      g = 2, b /= 2, W /= 2, e /= 2;
    }
    function ut(pt, ft) {
      return g === 1 ? pt[ft] : pt.readUInt16BE(ft * g);
    }
    let ht;
    if (p) {
      let pt = -1;
      for (ht = e; ht < b; ht++)
        if (ut(f, ht) === ut(r, pt === -1 ? 0 : ht - pt)) {
          if (pt === -1 && (pt = ht), ht - pt + 1 === W) return pt * g;
        } else
          pt !== -1 && (ht -= ht - pt), pt = -1;
    } else
      for (e + W > b && (e = b - W), ht = e; ht >= 0; ht--) {
        let pt = !0;
        for (let ft = 0; ft < W; ft++)
          if (ut(f, ht + ft) !== ut(r, ft)) {
            pt = !1;
            break;
          }
        if (pt) return ht;
      }
    return -1;
  }
  l.prototype.includes = function(r, e, c) {
    return this.indexOf(r, e, c) !== -1;
  }, l.prototype.indexOf = function(r, e, c) {
    return Ft(this, r, e, c, !0);
  }, l.prototype.lastIndexOf = function(r, e, c) {
    return Ft(this, r, e, c, !1);
  };
  function Mt(f, r, e, c) {
    e = Number(e) || 0;
    const p = f.length - e;
    c ? (c = Number(c), c > p && (c = p)) : c = p;
    const g = r.length;
    c > g / 2 && (c = g / 2);
    let b;
    for (b = 0; b < c; ++b) {
      const W = parseInt(r.substr(b * 2, 2), 16);
      if (cr(W)) return b;
      f[e + b] = W;
    }
    return b;
  }
  function Nr(f, r, e, c) {
    return sr(Ar(r, f.length - e), f, e, c);
  }
  function br(f, r, e, c) {
    return sr(kr(r), f, e, c);
  }
  function xr(f, r, e, c) {
    return sr(ar(r), f, e, c);
  }
  function Br(f, r, e, c) {
    return sr(Zt(r, f.length - e), f, e, c);
  }
  l.prototype.write = function(r, e, c, p) {
    if (e === void 0)
      p = "utf8", c = this.length, e = 0;
    else if (c === void 0 && typeof e == "string")
      p = e, c = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(c) ? (c = c >>> 0, p === void 0 && (p = "utf8")) : (p = c, c = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const g = this.length - e;
    if ((c === void 0 || c > g) && (c = g), r.length > 0 && (c < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    p || (p = "utf8");
    let b = !1;
    for (; ; )
      switch (p) {
        case "hex":
          return Mt(this, r, e, c);
        case "utf8":
        case "utf-8":
          return Nr(this, r, e, c);
        case "ascii":
        case "latin1":
        case "binary":
          return br(this, r, e, c);
        case "base64":
          return xr(this, r, e, c);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Br(this, r, e, c);
        default:
          if (b) throw new TypeError("Unknown encoding: " + p);
          p = ("" + p).toLowerCase(), b = !0;
      }
  }, l.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Fr(f, r, e) {
    return r === 0 && e === f.length ? s.fromByteArray(f) : s.fromByteArray(f.slice(r, e));
  }
  function pr(f, r, e) {
    e = Math.min(f.length, e);
    const c = [];
    let p = r;
    for (; p < e; ) {
      const g = f[p];
      let b = null, W = g > 239 ? 4 : g > 223 ? 3 : g > 191 ? 2 : 1;
      if (p + W <= e) {
        let ut, ht, pt, ft;
        switch (W) {
          case 1:
            g < 128 && (b = g);
            break;
          case 2:
            ut = f[p + 1], (ut & 192) === 128 && (ft = (g & 31) << 6 | ut & 63, ft > 127 && (b = ft));
            break;
          case 3:
            ut = f[p + 1], ht = f[p + 2], (ut & 192) === 128 && (ht & 192) === 128 && (ft = (g & 15) << 12 | (ut & 63) << 6 | ht & 63, ft > 2047 && (ft < 55296 || ft > 57343) && (b = ft));
            break;
          case 4:
            ut = f[p + 1], ht = f[p + 2], pt = f[p + 3], (ut & 192) === 128 && (ht & 192) === 128 && (pt & 192) === 128 && (ft = (g & 15) << 18 | (ut & 63) << 12 | (ht & 63) << 6 | pt & 63, ft > 65535 && ft < 1114112 && (b = ft));
        }
      }
      b === null ? (b = 65533, W = 1) : b > 65535 && (b -= 65536, c.push(b >>> 10 & 1023 | 55296), b = 56320 | b & 1023), c.push(b), p += W;
    }
    return Yt(c);
  }
  const dr = 4096;
  function Yt(f) {
    const r = f.length;
    if (r <= dr)
      return String.fromCharCode.apply(String, f);
    let e = "", c = 0;
    for (; c < r; )
      e += String.fromCharCode.apply(
        String,
        f.slice(c, c += dr)
      );
    return e;
  }
  function Ir(f, r, e) {
    let c = "";
    e = Math.min(f.length, e);
    for (let p = r; p < e; ++p)
      c += String.fromCharCode(f[p] & 127);
    return c;
  }
  function Xt(f, r, e) {
    let c = "";
    e = Math.min(f.length, e);
    for (let p = r; p < e; ++p)
      c += String.fromCharCode(f[p]);
    return c;
  }
  function $t(f, r, e) {
    const c = f.length;
    (!r || r < 0) && (r = 0), (!e || e < 0 || e > c) && (e = c);
    let p = "";
    for (let g = r; g < e; ++g)
      p += wr[f[g]];
    return p;
  }
  function Lr(f, r, e) {
    const c = f.slice(r, e);
    let p = "";
    for (let g = 0; g < c.length - 1; g += 2)
      p += String.fromCharCode(c[g] + c[g + 1] * 256);
    return p;
  }
  l.prototype.slice = function(r, e) {
    const c = this.length;
    r = ~~r, e = e === void 0 ? c : ~~e, r < 0 ? (r += c, r < 0 && (r = 0)) : r > c && (r = c), e < 0 ? (e += c, e < 0 && (e = 0)) : e > c && (e = c), e < r && (e = r);
    const p = this.subarray(r, e);
    return Object.setPrototypeOf(p, l.prototype), p;
  };
  function mt(f, r, e) {
    if (f % 1 !== 0 || f < 0) throw new RangeError("offset is not uint");
    if (f + r > e) throw new RangeError("Trying to access beyond buffer length");
  }
  l.prototype.readUintLE = l.prototype.readUIntLE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || mt(r, e, this.length);
    let p = this[r], g = 1, b = 0;
    for (; ++b < e && (g *= 256); )
      p += this[r + b] * g;
    return p;
  }, l.prototype.readUintBE = l.prototype.readUIntBE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || mt(r, e, this.length);
    let p = this[r + --e], g = 1;
    for (; e > 0 && (g *= 256); )
      p += this[r + --e] * g;
    return p;
  }, l.prototype.readUint8 = l.prototype.readUInt8 = function(r, e) {
    return r = r >>> 0, e || mt(r, 1, this.length), this[r];
  }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function(r, e) {
    return r = r >>> 0, e || mt(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function(r, e) {
    return r = r >>> 0, e || mt(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function(r, e) {
    return r = r >>> 0, e || mt(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function(r, e) {
    return r = r >>> 0, e || mt(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, l.prototype.readBigUInt64LE = Qt(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && or(r, this.length - 8);
    const p = e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, g = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + c * 2 ** 24;
    return BigInt(p) + (BigInt(g) << BigInt(32));
  }), l.prototype.readBigUInt64BE = Qt(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && or(r, this.length - 8);
    const p = e * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], g = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + c;
    return (BigInt(p) << BigInt(32)) + BigInt(g);
  }), l.prototype.readIntLE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || mt(r, e, this.length);
    let p = this[r], g = 1, b = 0;
    for (; ++b < e && (g *= 256); )
      p += this[r + b] * g;
    return g *= 128, p >= g && (p -= Math.pow(2, 8 * e)), p;
  }, l.prototype.readIntBE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || mt(r, e, this.length);
    let p = e, g = 1, b = this[r + --p];
    for (; p > 0 && (g *= 256); )
      b += this[r + --p] * g;
    return g *= 128, b >= g && (b -= Math.pow(2, 8 * e)), b;
  }, l.prototype.readInt8 = function(r, e) {
    return r = r >>> 0, e || mt(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, l.prototype.readInt16LE = function(r, e) {
    r = r >>> 0, e || mt(r, 2, this.length);
    const c = this[r] | this[r + 1] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, l.prototype.readInt16BE = function(r, e) {
    r = r >>> 0, e || mt(r, 2, this.length);
    const c = this[r + 1] | this[r] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, l.prototype.readInt32LE = function(r, e) {
    return r = r >>> 0, e || mt(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, l.prototype.readInt32BE = function(r, e) {
    return r = r >>> 0, e || mt(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, l.prototype.readBigInt64LE = Qt(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && or(r, this.length - 8);
    const p = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (c << 24);
    return (BigInt(p) << BigInt(32)) + BigInt(e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), l.prototype.readBigInt64BE = Qt(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && or(r, this.length - 8);
    const p = (e << 24) + // Overflow
    this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(p) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + c);
  }), l.prototype.readFloatLE = function(r, e) {
    return r = r >>> 0, e || mt(r, 4, this.length), h.read(this, r, !0, 23, 4);
  }, l.prototype.readFloatBE = function(r, e) {
    return r = r >>> 0, e || mt(r, 4, this.length), h.read(this, r, !1, 23, 4);
  }, l.prototype.readDoubleLE = function(r, e) {
    return r = r >>> 0, e || mt(r, 8, this.length), h.read(this, r, !0, 52, 8);
  }, l.prototype.readDoubleBE = function(r, e) {
    return r = r >>> 0, e || mt(r, 8, this.length), h.read(this, r, !1, 52, 8);
  };
  function It(f, r, e, c, p, g) {
    if (!l.isBuffer(f)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > p || r < g) throw new RangeError('"value" argument is out of bounds');
    if (e + c > f.length) throw new RangeError("Index out of range");
  }
  l.prototype.writeUintLE = l.prototype.writeUIntLE = function(r, e, c, p) {
    if (r = +r, e = e >>> 0, c = c >>> 0, !p) {
      const W = Math.pow(2, 8 * c) - 1;
      It(this, r, e, c, W, 0);
    }
    let g = 1, b = 0;
    for (this[e] = r & 255; ++b < c && (g *= 256); )
      this[e + b] = r / g & 255;
    return e + c;
  }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(r, e, c, p) {
    if (r = +r, e = e >>> 0, c = c >>> 0, !p) {
      const W = Math.pow(2, 8 * c) - 1;
      It(this, r, e, c, W, 0);
    }
    let g = c - 1, b = 1;
    for (this[e + g] = r & 255; --g >= 0 && (b *= 256); )
      this[e + g] = r / b & 255;
    return e + c;
  }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 1, 255, 0), this[e] = r & 255, e + 1;
  }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 2, 65535, 0), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 2, 65535, 0), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 4, 4294967295, 0), this[e + 3] = r >>> 24, this[e + 2] = r >>> 16, this[e + 1] = r >>> 8, this[e] = r & 255, e + 4;
  }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 4, 4294967295, 0), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  };
  function Lt(f, r, e, c, p) {
    fr(r, c, p, f, e, 7);
    let g = Number(r & BigInt(4294967295));
    f[e++] = g, g = g >> 8, f[e++] = g, g = g >> 8, f[e++] = g, g = g >> 8, f[e++] = g;
    let b = Number(r >> BigInt(32) & BigInt(4294967295));
    return f[e++] = b, b = b >> 8, f[e++] = b, b = b >> 8, f[e++] = b, b = b >> 8, f[e++] = b, e;
  }
  function Ot(f, r, e, c, p) {
    fr(r, c, p, f, e, 7);
    let g = Number(r & BigInt(4294967295));
    f[e + 7] = g, g = g >> 8, f[e + 6] = g, g = g >> 8, f[e + 5] = g, g = g >> 8, f[e + 4] = g;
    let b = Number(r >> BigInt(32) & BigInt(4294967295));
    return f[e + 3] = b, b = b >> 8, f[e + 2] = b, b = b >> 8, f[e + 1] = b, b = b >> 8, f[e] = b, e + 8;
  }
  l.prototype.writeBigUInt64LE = Qt(function(r, e = 0) {
    return Lt(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), l.prototype.writeBigUInt64BE = Qt(function(r, e = 0) {
    return Ot(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), l.prototype.writeIntLE = function(r, e, c, p) {
    if (r = +r, e = e >>> 0, !p) {
      const ut = Math.pow(2, 8 * c - 1);
      It(this, r, e, c, ut - 1, -ut);
    }
    let g = 0, b = 1, W = 0;
    for (this[e] = r & 255; ++g < c && (b *= 256); )
      r < 0 && W === 0 && this[e + g - 1] !== 0 && (W = 1), this[e + g] = (r / b >> 0) - W & 255;
    return e + c;
  }, l.prototype.writeIntBE = function(r, e, c, p) {
    if (r = +r, e = e >>> 0, !p) {
      const ut = Math.pow(2, 8 * c - 1);
      It(this, r, e, c, ut - 1, -ut);
    }
    let g = c - 1, b = 1, W = 0;
    for (this[e + g] = r & 255; --g >= 0 && (b *= 256); )
      r < 0 && W === 0 && this[e + g + 1] !== 0 && (W = 1), this[e + g] = (r / b >> 0) - W & 255;
    return e + c;
  }, l.prototype.writeInt8 = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[e] = r & 255, e + 1;
  }, l.prototype.writeInt16LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 2, 32767, -32768), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, l.prototype.writeInt16BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 2, 32767, -32768), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, l.prototype.writeInt32LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 4, 2147483647, -2147483648), this[e] = r & 255, this[e + 1] = r >>> 8, this[e + 2] = r >>> 16, this[e + 3] = r >>> 24, e + 4;
  }, l.prototype.writeInt32BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || It(this, r, e, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  }, l.prototype.writeBigInt64LE = Qt(function(r, e = 0) {
    return Lt(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), l.prototype.writeBigInt64BE = Qt(function(r, e = 0) {
    return Ot(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function rt(f, r, e, c, p, g) {
    if (e + c > f.length) throw new RangeError("Index out of range");
    if (e < 0) throw new RangeError("Index out of range");
  }
  function Nt(f, r, e, c, p) {
    return r = +r, e = e >>> 0, p || rt(f, r, e, 4), h.write(f, r, e, c, 23, 4), e + 4;
  }
  l.prototype.writeFloatLE = function(r, e, c) {
    return Nt(this, r, e, !0, c);
  }, l.prototype.writeFloatBE = function(r, e, c) {
    return Nt(this, r, e, !1, c);
  };
  function Ur(f, r, e, c, p) {
    return r = +r, e = e >>> 0, p || rt(f, r, e, 8), h.write(f, r, e, c, 52, 8), e + 8;
  }
  l.prototype.writeDoubleLE = function(r, e, c) {
    return Ur(this, r, e, !0, c);
  }, l.prototype.writeDoubleBE = function(r, e, c) {
    return Ur(this, r, e, !1, c);
  }, l.prototype.copy = function(r, e, c, p) {
    if (!l.isBuffer(r)) throw new TypeError("argument should be a Buffer");
    if (c || (c = 0), !p && p !== 0 && (p = this.length), e >= r.length && (e = r.length), e || (e = 0), p > 0 && p < c && (p = c), p === c || r.length === 0 || this.length === 0) return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (c < 0 || c >= this.length) throw new RangeError("Index out of range");
    if (p < 0) throw new RangeError("sourceEnd out of bounds");
    p > this.length && (p = this.length), r.length - e < p - c && (p = r.length - e + c);
    const g = p - c;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, c, p) : Uint8Array.prototype.set.call(
      r,
      this.subarray(c, p),
      e
    ), g;
  }, l.prototype.fill = function(r, e, c, p) {
    if (typeof r == "string") {
      if (typeof e == "string" ? (p = e, e = 0, c = this.length) : typeof c == "string" && (p = c, c = this.length), p !== void 0 && typeof p != "string")
        throw new TypeError("encoding must be a string");
      if (typeof p == "string" && !l.isEncoding(p))
        throw new TypeError("Unknown encoding: " + p);
      if (r.length === 1) {
        const b = r.charCodeAt(0);
        (p === "utf8" && b < 128 || p === "latin1") && (r = b);
      }
    } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
    if (e < 0 || this.length < e || this.length < c)
      throw new RangeError("Out of range index");
    if (c <= e)
      return this;
    e = e >>> 0, c = c === void 0 ? this.length : c >>> 0, r || (r = 0);
    let g;
    if (typeof r == "number")
      for (g = e; g < c; ++g)
        this[g] = r;
    else {
      const b = l.isBuffer(r) ? r : l.from(r, p), W = b.length;
      if (W === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (g = 0; g < c - e; ++g)
        this[g + e] = b[g % W];
    }
    return this;
  };
  const Jt = {};
  function tr(f, r, e) {
    Jt[f] = class extends e {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: r.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${f}]`, this.stack, delete this.name;
      }
      get code() {
        return f;
      }
      set code(p) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: p,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${f}]: ${this.message}`;
      }
    };
  }
  tr(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(f) {
      return f ? `${f} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), tr(
    "ERR_INVALID_ARG_TYPE",
    function(f, r) {
      return `The "${f}" argument must be of type number. Received type ${typeof r}`;
    },
    TypeError
  ), tr(
    "ERR_OUT_OF_RANGE",
    function(f, r, e) {
      let c = `The value of "${f}" is out of range.`, p = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? p = ir(String(e)) : typeof e == "bigint" && (p = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (p = ir(p)), p += "n"), c += ` It must be ${r}. Received ${p}`, c;
    },
    RangeError
  );
  function ir(f) {
    let r = "", e = f.length;
    const c = f[0] === "-" ? 1 : 0;
    for (; e >= c + 4; e -= 3)
      r = `_${f.slice(e - 3, e)}${r}`;
    return `${f.slice(0, e)}${r}`;
  }
  function Or(f, r, e) {
    Wt(r, "offset"), (f[r] === void 0 || f[r + e] === void 0) && or(r, f.length - (e + 1));
  }
  function fr(f, r, e, c, p, g) {
    if (f > e || f < r) {
      const b = typeof r == "bigint" ? "n" : "";
      let W;
      throw r === 0 || r === BigInt(0) ? W = `>= 0${b} and < 2${b} ** ${(g + 1) * 8}${b}` : W = `>= -(2${b} ** ${(g + 1) * 8 - 1}${b}) and < 2 ** ${(g + 1) * 8 - 1}${b}`, new Jt.ERR_OUT_OF_RANGE("value", W, f);
    }
    Or(c, p, g);
  }
  function Wt(f, r) {
    if (typeof f != "number")
      throw new Jt.ERR_INVALID_ARG_TYPE(r, "number", f);
  }
  function or(f, r, e) {
    throw Math.floor(f) !== f ? (Wt(f, e), new Jt.ERR_OUT_OF_RANGE("offset", "an integer", f)) : r < 0 ? new Jt.ERR_BUFFER_OUT_OF_BOUNDS() : new Jt.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${r}`,
      f
    );
  }
  const zr = /[^+/0-9A-Za-z-_]/g;
  function Kr(f) {
    if (f = f.split("=")[0], f = f.trim().replace(zr, ""), f.length < 2) return "";
    for (; f.length % 4 !== 0; )
      f = f + "=";
    return f;
  }
  function Ar(f, r) {
    r = r || 1 / 0;
    let e;
    const c = f.length;
    let p = null;
    const g = [];
    for (let b = 0; b < c; ++b) {
      if (e = f.charCodeAt(b), e > 55295 && e < 57344) {
        if (!p) {
          if (e > 56319) {
            (r -= 3) > -1 && g.push(239, 191, 189);
            continue;
          } else if (b + 1 === c) {
            (r -= 3) > -1 && g.push(239, 191, 189);
            continue;
          }
          p = e;
          continue;
        }
        if (e < 56320) {
          (r -= 3) > -1 && g.push(239, 191, 189), p = e;
          continue;
        }
        e = (p - 55296 << 10 | e - 56320) + 65536;
      } else p && (r -= 3) > -1 && g.push(239, 191, 189);
      if (p = null, e < 128) {
        if ((r -= 1) < 0) break;
        g.push(e);
      } else if (e < 2048) {
        if ((r -= 2) < 0) break;
        g.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((r -= 3) < 0) break;
        g.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((r -= 4) < 0) break;
        g.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return g;
  }
  function kr(f) {
    const r = [];
    for (let e = 0; e < f.length; ++e)
      r.push(f.charCodeAt(e) & 255);
    return r;
  }
  function Zt(f, r) {
    let e, c, p;
    const g = [];
    for (let b = 0; b < f.length && !((r -= 2) < 0); ++b)
      e = f.charCodeAt(b), c = e >> 8, p = e % 256, g.push(p), g.push(c);
    return g;
  }
  function ar(f) {
    return s.toByteArray(Kr(f));
  }
  function sr(f, r, e, c) {
    let p;
    for (p = 0; p < c && !(p + e >= r.length || p >= f.length); ++p)
      r[p + e] = f[p];
    return p;
  }
  function kt(f, r) {
    return f instanceof r || f != null && f.constructor != null && f.constructor.name != null && f.constructor.name === r.name;
  }
  function cr(f) {
    return f !== f;
  }
  const wr = function() {
    const f = "0123456789abcdef", r = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const c = e * 16;
      for (let p = 0; p < 16; ++p)
        r[c + p] = f[e] + f[p];
    }
    return r;
  }();
  function Qt(f) {
    return typeof BigInt > "u" ? yr : f;
  }
  function yr() {
    throw new Error("BigInt not supported");
  }
})(ue);
const Qe = "https://t.me/mizuwallet_bot/mizuwallet", je = "https://t.me/mizuwallet_bot/mizuwallet_testnet", ze = (w) => w === ce.TESTNET ? je : Qe, Sr = {
  CONNECT: "[Mizu Wallet Connection] ",
  TRANSACTION: "[Mizu Wallet Transaction] "
}, Ke = "07418a1b-9574-4449-bd34-2146db60b05c", Ye = "0c460c1a-5175-4383-b1c2-35b934f5aa71", He = (w) => w === ce.TESTNET ? Ye : Ke, _e = "Mizu Wallet", Je = "https://mizu.io", We = "data:image/png;base64,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";
var Ze = { exports: {} };
(function(w) {
  (function(s, h) {
    w.exports ? w.exports = h() : (s.nacl || (s.nacl = {}), s.nacl.util = h());
  })(Ce, function() {
    var s = {};
    function h(x) {
      if (!/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(x))
        throw new TypeError("invalid encoding");
    }
    return s.decodeUTF8 = function(x) {
      if (typeof x != "string") throw new TypeError("expected string");
      var d, I = unescape(encodeURIComponent(x)), R = new Uint8Array(I.length);
      for (d = 0; d < I.length; d++) R[d] = I.charCodeAt(d);
      return R;
    }, s.encodeUTF8 = function(x) {
      var d, I = [];
      for (d = 0; d < x.length; d++) I.push(String.fromCharCode(x[d]));
      return decodeURIComponent(escape(I.join("")));
    }, typeof atob > "u" ? typeof Buffer.from < "u" ? (s.encodeBase64 = function(x) {
      return Buffer.from(x).toString("base64");
    }, s.decodeBase64 = function(x) {
      return h(x), new Uint8Array(Array.prototype.slice.call(Buffer.from(x, "base64"), 0));
    }) : (s.encodeBase64 = function(x) {
      return new Buffer(x).toString("base64");
    }, s.decodeBase64 = function(x) {
      return h(x), new Uint8Array(Array.prototype.slice.call(new Buffer(x, "base64"), 0));
    }) : (s.encodeBase64 = function(x) {
      var d, I = [], R = x.length;
      for (d = 0; d < R; d++) I.push(String.fromCharCode(x[d]));
      return btoa(I.join(""));
    }, s.decodeBase64 = function(x) {
      h(x);
      var d, I = atob(x), R = new Uint8Array(I.length);
      for (d = 0; d < I.length; d++) R[d] = I.charCodeAt(d);
      return R;
    }), s;
  });
})(Ze);
function qe(w) {
  throw new Error('Could not dynamically require "' + w + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var xe = { exports: {} };
const Ge = {}, Ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ge
}, Symbol.toStringTag, { value: "Module" })), Xe = /* @__PURE__ */ Te(Ve);
(function(w) {
  (function(s) {
    var h = function(n) {
      var o, i = new Float64Array(16);
      if (n) for (o = 0; o < n.length; o++) i[o] = n[o];
      return i;
    }, x = function() {
      throw new Error("no PRNG");
    }, d = new Uint8Array(16), I = new Uint8Array(32);
    I[0] = 9;
    var R = h(), l = h([1]), j = h([56129, 1]), et = h([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), ct = h([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), dt = h([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), vt = h([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), At = h([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function Bt(n, o, i, t) {
      n[o] = i >> 24 & 255, n[o + 1] = i >> 16 & 255, n[o + 2] = i >> 8 & 255, n[o + 3] = i & 255, n[o + 4] = t >> 24 & 255, n[o + 5] = t >> 16 & 255, n[o + 6] = t >> 8 & 255, n[o + 7] = t & 255;
    }
    function Dt(n, o, i, t, a) {
      var A, y = 0;
      for (A = 0; A < a; A++) y |= n[o + A] ^ i[t + A];
      return (1 & y - 1 >>> 8) - 1;
    }
    function er(n, o, i, t) {
      return Dt(n, o, i, t, 16);
    }
    function Kt(n, o, i, t) {
      return Dt(n, o, i, t, 32);
    }
    function nr(n, o, i, t) {
      for (var a = t[0] & 255 | (t[1] & 255) << 8 | (t[2] & 255) << 16 | (t[3] & 255) << 24, A = i[0] & 255 | (i[1] & 255) << 8 | (i[2] & 255) << 16 | (i[3] & 255) << 24, y = i[4] & 255 | (i[5] & 255) << 8 | (i[6] & 255) << 16 | (i[7] & 255) << 24, U = i[8] & 255 | (i[9] & 255) << 8 | (i[10] & 255) << 16 | (i[11] & 255) << 24, T = i[12] & 255 | (i[13] & 255) << 8 | (i[14] & 255) << 16 | (i[15] & 255) << 24, D = t[4] & 255 | (t[5] & 255) << 8 | (t[6] & 255) << 16 | (t[7] & 255) << 24, F = o[0] & 255 | (o[1] & 255) << 8 | (o[2] & 255) << 16 | (o[3] & 255) << 24, ot = o[4] & 255 | (o[5] & 255) << 8 | (o[6] & 255) << 16 | (o[7] & 255) << 24, O = o[8] & 255 | (o[9] & 255) << 8 | (o[10] & 255) << 16 | (o[11] & 255) << 24, K = o[12] & 255 | (o[13] & 255) << 8 | (o[14] & 255) << 16 | (o[15] & 255) << 24, Y = t[8] & 255 | (t[9] & 255) << 8 | (t[10] & 255) << 16 | (t[11] & 255) << 24, q = i[16] & 255 | (i[17] & 255) << 8 | (i[18] & 255) << 16 | (i[19] & 255) << 24, Z = i[20] & 255 | (i[21] & 255) << 8 | (i[22] & 255) << 16 | (i[23] & 255) << 24, H = i[24] & 255 | (i[25] & 255) << 8 | (i[26] & 255) << 16 | (i[27] & 255) << 24, J = i[28] & 255 | (i[29] & 255) << 8 | (i[30] & 255) << 16 | (i[31] & 255) << 24, _ = t[12] & 255 | (t[13] & 255) << 8 | (t[14] & 255) << 16 | (t[15] & 255) << 24, k = a, Q = A, L = y, M = U, P = T, N = D, m = F, E = ot, C = O, B = K, v = Y, S = q, z = Z, G = H, X = J, V = _, u, tt = 0; tt < 20; tt += 2)
        u = k + z | 0, P ^= u << 7 | u >>> 25, u = P + k | 0, C ^= u << 9 | u >>> 23, u = C + P | 0, z ^= u << 13 | u >>> 19, u = z + C | 0, k ^= u << 18 | u >>> 14, u = N + Q | 0, B ^= u << 7 | u >>> 25, u = B + N | 0, G ^= u << 9 | u >>> 23, u = G + B | 0, Q ^= u << 13 | u >>> 19, u = Q + G | 0, N ^= u << 18 | u >>> 14, u = v + m | 0, X ^= u << 7 | u >>> 25, u = X + v | 0, L ^= u << 9 | u >>> 23, u = L + X | 0, m ^= u << 13 | u >>> 19, u = m + L | 0, v ^= u << 18 | u >>> 14, u = V + S | 0, M ^= u << 7 | u >>> 25, u = M + V | 0, E ^= u << 9 | u >>> 23, u = E + M | 0, S ^= u << 13 | u >>> 19, u = S + E | 0, V ^= u << 18 | u >>> 14, u = k + M | 0, Q ^= u << 7 | u >>> 25, u = Q + k | 0, L ^= u << 9 | u >>> 23, u = L + Q | 0, M ^= u << 13 | u >>> 19, u = M + L | 0, k ^= u << 18 | u >>> 14, u = N + P | 0, m ^= u << 7 | u >>> 25, u = m + N | 0, E ^= u << 9 | u >>> 23, u = E + m | 0, P ^= u << 13 | u >>> 19, u = P + E | 0, N ^= u << 18 | u >>> 14, u = v + B | 0, S ^= u << 7 | u >>> 25, u = S + v | 0, C ^= u << 9 | u >>> 23, u = C + S | 0, B ^= u << 13 | u >>> 19, u = B + C | 0, v ^= u << 18 | u >>> 14, u = V + X | 0, z ^= u << 7 | u >>> 25, u = z + V | 0, G ^= u << 9 | u >>> 23, u = G + z | 0, X ^= u << 13 | u >>> 19, u = X + G | 0, V ^= u << 18 | u >>> 14;
      k = k + a | 0, Q = Q + A | 0, L = L + y | 0, M = M + U | 0, P = P + T | 0, N = N + D | 0, m = m + F | 0, E = E + ot | 0, C = C + O | 0, B = B + K | 0, v = v + Y | 0, S = S + q | 0, z = z + Z | 0, G = G + H | 0, X = X + J | 0, V = V + _ | 0, n[0] = k >>> 0 & 255, n[1] = k >>> 8 & 255, n[2] = k >>> 16 & 255, n[3] = k >>> 24 & 255, n[4] = Q >>> 0 & 255, n[5] = Q >>> 8 & 255, n[6] = Q >>> 16 & 255, n[7] = Q >>> 24 & 255, n[8] = L >>> 0 & 255, n[9] = L >>> 8 & 255, n[10] = L >>> 16 & 255, n[11] = L >>> 24 & 255, n[12] = M >>> 0 & 255, n[13] = M >>> 8 & 255, n[14] = M >>> 16 & 255, n[15] = M >>> 24 & 255, n[16] = P >>> 0 & 255, n[17] = P >>> 8 & 255, n[18] = P >>> 16 & 255, n[19] = P >>> 24 & 255, n[20] = N >>> 0 & 255, n[21] = N >>> 8 & 255, n[22] = N >>> 16 & 255, n[23] = N >>> 24 & 255, n[24] = m >>> 0 & 255, n[25] = m >>> 8 & 255, n[26] = m >>> 16 & 255, n[27] = m >>> 24 & 255, n[28] = E >>> 0 & 255, n[29] = E >>> 8 & 255, n[30] = E >>> 16 & 255, n[31] = E >>> 24 & 255, n[32] = C >>> 0 & 255, n[33] = C >>> 8 & 255, n[34] = C >>> 16 & 255, n[35] = C >>> 24 & 255, n[36] = B >>> 0 & 255, n[37] = B >>> 8 & 255, n[38] = B >>> 16 & 255, n[39] = B >>> 24 & 255, n[40] = v >>> 0 & 255, n[41] = v >>> 8 & 255, n[42] = v >>> 16 & 255, n[43] = v >>> 24 & 255, n[44] = S >>> 0 & 255, n[45] = S >>> 8 & 255, n[46] = S >>> 16 & 255, n[47] = S >>> 24 & 255, n[48] = z >>> 0 & 255, n[49] = z >>> 8 & 255, n[50] = z >>> 16 & 255, n[51] = z >>> 24 & 255, n[52] = G >>> 0 & 255, n[53] = G >>> 8 & 255, n[54] = G >>> 16 & 255, n[55] = G >>> 24 & 255, n[56] = X >>> 0 & 255, n[57] = X >>> 8 & 255, n[58] = X >>> 16 & 255, n[59] = X >>> 24 & 255, n[60] = V >>> 0 & 255, n[61] = V >>> 8 & 255, n[62] = V >>> 16 & 255, n[63] = V >>> 24 & 255;
    }
    function lr(n, o, i, t) {
      for (var a = t[0] & 255 | (t[1] & 255) << 8 | (t[2] & 255) << 16 | (t[3] & 255) << 24, A = i[0] & 255 | (i[1] & 255) << 8 | (i[2] & 255) << 16 | (i[3] & 255) << 24, y = i[4] & 255 | (i[5] & 255) << 8 | (i[6] & 255) << 16 | (i[7] & 255) << 24, U = i[8] & 255 | (i[9] & 255) << 8 | (i[10] & 255) << 16 | (i[11] & 255) << 24, T = i[12] & 255 | (i[13] & 255) << 8 | (i[14] & 255) << 16 | (i[15] & 255) << 24, D = t[4] & 255 | (t[5] & 255) << 8 | (t[6] & 255) << 16 | (t[7] & 255) << 24, F = o[0] & 255 | (o[1] & 255) << 8 | (o[2] & 255) << 16 | (o[3] & 255) << 24, ot = o[4] & 255 | (o[5] & 255) << 8 | (o[6] & 255) << 16 | (o[7] & 255) << 24, O = o[8] & 255 | (o[9] & 255) << 8 | (o[10] & 255) << 16 | (o[11] & 255) << 24, K = o[12] & 255 | (o[13] & 255) << 8 | (o[14] & 255) << 16 | (o[15] & 255) << 24, Y = t[8] & 255 | (t[9] & 255) << 8 | (t[10] & 255) << 16 | (t[11] & 255) << 24, q = i[16] & 255 | (i[17] & 255) << 8 | (i[18] & 255) << 16 | (i[19] & 255) << 24, Z = i[20] & 255 | (i[21] & 255) << 8 | (i[22] & 255) << 16 | (i[23] & 255) << 24, H = i[24] & 255 | (i[25] & 255) << 8 | (i[26] & 255) << 16 | (i[27] & 255) << 24, J = i[28] & 255 | (i[29] & 255) << 8 | (i[30] & 255) << 16 | (i[31] & 255) << 24, _ = t[12] & 255 | (t[13] & 255) << 8 | (t[14] & 255) << 16 | (t[15] & 255) << 24, k = a, Q = A, L = y, M = U, P = T, N = D, m = F, E = ot, C = O, B = K, v = Y, S = q, z = Z, G = H, X = J, V = _, u, tt = 0; tt < 20; tt += 2)
        u = k + z | 0, P ^= u << 7 | u >>> 25, u = P + k | 0, C ^= u << 9 | u >>> 23, u = C + P | 0, z ^= u << 13 | u >>> 19, u = z + C | 0, k ^= u << 18 | u >>> 14, u = N + Q | 0, B ^= u << 7 | u >>> 25, u = B + N | 0, G ^= u << 9 | u >>> 23, u = G + B | 0, Q ^= u << 13 | u >>> 19, u = Q + G | 0, N ^= u << 18 | u >>> 14, u = v + m | 0, X ^= u << 7 | u >>> 25, u = X + v | 0, L ^= u << 9 | u >>> 23, u = L + X | 0, m ^= u << 13 | u >>> 19, u = m + L | 0, v ^= u << 18 | u >>> 14, u = V + S | 0, M ^= u << 7 | u >>> 25, u = M + V | 0, E ^= u << 9 | u >>> 23, u = E + M | 0, S ^= u << 13 | u >>> 19, u = S + E | 0, V ^= u << 18 | u >>> 14, u = k + M | 0, Q ^= u << 7 | u >>> 25, u = Q + k | 0, L ^= u << 9 | u >>> 23, u = L + Q | 0, M ^= u << 13 | u >>> 19, u = M + L | 0, k ^= u << 18 | u >>> 14, u = N + P | 0, m ^= u << 7 | u >>> 25, u = m + N | 0, E ^= u << 9 | u >>> 23, u = E + m | 0, P ^= u << 13 | u >>> 19, u = P + E | 0, N ^= u << 18 | u >>> 14, u = v + B | 0, S ^= u << 7 | u >>> 25, u = S + v | 0, C ^= u << 9 | u >>> 23, u = C + S | 0, B ^= u << 13 | u >>> 19, u = B + C | 0, v ^= u << 18 | u >>> 14, u = V + X | 0, z ^= u << 7 | u >>> 25, u = z + V | 0, G ^= u << 9 | u >>> 23, u = G + z | 0, X ^= u << 13 | u >>> 19, u = X + G | 0, V ^= u << 18 | u >>> 14;
      n[0] = k >>> 0 & 255, n[1] = k >>> 8 & 255, n[2] = k >>> 16 & 255, n[3] = k >>> 24 & 255, n[4] = N >>> 0 & 255, n[5] = N >>> 8 & 255, n[6] = N >>> 16 & 255, n[7] = N >>> 24 & 255, n[8] = v >>> 0 & 255, n[9] = v >>> 8 & 255, n[10] = v >>> 16 & 255, n[11] = v >>> 24 & 255, n[12] = V >>> 0 & 255, n[13] = V >>> 8 & 255, n[14] = V >>> 16 & 255, n[15] = V >>> 24 & 255, n[16] = m >>> 0 & 255, n[17] = m >>> 8 & 255, n[18] = m >>> 16 & 255, n[19] = m >>> 24 & 255, n[20] = E >>> 0 & 255, n[21] = E >>> 8 & 255, n[22] = E >>> 16 & 255, n[23] = E >>> 24 & 255, n[24] = C >>> 0 & 255, n[25] = C >>> 8 & 255, n[26] = C >>> 16 & 255, n[27] = C >>> 24 & 255, n[28] = B >>> 0 & 255, n[29] = B >>> 8 & 255, n[30] = B >>> 16 & 255, n[31] = B >>> 24 & 255;
    }
    function Vt(n, o, i, t) {
      nr(n, o, i, t);
    }
    function Rt(n, o, i, t) {
      lr(n, o, i, t);
    }
    var Ft = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function Ht(n, o, i, t, a, A, y) {
      var U = new Uint8Array(16), T = new Uint8Array(64), D, F;
      for (F = 0; F < 16; F++) U[F] = 0;
      for (F = 0; F < 8; F++) U[F] = A[F];
      for (; a >= 64; ) {
        for (Vt(T, U, y, Ft), F = 0; F < 64; F++) n[o + F] = i[t + F] ^ T[F];
        for (D = 1, F = 8; F < 16; F++)
          D = D + (U[F] & 255) | 0, U[F] = D & 255, D >>>= 8;
        a -= 64, o += 64, t += 64;
      }
      if (a > 0)
        for (Vt(T, U, y, Ft), F = 0; F < a; F++) n[o + F] = i[t + F] ^ T[F];
      return 0;
    }
    function Mt(n, o, i, t, a) {
      var A = new Uint8Array(16), y = new Uint8Array(64), U, T;
      for (T = 0; T < 16; T++) A[T] = 0;
      for (T = 0; T < 8; T++) A[T] = t[T];
      for (; i >= 64; ) {
        for (Vt(y, A, a, Ft), T = 0; T < 64; T++) n[o + T] = y[T];
        for (U = 1, T = 8; T < 16; T++)
          U = U + (A[T] & 255) | 0, A[T] = U & 255, U >>>= 8;
        i -= 64, o += 64;
      }
      if (i > 0)
        for (Vt(y, A, a, Ft), T = 0; T < i; T++) n[o + T] = y[T];
      return 0;
    }
    function Nr(n, o, i, t, a) {
      var A = new Uint8Array(32);
      Rt(A, t, a, Ft);
      for (var y = new Uint8Array(8), U = 0; U < 8; U++) y[U] = t[U + 16];
      return Mt(n, o, i, y, A);
    }
    function br(n, o, i, t, a, A, y) {
      var U = new Uint8Array(32);
      Rt(U, A, y, Ft);
      for (var T = new Uint8Array(8), D = 0; D < 8; D++) T[D] = A[D + 16];
      return Ht(n, o, i, t, a, T, U);
    }
    var xr = function(n) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var o, i, t, a, A, y, U, T;
      o = n[0] & 255 | (n[1] & 255) << 8, this.r[0] = o & 8191, i = n[2] & 255 | (n[3] & 255) << 8, this.r[1] = (o >>> 13 | i << 3) & 8191, t = n[4] & 255 | (n[5] & 255) << 8, this.r[2] = (i >>> 10 | t << 6) & 7939, a = n[6] & 255 | (n[7] & 255) << 8, this.r[3] = (t >>> 7 | a << 9) & 8191, A = n[8] & 255 | (n[9] & 255) << 8, this.r[4] = (a >>> 4 | A << 12) & 255, this.r[5] = A >>> 1 & 8190, y = n[10] & 255 | (n[11] & 255) << 8, this.r[6] = (A >>> 14 | y << 2) & 8191, U = n[12] & 255 | (n[13] & 255) << 8, this.r[7] = (y >>> 11 | U << 5) & 8065, T = n[14] & 255 | (n[15] & 255) << 8, this.r[8] = (U >>> 8 | T << 8) & 8191, this.r[9] = T >>> 5 & 127, this.pad[0] = n[16] & 255 | (n[17] & 255) << 8, this.pad[1] = n[18] & 255 | (n[19] & 255) << 8, this.pad[2] = n[20] & 255 | (n[21] & 255) << 8, this.pad[3] = n[22] & 255 | (n[23] & 255) << 8, this.pad[4] = n[24] & 255 | (n[25] & 255) << 8, this.pad[5] = n[26] & 255 | (n[27] & 255) << 8, this.pad[6] = n[28] & 255 | (n[29] & 255) << 8, this.pad[7] = n[30] & 255 | (n[31] & 255) << 8;
    };
    xr.prototype.blocks = function(n, o, i) {
      for (var t = this.fin ? 0 : 2048, a, A, y, U, T, D, F, ot, O, K, Y, q, Z, H, J, _, k, Q, L, M = this.h[0], P = this.h[1], N = this.h[2], m = this.h[3], E = this.h[4], C = this.h[5], B = this.h[6], v = this.h[7], S = this.h[8], z = this.h[9], G = this.r[0], X = this.r[1], V = this.r[2], u = this.r[3], tt = this.r[4], at = this.r[5], st = this.r[6], $ = this.r[7], nt = this.r[8], it = this.r[9]; i >= 16; )
        a = n[o + 0] & 255 | (n[o + 1] & 255) << 8, M += a & 8191, A = n[o + 2] & 255 | (n[o + 3] & 255) << 8, P += (a >>> 13 | A << 3) & 8191, y = n[o + 4] & 255 | (n[o + 5] & 255) << 8, N += (A >>> 10 | y << 6) & 8191, U = n[o + 6] & 255 | (n[o + 7] & 255) << 8, m += (y >>> 7 | U << 9) & 8191, T = n[o + 8] & 255 | (n[o + 9] & 255) << 8, E += (U >>> 4 | T << 12) & 8191, C += T >>> 1 & 8191, D = n[o + 10] & 255 | (n[o + 11] & 255) << 8, B += (T >>> 14 | D << 2) & 8191, F = n[o + 12] & 255 | (n[o + 13] & 255) << 8, v += (D >>> 11 | F << 5) & 8191, ot = n[o + 14] & 255 | (n[o + 15] & 255) << 8, S += (F >>> 8 | ot << 8) & 8191, z += ot >>> 5 | t, O = 0, K = O, K += M * G, K += P * (5 * it), K += N * (5 * nt), K += m * (5 * $), K += E * (5 * st), O = K >>> 13, K &= 8191, K += C * (5 * at), K += B * (5 * tt), K += v * (5 * u), K += S * (5 * V), K += z * (5 * X), O += K >>> 13, K &= 8191, Y = O, Y += M * X, Y += P * G, Y += N * (5 * it), Y += m * (5 * nt), Y += E * (5 * $), O = Y >>> 13, Y &= 8191, Y += C * (5 * st), Y += B * (5 * at), Y += v * (5 * tt), Y += S * (5 * u), Y += z * (5 * V), O += Y >>> 13, Y &= 8191, q = O, q += M * V, q += P * X, q += N * G, q += m * (5 * it), q += E * (5 * nt), O = q >>> 13, q &= 8191, q += C * (5 * $), q += B * (5 * st), q += v * (5 * at), q += S * (5 * tt), q += z * (5 * u), O += q >>> 13, q &= 8191, Z = O, Z += M * u, Z += P * V, Z += N * X, Z += m * G, Z += E * (5 * it), O = Z >>> 13, Z &= 8191, Z += C * (5 * nt), Z += B * (5 * $), Z += v * (5 * st), Z += S * (5 * at), Z += z * (5 * tt), O += Z >>> 13, Z &= 8191, H = O, H += M * tt, H += P * u, H += N * V, H += m * X, H += E * G, O = H >>> 13, H &= 8191, H += C * (5 * it), H += B * (5 * nt), H += v * (5 * $), H += S * (5 * st), H += z * (5 * at), O += H >>> 13, H &= 8191, J = O, J += M * at, J += P * tt, J += N * u, J += m * V, J += E * X, O = J >>> 13, J &= 8191, J += C * G, J += B * (5 * it), J += v * (5 * nt), J += S * (5 * $), J += z * (5 * st), O += J >>> 13, J &= 8191, _ = O, _ += M * st, _ += P * at, _ += N * tt, _ += m * u, _ += E * V, O = _ >>> 13, _ &= 8191, _ += C * X, _ += B * G, _ += v * (5 * it), _ += S * (5 * nt), _ += z * (5 * $), O += _ >>> 13, _ &= 8191, k = O, k += M * $, k += P * st, k += N * at, k += m * tt, k += E * u, O = k >>> 13, k &= 8191, k += C * V, k += B * X, k += v * G, k += S * (5 * it), k += z * (5 * nt), O += k >>> 13, k &= 8191, Q = O, Q += M * nt, Q += P * $, Q += N * st, Q += m * at, Q += E * tt, O = Q >>> 13, Q &= 8191, Q += C * u, Q += B * V, Q += v * X, Q += S * G, Q += z * (5 * it), O += Q >>> 13, Q &= 8191, L = O, L += M * it, L += P * nt, L += N * $, L += m * st, L += E * at, O = L >>> 13, L &= 8191, L += C * tt, L += B * u, L += v * V, L += S * X, L += z * G, O += L >>> 13, L &= 8191, O = (O << 2) + O | 0, O = O + K | 0, K = O & 8191, O = O >>> 13, Y += O, M = K, P = Y, N = q, m = Z, E = H, C = J, B = _, v = k, S = Q, z = L, o += 16, i -= 16;
      this.h[0] = M, this.h[1] = P, this.h[2] = N, this.h[3] = m, this.h[4] = E, this.h[5] = C, this.h[6] = B, this.h[7] = v, this.h[8] = S, this.h[9] = z;
    }, xr.prototype.finish = function(n, o) {
      var i = new Uint16Array(10), t, a, A, y;
      if (this.leftover) {
        for (y = this.leftover, this.buffer[y++] = 1; y < 16; y++) this.buffer[y] = 0;
        this.fin = 1, this.blocks(this.buffer, 0, 16);
      }
      for (t = this.h[1] >>> 13, this.h[1] &= 8191, y = 2; y < 10; y++)
        this.h[y] += t, t = this.h[y] >>> 13, this.h[y] &= 8191;
      for (this.h[0] += t * 5, t = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += t, t = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += t, i[0] = this.h[0] + 5, t = i[0] >>> 13, i[0] &= 8191, y = 1; y < 10; y++)
        i[y] = this.h[y] + t, t = i[y] >>> 13, i[y] &= 8191;
      for (i[9] -= 8192, a = (t ^ 1) - 1, y = 0; y < 10; y++) i[y] &= a;
      for (a = ~a, y = 0; y < 10; y++) this.h[y] = this.h[y] & a | i[y];
      for (this.h[0] = (this.h[0] | this.h[1] << 13) & 65535, this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535, this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535, this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535, this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535, this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535, this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535, this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535, A = this.h[0] + this.pad[0], this.h[0] = A & 65535, y = 1; y < 8; y++)
        A = (this.h[y] + this.pad[y] | 0) + (A >>> 16) | 0, this.h[y] = A & 65535;
      n[o + 0] = this.h[0] >>> 0 & 255, n[o + 1] = this.h[0] >>> 8 & 255, n[o + 2] = this.h[1] >>> 0 & 255, n[o + 3] = this.h[1] >>> 8 & 255, n[o + 4] = this.h[2] >>> 0 & 255, n[o + 5] = this.h[2] >>> 8 & 255, n[o + 6] = this.h[3] >>> 0 & 255, n[o + 7] = this.h[3] >>> 8 & 255, n[o + 8] = this.h[4] >>> 0 & 255, n[o + 9] = this.h[4] >>> 8 & 255, n[o + 10] = this.h[5] >>> 0 & 255, n[o + 11] = this.h[5] >>> 8 & 255, n[o + 12] = this.h[6] >>> 0 & 255, n[o + 13] = this.h[6] >>> 8 & 255, n[o + 14] = this.h[7] >>> 0 & 255, n[o + 15] = this.h[7] >>> 8 & 255;
    }, xr.prototype.update = function(n, o, i) {
      var t, a;
      if (this.leftover) {
        for (a = 16 - this.leftover, a > i && (a = i), t = 0; t < a; t++)
          this.buffer[this.leftover + t] = n[o + t];
        if (i -= a, o += a, this.leftover += a, this.leftover < 16)
          return;
        this.blocks(this.buffer, 0, 16), this.leftover = 0;
      }
      if (i >= 16 && (a = i - i % 16, this.blocks(n, o, a), o += a, i -= a), i) {
        for (t = 0; t < i; t++)
          this.buffer[this.leftover + t] = n[o + t];
        this.leftover += i;
      }
    };
    function Br(n, o, i, t, a, A) {
      var y = new xr(A);
      return y.update(i, t, a), y.finish(n, o), 0;
    }
    function Fr(n, o, i, t, a, A) {
      var y = new Uint8Array(16);
      return Br(y, 0, i, t, a, A), er(n, o, y, 0);
    }
    function pr(n, o, i, t, a) {
      var A;
      if (i < 32) return -1;
      for (br(n, 0, o, 0, i, t, a), Br(n, 16, n, 32, i - 32, n), A = 0; A < 16; A++) n[A] = 0;
      return 0;
    }
    function dr(n, o, i, t, a) {
      var A, y = new Uint8Array(32);
      if (i < 32 || (Nr(y, 0, 32, t, a), Fr(o, 16, o, 32, i - 32, y) !== 0)) return -1;
      for (br(n, 0, o, 0, i, t, a), A = 0; A < 32; A++) n[A] = 0;
      return 0;
    }
    function Yt(n, o) {
      var i;
      for (i = 0; i < 16; i++) n[i] = o[i] | 0;
    }
    function Ir(n) {
      var o, i, t = 1;
      for (o = 0; o < 16; o++)
        i = n[o] + t + 65535, t = Math.floor(i / 65536), n[o] = i - t * 65536;
      n[0] += t - 1 + 37 * (t - 1);
    }
    function Xt(n, o, i) {
      for (var t, a = ~(i - 1), A = 0; A < 16; A++)
        t = a & (n[A] ^ o[A]), n[A] ^= t, o[A] ^= t;
    }
    function $t(n, o) {
      var i, t, a, A = h(), y = h();
      for (i = 0; i < 16; i++) y[i] = o[i];
      for (Ir(y), Ir(y), Ir(y), t = 0; t < 2; t++) {
        for (A[0] = y[0] - 65517, i = 1; i < 15; i++)
          A[i] = y[i] - 65535 - (A[i - 1] >> 16 & 1), A[i - 1] &= 65535;
        A[15] = y[15] - 32767 - (A[14] >> 16 & 1), a = A[15] >> 16 & 1, A[14] &= 65535, Xt(y, A, 1 - a);
      }
      for (i = 0; i < 16; i++)
        n[2 * i] = y[i] & 255, n[2 * i + 1] = y[i] >> 8;
    }
    function Lr(n, o) {
      var i = new Uint8Array(32), t = new Uint8Array(32);
      return $t(i, n), $t(t, o), Kt(i, 0, t, 0);
    }
    function mt(n) {
      var o = new Uint8Array(32);
      return $t(o, n), o[0] & 1;
    }
    function It(n, o) {
      var i;
      for (i = 0; i < 16; i++) n[i] = o[2 * i] + (o[2 * i + 1] << 8);
      n[15] &= 32767;
    }
    function Lt(n, o, i) {
      for (var t = 0; t < 16; t++) n[t] = o[t] + i[t];
    }
    function Ot(n, o, i) {
      for (var t = 0; t < 16; t++) n[t] = o[t] - i[t];
    }
    function rt(n, o, i) {
      var t, a, A = 0, y = 0, U = 0, T = 0, D = 0, F = 0, ot = 0, O = 0, K = 0, Y = 0, q = 0, Z = 0, H = 0, J = 0, _ = 0, k = 0, Q = 0, L = 0, M = 0, P = 0, N = 0, m = 0, E = 0, C = 0, B = 0, v = 0, S = 0, z = 0, G = 0, X = 0, V = 0, u = i[0], tt = i[1], at = i[2], st = i[3], $ = i[4], nt = i[5], it = i[6], Et = i[7], lt = i[8], wt = i[9], yt = i[10], gt = i[11], bt = i[12], Ct = i[13], St = i[14], Tt = i[15];
      t = o[0], A += t * u, y += t * tt, U += t * at, T += t * st, D += t * $, F += t * nt, ot += t * it, O += t * Et, K += t * lt, Y += t * wt, q += t * yt, Z += t * gt, H += t * bt, J += t * Ct, _ += t * St, k += t * Tt, t = o[1], y += t * u, U += t * tt, T += t * at, D += t * st, F += t * $, ot += t * nt, O += t * it, K += t * Et, Y += t * lt, q += t * wt, Z += t * yt, H += t * gt, J += t * bt, _ += t * Ct, k += t * St, Q += t * Tt, t = o[2], U += t * u, T += t * tt, D += t * at, F += t * st, ot += t * $, O += t * nt, K += t * it, Y += t * Et, q += t * lt, Z += t * wt, H += t * yt, J += t * gt, _ += t * bt, k += t * Ct, Q += t * St, L += t * Tt, t = o[3], T += t * u, D += t * tt, F += t * at, ot += t * st, O += t * $, K += t * nt, Y += t * it, q += t * Et, Z += t * lt, H += t * wt, J += t * yt, _ += t * gt, k += t * bt, Q += t * Ct, L += t * St, M += t * Tt, t = o[4], D += t * u, F += t * tt, ot += t * at, O += t * st, K += t * $, Y += t * nt, q += t * it, Z += t * Et, H += t * lt, J += t * wt, _ += t * yt, k += t * gt, Q += t * bt, L += t * Ct, M += t * St, P += t * Tt, t = o[5], F += t * u, ot += t * tt, O += t * at, K += t * st, Y += t * $, q += t * nt, Z += t * it, H += t * Et, J += t * lt, _ += t * wt, k += t * yt, Q += t * gt, L += t * bt, M += t * Ct, P += t * St, N += t * Tt, t = o[6], ot += t * u, O += t * tt, K += t * at, Y += t * st, q += t * $, Z += t * nt, H += t * it, J += t * Et, _ += t * lt, k += t * wt, Q += t * yt, L += t * gt, M += t * bt, P += t * Ct, N += t * St, m += t * Tt, t = o[7], O += t * u, K += t * tt, Y += t * at, q += t * st, Z += t * $, H += t * nt, J += t * it, _ += t * Et, k += t * lt, Q += t * wt, L += t * yt, M += t * gt, P += t * bt, N += t * Ct, m += t * St, E += t * Tt, t = o[8], K += t * u, Y += t * tt, q += t * at, Z += t * st, H += t * $, J += t * nt, _ += t * it, k += t * Et, Q += t * lt, L += t * wt, M += t * yt, P += t * gt, N += t * bt, m += t * Ct, E += t * St, C += t * Tt, t = o[9], Y += t * u, q += t * tt, Z += t * at, H += t * st, J += t * $, _ += t * nt, k += t * it, Q += t * Et, L += t * lt, M += t * wt, P += t * yt, N += t * gt, m += t * bt, E += t * Ct, C += t * St, B += t * Tt, t = o[10], q += t * u, Z += t * tt, H += t * at, J += t * st, _ += t * $, k += t * nt, Q += t * it, L += t * Et, M += t * lt, P += t * wt, N += t * yt, m += t * gt, E += t * bt, C += t * Ct, B += t * St, v += t * Tt, t = o[11], Z += t * u, H += t * tt, J += t * at, _ += t * st, k += t * $, Q += t * nt, L += t * it, M += t * Et, P += t * lt, N += t * wt, m += t * yt, E += t * gt, C += t * bt, B += t * Ct, v += t * St, S += t * Tt, t = o[12], H += t * u, J += t * tt, _ += t * at, k += t * st, Q += t * $, L += t * nt, M += t * it, P += t * Et, N += t * lt, m += t * wt, E += t * yt, C += t * gt, B += t * bt, v += t * Ct, S += t * St, z += t * Tt, t = o[13], J += t * u, _ += t * tt, k += t * at, Q += t * st, L += t * $, M += t * nt, P += t * it, N += t * Et, m += t * lt, E += t * wt, C += t * yt, B += t * gt, v += t * bt, S += t * Ct, z += t * St, G += t * Tt, t = o[14], _ += t * u, k += t * tt, Q += t * at, L += t * st, M += t * $, P += t * nt, N += t * it, m += t * Et, E += t * lt, C += t * wt, B += t * yt, v += t * gt, S += t * bt, z += t * Ct, G += t * St, X += t * Tt, t = o[15], k += t * u, Q += t * tt, L += t * at, M += t * st, P += t * $, N += t * nt, m += t * it, E += t * Et, C += t * lt, B += t * wt, v += t * yt, S += t * gt, z += t * bt, G += t * Ct, X += t * St, V += t * Tt, A += 38 * Q, y += 38 * L, U += 38 * M, T += 38 * P, D += 38 * N, F += 38 * m, ot += 38 * E, O += 38 * C, K += 38 * B, Y += 38 * v, q += 38 * S, Z += 38 * z, H += 38 * G, J += 38 * X, _ += 38 * V, a = 1, t = A + a + 65535, a = Math.floor(t / 65536), A = t - a * 65536, t = y + a + 65535, a = Math.floor(t / 65536), y = t - a * 65536, t = U + a + 65535, a = Math.floor(t / 65536), U = t - a * 65536, t = T + a + 65535, a = Math.floor(t / 65536), T = t - a * 65536, t = D + a + 65535, a = Math.floor(t / 65536), D = t - a * 65536, t = F + a + 65535, a = Math.floor(t / 65536), F = t - a * 65536, t = ot + a + 65535, a = Math.floor(t / 65536), ot = t - a * 65536, t = O + a + 65535, a = Math.floor(t / 65536), O = t - a * 65536, t = K + a + 65535, a = Math.floor(t / 65536), K = t - a * 65536, t = Y + a + 65535, a = Math.floor(t / 65536), Y = t - a * 65536, t = q + a + 65535, a = Math.floor(t / 65536), q = t - a * 65536, t = Z + a + 65535, a = Math.floor(t / 65536), Z = t - a * 65536, t = H + a + 65535, a = Math.floor(t / 65536), H = t - a * 65536, t = J + a + 65535, a = Math.floor(t / 65536), J = t - a * 65536, t = _ + a + 65535, a = Math.floor(t / 65536), _ = t - a * 65536, t = k + a + 65535, a = Math.floor(t / 65536), k = t - a * 65536, A += a - 1 + 37 * (a - 1), a = 1, t = A + a + 65535, a = Math.floor(t / 65536), A = t - a * 65536, t = y + a + 65535, a = Math.floor(t / 65536), y = t - a * 65536, t = U + a + 65535, a = Math.floor(t / 65536), U = t - a * 65536, t = T + a + 65535, a = Math.floor(t / 65536), T = t - a * 65536, t = D + a + 65535, a = Math.floor(t / 65536), D = t - a * 65536, t = F + a + 65535, a = Math.floor(t / 65536), F = t - a * 65536, t = ot + a + 65535, a = Math.floor(t / 65536), ot = t - a * 65536, t = O + a + 65535, a = Math.floor(t / 65536), O = t - a * 65536, t = K + a + 65535, a = Math.floor(t / 65536), K = t - a * 65536, t = Y + a + 65535, a = Math.floor(t / 65536), Y = t - a * 65536, t = q + a + 65535, a = Math.floor(t / 65536), q = t - a * 65536, t = Z + a + 65535, a = Math.floor(t / 65536), Z = t - a * 65536, t = H + a + 65535, a = Math.floor(t / 65536), H = t - a * 65536, t = J + a + 65535, a = Math.floor(t / 65536), J = t - a * 65536, t = _ + a + 65535, a = Math.floor(t / 65536), _ = t - a * 65536, t = k + a + 65535, a = Math.floor(t / 65536), k = t - a * 65536, A += a - 1 + 37 * (a - 1), n[0] = A, n[1] = y, n[2] = U, n[3] = T, n[4] = D, n[5] = F, n[6] = ot, n[7] = O, n[8] = K, n[9] = Y, n[10] = q, n[11] = Z, n[12] = H, n[13] = J, n[14] = _, n[15] = k;
    }
    function Nt(n, o) {
      rt(n, o, o);
    }
    function Ur(n, o) {
      var i = h(), t;
      for (t = 0; t < 16; t++) i[t] = o[t];
      for (t = 253; t >= 0; t--)
        Nt(i, i), t !== 2 && t !== 4 && rt(i, i, o);
      for (t = 0; t < 16; t++) n[t] = i[t];
    }
    function Jt(n, o) {
      var i = h(), t;
      for (t = 0; t < 16; t++) i[t] = o[t];
      for (t = 250; t >= 0; t--)
        Nt(i, i), t !== 1 && rt(i, i, o);
      for (t = 0; t < 16; t++) n[t] = i[t];
    }
    function tr(n, o, i) {
      var t = new Uint8Array(32), a = new Float64Array(80), A, y, U = h(), T = h(), D = h(), F = h(), ot = h(), O = h();
      for (y = 0; y < 31; y++) t[y] = o[y];
      for (t[31] = o[31] & 127 | 64, t[0] &= 248, It(a, i), y = 0; y < 16; y++)
        T[y] = a[y], F[y] = U[y] = D[y] = 0;
      for (U[0] = F[0] = 1, y = 254; y >= 0; --y)
        A = t[y >>> 3] >>> (y & 7) & 1, Xt(U, T, A), Xt(D, F, A), Lt(ot, U, D), Ot(U, U, D), Lt(D, T, F), Ot(T, T, F), Nt(F, ot), Nt(O, U), rt(U, D, U), rt(D, T, ot), Lt(ot, U, D), Ot(U, U, D), Nt(T, U), Ot(D, F, O), rt(U, D, j), Lt(U, U, F), rt(D, D, U), rt(U, F, O), rt(F, T, a), Nt(T, ot), Xt(U, T, A), Xt(D, F, A);
      for (y = 0; y < 16; y++)
        a[y + 16] = U[y], a[y + 32] = D[y], a[y + 48] = T[y], a[y + 64] = F[y];
      var K = a.subarray(32), Y = a.subarray(16);
      return Ur(K, K), rt(Y, Y, K), $t(n, Y), 0;
    }
    function ir(n, o) {
      return tr(n, o, I);
    }
    function Or(n, o) {
      return x(o, 32), ir(n, o);
    }
    function fr(n, o, i) {
      var t = new Uint8Array(32);
      return tr(t, i, o), Rt(n, d, t, Ft);
    }
    var Wt = pr, or = dr;
    function zr(n, o, i, t, a, A) {
      var y = new Uint8Array(32);
      return fr(y, a, A), Wt(n, o, i, t, y);
    }
    function Kr(n, o, i, t, a, A) {
      var y = new Uint8Array(32);
      return fr(y, a, A), or(n, o, i, t, y);
    }
    var Ar = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function kr(n, o, i, t) {
      for (var a = new Int32Array(16), A = new Int32Array(16), y, U, T, D, F, ot, O, K, Y, q, Z, H, J, _, k, Q, L, M, P, N, m, E, C, B, v, S, z = n[0], G = n[1], X = n[2], V = n[3], u = n[4], tt = n[5], at = n[6], st = n[7], $ = o[0], nt = o[1], it = o[2], Et = o[3], lt = o[4], wt = o[5], yt = o[6], gt = o[7], bt = 0; t >= 128; ) {
        for (P = 0; P < 16; P++)
          N = 8 * P + bt, a[P] = i[N + 0] << 24 | i[N + 1] << 16 | i[N + 2] << 8 | i[N + 3], A[P] = i[N + 4] << 24 | i[N + 5] << 16 | i[N + 6] << 8 | i[N + 7];
        for (P = 0; P < 80; P++)
          if (y = z, U = G, T = X, D = V, F = u, ot = tt, O = at, K = st, Y = $, q = nt, Z = it, H = Et, J = lt, _ = wt, k = yt, Q = gt, m = st, E = gt, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = (u >>> 14 | lt << 18) ^ (u >>> 18 | lt << 14) ^ (lt >>> 9 | u << 23), E = (lt >>> 14 | u << 18) ^ (lt >>> 18 | u << 14) ^ (u >>> 9 | lt << 23), C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, m = u & tt ^ ~u & at, E = lt & wt ^ ~lt & yt, C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, m = Ar[P * 2], E = Ar[P * 2 + 1], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, m = a[P % 16], E = A[P % 16], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, L = v & 65535 | S << 16, M = C & 65535 | B << 16, m = L, E = M, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = (z >>> 28 | $ << 4) ^ ($ >>> 2 | z << 30) ^ ($ >>> 7 | z << 25), E = ($ >>> 28 | z << 4) ^ (z >>> 2 | $ << 30) ^ (z >>> 7 | $ << 25), C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, m = z & G ^ z & X ^ G & X, E = $ & nt ^ $ & it ^ nt & it, C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, K = v & 65535 | S << 16, Q = C & 65535 | B << 16, m = D, E = H, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = L, E = M, C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, D = v & 65535 | S << 16, H = C & 65535 | B << 16, G = y, X = U, V = T, u = D, tt = F, at = ot, st = O, z = K, nt = Y, it = q, Et = Z, lt = H, wt = J, yt = _, gt = k, $ = Q, P % 16 === 15)
            for (N = 0; N < 16; N++)
              m = a[N], E = A[N], C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = a[(N + 9) % 16], E = A[(N + 9) % 16], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, L = a[(N + 1) % 16], M = A[(N + 1) % 16], m = (L >>> 1 | M << 31) ^ (L >>> 8 | M << 24) ^ L >>> 7, E = (M >>> 1 | L << 31) ^ (M >>> 8 | L << 24) ^ (M >>> 7 | L << 25), C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, L = a[(N + 14) % 16], M = A[(N + 14) % 16], m = (L >>> 19 | M << 13) ^ (M >>> 29 | L << 3) ^ L >>> 6, E = (M >>> 19 | L << 13) ^ (L >>> 29 | M << 3) ^ (M >>> 6 | L << 26), C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, a[N] = v & 65535 | S << 16, A[N] = C & 65535 | B << 16;
        m = z, E = $, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[0], E = o[0], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[0] = z = v & 65535 | S << 16, o[0] = $ = C & 65535 | B << 16, m = G, E = nt, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[1], E = o[1], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[1] = G = v & 65535 | S << 16, o[1] = nt = C & 65535 | B << 16, m = X, E = it, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[2], E = o[2], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[2] = X = v & 65535 | S << 16, o[2] = it = C & 65535 | B << 16, m = V, E = Et, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[3], E = o[3], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[3] = V = v & 65535 | S << 16, o[3] = Et = C & 65535 | B << 16, m = u, E = lt, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[4], E = o[4], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[4] = u = v & 65535 | S << 16, o[4] = lt = C & 65535 | B << 16, m = tt, E = wt, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[5], E = o[5], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[5] = tt = v & 65535 | S << 16, o[5] = wt = C & 65535 | B << 16, m = at, E = yt, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[6], E = o[6], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[6] = at = v & 65535 | S << 16, o[6] = yt = C & 65535 | B << 16, m = st, E = gt, C = E & 65535, B = E >>> 16, v = m & 65535, S = m >>> 16, m = n[7], E = o[7], C += E & 65535, B += E >>> 16, v += m & 65535, S += m >>> 16, B += C >>> 16, v += B >>> 16, S += v >>> 16, n[7] = st = v & 65535 | S << 16, o[7] = gt = C & 65535 | B << 16, bt += 128, t -= 128;
      }
      return t;
    }
    function Zt(n, o, i) {
      var t = new Int32Array(8), a = new Int32Array(8), A = new Uint8Array(256), y, U = i;
      for (t[0] = 1779033703, t[1] = 3144134277, t[2] = 1013904242, t[3] = 2773480762, t[4] = 1359893119, t[5] = 2600822924, t[6] = 528734635, t[7] = 1541459225, a[0] = 4089235720, a[1] = 2227873595, a[2] = 4271175723, a[3] = 1595750129, a[4] = 2917565137, a[5] = 725511199, a[6] = 4215389547, a[7] = 327033209, kr(t, a, o, i), i %= 128, y = 0; y < i; y++) A[y] = o[U - i + y];
      for (A[i] = 128, i = 256 - 128 * (i < 112 ? 1 : 0), A[i - 9] = 0, Bt(A, i - 8, U / 536870912 | 0, U << 3), kr(t, a, A, i), y = 0; y < 8; y++) Bt(n, 8 * y, t[y], a[y]);
      return 0;
    }
    function ar(n, o) {
      var i = h(), t = h(), a = h(), A = h(), y = h(), U = h(), T = h(), D = h(), F = h();
      Ot(i, n[1], n[0]), Ot(F, o[1], o[0]), rt(i, i, F), Lt(t, n[0], n[1]), Lt(F, o[0], o[1]), rt(t, t, F), rt(a, n[3], o[3]), rt(a, a, ct), rt(A, n[2], o[2]), Lt(A, A, A), Ot(y, t, i), Ot(U, A, a), Lt(T, A, a), Lt(D, t, i), rt(n[0], y, U), rt(n[1], D, T), rt(n[2], T, U), rt(n[3], y, D);
    }
    function sr(n, o, i) {
      var t;
      for (t = 0; t < 4; t++)
        Xt(n[t], o[t], i);
    }
    function kt(n, o) {
      var i = h(), t = h(), a = h();
      Ur(a, o[2]), rt(i, o[0], a), rt(t, o[1], a), $t(n, t), n[31] ^= mt(i) << 7;
    }
    function cr(n, o, i) {
      var t, a;
      for (Yt(n[0], R), Yt(n[1], l), Yt(n[2], l), Yt(n[3], R), a = 255; a >= 0; --a)
        t = i[a / 8 | 0] >> (a & 7) & 1, sr(n, o, t), ar(o, n), ar(n, n), sr(n, o, t);
    }
    function wr(n, o) {
      var i = [h(), h(), h(), h()];
      Yt(i[0], dt), Yt(i[1], vt), Yt(i[2], l), rt(i[3], dt, vt), cr(n, i, o);
    }
    function Qt(n, o, i) {
      var t = new Uint8Array(64), a = [h(), h(), h(), h()], A;
      for (i || x(o, 32), Zt(t, o, 32), t[0] &= 248, t[31] &= 127, t[31] |= 64, wr(a, t), kt(n, a), A = 0; A < 32; A++) o[A + 32] = n[A];
      return 0;
    }
    var yr = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function f(n, o) {
      var i, t, a, A;
      for (t = 63; t >= 32; --t) {
        for (i = 0, a = t - 32, A = t - 12; a < A; ++a)
          o[a] += i - 16 * o[t] * yr[a - (t - 32)], i = Math.floor((o[a] + 128) / 256), o[a] -= i * 256;
        o[a] += i, o[t] = 0;
      }
      for (i = 0, a = 0; a < 32; a++)
        o[a] += i - (o[31] >> 4) * yr[a], i = o[a] >> 8, o[a] &= 255;
      for (a = 0; a < 32; a++) o[a] -= i * yr[a];
      for (t = 0; t < 32; t++)
        o[t + 1] += o[t] >> 8, n[t] = o[t] & 255;
    }
    function r(n) {
      var o = new Float64Array(64), i;
      for (i = 0; i < 64; i++) o[i] = n[i];
      for (i = 0; i < 64; i++) n[i] = 0;
      f(n, o);
    }
    function e(n, o, i, t) {
      var a = new Uint8Array(64), A = new Uint8Array(64), y = new Uint8Array(64), U, T, D = new Float64Array(64), F = [h(), h(), h(), h()];
      Zt(a, t, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64;
      var ot = i + 64;
      for (U = 0; U < i; U++) n[64 + U] = o[U];
      for (U = 0; U < 32; U++) n[32 + U] = a[32 + U];
      for (Zt(y, n.subarray(32), i + 32), r(y), wr(F, y), kt(n, F), U = 32; U < 64; U++) n[U] = t[U];
      for (Zt(A, n, i + 64), r(A), U = 0; U < 64; U++) D[U] = 0;
      for (U = 0; U < 32; U++) D[U] = y[U];
      for (U = 0; U < 32; U++)
        for (T = 0; T < 32; T++)
          D[U + T] += A[U] * a[T];
      return f(n.subarray(32), D), ot;
    }
    function c(n, o) {
      var i = h(), t = h(), a = h(), A = h(), y = h(), U = h(), T = h();
      return Yt(n[2], l), It(n[1], o), Nt(a, n[1]), rt(A, a, et), Ot(a, a, n[2]), Lt(A, n[2], A), Nt(y, A), Nt(U, y), rt(T, U, y), rt(i, T, a), rt(i, i, A), Jt(i, i), rt(i, i, a), rt(i, i, A), rt(i, i, A), rt(n[0], i, A), Nt(t, n[0]), rt(t, t, A), Lr(t, a) && rt(n[0], n[0], At), Nt(t, n[0]), rt(t, t, A), Lr(t, a) ? -1 : (mt(n[0]) === o[31] >> 7 && Ot(n[0], R, n[0]), rt(n[3], n[0], n[1]), 0);
    }
    function p(n, o, i, t) {
      var a, A = new Uint8Array(32), y = new Uint8Array(64), U = [h(), h(), h(), h()], T = [h(), h(), h(), h()];
      if (i < 64 || c(T, t)) return -1;
      for (a = 0; a < i; a++) n[a] = o[a];
      for (a = 0; a < 32; a++) n[a + 32] = t[a];
      if (Zt(y, n, i), r(y), cr(U, T, y), wr(T, o.subarray(32)), ar(U, T), kt(A, U), i -= 64, Kt(o, 0, A, 0)) {
        for (a = 0; a < i; a++) n[a] = 0;
        return -1;
      }
      for (a = 0; a < i; a++) n[a] = o[a + 64];
      return i;
    }
    var g = 32, b = 24, W = 32, ut = 16, ht = 32, pt = 32, ft = 32, vr = 32, Yr = 32, $r = b, pe = W, de = ut, qt = 64, hr = 32, gr = 64, Hr = 32, _r = 64;
    s.lowlevel = {
      crypto_core_hsalsa20: Rt,
      crypto_stream_xor: br,
      crypto_stream: Nr,
      crypto_stream_salsa20_xor: Ht,
      crypto_stream_salsa20: Mt,
      crypto_onetimeauth: Br,
      crypto_onetimeauth_verify: Fr,
      crypto_verify_16: er,
      crypto_verify_32: Kt,
      crypto_secretbox: pr,
      crypto_secretbox_open: dr,
      crypto_scalarmult: tr,
      crypto_scalarmult_base: ir,
      crypto_box_beforenm: fr,
      crypto_box_afternm: Wt,
      crypto_box: zr,
      crypto_box_open: Kr,
      crypto_box_keypair: Or,
      crypto_hash: Zt,
      crypto_sign: e,
      crypto_sign_keypair: Qt,
      crypto_sign_open: p,
      crypto_secretbox_KEYBYTES: g,
      crypto_secretbox_NONCEBYTES: b,
      crypto_secretbox_ZEROBYTES: W,
      crypto_secretbox_BOXZEROBYTES: ut,
      crypto_scalarmult_BYTES: ht,
      crypto_scalarmult_SCALARBYTES: pt,
      crypto_box_PUBLICKEYBYTES: ft,
      crypto_box_SECRETKEYBYTES: vr,
      crypto_box_BEFORENMBYTES: Yr,
      crypto_box_NONCEBYTES: $r,
      crypto_box_ZEROBYTES: pe,
      crypto_box_BOXZEROBYTES: de,
      crypto_sign_BYTES: qt,
      crypto_sign_PUBLICKEYBYTES: hr,
      crypto_sign_SECRETKEYBYTES: gr,
      crypto_sign_SEEDBYTES: Hr,
      crypto_hash_BYTES: _r,
      gf: h,
      D: et,
      L: yr,
      pack25519: $t,
      unpack25519: It,
      M: rt,
      A: Lt,
      S: Nt,
      Z: Ot,
      pow2523: Jt,
      add: ar,
      set25519: Yt,
      modL: f,
      scalarmult: cr,
      scalarbase: wr
    };
    function te(n, o) {
      if (n.length !== g) throw new Error("bad key size");
      if (o.length !== b) throw new Error("bad nonce size");
    }
    function Ae(n, o) {
      if (n.length !== ft) throw new Error("bad public key size");
      if (o.length !== vr) throw new Error("bad secret key size");
    }
    function Pt() {
      for (var n = 0; n < arguments.length; n++)
        if (!(arguments[n] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function re(n) {
      for (var o = 0; o < n.length; o++) n[o] = 0;
    }
    s.randomBytes = function(n) {
      var o = new Uint8Array(n);
      return x(o, n), o;
    }, s.secretbox = function(n, o, i) {
      Pt(n, o, i), te(i, o);
      for (var t = new Uint8Array(W + n.length), a = new Uint8Array(t.length), A = 0; A < n.length; A++) t[A + W] = n[A];
      return pr(a, t, t.length, o, i), a.subarray(ut);
    }, s.secretbox.open = function(n, o, i) {
      Pt(n, o, i), te(i, o);
      for (var t = new Uint8Array(ut + n.length), a = new Uint8Array(t.length), A = 0; A < n.length; A++) t[A + ut] = n[A];
      return t.length < 32 || dr(a, t, t.length, o, i) !== 0 ? null : a.subarray(W);
    }, s.secretbox.keyLength = g, s.secretbox.nonceLength = b, s.secretbox.overheadLength = ut, s.scalarMult = function(n, o) {
      if (Pt(n, o), n.length !== pt) throw new Error("bad n size");
      if (o.length !== ht) throw new Error("bad p size");
      var i = new Uint8Array(ht);
      return tr(i, n, o), i;
    }, s.scalarMult.base = function(n) {
      if (Pt(n), n.length !== pt) throw new Error("bad n size");
      var o = new Uint8Array(ht);
      return ir(o, n), o;
    }, s.scalarMult.scalarLength = pt, s.scalarMult.groupElementLength = ht, s.box = function(n, o, i, t) {
      var a = s.box.before(i, t);
      return s.secretbox(n, o, a);
    }, s.box.before = function(n, o) {
      Pt(n, o), Ae(n, o);
      var i = new Uint8Array(Yr);
      return fr(i, n, o), i;
    }, s.box.after = s.secretbox, s.box.open = function(n, o, i, t) {
      var a = s.box.before(i, t);
      return s.secretbox.open(n, o, a);
    }, s.box.open.after = s.secretbox.open, s.box.keyPair = function() {
      var n = new Uint8Array(ft), o = new Uint8Array(vr);
      return Or(n, o), { publicKey: n, secretKey: o };
    }, s.box.keyPair.fromSecretKey = function(n) {
      if (Pt(n), n.length !== vr)
        throw new Error("bad secret key size");
      var o = new Uint8Array(ft);
      return ir(o, n), { publicKey: o, secretKey: new Uint8Array(n) };
    }, s.box.publicKeyLength = ft, s.box.secretKeyLength = vr, s.box.sharedKeyLength = Yr, s.box.nonceLength = $r, s.box.overheadLength = s.secretbox.overheadLength, s.sign = function(n, o) {
      if (Pt(n, o), o.length !== gr)
        throw new Error("bad secret key size");
      var i = new Uint8Array(qt + n.length);
      return e(i, n, n.length, o), i;
    }, s.sign.open = function(n, o) {
      if (Pt(n, o), o.length !== hr)
        throw new Error("bad public key size");
      var i = new Uint8Array(n.length), t = p(i, n, n.length, o);
      if (t < 0) return null;
      for (var a = new Uint8Array(t), A = 0; A < a.length; A++) a[A] = i[A];
      return a;
    }, s.sign.detached = function(n, o) {
      for (var i = s.sign(n, o), t = new Uint8Array(qt), a = 0; a < t.length; a++) t[a] = i[a];
      return t;
    }, s.sign.detached.verify = function(n, o, i) {
      if (Pt(n, o, i), o.length !== qt)
        throw new Error("bad signature size");
      if (i.length !== hr)
        throw new Error("bad public key size");
      var t = new Uint8Array(qt + n.length), a = new Uint8Array(qt + n.length), A;
      for (A = 0; A < qt; A++) t[A] = o[A];
      for (A = 0; A < n.length; A++) t[A + qt] = n[A];
      return p(a, t, t.length, i) >= 0;
    }, s.sign.keyPair = function() {
      var n = new Uint8Array(hr), o = new Uint8Array(gr);
      return Qt(n, o), { publicKey: n, secretKey: o };
    }, s.sign.keyPair.fromSecretKey = function(n) {
      if (Pt(n), n.length !== gr)
        throw new Error("bad secret key size");
      for (var o = new Uint8Array(hr), i = 0; i < o.length; i++) o[i] = n[32 + i];
      return { publicKey: o, secretKey: new Uint8Array(n) };
    }, s.sign.keyPair.fromSeed = function(n) {
      if (Pt(n), n.length !== Hr)
        throw new Error("bad seed size");
      for (var o = new Uint8Array(hr), i = new Uint8Array(gr), t = 0; t < 32; t++) i[t] = n[t];
      return Qt(o, i, !0), { publicKey: o, secretKey: i };
    }, s.sign.publicKeyLength = hr, s.sign.secretKeyLength = gr, s.sign.seedLength = Hr, s.sign.signatureLength = qt, s.hash = function(n) {
      Pt(n);
      var o = new Uint8Array(_r);
      return Zt(o, n, n.length), o;
    }, s.hash.hashLength = _r, s.verify = function(n, o) {
      return Pt(n, o), n.length === 0 || o.length === 0 || n.length !== o.length ? !1 : Dt(n, 0, o, 0, n.length) === 0;
    }, s.setPRNG = function(n) {
      x = n;
    }, function() {
      var n = typeof self < "u" ? self.crypto || self.msCrypto : null;
      if (n && n.getRandomValues) {
        var o = 65536;
        s.setPRNG(function(i, t) {
          var a, A = new Uint8Array(t);
          for (a = 0; a < t; a += o)
            n.getRandomValues(A.subarray(a, a + Math.min(t - a, o)));
          for (a = 0; a < t; a++) i[a] = A[a];
          re(A);
        });
      } else typeof qe < "u" && (n = Xe, n && n.randomBytes && s.setPRNG(function(i, t) {
        var a, A = n.randomBytes(t);
        for (a = 0; a < t; a++) i[a] = A[a];
        re(A);
      }));
    }();
  })(w.exports ? w.exports : self.nacl = self.nacl || {});
})(xe);
var $e = xe.exports;
const Mr = /* @__PURE__ */ Se($e);
var tn = Object.defineProperty, rn = (w, s, h) => s in w ? tn(w, s, { enumerable: !0, configurable: !0, writable: !0, value: h }) : w[s] = h, Wr = (w, s, h) => rn(w, typeof s != "symbol" ? s + "" : s, h);
async function en(w, s) {
  const h = w.getReader();
  let x;
  for (; !(x = await h.read()).done; )
    s(x.value);
}
function nn(w) {
  let s, h, x, d = !1;
  return function(I) {
    s === void 0 ? (s = I, h = 0, x = -1) : s = on(s, I);
    const R = s.length;
    let l = 0;
    for (; h < R; ) {
      d && (s[h] === 10 && (l = ++h), d = !1);
      let j = -1;
      for (; h < R && j === -1; ++h)
        switch (s[h]) {
          case 58:
            x === -1 && (x = h - l);
            break;
          case 13:
            d = !0;
          case 10:
            j = h;
            break;
        }
      if (j === -1)
        break;
      w(s.subarray(l, j), x), l = h, x = -1;
    }
    l === R ? s = void 0 : l !== 0 && (s = s.subarray(l), h -= l);
  };
}
function fn(w, s, h) {
  let x = ie();
  const d = new TextDecoder();
  return function(I, R) {
    if (I.length === 0)
      h == null || h(x), x = ie();
    else if (R > 0) {
      const l = d.decode(I.subarray(0, R)), j = R + (I[R + 1] === 32 ? 2 : 1), et = d.decode(I.subarray(j));
      switch (l) {
        case "data":
          x.data = x.data ? x.data + `
` + et : et;
          break;
        case "event":
          x.event = et;
          break;
        case "id":
          w(x.id = et);
          break;
        case "retry":
          const ct = parseInt(et, 10);
          isNaN(ct) || s(x.retry = ct);
          break;
      }
    }
  };
}
function on(w, s) {
  const h = new Uint8Array(w.length + s.length);
  return h.set(w), h.set(s, w.length), h;
}
function ie() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
var an = function(w, s) {
  var h = {};
  for (var x in w) Object.prototype.hasOwnProperty.call(w, x) && s.indexOf(x) < 0 && (h[x] = w[x]);
  if (w != null && typeof Object.getOwnPropertySymbols == "function")
    for (var d = 0, x = Object.getOwnPropertySymbols(w); d < x.length; d++)
      s.indexOf(x[d]) < 0 && Object.prototype.propertyIsEnumerable.call(w, x[d]) && (h[x[d]] = w[x[d]]);
  return h;
};
const Gr = "text/event-stream", sn = 1e3, fe = "last-event-id";
function cn(w, s) {
  var { signal: h, headers: x, onopen: d, onmessage: I, onclose: R, onerror: l, openWhenHidden: j, fetch: et } = s, ct = an(s, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
  return new Promise((dt, vt) => {
    const At = Object.assign({}, x);
    At.accept || (At.accept = Gr);
    let Bt;
    function Dt() {
      Bt.abort(), document.hidden || Rt();
    }
    j || document.addEventListener("visibilitychange", Dt);
    let er = sn, Kt = 0;
    function nr() {
      document.removeEventListener("visibilitychange", Dt), window.clearTimeout(Kt), Bt.abort();
    }
    h == null || h.addEventListener("abort", () => {
      nr(), dt();
    });
    const lr = et ?? window.fetch, Vt = d ?? hn;
    async function Rt() {
      var Ft;
      Bt = new AbortController();
      try {
        const Ht = await lr(w, Object.assign(Object.assign({}, ct), { headers: At, signal: Bt.signal }));
        await Vt(Ht), await en(Ht.body, nn(fn((Mt) => {
          Mt ? At[fe] = Mt : delete At[fe];
        }, (Mt) => {
          er = Mt;
        }, I))), R == null || R(), nr(), dt();
      } catch (Ht) {
        if (!Bt.signal.aborted)
          try {
            const Mt = (Ft = l == null ? void 0 : l(Ht)) !== null && Ft !== void 0 ? Ft : er;
            window.clearTimeout(Kt), Kt = window.setTimeout(Rt, Mt);
          } catch (Mt) {
            nr(), vt(Mt);
          }
      }
    }
    Rt();
  });
}
function hn(w) {
  const s = w.headers.get("content-type");
  if (!(s != null && s.startsWith(Gr)))
    throw new Error(`Expected content-type to be ${Gr}, Actual: ${s}`);
}
function un(w, s) {
  const h = new Uint8Array(w.length + s.length);
  return h.set(w), h.set(s, w.length), h;
}
function ln(w, s) {
  if (s >= w.length)
    throw new Error("Index is out of buffer");
  const h = w.slice(0, s), x = w.slice(s);
  return [h, x];
}
function Zr(w) {
  let s = "";
  return w.forEach((h) => {
    s += ("0" + (h & 255).toString(16)).slice(-2);
  }), s;
}
function Qr(w) {
  if (w.length % 2 !== 0)
    throw new Error(`Cannot convert ${w} to bytesArray`);
  const s = new Uint8Array(w.length / 2);
  for (let h = 0; h < w.length; h += 2)
    s[h / 2] = parseInt(w.slice(h, h + 2), 16);
  return s;
}
class Tr {
  constructor(s) {
    Wr(this, "nonceLength", 24), Wr(this, "keyPair"), Wr(this, "sessionId"), this.keyPair = s ? this.createKeypairFromString(s) : this.createKeypair(), this.sessionId = Zr(this.keyPair.publicKey);
  }
  createKeypair() {
    return Mr.box.keyPair();
  }
  createKeypairFromString(s) {
    return {
      publicKey: Qr(s.publicKey),
      secretKey: Qr(s.secretKey)
    };
  }
  createNonce() {
    return Mr.randomBytes(this.nonceLength);
  }
  encrypt(s, h) {
    const x = new TextEncoder().encode(s), d = this.createNonce(), I = Mr.box(x, d, h, this.keyPair.secretKey);
    return un(d, I);
  }
  decrypt(s, h) {
    const [x, d] = ln(s, this.nonceLength), I = Mr.box.open(
      d,
      x,
      h,
      this.keyPair.secretKey
    );
    if (!I)
      throw new Error(
        `Decryption error: 
 message: ${s.toString()} 
 sender pubkey: ${h.toString()} 
 keypair pubkey: ${this.keyPair.publicKey.toString()} 
 keypair secretkey: ${this.keyPair.secretKey.toString()}`
      );
    return new TextDecoder().decode(I);
  }
  stringifyKeypair() {
    return {
      publicKey: Zr(this.keyPair.publicKey),
      secretKey: Zr(this.keyPair.secretKey)
    };
  }
}
new AbortController();
const xn = "https://bridge.mz.xyz", oe = {
  CONNECT: "[MizuWallet SSE Connect]"
}, Pr = async (w) => {
  const s = new URLSearchParams();
  return s.append("client_id", w.keypair.publicKey.toString()), new Promise(async (h, x) => {
    await cn(`${xn}/bridge/events?${s.toString()}`, {
      openWhenHidden: !1,
      onopen(d) {
        return d.status === 200 ? (console.info(`${oe.CONNECT} Opened`), Promise.resolve()) : (console.error(`${oe.CONNECT} Failed to open`), Promise.reject());
      },
      onmessage(d) {
        try {
          if (d.data && d.data.startsWith("{")) {
            const I = JSON.parse(d.data);
            if (I.message) {
              const R = new Tr({
                ...w.keypair
              }), l = I.message, j = Qr(l), et = R.decrypt(
                j,
                Qr(I.from.toString())
              ), ct = JSON.parse(et);
              h(ct);
            }
          }
        } catch (I) {
          console.error(I), x(I);
        }
      }
    });
  });
}, Rr = typeof window < "u" && !!(window != null && window.TelegramWebviewProxy);
var ae, se;
typeof window < "u" && ((se = (ae = window == null ? void 0 : window.Telegram) == null ? void 0 : ae.WebApp) != null && se.openTelegramLink);
const pn = typeof window < "u" && (window == null ? void 0 : window.parent) != null && window != (window == null ? void 0 : window.parent);
function dn(w, s, h) {
  if (s || (s = function() {
  }), h === void 0 && (h = ""), console.log("[Telegram.WebView] > postEvent", w, h), (window == null ? void 0 : window.TelegramWebviewProxy) !== void 0)
    window == null || window.TelegramWebviewProxy.postEvent(w, JSON.stringify(h)), s();
  else if (pn)
    try {
      var x = "https://web.telegram.org";
      x = "*", window == null || window.parent.postMessage(
        JSON.stringify({ eventType: w, eventData: h }),
        x
      ), s();
    } catch (d) {
      s(d);
    }
  else
    s({ notAvailable: !0 });
}
const Dr = function(w) {
  var x, d, I, R;
  if (typeof window < "u" && ((d = (x = window == null ? void 0 : window.Telegram) == null ? void 0 : x.WebApp) != null && d.openTelegramLink)) {
    (R = (I = window == null ? void 0 : window.Telegram) == null ? void 0 : I.WebApp) == null || R.openTelegramLink(w);
    return;
  }
  let s = document.createElement("A");
  if (s.href = w, s.protocol != "http:" && s.protocol != "https:")
    throw console.error("[Telegram.WebApp] Url protocol is not supported", w), Error("WebAppTgUrlInvalid");
  if (s.hostname != "t.me")
    throw console.error("[Telegram.WebApp] Url host is not supported", w), Error("WebAppTgUrlInvalid");
  var h = s.pathname + s.search;
  dn("web_app_open_tg_link", !1, { path_full: h });
};
class Er {
  static buildAction(s) {
    return `${s.prefix}${s.action}_${s.params.map((h) => Er.actionParamsEncode(h)).join("_")}`;
  }
  static actionParamsEncode(s) {
    return encodeURIComponent(s).replace(/\./g, "%2E").replace(/%/g, "--");
  }
  static actionParamsDecode(s) {
    return decodeURIComponent(s.replace(/--/g, "%"));
  }
}
const rr = "mizuwallet-address", Cr = "mizuwallet-publickey";
class An {
  /**
   *
   * @param args.manifestURL Manifest URL
   */
  constructor(s) {
    /**
     * @param manifestURL
     */
    xt(this, "manifestURL");
    xt(this, "miniAppURL");
    if (!s.manifestURL) throw new Error("manifestURL is required");
    this.manifestURL = s.manifestURL, this.miniAppURL = ze(s.network);
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
    var d, I, R, l;
    if (window != null && window.localStorage && ((d = window.localStorage) != null && d.getItem(rr)) && ((I = window.localStorage) != null && I.getItem(Cr)))
      return {
        address: ((R = window.localStorage.getItem(rr)) == null ? void 0 : R.toString()) || "",
        publicKey: ((l = window.localStorage.getItem(Cr)) == null ? void 0 : l.toString()) || ""
      };
    const s = new Tr(), h = Er.buildAction({
      prefix: "R_",
      action: "miniapp-connect",
      params: [s.sessionId, this.manifestURL]
    });
    Dr(`${this.miniAppURL}?startapp=${h}`);
    const x = await Pr({
      keypair: s.stringifyKeypair()
    });
    if (window != null && window.localStorage && ge.isValid({
      input: x == null ? void 0 : x.address,
      strict: !0
    }))
      return window.localStorage.setItem(rr, x == null ? void 0 : x.address), window.localStorage.setItem(Cr, x == null ? void 0 : x.publicKey), {
        address: x == null ? void 0 : x.address,
        publicKey: x == null ? void 0 : x.publicKey
      };
    throw new Error(`${Sr.CONNECT} Error`);
  }
  disconnect() {
    window != null && window.localStorage.getItem(rr) && (window == null || window.localStorage.removeItem(rr)), window != null && window.localStorage.getItem(Cr) && (window == null || window.localStorage.removeItem(Cr));
  }
  async signAndSubmitTransaction(s) {
    if (window != null && window.localStorage.getItem(rr)) {
      const h = new Tr(), x = Er.buildAction({
        prefix: "R_",
        action: "miniapp-transaction",
        params: [h.sessionId, this.manifestURL, window == null ? void 0 : window.btoa(JSON.stringify(s))]
      });
      Dr(`${this.miniAppURL}?startapp=${x}`);
      const d = await Pr({
        keypair: h.stringifyKeypair()
      });
      if (d.cancel)
        throw new Error("User Canceled");
      return {
        hash: d.hash
      };
    } else
      throw new Error(`${Sr.TRANSACTION} No address found`);
  }
  async signTransaction(s) {
    if (window != null && window.localStorage.getItem(rr)) {
      const h = new Tr(), x = Er.buildAction({
        prefix: "R_",
        action: "miniapp-signtransaction",
        params: [h.sessionId, this.manifestURL, s.bcsToHex().toStringWithoutPrefix()]
      });
      Dr(`${this.miniAppURL}?startapp=${x}`);
      const d = await Pr({
        keypair: h.stringifyKeypair()
      });
      if (d.cancel)
        throw new Error("User Canceled");
      return {
        signature: d
      };
    } else
      throw new Error(`${Sr.TRANSACTION} No address found`);
  }
  async signMessage(s) {
    if (window != null && window.localStorage.getItem(rr)) {
      const h = new Tr(), x = Er.buildAction({
        prefix: "R_",
        action: "miniapp-signmessage",
        params: [h.sessionId, this.manifestURL, window == null ? void 0 : window.btoa(JSON.stringify(s))]
      });
      Dr(`${this.miniAppURL}?startapp=${x}`);
      const d = await Pr({
        keypair: h.stringifyKeypair()
      });
      if (d.cancel)
        throw new Error("User Canceled");
      return {
        data: d
      };
    } else
      throw new Error(`${Sr.TRANSACTION} No address found`);
  }
}
/**
  postmate - A powerful, simple, promise-based postMessage library
  @version v1.5.2
  @link https://github.com/dollarshaveclub/postmate
  @author Jacob Kelley <jakie8@gmail.com>
  @license MIT
**/
var ur = "application/x-postmate-v1+json", wn = 5, yn = 0, gn = function() {
  return ++yn;
}, Ut = function() {
  var s;
  return zt.debug ? (s = console).log.apply(s, arguments) : null;
}, mn = function(s) {
  var h = document.createElement("a");
  h.href = s;
  var x = h.protocol.length > 4 ? h.protocol : window.location.protocol, d = h.host.length ? h.port === "80" || h.port === "443" ? h.hostname : h.host : window.location.host;
  return h.origin || x + "//" + d;
}, En = {
  handshake: 1,
  "handshake-reply": 1,
  call: 1,
  emit: 1,
  reply: 1,
  request: 1
  /**
   * Ensures that a message is safe to interpret
   * @param  {Object} message The postmate message being sent
   * @param  {String|Boolean} allowedOrigin The whitelisted origin or false to skip origin check
   * @return {Boolean}
   */
}, Xr = function(s, h) {
  return !(typeof h == "string" && s.origin !== h || !s.data || typeof s.data == "object" && !("postmate" in s.data) || s.data.type !== ur || !En[s.data.postmate]);
}, bn = function(s, h) {
  var x = typeof s[h] == "function" ? s[h]() : s[h];
  return zt.Promise.resolve(x);
}, Bn = /* @__PURE__ */ function() {
  function w(h) {
    var x = this;
    this.parent = h.parent, this.frame = h.frame, this.child = h.child, this.childOrigin = h.childOrigin, this.events = {}, process.env.NODE_ENV !== "production" && (Ut("Parent: Registering API"), Ut("Parent: Awaiting messages...")), this.listener = function(d) {
      if (!Xr(d, x.childOrigin)) return !1;
      var I = ((d || {}).data || {}).value || {}, R = I.data, l = I.name;
      d.data.postmate === "emit" && (process.env.NODE_ENV !== "production" && Ut("Parent: Received event emission: " + l), l in x.events && x.events[l].call(x, R));
    }, this.parent.addEventListener("message", this.listener, !1), process.env.NODE_ENV !== "production" && Ut("Parent: Awaiting event emissions from Child");
  }
  var s = w.prototype;
  return s.get = function(x) {
    var d = this;
    return new zt.Promise(function(I) {
      var R = gn(), l = function j(et) {
        et.data.uid === R && et.data.postmate === "reply" && (d.parent.removeEventListener("message", j, !1), I(et.data.value));
      };
      d.parent.addEventListener("message", l, !1), d.child.postMessage({
        postmate: "request",
        type: ur,
        property: x,
        uid: R
      }, d.childOrigin);
    });
  }, s.call = function(x, d) {
    this.child.postMessage({
      postmate: "call",
      type: ur,
      property: x,
      data: d
    }, this.childOrigin);
  }, s.on = function(x, d) {
    this.events[x] = d;
  }, s.destroy = function() {
    process.env.NODE_ENV !== "production" && Ut("Parent: Destroying Postmate instance"), window.removeEventListener("message", this.listener, !1), this.frame.parentNode.removeChild(this.frame);
  }, w;
}(), In = /* @__PURE__ */ function() {
  function w(h) {
    var x = this;
    this.model = h.model, this.parent = h.parent, this.parentOrigin = h.parentOrigin, this.child = h.child, process.env.NODE_ENV !== "production" && (Ut("Child: Registering API"), Ut("Child: Awaiting messages...")), this.child.addEventListener("message", function(d) {
      if (Xr(d, x.parentOrigin)) {
        process.env.NODE_ENV !== "production" && Ut("Child: Received request", d.data);
        var I = d.data, R = I.property, l = I.uid, j = I.data;
        if (d.data.postmate === "call") {
          R in x.model && typeof x.model[R] == "function" && x.model[R](j);
          return;
        }
        bn(x.model, R).then(function(et) {
          return d.source.postMessage({
            property: R,
            postmate: "reply",
            type: ur,
            uid: l,
            value: et
          }, d.origin);
        });
      }
    });
  }
  var s = w.prototype;
  return s.emit = function(x, d) {
    process.env.NODE_ENV !== "production" && Ut('Child: Emitting Event "' + x + '"', d), this.parent.postMessage({
      postmate: "emit",
      type: ur,
      value: {
        name: x,
        data: d
      }
    }, this.parentOrigin);
  }, w;
}(), zt = /* @__PURE__ */ function() {
  function w(h) {
    var x = h.container, d = x === void 0 ? typeof d < "u" ? d : document.body : x, I = h.model, R = h.url, l = h.name, j = h.classListArray, et = j === void 0 ? [] : j;
    return this.parent = window, this.frame = document.createElement("iframe"), this.frame.name = l || "", this.frame.classList.add.apply(this.frame.classList, et), d.appendChild(this.frame), this.child = this.frame.contentWindow || this.frame.contentDocument.parentWindow, this.model = I || {}, this.sendHandshake(R);
  }
  var s = w.prototype;
  return s.sendHandshake = function(x) {
    var d = this, I = mn(x), R = 0, l;
    return new w.Promise(function(j, et) {
      var ct = function At(Bt) {
        return Xr(Bt, I) ? Bt.data.postmate === "handshake-reply" ? (clearInterval(l), process.env.NODE_ENV !== "production" && Ut("Parent: Received handshake reply from Child"), d.parent.removeEventListener("message", At, !1), d.childOrigin = Bt.origin, process.env.NODE_ENV !== "production" && Ut("Parent: Saving Child origin", d.childOrigin), j(new Bn(d))) : (process.env.NODE_ENV !== "production" && Ut("Parent: Invalid handshake reply"), et("Failed handshake")) : !1;
      };
      d.parent.addEventListener("message", ct, !1);
      var dt = function() {
        R++, process.env.NODE_ENV !== "production" && Ut("Parent: Sending handshake attempt " + R, {
          childOrigin: I
        }), d.child.postMessage({
          postmate: "handshake",
          type: ur,
          model: d.model
        }, I), R === wn && clearInterval(l);
      }, vt = function() {
        dt(), l = setInterval(dt, 500);
      };
      d.frame.attachEvent ? d.frame.attachEvent("onload", vt) : d.frame.onload = vt, process.env.NODE_ENV !== "production" && Ut("Parent: Loading frame", {
        url: x
      }), d.frame.src = x;
    });
  }, w;
}();
zt.debug = !1;
zt.Promise = function() {
  try {
    return window ? window.Promise : Promise;
  } catch {
    return null;
  }
}();
zt.Model = /* @__PURE__ */ function() {
  function w(h) {
    return this.child = window, this.model = h, this.parent = this.child.parent, this.sendHandshakeReply();
  }
  var s = w.prototype;
  return s.sendHandshakeReply = function() {
    var x = this;
    return new zt.Promise(function(d, I) {
      var R = function l(j) {
        if (j.data.postmate) {
          if (j.data.postmate === "handshake") {
            process.env.NODE_ENV !== "production" && Ut("Child: Received handshake from Parent"), x.child.removeEventListener("message", l, !1), process.env.NODE_ENV !== "production" && Ut("Child: Sending handshake reply to Parent"), j.source.postMessage({
              postmate: "handshake-reply",
              type: ur
            }, j.origin), x.parentOrigin = j.origin;
            var et = j.data.model;
            return et && (Object.keys(et).forEach(function(ct) {
              x.model[ct] = et[ct];
            }), process.env.NODE_ENV !== "production" && Ut("Child: Inherited and extended model from Parent")), process.env.NODE_ENV !== "production" && Ut("Child: Saving Parent origin", x.parentOrigin), d(new In(x));
          }
          return I("Handshake Reply Failed");
        }
      };
      x.child.addEventListener("message", R, !1);
    });
  }, w;
}();
const Un = "https://mizu.io", vn = () => {
  const w = document.createElement("style");
  w.innerHTML = `
	  .mizu-wallet-frame {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		border: none;
		z-index: 999999999;
		inset: 0px;
		color-scheme: light;
	  }
	`, document.head.appendChild(w);
};
class Rn {
  /**
   *
   * @param args.manifestURL Manifest URL
   */
  constructor(s) {
    xt(this, "authCode");
    xt(this, "manifestURL");
    xt(this, "network");
    xt(this, "mizuClient");
    xt(this, "provider");
    xt(this, "origin");
    if (!s.manifestURL) throw new Error("manifestURL is required");
    this.authCode = "", this.manifestURL = s.manifestURL, this.network = s.network, this.mizuClient = s.mizuClient, this.origin = Un, vn();
  }
  async connect() {
    const s = await new zt({
      container: document.body,
      // Element to inject frame into
      url: `${this.origin}/wallet/checkLogin?network=${this.network}`,
      name: "mizu-wallet-login",
      classListArray: ["mizu-wallet-frame", "mizu-wallet-login-frame"],
      model: {
        manifestURL: this.manifestURL,
        network: this.network,
        appId: this.mizuClient.appId
      }
    });
    return s.on("close-frame", () => {
      s.destroy();
    }), new Promise((h, x) => {
      s.on("login", (d) => {
        this.authCode = d.code, h({
          address: d.address,
          publicKey: ""
        });
      });
    });
  }
  async disconnect() {
    var h;
    const s = await new zt({
      container: document.body,
      // Element to inject frame into
      url: `${this.origin}/wallet/logout?network=${this.network}`,
      name: "mizu-wallet-logout",
      classListArray: ["mizu-wallet-frame", "mizu-wallet-logout-frame"],
      model: {
        manifestURL: this.manifestURL,
        network: this.network,
        appId: this.mizuClient.appId
      }
    });
    s.on("close-frame", () => {
      s.destroy();
    }), await ((h = this.mizuClient) == null ? void 0 : h.logout());
  }
  async signAndSubmitTransaction(s) {
    var h;
    try {
      const x = await ((h = this.mizuClient) == null ? void 0 : h.createOrderWithCode({
        code: this.authCode,
        payload: s
      }));
      if (!x) throw new Error("Transaction creation failed");
      const d = await new zt({
        container: document.body,
        // Element to inject frame into
        url: `${this.origin}/wallet/checkLogin?redirect_url=${encodeURIComponent("/wallet/transaction")}&network=${this.network}`,
        name: "mizu-wallet-login",
        classListArray: ["mizu-wallet-frame", "mizu-wallet-sign-frame"],
        model: {
          manifestURL: this.manifestURL,
          network: this.network,
          appId: this.mizuClient.appId,
          transactionInfo: {
            orderId: x,
            payload: s
          }
        }
      });
      return d.on("close-frame", () => {
        d.destroy();
      }), d.on("cancel", () => {
        throw new Error("User Canceled");
      }), new Promise((I, R) => {
        d.on("submitted", (l) => {
          if (l.error)
            return R(l.error);
          I({
            // hash: data.transactions?.filter((tx: any) => tx.type === 2)?.[0]?.hash || '',
            hash: l.hash
          });
        });
      });
    } catch (x) {
      throw console.error(x), x;
    }
  }
  async signTransaction(s) {
    try {
      const h = await new zt({
        container: document.body,
        // Element to inject frame into
        url: `${this.origin}/wallet/checkLogin?redirect_url=${encodeURIComponent("/wallet/sign_transaction")}&network=${this.network}`,
        name: "mizu-wallet-login",
        classListArray: ["mizu-wallet-frame", "mizu-wallet-sign-frame"],
        model: {
          manifestURL: this.manifestURL,
          network: this.network,
          appId: this.mizuClient.appId,
          transactionInfo: {
            transaction: s.bcsToHex().toStringWithoutPrefix()
          }
        }
      });
      return h.on("close-frame", () => {
        h.destroy();
      }), h.on("cancel", () => {
        throw new Error("User Canceled");
      }), new Promise((x, d) => {
        h.on("sign_transaction", (I) => {
          if (I.error)
            return d(I.error);
          x({
            ...I.result
          });
        });
      });
    } catch (h) {
      throw console.error(h), h;
    }
  }
  async signMessage(s) {
    try {
      const h = await new zt({
        container: document.body,
        // Element to inject frame into
        url: `${this.origin}/wallet/checkLogin?redirect_url=${encodeURIComponent("/wallet/sign_message")}&network=${this.network}`,
        name: "mizu-wallet-login",
        classListArray: ["mizu-wallet-frame", "mizu-wallet-sign-frame"],
        model: {
          manifestURL: this.manifestURL,
          network: this.network,
          appId: this.mizuClient.appId,
          messageInfo: {
            message: s.message,
            nonce: s.nonce
          }
        }
      });
      return h.on("close-frame", () => {
        h.destroy();
      }), h.on("cancel", () => {
        throw new Error("User Canceled");
      }), new Promise((x, d) => {
        h.on("sign_message", (I) => {
          if (I.error)
            return d(I.error);
          x({
            data: I.result
          });
        });
      });
    } catch (h) {
      throw console.error(h), h;
    }
  }
}
class Fn {
  constructor(s) {
    xt(this, "url", Je);
    xt(this, "version", "1.0.0");
    xt(this, "name", _e);
    xt(this, "icon", We);
    xt(this, "chains", Re);
    xt(this, "accounts", []);
    xt(this, "provider");
    xt(this, "mizuClient");
    xt(this, "telegramMiniAppHelper");
    xt(this, "websiteHelper");
    xt(this, "accountInfo");
    xt(this, "account", async () => this.accountInfo || {
      address: "",
      publicKey: ""
    });
    xt(this, "connect", async () => {
      var s;
      try {
        if (Rr)
          if (this.telegramMiniAppHelper)
            this.accountInfo = await this.telegramMiniAppHelper.connect();
          else
            throw new Error(`${Sr.CONNECT} Please pass a valid manifestURL`);
        else
          this.accountInfo = await ((s = this.websiteHelper) == null ? void 0 : s.connect());
        return {
          args: {
            ...this.accountInfo
          },
          status: Gt.APPROVED
        };
      } catch {
        return {
          status: Gt.REJECTED
        };
      }
    });
    xt(this, "network", async () => ({
      name: this.provider.network,
      chainId: this.provider.network === "mainnet" ? 1 : 2
    }));
    xt(this, "disconnect", async () => {
      var s, h;
      try {
        Rr ? await ((s = this.telegramMiniAppHelper) == null ? void 0 : s.disconnect()) : await ((h = this.websiteHelper) == null ? void 0 : h.disconnect());
      } catch (x) {
        throw x;
      }
    });
    xt(this, "signTransaction", async (s, h) => {
      var d, I;
      console.log(h);
      let x = {};
      if (Rr ? x = await ((d = this.telegramMiniAppHelper) == null ? void 0 : d.signTransaction(s)) : x = await ((I = this.websiteHelper) == null ? void 0 : I.signTransaction(s)), x.signature) {
        const R = new me(ue.Buffer.from(x.signature, "hex"));
        return {
          args: Ee.deserialize(R),
          status: Gt.APPROVED
        };
      } else
        return {
          status: Gt.REJECTED
        };
    });
    xt(this, "signAndSubmitTransaction", async (s) => {
      var h, x;
      try {
        let d = {};
        return Rr ? d = await ((h = this.telegramMiniAppHelper) == null ? void 0 : h.signAndSubmitTransaction(s.payload)) : d = await ((x = this.websiteHelper) == null ? void 0 : x.signAndSubmitTransaction(s.payload)), d != null && d.hash ? {
          args: d,
          status: Gt.APPROVED
        } : {
          status: Gt.REJECTED
        };
      } catch (d) {
        throw console.error(d.message || d), new ne(qr.InternalError);
      }
    });
    xt(this, "signMessage", async (s) => {
      var h, x;
      try {
        const { message: d, nonce: I, ...R } = s;
        let l = {};
        return Rr ? l = await ((h = this.telegramMiniAppHelper) == null ? void 0 : h.signMessage({
          message: d,
          nonce: I
        })) : l = await ((x = this.websiteHelper) == null ? void 0 : x.signMessage({
          message: d,
          nonce: I
        })), l != null && l.data ? {
          args: {
            ...l == null ? void 0 : l.data,
            ...R
          },
          status: Gt.APPROVED
        } : {
          status: Gt.REJECTED
        };
      } catch (d) {
        throw console.error(d.message || d), new ne(qr.InternalError);
      }
    });
    xt(this, "onAccountChange", async () => Promise.resolve());
    xt(this, "onNetworkChange", async () => Promise.resolve());
    if (!s.network) throw new Error("MizuWallet: network is required");
    this.mizuClient = new be({
      appId: s.appId || He(s.network),
      network: s.network
    }), this.provider = {
      network: s.network,
      address: ""
    }, s != null && s.manifestURL && (this.telegramMiniAppHelper = new An({
      manifestURL: s == null ? void 0 : s.manifestURL,
      network: s.network
    })), this.websiteHelper = new Rn({
      manifestURL: s.manifestURL,
      network: s.network,
      mizuClient: this.mizuClient
    });
  }
  get features() {
    return {
      "aptos:connect": {
        version: "1.0.0",
        connect: this.connect
      },
      "aptos:network": {
        version: "1.0.0",
        network: this.network
      },
      "aptos:disconnect": {
        version: "1.0.0",
        disconnect: this.disconnect
      },
      "aptos:signTransaction": {
        version: "1.0.0",
        signTransaction: this.signTransaction
      },
      "aptos:signAndSubmitTransaction": {
        version: "1.1.0",
        signAndSubmitTransaction: this.signAndSubmitTransaction
      },
      "aptos:signMessage": {
        version: "1.0.0",
        signMessage: this.signMessage
      },
      "aptos:onAccountChange": {
        version: "1.0.0",
        onAccountChange: this.onAccountChange
      },
      "aptos:onNetworkChange": {
        version: "1.0.0",
        onNetworkChange: this.onNetworkChange
      },
      "aptos:account": {
        version: "1.0.0",
        account: this.account
      }
    };
  }
}
export {
  Fn as MizuWallet
};
