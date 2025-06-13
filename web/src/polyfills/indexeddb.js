/**
 * 注入 fake-indexeddb 到 Node (SSR / build) 環境。
 * 在瀏覽器 bundle 不會被執行。
 */
import 'fake-indexeddb/auto';