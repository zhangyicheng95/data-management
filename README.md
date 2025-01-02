## 数据管理分析软件

`基于next 12 + react18 + electron搭建`

## Usage

```basic
$ cd my-app

# using yarn or npm
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/
$ yarn (or `npm install`)

# using pnpm
pnpm config set electron_mirror https://npmmirror.com/mirrors/electron/
$ pnpm install --shamefully-hoist
```

### Use it

```
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```

### Create a new App

```
# with npx
$ npx create-nextron-app my-app --example with-ant-design

# with yarn
$ yarn create nextron-app my-app --example with-ant-design

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-ant-design
```

## Resources

<https://ant.design>
