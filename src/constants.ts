import { createRequire } from 'node:module'
import stdLibBrowser from 'node-stdlib-browser'

export const require = createRequire(import.meta.url)

export const inject: Record<string, string> = {
  buffer: require.resolve('./buffer/index'),
  global: require.resolve('./global/index'),
  process: require.resolve('./process/index'),
}

export const alias = Object.entries(stdLibBrowser).reduce(
  (map, [name, value]) => {
    map[name] = inject[name.replace(/^node:/, '')] || value
    return map
  }, {} as Record<string, string>
)

export const define = {
  Buffer: 'Buffer',
  process: 'process',
  global: 'global',
}

export const banner = [
  `import __buffer_polyfill from '${inject.buffer}'`,
  `import __global_polyfill from '${inject.global}'`,
  `import __process_polyfill from '${inject.process}'`,
  `globalThis.Buffer = globalThis.Buffer || __buffer_polyfill`,
  `globalThis.global = globalThis.global || __global_polyfill`,
  `globalThis.process = globalThis.process || __process_polyfill`,
  ``,
].join('\n')

