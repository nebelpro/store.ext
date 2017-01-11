!function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e.store = e.store || {}, e.store.ext = t())
}(this, function () {
    "use strict";
    function e(e, t) {
        return t = {exports: {}}, e(t, t.exports), t.exports
    }

    function t(e) {
        var t = a.get("@@EXPIRE_STORE") || [];
        t.push(e), a.set("@@EXPIRE_STORE", t)
    }

    function n() {
        var e = a.get("@@EXPIRE_STORE") || [];
        e.forEach(function (e) {
            r(e)
        })
    }

    function r(e, t) {
        return t = t || a.get(e), !(t.exp != -1 && (new Date).getTime() - t.time > t.exp) || (a.remove(e), !1)
    }

    function o(e, t) {
        if (t = t || a.get(e), t && t.read != -1) {
            var n = t.readed || 0;
            if (n >= t.read)return a.remove(e), !1;
            var r = n + 1;
            return r == t.read ? a.remove(e) : (t.readed = r, a.set(e, t)), !0
        }
        return !0
    }

    var i = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, a = e(function (e, t) {
        !function (n, r) {
            "function" == typeof define && define.amd ? define([], r) : "object" == typeof t ? e.exports = r() : n.store = r()
        }(i, function () {
            function e() {
                try {
                    return a in r && r[a]
                } catch (e) {
                    return !1
                }
            }

            var t, n = {}, r = "undefined" != typeof window ? window : i, o = r.document, a = "localStorage", u = "script";
            if (n.disabled = !1, n.version = "1.3.20", n.set = function (e, t) {
                }, n.get = function (e, t) {
                }, n.has = function (e) {
                    return void 0 !== n.get(e)
                }, n.remove = function (e) {
                }, n.clear = function () {
                }, n.transact = function (e, t, r) {
                    null == r && (r = t, t = null), null == t && (t = {});
                    var o = n.get(e, t);
                    r(o), n.set(e, o)
                }, n.getAll = function () {
                }, n.forEach = function () {
                }, n.serialize = function (e) {
                    return JSON.stringify(e)
                }, n.deserialize = function (e) {
                    if ("string" == typeof e)try {
                        return JSON.parse(e)
                    } catch (t) {
                        return e || void 0
                    }
                }, e()) t = r[a], n.set = function (e, r) {
                return void 0 === r ? n.remove(e) : (t.setItem(e, n.serialize(r)), r)
            }, n.get = function (e, r) {
                var o = n.deserialize(t.getItem(e));
                return void 0 === o ? r : o
            }, n.remove = function (e) {
                t.removeItem(e)
            }, n.clear = function () {
                t.clear()
            }, n.getAll = function () {
                var e = {};
                return n.forEach(function (t, n) {
                    e[t] = n
                }), e
            }, n.forEach = function (e) {
                for (var r = 0; r < t.length; r++) {
                    var o = t.key(r);
                    e(o, n.get(o))
                }
            }; else if (o && o.documentElement.addBehavior) {
                var c, f;
                try {
                    f = new ActiveXObject("htmlfile"), f.open(), f.write("<" + u + ">document.w=window</" + u + '><iframe src="/favicon.ico"></iframe>'), f.close(), c = f.w.frames[0].document, t = c.createElement("div")
                } catch (e) {
                    t = o.createElement("div"), c = o.body
                }
                var d = function (e) {
                    return function () {
                        var r = Array.prototype.slice.call(arguments, 0);
                        r.unshift(t), c.appendChild(t), t.addBehavior("#default#userData"), t.load(a);
                        var o = e.apply(n, r);
                        return c.removeChild(t), o
                    }
                }, l = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g"), v = function (e) {
                    return e.replace(/^d/, "___$&").replace(l, "___")
                };
                n.set = d(function (e, t, r) {
                    return t = v(t), void 0 === r ? n.remove(t) : (e.setAttribute(t, n.serialize(r)), e.save(a), r)
                }), n.get = d(function (e, t, r) {
                    t = v(t);
                    var o = n.deserialize(e.getAttribute(t));
                    return void 0 === o ? r : o
                }), n.remove = d(function (e, t) {
                    t = v(t), e.removeAttribute(t), e.save(a)
                }), n.clear = d(function (e) {
                    var t = e.XMLDocument.documentElement.attributes;
                    e.load(a);
                    for (var n = t.length - 1; n >= 0; n--)e.removeAttribute(t[n].name);
                    e.save(a)
                }), n.getAll = function (e) {
                    var t = {};
                    return n.forEach(function (e, n) {
                        t[e] = n
                    }), t
                }, n.forEach = d(function (e, t) {
                    for (var r, o = e.XMLDocument.documentElement.attributes, i = 0; r = o[i]; ++i)t(r.name, n.deserialize(e.getAttribute(r.name)))
                })
            }
            try {
                var s = "__storejs__";
                n.set(s, s), n.get(s) != s && (n.disabled = !0), n.remove(s)
            } catch (e) {
                n.disabled = !0
            }
            return n.enabled = !n.disabled, n
        })
    }), u = {
        clear: function () {
            n()
        }, remove: function (e) {
            a.remove(e)
        }, set: function (e, n, r) {
            var o = r.exp;
            void 0 === o && (o = -1);
            var i = r.read;
            void 0 === i && (i = -1);
            var u = o == -1 ? -1 : 6e4 * o;
            a.set(e, {val: n, exp: u, time: (new Date).getTime(), read: i}), u > 0 && t(e)
        }, get: function (e) {
            var t = a.get(e);
            return t && r(e, t) && o(e, t) ? t.val : null
        }
    };
    return u
});
//# sourceMappingURL=store.ext.js.map
