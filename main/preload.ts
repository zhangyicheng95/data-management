import { contextBridge, ipcRenderer, IpcRendererEvent, webFrame } from 'electron'
// Next.js Websocket DevServer is not listining on our custom scheme.
// This is why we need to monkey patch the global WebSocket constructor
// to use the correct DevServer url
// More info: https://github.com/HaNdTriX/next-electron-server/issues/7
if (process.env.NEXT_ELECTON_SERVER_DEV === "true") {
    webFrame.executeJavaScript(`Object.defineProperty(globalThis, 'WebSocket', {
    value: new Proxy(WebSocket, {
      construct: (Target, [url, protocols]) => {
        if (url.endsWith('/_next/webpack-hmr')) {
          // Fix the Next.js hmr client url
          return new Target("ws://localhost:${
        process.env.NEXT_ELECTON_SERVER_PORT || 3000
    }/_next/webpack-hmr", protocols)
        } else {
          return new Target(url, protocols)
        }
      }
    })
  });`);
}

const handler = {
    send(channel: string, value: unknown) {
        ipcRenderer.send(channel, value)
    },
    on(channel: string, callback: (...args: unknown[]) => void) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
            callback(...args)
        ipcRenderer.on(channel, subscription)

        return () => {
            ipcRenderer.removeListener(channel, subscription)
        }
    },
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler

