## 介绍

发布订阅工具

## 下载

src

```html
<script src="../dist/event-bus.js"></script>
```

## 使用

### 订阅

```javascript
const eventBus = new EventBus()

eventBus.on('foo', (...args) => {
  console.log('foo', ...args)
})

// 订阅多个
eventBus.on(['foo', 'bar'], (...args) => {
  console.log(...args)
})

// 支持命名空间
eventBus.on('namespace1:foo', (...args) => {
  console.log('namespace1:foo', ...args)
})

eventBus.on(['namespace2:bar', 'namespace3:baz'], (...args) => {
  console.log(...args)
})
```

### 发布

```javascript
eventBus.emit('foo', 1, 2, 3)
```

### 订阅一次

```javascript
eventBus.once('foo', (...args) => {
  console.log('foo', ...args)
})

eventBus.once(['bar', 'baz'], (...args) => {
  console.log(...args)
})
```

### 取消订阅

```javascript
eventBus.off() // 取消所有订阅
eventBus.off(['foo', 'bar']) // 取消 foo, bar 下的所有订阅
eventBus.off(['foo', 'bar'], fn) // 取消 foo, bar 下的 fn 订阅
eventBus.off('foo') // 取消 foo 下的所有订阅
eventBus.off('foo', fn) // 取消 foo 下的 fn 订阅
```

### 支持先发布再订阅

```javascript
// 此时还没有对象订阅 foo, 不会派发，当发现有人订阅时会立即发布
eventBus.emit('foo', 1, 2, 3)

// 有对象订阅了 foo, 会立即发布
eventBus.on('foo', (...args) => {
  console.log('foo' ,...args)
})
```




