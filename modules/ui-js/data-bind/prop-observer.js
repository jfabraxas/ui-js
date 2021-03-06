// Generated by CoffeeScript 1.10.0
var Map, PropObserver;

Map = require('ui-js/polyfill/map');

module.exports = PropObserver = (function() {
  var handlerStores;

  handlerStores = new Map();

  function PropObserver(context1, prop1, handler1, init) {
    var handlers;
    this.context = context1;
    this.prop = prop1;
    this.handler = handler1;
    if (init == null) {
      init = false;
    }
    this.destroyed = false;
    this.propCanChange = this.isPropCanChange();
    if (this.propCanChange) {
      handlers = this.getHandlersFor(this.context, this.prop);
      handlers.push(this.handler);
    }
    if (init) {
      this.handler(this.context[this.prop]);
    }
    return;
  }

  PropObserver.prototype.isPropCanChange = function() {
    if (this.context instanceof File) {
      return false;
    }
    return true;
  };

  PropObserver.prototype.destroy = function() {
    if (this.destroyed) {
      return;
    }
    if (this.propCanChange) {
      this.removeHandlerFor(this.context, this.prop, this.handler);
    }
    this.destroyed = true;
  };

  PropObserver.prototype.getHandlersFor = function(context, prop) {
    if (!this.hasHandlersFor(context, prop)) {
      this.setHandlersFor(context, prop);
    }
    return handlerStores.get(context)[prop];
  };

  PropObserver.prototype.hasHandlersFor = function(context, prop) {
    var handlerStore;
    if (!handlerStores.has(context)) {
      return false;
    }
    handlerStore = handlerStores.get(context);
    return !!handlerStore[prop];
  };

  PropObserver.prototype.removeHandlerFor = function(context, prop, handler) {
    var handlers, index;
    handlers = this.getHandlersFor(context, prop);
    index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    if (!handlers.length) {
      this.clearHandlersFor(context, prop);
    }
  };

  PropObserver.prototype.clearHandlersFor = function(context, prop) {
    var descriptor, handlerStore, value;
    handlerStore = handlerStores.get(context);
    descriptor = handlerStore[prop].descriptor;
    value = context[prop];
    delete handlerStore[prop];
    if (!descriptor) {
      if (value == null) {
        delete context[prop];
      }
      Object.defineProperty(context, prop, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } else if (descriptor.set) {
      Object.defineProperty(context, prop, descriptor);
    } else {
      descriptor.value = context[prop];
      Object.defineProperty(context, prop, descriptor);
    }
    if (!Object.keys(handlerStore).length) {
      handlerStores["delete"](context);
    }
  };

  PropObserver.prototype.setHandlersFor = function(context, prop) {
    var descriptor, getter, handlerStore, handlers, setter;
    if (!handlerStores.has(context)) {
      handlerStores.set(context, {});
    }
    handlers = [];
    descriptor = this.getDescriptor(context, prop);
    handlerStore = handlerStores.get(context);
    handlers.descriptor = descriptor;
    handlerStore[prop] = handlers;
    if (descriptor && descriptor.get && descriptor.set) {
      getter = descriptor.get;
      setter = descriptor.set;
      this.setHandlerForSetterMode(context, prop, getter, setter, handlers);
    } else {
      this.setHandlerForValueMode(context, prop, handlers);
    }
  };

  PropObserver.prototype.setHandlerForSetterMode = function(context, prop, getter, setter, handlers) {
    Object.defineProperty(context, prop, {
      configurable: true,
      get: function() {
        return getter.call(this);
      },
      set: function(val) {
        var change, handler, i, len, oldValue, ref, value;
        value = getter.call(this);
        if ((val !== val) && (value !== value)) {
          return;
        }
        change = val !== value;
        oldValue = value;
        setter.call(this, val);
        if (change) {
          ref = handlers.slice();
          for (i = 0, len = ref.length; i < len; i++) {
            handler = ref[i];
            handler(val, oldValue);
          }
        }
        return val;
      }
    });
  };

  PropObserver.prototype.setHandlerForValueMode = function(context, prop, handlers) {
    var value;
    value = context[prop];
    Object.defineProperty(context, prop, {
      configurable: true,
      get: function() {
        return value;
      },
      set: function(val) {
        var change, handler, i, len, oldValue, ref;
        if ((val !== val) && (value !== value)) {
          return;
        }
        change = val !== value;
        oldValue = value;
        value = val;
        if (change) {
          ref = handlers.slice();
          for (i = 0, len = ref.length; i < len; i++) {
            handler = ref[i];
            handler(value, oldValue);
          }
        }
        return val;
      }
    });
  };

  PropObserver.prototype.getDescriptor = function(context, prop) {
    var descriptor;
    if (!(prop in context)) {
      return null;
    }
    while (context) {
      descriptor = Object.getOwnPropertyDescriptor(context, prop);
      if (descriptor) {
        return descriptor;
      }
      context = Object.getPrototypeOf(context);
    }
    return null;
  };

  return PropObserver;

})();

//# sourceMappingURL=prop-observer.js.map
