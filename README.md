# Foo

Dual-template component library with matching React and Vue implementations.

## Getting Started
- Install dependencies: `pnpm install`
- Run examples (dev server at /examples): `pnpm dev`
- Build library: `pnpm build` or `pnpm watch` for watch mode
- Run tests: `pnpm test`
- Type check: `pnpm type-check`

## Usage
- React: `import Foo from 'foo/react'`
- Vue: `import Foo from 'foo/vue'`
- Prop: `message?: string`

## Examples
- Dev entry: [examples/index.html](examples/index.html)
- React demo: [examples/App.tsx](examples/App.tsx)
- Vue demo: [examples/App.vue](examples/App.vue)

## Tests
- Specs: [test/foo.spec.tsx](test/foo.spec.tsx)
- Config: [vitest.config.ts](vitest.config.ts), setup at [test/setup.ts](test/setup.ts)

## Build Output
- Library build and types emit to `dist/` from [src](src)
