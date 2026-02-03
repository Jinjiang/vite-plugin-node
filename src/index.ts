import { createRequire } from 'node:module'
import stdLibBrowser from 'node-stdlib-browser'
// @ts-ignore
import { handleCircularDependancyWarning } from 'node-stdlib-browser/helpers/rollup/plugin'
// @ts-ignore
import esbuildPlugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import type { Plugin } from 'vite'
import {
  withoutNodeProtocol,
} from './utils'

export type ModuleName = keyof typeof stdLibBrowser
export type ModuleNameWithoutNodePrefix<T = ModuleName> = T extends `node:${infer P}` ? P : never

const require = createRequire(import.meta.url)

const shimsToInject: {
  [key in ModuleNameWithoutNodePrefix]?: string
} & { global?: string } = {
  // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md#vite
  buffer: require.resolve('./buffer/index'),
  global: require.resolve('./global/index'),
  process: require.resolve('./process/index'),
}

const globalShimPaths = Object.values(shimsToInject)

const globalShimBanners = {
  buffer: [
    `import __buffer_polyfill from '${shimsToInject.buffer}'`,
    `globalThis.Buffer = globalThis.Buffer || __buffer_polyfill`,
  ],
  global: [
    `import __global_polyfill from '${shimsToInject.global}'`,
    `globalThis.global = globalThis.global || __global_polyfill`,
  ],
  process: [
    `import __process_polyfill from '${shimsToInject.process}'`,
    `globalThis.process = globalThis.process || __process_polyfill`,
  ],
}

const globalShimsBanner = [
  globalShimBanners.buffer,
  globalShimBanners.global,
  globalShimBanners.process,
  ``,
].join('\n')

const defines = {
  Buffer: 'Buffer',
  global: 'global',
  process: 'process',
}

const polyfills = (Object.entries(stdLibBrowser) as Array<[ModuleName, string]>)
  .reduce<Record<ModuleName, string>>(
    (included, [name, value]) => {
      included[name] = shimsToInject[withoutNodeProtocol(name)] || value
      return included
    }, {} as Record<ModuleName, string>
  )

export const stdlib = (): Plugin => {
  return {
    name: 'vite-plugin-node-polyfills',
    config(config, env) {
      const isDev = env.command === 'serve'

      // TODO: check rolldown options
      // 1. build: inject shims
      // 2. esbuild: banner in dev mode
      // 3. resolve: alias polyfills
      // 4. optimizeDeps: exclude shims
      // 5. optimizeDeps: alias polyfills
      // 6. optimizeDeps: defines in dev mode
      // 7. optimizeDeps: banner in dev mode
      return {
        build: {
          rollupOptions: {
            onwarn: (warning, rollupWarn) => {
              handleCircularDependancyWarning(warning, () => {
                if (config.build?.rollupOptions?.onLog) {
                  return config.build.rollupOptions.onLog('warn', warning, rollupWarn)
                }

                rollupWarn(warning)
              })
            },
            transform: { inject: shimsToInject },
          },
        },
        esbuild: {
          // In dev, the global polyfills need to be injected as a banner in order for isolated scripts (such as Vue SFCs) to have access to them.
          banner: isDev ? globalShimsBanner : undefined,
        },
        optimizeDeps: {
          exclude: [
            ...globalShimPaths,
          ],
          rolldownOptions: {
            resolve: {
              // https://github.com/niksy/node-stdlib-browser/blob/3e7cd7f3d115ac5c4593b550e7d8c4a82a0d4ac4/README.md?plain=1#L150
              alias: {
                ...polyfills,
              },
            },
            transform: {
              define: isDev ? defines : undefined,
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
          alias: {
            ...polyfills,
          },
        },
      }
    },
  }
}