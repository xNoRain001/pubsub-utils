import getNamespace from "./get-namespace"
import createAlias from "./createAlias"

class EventBus {
  constructor () {
    this.events = {}
    this.offlineStack = {}
  }

  listen (key, fn) {

    // 订阅多个事件
    if (Array.isArray(key)) {
      for (let i = 0, l = key.length; i < l; i++) {
        this.listen(key[i], fn)
      }
      return this
    }

    const { namespace, event } = getNamespace(key)

    this.events[namespace] = this.events[namespace] || {};
    (
      this.events[namespace][event] || 
      (this.events[namespace][event] = [])
    ).push(fn)

    // 处理离线事件
    if (
      this.offlineStack[namespace]?.[event] &&
      this.offlineStack[namespace][event].length
    ) {
      let cbs = this.offlineStack[namespace][event]

      for (let i = 0, l = cbs.length; i < l; i++) {
        cbs[i]()
      }

      this.offlineStack[namespace][event] = null
    }

    return this
  }

  trigger (key, ...args) {
    const { namespace, event } = getNamespace(key)
    const cbs = this.events[namespace]?.[event]

    if (!cbs) {
      this.offlineStack[namespace] = this.offlineStack[namespace] || {};
      (
        this.offlineStack[namespace][event] || 
        (this.offlineStack[namespace][event] = [])
      ).push(() => {
        this.trigger(key, ...args)
      })
    } else {
      for (let i = 0, l = cbs.length; i < l; i++) {
        cbs[i].call(this, ...args)
      }
    }

    return this
  }

  one (key, fn) {
    if (Array.isArray(key)) {
      for (let i = 0, l = key.length; i < l; i++) {
        const k = key[i]
        const cb = (...args) => {
          fn.call(this, ...args)
          this.remove(k, fn)
        }
        cb.fn = fn
    
        this.listen(k, cb)
      }
    }
  }

  remove (key, fn) {
    if (arguments.length === 0) {
      this.events = Object.create(null)
      return this
    }

    if (Array.isArray(key, fn)) {
      for (let i = 0, k; k = key[i++];) {
        this.remove(k, fn)
      }
      return this
    }

    const { namespace, event } = getNamespace(key)
    const cbs = this.events[namespace]?.[event]

    if (!cbs) {
      return this
    } 

    if (!fn) {
      this.events[namespace][event] = null
      return this
    } 

    for (let i = cbs.length - 1; i >= 0; i--) {
      const cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return this
  }
}

createAlias(EventBus)

export default EventBus