import localforage from 'localforage'

const store = localforage.createInstance({
  name: 'react-admin',
})

export { store }
