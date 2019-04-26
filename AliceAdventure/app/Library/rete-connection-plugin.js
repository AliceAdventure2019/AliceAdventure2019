/*!
 * rete-connection-plugin v0.3.3 
 * (c) 2019  
 * Released under the ISC license.
 */
! function (t) {
    "use strict";
    var c, e = Object.prototype,
        s = e.hasOwnProperty,
        n = "function" == typeof Symbol ? Symbol : {},
        o = n.iterator || "@@iterator",
        r = n.asyncIterator || "@@asyncIterator",
        i = n.toStringTag || "@@toStringTag",
        u = "object" == typeof module,
        a = t.regeneratorRuntime;
    if (a) u && (module.exports = a);
    else {
        (a = t.regeneratorRuntime = u ? module.exports : {}).wrap = w;
        var f = "suspendedStart",
            h = "suspendedYield",
            p = "executing",
            d = "completed",
            v = {},
            l = {};
        l[o] = function () {
            return this
        };
        var y = Object.getPrototypeOf,
            m = y && y(y(S([])));
        m && m !== e && s.call(m, o) && (l = m);
        var g = x.prototype = b.prototype = Object.create(l);
        E.prototype = g.constructor = x, x.constructor = E, x[i] = E.displayName = "GeneratorFunction", a.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return !!e && (e === E || "GeneratorFunction" === (e.displayName || e.name))
        }, a.mark = function (t) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(t, x) : (t.__proto__ = x, i in t || (t[i] = "GeneratorFunction")), t.prototype = Object.create(g), t
        }, a.awrap = function (t) {
            return {
                __await: t
            }
        }, k(C.prototype), C.prototype[r] = function () {
            return this
        }, a.AsyncIterator = C, a.async = function (t, e, n, r) {
            var o = new C(w(t, e, n, r));
            return a.isGeneratorFunction(e) ? o : o.next().then(function (t) {
                return t.done ? t.value : o.next()
            })
        }, k(g), g[i] = "Generator", g[o] = function () {
            return this
        }, g.toString = function () {
            return "[object Generator]"
        }, a.keys = function (n) {
            var r = [];
            for (var t in n) r.push(t);
            return r.reverse(),
                function t() {
                    for (; r.length;) {
                        var e = r.pop();
                        if (e in n) return t.value = e, t.done = !1, t
                    }
                    return t.done = !0, t
                }
        }, a.values = S, O.prototype = {
            constructor: O,
            reset: function (t) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = c, this.done = !1, this.delegate = null, this.method = "next", this.arg = c, this.tryEntries.forEach(j), !t)
                    for (var e in this) "t" === e.charAt(0) && s.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = c)
            },
            stop: function () {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if ("throw" === t.type) throw t.arg;
                return this.rval
            },
            dispatchException: function (n) {
                if (this.done) throw n;
                var r = this;

                function t(t, e) {
                    return i.type = "throw", i.arg = n, r.next = t, e && (r.method = "next", r.arg = c), !!e
                }
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                    var o = this.tryEntries[e],
                        i = o.completion;
                    if ("root" === o.tryLoc) return t("end");
                    if (o.tryLoc <= this.prev) {
                        var u = s.call(o, "catchLoc"),
                            a = s.call(o, "finallyLoc");
                        if (u && a) {
                            if (this.prev < o.catchLoc) return t(o.catchLoc, !0);
                            if (this.prev < o.finallyLoc) return t(o.finallyLoc)
                        } else if (u) {
                            if (this.prev < o.catchLoc) return t(o.catchLoc, !0)
                        } else {
                            if (!a) throw new Error("try statement without catch or finally");
                            if (this.prev < o.finallyLoc) return t(o.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function (t, e) {
                for (var n = this.tryEntries.length - 1; 0 <= n; --n) {
                    var r = this.tryEntries[n];
                    if (r.tryLoc <= this.prev && s.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
                        var o = r;
                        break
                    }
                }
                o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                var i = o ? o.completion : {};
                return i.type = t, i.arg = e, o ? (this.method = "next", this.next = o.finallyLoc, v) : this.complete(i)
            },
            complete: function (t, e) {
                if ("throw" === t.type) throw t.arg;
                return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), v
            },
            finish: function (t) {
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t) return this.complete(n.completion, n.afterLoc), j(n), v
                }
            },
            catch: function (t) {
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                        var r = n.completion;
                        if ("throw" === r.type) {
                            var o = r.arg;
                            j(n)
                        }
                        return o
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function (t, e, n) {
                return this.delegate = {
                    iterator: S(t),
                    resultName: e,
                    nextLoc: n
                }, "next" === this.method && (this.arg = c), v
            }
        }
    }

    function w(t, e, n, r) {
        var i, u, a, c, o = e && e.prototype instanceof b ? e : b,
            s = Object.create(o.prototype),
            l = new O(r || []);
        return s._invoke = (i = t, u = n, a = l, c = f, function (t, e) {
            if (c === p) throw new Error("Generator is already running");
            if (c === d) {
                if ("throw" === t) throw e;
                return N()
            }
            for (a.method = t, a.arg = e; ;) {
                var n = a.delegate;
                if (n) {
                    var r = _(n, a);
                    if (r) {
                        if (r === v) continue;
                        return r
                    }
                }
                if ("next" === a.method) a.sent = a._sent = a.arg;
                else if ("throw" === a.method) {
                    if (c === f) throw c = d, a.arg;
                    a.dispatchException(a.arg)
                } else "return" === a.method && a.abrupt("return", a.arg);
                c = p;
                var o = L(i, u, a);
                if ("normal" === o.type) {
                    if (c = a.done ? d : h, o.arg === v) continue;
                    return {
                        value: o.arg,
                        done: a.done
                    }
                }
                "throw" === o.type && (c = d, a.method = "throw", a.arg = o.arg)
            }
        }), s
    }

    function L(t, e, n) {
        try {
            return {
                type: "normal",
                arg: t.call(e, n)
            }
        } catch (t) {
            return {
                type: "throw",
                arg: t
            }
        }
    }

    function b() { }

    function E() { }

    function x() { }

    function k(t) {
        ["next", "throw", "return"].forEach(function (e) {
            t[e] = function (t) {
                return this._invoke(e, t)
            }
        })
    }

    function C(c) {
        var e;
        this._invoke = function (n, r) {
            function t() {
                return new Promise(function (t, e) {
                    ! function e(t, n, r, o) {
                        var i = L(c[t], c, n);
                        if ("throw" !== i.type) {
                            var u = i.arg,
                                a = u.value;
                            return a && "object" == typeof a && s.call(a, "__await") ? Promise.resolve(a.__await).then(function (t) {
                                e("next", t, r, o)
                            }, function (t) {
                                e("throw", t, r, o)
                            }) : Promise.resolve(a).then(function (t) {
                                u.value = t, r(u)
                            }, o)
                        }
                        o(i.arg)
                    }(n, r, t, e)
                })
            }
            return e = e ? e.then(t, t) : t()
        }
    }

    function _(t, e) {
        var n = t.iterator[e.method];
        if (n === c) {
            if (e.delegate = null, "throw" === e.method) {
                if (t.iterator.return && (e.method = "return", e.arg = c, _(t, e), "throw" === e.method)) return v;
                e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method")
            }
            return v
        }
        var r = L(n, t.iterator, e.arg);
        if ("throw" === r.type) return e.method = "throw", e.arg = r.arg, e.delegate = null, v;
        var o = r.arg;
        return o ? o.done ? (e[t.resultName] = o.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", e.arg = c), e.delegate = null, v) : o : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, v)
    }

    function P(t) {
        var e = {
            tryLoc: t[0]
        };
        1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
    }

    function j(t) {
        var e = t.completion || {};
        e.type = "normal", delete e.arg, t.completion = e
    }

    function O(t) {
        this.tryEntries = [{
            tryLoc: "root"
        }], t.forEach(P, this), this.reset(!0)
    }

    function S(e) {
        if (e) {
            var t = e[o];
            if (t) return t.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
                var n = -1,
                    r = function t() {
                        for (; ++n < e.length;)
                            if (s.call(e, n)) return t.value = e[n], t.done = !1, t;
                        return t.value = c, t.done = !0, t
                    };
                return r.next = r
            }
        }
        return {
            next: N
        }
    }

    function N() {
        return {
            value: c,
            done: !0
        }
    }
}(function () {
    return this
}() || Function("return this")()),
    function (t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.ConnectionPlugin = e()
    }(this, function () {
        "use strict";
        ! function (t) {
            if (t && "undefined" != typeof window) {
                var e = document.createElement("style");
                e.setAttribute("type", "text/css"), e.innerHTML = t, document.head.appendChild(e)
            }
        }(".connection {\n  overflow: visible !important; }\n  .connection .main-path {\n    fill: none;\n    stroke-width: 5px;\n    stroke: steelblue; }\n");
        var t = function () {
            function r(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function (t, e, n) {
                return e && r(t.prototype, e), n && r(t, n), t
            }
        }(),
            a = function (t, e) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return function (t, e) {
                    var n = [],
                        r = !0,
                        o = !1,
                        i = void 0;
                    try {
                        for (var u, a = t[Symbol.iterator](); !(r = (u = a.next()).done) && (n.push(u.value), !e || n.length !== e); r = !0);
                    } catch (t) {
                        o = !0, i = t
                    } finally {
                        try {
                            !r && a.return && a.return()
                        } finally {
                            if (o) throw i
                        }
                    }
                    return n
                }(t, e);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            };

        function c(t) {
            return t.toLowerCase().replace(/ /g, "-")
        }

        function o(t, e) {
            var n = a(t, 4),
                r = n[0],
                o = n[1],
                i = n[2],
                u = n[3];
            return "M " + r + " " + o + " C " + (r + Math.abs(i - r) * e) + " " + o + " " + (i - Math.abs(i - r) * e) + " " + u + " " + i + " " + u
        }

        function i(t, e, n) {
            var r = {
                points: e,
                connection: n,
                d: ""
            };
            return t.trigger("connectionpath", r), r.d || o(e, .4)
        }

        function s(t) {
            var e = t.el,
                n = t.d,
                r = e.querySelector(".connection path");
            if (!r) throw new Error("Path of connection was broken");
            r.setAttribute("d", n)
        }

        function l(t) {
            var e, n = t.el,
                r = t.d,
                o = t.connection,
                i = o ? ["input-" + c(o.input.name), "output-" + c(o.output.name), "socket-input-" + c(o.input.socket.name), "socket-output-" + c(o.output.socket.name)] : [],
                u = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                a = document.createElementNS("http://www.w3.org/2000/svg", "path");
            (e = u.classList).add.apply(e, ["connection"].concat(i)), a.classList.add("main-path"), a.setAttribute("d", r), u.appendChild(a), n.appendChild(u), s({
                el: n,
                d: r
            })
        }
        var e = function () {
            function e(t) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.el = document.createElement("div"), this.editor = t, this._output = null
            }
            return t(e, [{
                key: "getPoints",
                value: function () {
                    var t = this.editor.view.area.mouse,
                        e = this.editor.view.nodes.get(this.output.node).getSocketPosition(this.output),
                        n = a(e, 2);
                    return [n[0], n[1], t.x, t.y]
                }
            }, {
                key: "updateConnection",
                value: function () {
                    if (this.output) {
                        var t = i(this.editor, this.getPoints());
                        s({
                            el: this.el,
                            d: t
                        })
                    }
                }
            }, {
                key: "renderConnection",
                value: function () {
                    if (this.output) {
                        var t = i(this.editor, this.getPoints());
                        l({
                            el: this.el,
                            d: t,
                            connection: null
                        })
                    }
                }
            }, {
                key: "output",
                get: function () {
                    return this._output
                },
                set: function (t) {
                    var e = this.editor.view.area;
                    null !== (this._output = t) ? (e.appendChild(this.el), this.renderConnection()) : this.el.parentElement && (e.removeChild(this.el), this.el.innerHTML = "")
                }
            }]), e
        }();
        return {
            install: function (u) {
                u.bind("connectionpath");
                var a = new e(u);
                u.on("rendersocket", function (t) {
                    var e = t.el,
                        n = t.input,
                        r = t.output,
                        o = !1;

                    function i(t) {
                        var e;
                        o || (t.stopPropagation(), t.preventDefault(), n ? function (t) {
                            if (null === a.output) return t.hasConnection() && (a.output = t.connections[0].output, u.removeConnection(t.connections[0]));
                            if (!t.multipleConnections && t.hasConnection() && u.removeConnection(t.connections[0]), !a.output.multipleConnections && a.output.hasConnection() && u.removeConnection(a.output.connections[0]), a.output.connectedTo(t)) {
                                var e = t.connections.find(function (t) {
                                    return t.output === a.output
                                });
                                u.removeConnection(e)
                            }
                            u.connect(a.output, t), a.output = null
                        }(n) : r && (!(e = r) || a.output || (a.output = e)))
                    }
                    e.addEventListener("mousedown", function (t) {
                        return i(t), o = !0
                    }), e.addEventListener("mouseup", i), e.addEventListener("click", function (t) {
                        return i(t), o = !1
                    }), e.addEventListener("mousemove", function () {
                        return o = !1
                    })
                }), u.on("mousemove", function () {
                    a.updateConnection()
                }), u.view.container.addEventListener("mousedown", function () {
                    a.output = null
                }), u.on("renderconnection", function (t) {
                    var e = t.el,
                        r = t.connection,
                        n = t.points,
                        o = i(u, n, r);
                    e.addEventListener("contextmenu", function (t) {
                        var e, n;
                        t.stopPropagation(), t.preventDefault(), n = (e = r).output, u.removeConnection(e), a.output = n
                    }), l({
                        el: e,
                        d: o,
                        connection: r
                    })
                }), u.on("updateconnection", function (t) {
                    var e = t.el,
                        n = t.connection,
                        r = t.points;
                    s({
                        el: e,
                        connection: n,
                        d: i(u, r, n)
                    })
                })
            },
            defaultPath: o
        }
    });
//# sourceMappingURL=connection-plugin.min.js.map