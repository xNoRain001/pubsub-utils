const createAlias = (EventBus) => {
  const proto = EventBus.prototype

  proto.on = proto.listen
  proto.emit = proto.trigger
  proto.once = proto.one
  proto.off = proto.remove
}

export default createAlias