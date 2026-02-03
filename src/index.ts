import type { Plugin } from 'vite'

import { createRequire } from 'node:module'
import stdLibBrowser from 'node-stdlib-browser'

const require = createRequire(import.meta.url)

export const inject: Record<string, string> = {
  buffer: require.resolve('vite-plugin-node-polyfills/shims/buffer'),
  global: require.resolve('vite-plugin-node-polyfills/shims/global'),
  process: require.resolve('vite-plugin-node-polyfills/shims/process'),
}

export const alias = Object.entries(stdLibBrowser).reduce(
  (map, [name, value]) => {
    map[name] = inject[name.replace(/^node:/, '')] || value
    return map
  }, {} as Record<string, string>
)

const globalShimBanners = {
  buffer: [
    `import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'`,
    `globalThis.Buffer = globalThis.Buffer || __buffer_polyfill`,
  ],
  global: [
    `import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'`,
    `globalThis.global = globalThis.global || __global_polyfill`,
  ],
  process: [
    `import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'`,
    `globalThis.process = globalThis.process || __process_polyfill`,
  ],
}

export const stdlib = (): Plugin => {
  const globalShimPaths = [
    require.resolve('vite-plugin-node-polyfills/shims/buffer'),
    require.resolve('vite-plugin-node-polyfills/shims/global'),
    require.resolve('vite-plugin-node-polyfills/shims/process'),
  ]

  const globalShimsBanner = [
    ...globalShimBanners.buffer,
    ...globalShimBanners.global,
    ...globalShimBanners.process,
    ``,
  ].join('\n')

  return {
    name: 'vite-plugin-node-polyfills',
    config(_config, env) {
      const isDev = env.command === 'serve'

      // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md?plain=1#L203-L209
      const defines = {
        Buffer: 'Buffer',
        global: 'global',
        process: 'process',
      }

      return {
        build: {
          rolldownOptions: {
            transform: { inject },
          },
        },
        oxc: {
          inject: {
            Buffer: ['vite-plugin-node-polyfills/shims/buffer', 'default'],
            global: ['vite-plugin-node-polyfills/shims/global', 'default'],
            process: ['vite-plugin-node-polyfills/shims/process', 'default']
          }
        },
        optimizeDeps: {
          exclude: [
            ...globalShimPaths,
          ],
          rolldownOptions: {
            resolve: {
              // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md?plain=1#L150
              alias,
            },
            transform: {
              define: defines,
            },
            plugins: [
              {
                name: 'vite-plugin-node-polyfills:optimizer',
                banner: isDev ? globalShimsBanner : undefined,
              },
            ],
          },
        },
        resolve: {
          // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md?plain=1#L150
          alias,
        },
      }
    },
  }
}
