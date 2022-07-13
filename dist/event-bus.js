(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventBus = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var getNamespace = function getNamespace(event) {
    var namespace = 'default';
    var parts = event.split(':');

    if (parts.length > 1) {
      namespace = parts.shift();
      event = parts[0];
    }

    return {
      namespace: namespace,
      event: event
    };
  };

  var createAlias = function createAlias(EventBus) {
    var proto = EventBus.prototype;
    proto.on = proto.listen;
    proto.emit = proto.trigger;
    proto.once = proto.one;
    proto.off = proto.remove;
  };

  var EventBus = /*#__PURE__*/function () {
    function EventBus() {
      _classCallCheck(this, EventBus);

      this.events = {};
      this.offlineStack = {};
    }

    _createClass(EventBus, [{
      key: "listen",
      value: function listen(key, fn) {
        var _this$offlineStack$na;

        // 订阅多个事件
        if (Array.isArray(key)) {
          for (var i = 0, l = key.length; i < l; i++) {
            this.listen(key[i], fn);
          }

          return this;
        }

        var _getNamespace = getNamespace(key),
            namespace = _getNamespace.namespace,
            event = _getNamespace.event;

        this.events[namespace] = this.events[namespace] || {};
        (this.events[namespace][event] || (this.events[namespace][event] = [])).push(fn); // 处理离线事件

        if ((_this$offlineStack$na = this.offlineStack[namespace]) !== null && _this$offlineStack$na !== void 0 && _this$offlineStack$na[event] && this.offlineStack[namespace][event].length) {
          var cbs = this.offlineStack[namespace][event];

          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i]();
          }

          this.offlineStack[namespace][event] = null;
        }

        return this;
      }
    }, {
      key: "trigger",
      value: function trigger(key) {
        var _this$events$namespac,
            _this = this;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var _getNamespace2 = getNamespace(key),
            namespace = _getNamespace2.namespace,
            event = _getNamespace2.event;

        var cbs = (_this$events$namespac = this.events[namespace]) === null || _this$events$namespac === void 0 ? void 0 : _this$events$namespac[event];

        if (!cbs) {
          this.offlineStack[namespace] = this.offlineStack[namespace] || {};
          (this.offlineStack[namespace][event] || (this.offlineStack[namespace][event] = [])).push(function () {
            _this.trigger.apply(_this, [key].concat(args));
          });
        } else {
          for (var i = 0, l = cbs.length; i < l; i++) {
            var _cbs$i;

            (_cbs$i = cbs[i]).call.apply(_cbs$i, [this].concat(args));
          }
        }

        return this;
      }
    }, {
      key: "one",
      value: function one(key, fn) {
        var _this2 = this;

        if (Array.isArray(key)) {
          var _loop = function _loop(i, l) {
            var k = key[i];

            var cb = function cb() {
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              fn.call.apply(fn, [_this2].concat(args));

              _this2.remove(k, fn);
            };

            cb.fn = fn;

            _this2.listen(k, cb);
          };

          for (var i = 0, l = key.length; i < l; i++) {
            _loop(i, l);
          }
        }
      }
    }, {
      key: "remove",
      value: function remove(key, fn) {
        var _this$events$namespac2;

        if (arguments.length === 0) {
          this.events = Object.create(null);
          return this;
        }

        if (Array.isArray(key, fn)) {
          for (var i = 0, k; k = key[i++];) {
            this.remove(k, fn);
          }

          return this;
        }

        var _getNamespace3 = getNamespace(key),
            namespace = _getNamespace3.namespace,
            event = _getNamespace3.event;

        var cbs = (_this$events$namespac2 = this.events[namespace]) === null || _this$events$namespac2 === void 0 ? void 0 : _this$events$namespac2[event];

        if (!cbs) {
          return this;
        }

        if (!fn) {
          this.events[namespace][event] = null;
          return this;
        }

        for (var i = cbs.length - 1; i >= 0; i--) {
          var cb = cbs[i];

          if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1);
            break;
          }
        }

        return this;
      }
    }]);

    return EventBus;
  }();

  createAlias(EventBus);

  return EventBus;

}));
