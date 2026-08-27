import type { Config } from 'tailwindcss'

/**
 * The config itself stays plain JS, as Tailwind's tooling expects. This only
 * types it for the test that compiles the touch utilities.
 */
declare const config: Config
export default config
