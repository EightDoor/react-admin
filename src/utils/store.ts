import localforage from 'localforage';

const store = localforage.createInstance({
  name: "react-admin-vite"
})


export { store }