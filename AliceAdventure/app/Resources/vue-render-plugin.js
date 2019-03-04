/*!
 * rete-vue-render-plugin v0.2.6 
 * (c) 2018  
 * Released under the ISC license.
 */
! function (e) {
    "use strict";
    var s, t = Object.prototype,
        u = t.hasOwnProperty,
        n = "function" == typeof Symbol ? Symbol : {},
        o = n.iterator || "@@iterator",
        r = n.asyncIterator || "@@asyncIterator",
        i = n.toStringTag || "@@toStringTag",
        a = "object" == typeof module,
        c = e.regeneratorRuntime;
    if (c) a && (module.exports = c);
    else {
        (c = e.regeneratorRuntime = a ? module.exports : {}).wrap = b;
        var d = "suspendedStart",
            A = "suspendedYield",
            p = "executing",
            f = "completed",
            h = {},
            l = {};
        l[o] = function () {
            return this
        };
        var v = Object.getPrototypeOf,
            m = v && v(v(S([])));
        m && m !== t && u.call(m, o) && (l = m);
        var g = w.prototype = x.prototype = Object.create(l);
        C.prototype = g.constructor = w, w.constructor = C, w[i] = C.displayName = "GeneratorFunction", c.isGeneratorFunction = function (e) {
            var t = "function" == typeof e && e.constructor;
            return !!t && (t === C || "GeneratorFunction" === (t.displayName || t.name))
        }, c.mark = function (e) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e, w) : (e.__proto__ = w, i in e || (e[i] = "GeneratorFunction")), e.prototype = Object.create(g), e
        }, c.awrap = function (e) {
            return {
                __await: e
            }
        }, k(B.prototype), B.prototype[r] = function () {
            return this
        }, c.AsyncIterator = B, c.async = function (e, t, n, r) {
            var o = new B(b(e, t, n, r));
            return c.isGeneratorFunction(t) ? o : o.next().then(function (e) {
                return e.done ? e.value : o.next()
            })
        }, k(g), g[i] = "Generator", g[o] = function () {
            return this
        }, g.toString = function () {
            return "[object Generator]"
        }, c.keys = function (n) {
            var r = [];
            for (var e in n) r.push(e);
            return r.reverse(),
                function e() {
                    for (; r.length;) {
                        var t = r.pop();
                        if (t in n) return e.value = t, e.done = !1, e
                    }
                    return e.done = !0, e
                }
        }, c.values = S, I.prototype = {
            constructor: I,
            reset: function (e) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = s, this.done = !1, this.delegate = null, this.method = "next", this.arg = s, this.tryEntries.forEach(L), !e)
                    for (var t in this) "t" === t.charAt(0) && u.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = s)
            },
            stop: function () {
                this.done = !0;
                var e = this.tryEntries[0].completion;
                if ("throw" === e.type) throw e.arg;
                return this.rval
            },
            dispatchException: function (n) {
                if (this.done) throw n;
                var r = this;

                function e(e, t) {
                    return i.type = "throw", i.arg = n, r.next = e, t && (r.method = "next", r.arg = s), !!t
                }
                for (var t = this.tryEntries.length - 1; 0 <= t; --t) {
                    var o = this.tryEntries[t],
                        i = o.completion;
                    if ("root" === o.tryLoc) return e("end");
                    if (o.tryLoc <= this.prev) {
                        var a = u.call(o, "catchLoc"),
                            c = u.call(o, "finallyLoc");
                        if (a && c) {
                            if (this.prev < o.catchLoc) return e(o.catchLoc, !0);
                            if (this.prev < o.finallyLoc) return e(o.finallyLoc)
                        } else if (a) {
                            if (this.prev < o.catchLoc) return e(o.catchLoc, !0)
                        } else {
                            if (!c) throw new Error("try statement without catch or finally");
                            if (this.prev < o.finallyLoc) return e(o.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function (e, t) {
                for (var n = this.tryEntries.length - 1; 0 <= n; --n) {
                    var r = this.tryEntries[n];
                    if (r.tryLoc <= this.prev && u.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
                        var o = r;
                        break
                    }
                }
                o && ("break" === e || "continue" === e) && o.tryLoc <= t && t <= o.finallyLoc && (o = null);
                var i = o ? o.completion : {};
                return i.type = e, i.arg = t, o ? (this.method = "next", this.next = o.finallyLoc, h) : this.complete(i)
            },
            complete: function (e, t) {
                if ("throw" === e.type) throw e.arg;
                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), h
            },
            finish: function (e) {
                for (var t = this.tryEntries.length - 1; 0 <= t; --t) {
                    var n = this.tryEntries[t];
                    if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), L(n), h
                }
            },
            catch: function (e) {
                for (var t = this.tryEntries.length - 1; 0 <= t; --t) {
                    var n = this.tryEntries[t];
                    if (n.tryLoc === e) {
                        var r = n.completion;
                        if ("throw" === r.type) {
                            var o = r.arg;
                            L(n)
                        }
                        return o
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function (e, t, n) {
                return this.delegate = {
                    iterator: S(e),
                    resultName: t,
                    nextLoc: n
                }, "next" === this.method && (this.arg = s), h
            }
        }
    }

    function b(e, t, n, r) {
        var i, a, c, s, o = t && t.prototype instanceof x ? t : x,
            u = Object.create(o.prototype),
            l = new I(r || []);
        return u._invoke = (i = e, a = n, c = l, s = d, function (e, t) {
            if (s === p) throw new Error("Generator is already running");
            if (s === f) {
                if ("throw" === e) throw t;
                return N()
            }
            for (c.method = e, c.arg = t; ;) {
                var n = c.delegate;
                if (n) {
                    var r = E(n, c);
                    if (r) {
                        if (r === h) continue;
                        return r
                    }
                }
                if ("next" === c.method) c.sent = c._sent = c.arg;
                else if ("throw" === c.method) {
                    if (s === d) throw s = f, c.arg;
                    c.dispatchException(c.arg)
                } else "return" === c.method && c.abrupt("return", c.arg);
                s = p;
                var o = y(i, a, c);
                if ("normal" === o.type) {
                    if (s = c.done ? f : A, o.arg === h) continue;
                    return {
                        value: o.arg,
                        done: c.done
                    }
                }
                "throw" === o.type && (s = f, c.method = "throw", c.arg = o.arg)
            }
        }), u
    }

    function y(e, t, n) {
        try {
            return {
                type: "normal",
                arg: e.call(t, n)
            }
        } catch (e) {
            return {
                type: "throw",
                arg: e
            }
        }
    }

    function x() { }

    function C() { }

    function w() { }

    function k(e) {
        ["next", "throw", "return"].forEach(function (t) {
            e[t] = function (e) {
                return this._invoke(t, e)
            }
        })
    }

    function B(s) {
        var t;
        this._invoke = function (n, r) {
            function e() {
                return new Promise(function (e, t) {
                    ! function t(e, n, r, o) {
                        var i = y(s[e], s, n);
                        if ("throw" !== i.type) {
                            var a = i.arg,
                                c = a.value;
                            return c && "object" == typeof c && u.call(c, "__await") ? Promise.resolve(c.__await).then(function (e) {
                                t("next", e, r, o)
                            }, function (e) {
                                t("throw", e, r, o)
                            }) : Promise.resolve(c).then(function (e) {
                                a.value = e, r(a)
                            }, o)
                        }
                        o(i.arg)
                    }(n, r, e, t)
                })
            }
            return t = t ? t.then(e, e) : e()
        }
    }

    function E(e, t) {
        var n = e.iterator[t.method];
        if (n === s) {
            if (t.delegate = null, "throw" === t.method) {
                if (e.iterator.return && (t.method = "return", t.arg = s, E(e, t), "throw" === t.method)) return h;
                t.method = "throw", t.arg = new TypeError("The iterator does not provide a 'throw' method")
            }
            return h
        }
        var r = y(n, e.iterator, t.arg);
        if ("throw" === r.type) return t.method = "throw", t.arg = r.arg, t.delegate = null, h;
        var o = r.arg;
        return o ? o.done ? (t[e.resultName] = o.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", t.arg = s), t.delegate = null, h) : o : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, h)
    }

    function _(e) {
        var t = {
            tryLoc: e[0]
        };
        1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
    }

    function L(e) {
        var t = e.completion || {};
        t.type = "normal", delete t.arg, e.completion = t
    }

    function I(e) {
        this.tryEntries = [{
            tryLoc: "root"
        }], e.forEach(_, this), this.reset(!0)
    }

    function S(t) {
        if (t) {
            var e = t[o];
            if (e) return e.call(t);
            if ("function" == typeof t.next) return t;
            if (!isNaN(t.length)) {
                var n = -1,
                    r = function e() {
                        for (; ++n < t.length;)
                            if (u.call(t, n)) return e.value = t[n], e.done = !1, e;
                        return e.value = s, e.done = !0, e
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
            value: s,
            done: !0
        }
    }
}(function () {
    return this
}() || Function("return this")()),
    function (e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("vue")) : "function" == typeof define && define.amd ? define(["vue"], t) : e.VueRenderPlugin = t(e.Vue)
    }(this, function (i) {
        "use strict";
        (i = i && i.hasOwnProperty("default") ? i.default : i).filter("kebab", function (e) {
            var t = function (e) {
                return e.toLowerCase().replace(/ /g, "-")
            };
            return Array.isArray(e) ? e.map(t) : t(e)
        });
        var e = {
            props: ["node", "editor", "bindSocket", "bindControl"],
            methods: {
                inputs: function () {
                    return Array.from(this.node.inputs.values())
                },
                outputs: function () {
                    return Array.from(this.node.outputs.values())
                },
                controls: function () {
                    return Array.from(this.node.controls.values())
                },
                selected: function () {
                    return this.editor.selected.contains(this.node) ? "selected" : ""
                }
            },
            directives: {
                socket: {
                    bind: function (e, t, n) {
                        n.context.bindSocket(e, t.arg, t.value)
                    }
                },
                control: {
                    bind: function (e, t, n) {
                        t.value && n.context.bindControl(e, t.value)
                    }
                }
            }
        },
            t = {
                props: ["type", "socket"]
            },
            n = function () {
                var e = this,
                    t = e.$createElement;
                return (e._self._c || t)("div", {
                    staticClass: "socket",
                    class: e._f("kebab")([e.type, e.socket.name]),
                    attrs: {
                        title: e.socket.name + "\n" + e.socket.hint
                    }
                })
            };
        n._withStripped = !0;

        var r = function (e, t, n, r, o, i, a, c) {
            var s = ("function" == typeof n ? n.options : n) || {};
            s.__file = "/media/ni55an/1902898F7AF8DF7096/Workflow/retejs/vue-render-plugin/src/Socket.vue", s.render || (s.render = e.render, s.staticRenderFns = e.staticRenderFns, s._compiled = !0, o && (s.functional = !0)), s._scopeId = r;
            var u = void 0;
            if (t && (u = function (e) {
                t.call(this, a(e))
            }), void 0 !== u)
                if (s.functional) {
                    var l = s.render;
                    s.render = function (e, t) {
                        return u.call(t), l(e, t)
                    }
                } else {
                    var d = s.beforeCreate;
                    s.beforeCreate = d ? [].concat(d, u) : [u]
                }
            return s
        }({
            render: n,
            staticRenderFns: []
        }, function (e) {
            e && e("data-v-17bd5eff_0", {
                source: "\n.socket[data-v-17bd5eff] {\n  display: inline-block;\n  cursor: pointer;\n  border: 1px solid white;\n  border-radius: 12px;\n  width: 24px;\n  height: 24px;\n  margin: 6px;\n  vertical-align: middle;\n  background: #17a2b8;\n  z-index: 2;\n  box-sizing: border-box;\n}\n.socket[data-v-17bd5eff]:hover {\n     border-width: 4px;\n}\n.socket.multiple[data-v-17bd5eff] {\n    border-color: yellow;\n}\n.socket.output[data-v-17bd5eff] {\n    margin-right: -12px;\n}\n.socket.input[data-v-17bd5eff] {\n    margin-left: -12px;\n}\n\n/*# sourceMappingURL=Socket.vue.map */",
                map: {
                    version: 3,
                    sources: ["/media/ni55an/1902898F7AF8DF7096/Workflow/retejs/vue-render-plugin/src/Socket.vue", "Socket.vue"],
                    names: [],
                    mappings: ";AAgBA;EACA,sBAAA;EACA,gBAAA;EACA,wBAAA;EACA,oBAAA;EACA,YAAA;EACA,aAAA;EACA,YAAA;EACA,uBAAA;EACA,oBAAA;EACA,WAAA;EACA,uBAAA;CAQA;AAnBA;IAaA,kBAAA;CAAA;AAbA;IAeA,qBAAA;CAAA;AAfA;IAiBA,oBAAA;CAAA;AAjBA;IAmBA,mBAAA;CAAA;;ACdA,sCAAsC",
                    file: "Socket.vue",
                    sourcesContent: [null, ".socket {\n  display: inline-block;\n  cursor: pointer;\n  border: 1px solid white;\n  border-radius: 12px;\n  width: 24px;\n  height: 24px;\n  margin: 6px;\n  vertical-align: middle;\n  background: #17a2b8;\n  z-index: 2;\n  box-sizing: border-box; }\n  .socket:hover {\n    border-width: 4px; }\n  .socket.multiple {\n    border-color: yellow; }\n  .socket.output {\n    margin-right: -12px; }\n  .socket.input {\n    margin-left: -12px; }\n\n/*# sourceMappingURL=Socket.vue.map */"]
                },
                media: void 0
            })
        }, t, "data-v-17bd5eff", !1, 0, function e() {
            var u = document.head || document.getElementsByTagName("head")[0],
                l = e.styles || (e.styles = {}),
                d = "undefined" != typeof navigator && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
            return function (e, t) {
                if (!document.querySelector('style[data-vue-ssr-id~="' + e + '"]')) {
                    var n = d ? t.media || "default" : e,
                        r = l[n] || (l[n] = {
                            ids: [],
                            parts: [],
                            element: void 0
                        });
                    if (!r.ids.includes(e)) {
                        var o = t.source,
                            i = r.ids.length;
                        if (r.ids.push(e), d && (r.element = r.element || document.querySelector("style[data-group=" + n + "]")), !r.element) {
                            var a = r.element = document.createElement("style");
                            a.type = "text/css", t.media && a.setAttribute("media", t.media), d && (a.setAttribute("data-group", n), a.setAttribute("data-next-index", "0")), u.appendChild(a)
                        }
                        if (d && (i = parseInt(r.element.getAttribute("data-next-index")), r.element.setAttribute("data-next-index", i + 1)), r.element.styleSheet) r.parts.push(o), r.element.styleSheet.cssText = r.parts.filter(Boolean).join("\n");
                        else {
                            var c = document.createTextNode(o),
                                s = r.element.childNodes;
                            s[i] && r.element.removeChild(s[i]), s.length ? r.element.insertBefore(c, s[i]) : r.element.appendChild(c)
                        }
                    }
                }
            }
        }),
            o = {
                mixins: [e],
                components: {
                    Socket: r
                }
            },
            a = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "node",
                    class: t._f("kebab")([t.selected(), t.node.name])
                }, [n("div", {
                    staticClass: "title"
                }, [t._v(t._s(t.node.name))]), t._l(t.outputs(), function (e) {
                    return n("div", {
                        key: e.key,
                        staticClass: "output"
                    }, [n("div", {
                        staticClass: "output-title"
                    }, [t._v(t._s(e.name))]), n("Socket", {
                        directives: [{
                            name: "socket",
                            rawName: "v-socket:output",
                            value: e,
                            expression: "output",
                            arg: "output"
                        }],
                        attrs: {
                            type: "output",
                            socket: e.socket
                        }
                    })], 1)
                }), t._l(t.controls(), function (e) {
                    return n("div", {
                        directives: [{
                            name: "control",
                            rawName: "v-control",
                            value: e,
                            expression: "control"
                        }],
                        staticClass: "control"
                    })
                }), t._l(t.inputs(), function (e) {
                    return n("div", {
                        key: e.key,
                        staticClass: "input"
                    }, [n("Socket", {
                        directives: [{
                            name: "socket",
                            rawName: "v-socket:input",
                            value: e,
                            expression: "input",
                            arg: "input"
                        }],
                        attrs: {
                            type: "input",
                            socket: e.socket
                        }
                    }), n("div", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !e.showControl(),
                            expression: "!input.showControl()"
                        }],
                        staticClass: "input-title"
                    }, [t._v(t._s(e.name))]), n("div", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: e.showControl(),
                            expression: "input.showControl()"
                        }, {
                            name: "control",
                            rawName: "v-control",
                            value: e.control,
                            expression: "input.control"
                        }],
                        staticClass: "input-control"
                    })], 1)
                })], 2)
            };
        a._withStripped = !0;
        var h = function (e, t, n, r, o, i, a, c) {
            var s = ("function" == typeof n ? n.options : n) || {};
            s.__file = "/media/ni55an/1902898F7AF8DF7096/Workflow/retejs/vue-render-plugin/src/Node.vue", s.render || (s.render = e.render, s.staticRenderFns = e.staticRenderFns, s._compiled = !0, o && (s.functional = !0)), s._scopeId = r;
            var u = void 0;
            if (t && (u = function (e) {
                t.call(this, a(e))
            }), void 0 !== u)
                if (s.functional) {
                    var l = s.render;
                    s.render = function (e, t) {
                        return u.call(t), l(e, t)
                    }
                } else {
                    var d = s.beforeCreate;
                    s.beforeCreate = d ? [].concat(d, u) : [u]
                }
            return s
        }({
            render: a,
            staticRenderFns: []
        }, function (e) {
            e && e("data-v-5cb6ab71_0", {
                source: "\n.node[data-v-5cb6ab71] {\n  background: #add;\n  border-radius: 10px;\n  cursor: pointer;\n  min-width: 180px;\n  height: auto;\n  padding-bottom: 6px;\n  box-sizing: content-box;\n  position: relative;\n  user-select: none;\n}\n.node[data-v-5cb6ab71]:hover {\n    background: #84c3c3; \n}\n.node.selected[data-v-5cb6ab71] {\n    background: #ffd92c;\n    border-color: #e3c000;\n}\n.node .title[data-v-5cb6ab71] {\n    color: white;\n    font-family: sans-serif;\n    font-size: 18px;\n    padding: 8px;\n}\n.node .output[data-v-5cb6ab71] {\n    text-align: right;\n}\n.node .input[data-v-5cb6ab71] {\n    text-align: left;\n}\n.node .input-title[data-v-5cb6ab71], .node .output-title[data-v-5cb6ab71] {\n    vertical-align: middle;\n    color: white;\n    display: inline-block;\n    font-family: sans-serif;\n    font-size: 14px;\n    margin: 6px;\n    line-height: 24px;\n}\n.node .input-control[data-v-5cb6ab71] {\n    z-index: 1;\n    width: calc(100% - 36px);\n    vertical-align: middle;\n    display: inline-block;\n}\n.node .control[data-v-5cb6ab71] {\n    padding: 6px 18px;\n}\n\n/*# sourceMappingURL=Node.vue.map */",
                map: {
                    version: 3,
                    sources: ["/media/ni55an/1902898F7AF8DF7096/Workflow/retejs/vue-render-plugin/src/Node.vue", "Node.vue"],
                    names: [],
                    mappings: ";AAwCA;EACA,qCAAA;EACA,0BAAA;EACA,oBAAA;EACA,gBAAA;EACA,iBAAA;EACA,aAAA;EACA,oBAAA;EACA,wBAAA;EACA,mBAAA;EACA,kBAAA;CA6BA;AAvCA;IAYA,qCAAA;CAAA;AAZA;IAcA,oBAAA;IACA,sBAAA;CAAA;AAfA;IAiBA,aAAA;IACA,wBAAA;IACA,gBAAA;IACA,aAAA;CAAA;AApBA;IAsBA,kBAAA;CAAA;AAtBA;IAwBA,iBAAA;CAAA;AAxBA;IA0BA,uBAAA;IACA,aAAA;IACA,sBAAA;IACA,wBAAA;IACA,gBAAA;IACA,YAAA;IACA,kBAAA;CAAA;AAhCA;IAkCA,WAAA;IACA,yBAAA;IACA,uBAAA;IACA,sBAAA;CAAA;AArCA;IAuCA,kBAAA;CAAA;;ACtCA,oCAAoC",
                    file: "Node.vue",
                    sourcesContent: [null, ".node {\n  background: rgba(110, 136, 255, 0.8);\n  border: 2px solid #4e58bf;\n  border-radius: 10px;\n  cursor: pointer;\n  min-width: 180px;\n  height: auto;\n  padding-bottom: 6px;\n  box-sizing: content-box;\n  position: relative;\n  user-select: none; }\n  .node:hover {\n    background: #84c3c3;  }\n  .node.selected {\n    background: #ffd92c;\n    border-color: #e3c000; }\n  .node .title {\n    color: white;\n    font-family: sans-serif;\n    font-size: 18px;\n    padding: 8px; }\n  .node .output {\n    text-align: right; }\n  .node .input {\n    text-align: left; }\n  .node .input-title, .node .output-title {\n    vertical-align: middle;\n    color: white;\n    display: inline-block;\n    font-family: sans-serif;\n    font-size: 14px;\n    margin: 6px;\n    line-height: 24px; }\n  .node .input-control {\n    z-index: 1;\n    width: calc(100% - 36px);\n    vertical-align: middle;\n    display: inline-block; }\n  .node .control {\n    padding: 6px 18px; }\n\n/*# sourceMappingURL=Node.vue.map */"]
                },
                media: void 0
            })
        }, o, "data-v-5cb6ab71", !1, 0, function e() {
            var u = document.head || document.getElementsByTagName("head")[0],
                l = e.styles || (e.styles = {}),
                d = "undefined" != typeof navigator && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
            return function (e, t) {
                if (!document.querySelector('style[data-vue-ssr-id~="' + e + '"]')) {
                    var n = d ? t.media || "default" : e,
                        r = l[n] || (l[n] = {
                            ids: [],
                            parts: [],
                            element: void 0
                        });
                    if (!r.ids.includes(e)) {
                        var o = t.source,
                            i = r.ids.length;
                        if (r.ids.push(e), d && (r.element = r.element || document.querySelector("style[data-group=" + n + "]")), !r.element) {
                            var a = r.element = document.createElement("style");
                            a.type = "text/css", t.media && a.setAttribute("media", t.media), d && (a.setAttribute("data-group", n), a.setAttribute("data-next-index", "0")), u.appendChild(a)
                        }
                        if (d && (i = parseInt(r.element.getAttribute("data-next-index")), r.element.setAttribute("data-next-index", i + 1)), r.element.styleSheet) r.parts.push(o), r.element.styleSheet.cssText = r.parts.filter(Boolean).join("\n");
                        else {
                            var c = document.createTextNode(o),
                                s = r.element.childNodes;
                            s[i] && r.element.removeChild(s[i]), s.length ? r.element.insertBefore(c, s[i]) : r.element.appendChild(c)
                        }
                    }
                }
            }
        }),
            v = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                }
                return e
            };

        function m(e, t, n) {
            var r = new i({
                render: function (e) {
                    return e(t, {
                        props: n
                    })
                }
            }),
                o = document.createElement("div");
            return e.appendChild(o), r.$mount(o), r
        }
        var g = function (e) {
            e.vueContext && e.vueContext.$forceUpdate()
        };
        return {
            name: "vue-render",
            install: function (f, e) {
                f.on("rendernode", function (e) {
                    var t, n, r, o, i, a, c, s, u = e.el,
                        l = e.node,
                        d = e.component,
                        A = e.bindSocket,
                        p = e.bindControl;
                    d.render && "vue" !== d.render || (l._vue = (t = f, r = (n = {
                        el: u,
                        node: l,
                        component: d,
                        bindSocket: A,
                        bindControl: p
                    }).el, o = n.node, i = n.component, a = n.bindSocket, c = n.bindControl, s = m(r, i.component || h, v({}, i.props, {
                        node: o,
                        editor: t,
                        bindSocket: a,
                        bindControl: c
                    })), o.vueContext = s.$children[0], s), l.update = function () {
                        return g(l)
                    })
                }), f.on("rendercontrol", function (e) {
                    var t, n, r, o, i = e.el,
                        a = e.control;
                    a.render && "vue" !== a.render || (a._vue = (n = (t = {
                        el: i,
                        control: a
                    }).el, r = t.control, o = m(n, r.component, v({}, r.props, {
                        getData: r.getData.bind(r),
                        putData: r.putData.bind(r)
                    })), r.vueContext = o.$children[0], o), a.update = function () {
                        return g(a)
                    })
                }), f.on("connectioncreated connectionremoved", function (e) {
                    g(e.output.node), g(e.input.node)
                }), f.on("nodeselected", function () {
                    f.nodes.map(g)
                })
            },
            mixin: e,
            Node: h,
            Socket: r
        }
    });
//# sourceMappingURL=vue-render-plugin.min.js.map