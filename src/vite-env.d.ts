/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

/** Injected at build time from package.json — see `define` in vite.config.ts. */
declare const __APP_VERSION__: string

/** Vite serves any asset as a URL with `?url`; only `?init` ships a type. */
declare module '*.wasm?url' {
  const src: string
  export default src
}
