import getNamespace from "./get-namespace"
import alias from "./alias"

class EventBus {
  constructor () {
    this.events = {}
  }

  listen (key, fn) {
    if (Array.isArray(key)) {
      for (let i = 0, l = key.length; i < l; i++) {
        this.listen(key[i], fn)
      }
    }

    const { namespace, event } = getNamespace(key)

    this.events[namespace] = this.events[namespace] || {};
    (
      this.events[namespace][event] || 
      (this.events[namespace][event] = [])
    ).push(fn)

    return this
  }

  trigger (key, ...args) {
    const { namespace, event } = getNamespace(key)
    const cbs = this.events[namespace]?.[event]

    if (cbs) {
      let i = cbs.length

      while (i--) {
        cbs[i].call(this, ...args)
      }
    }

    return this
  }

  one (key, fn) {
    if (Array.isArray(key)) {
      for (let i = 0, l = key.length; i < l; i++) {
        this.listen(key[i], fn)
      }
    }

    const cb = (...args) => {
      fn.call(this, ...args)
      this.remove(key, fn)
    }
    cb.fn = fn

    this.listen(key, cb)
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

alias(EventBus)

export default EventBus