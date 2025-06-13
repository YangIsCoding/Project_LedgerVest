//   web/src/polyfills/fdidb.ts
// 只在伺服器環境需要（Edge or Node）時注入
if (typeof indexedDB === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fdb = require('fake-indexeddb');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.indexedDB   = fdb.indexedDB;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.IDBKeyRange = fdb.IDBKeyRange;
}
