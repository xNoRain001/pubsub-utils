const getNamespace = event => {
  let namespace = 'default'
  const parts = event.split(':')

  if (parts.length > 1) {
    namespace = parts.shift()
    event = parts[0]
  }

  return {
    namespace,
    event
  }
}

export default getNamespace