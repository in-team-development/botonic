import { DevApp, NodeApp, WebchatApp, WebviewApp } from './index'
import { routes, plugins, locales, webchat, webviews } from 'BotonicProject'

export let app

if (process.env.BOTONIC_TARGET === 'dev') {
  app = new DevApp({
    routes,
    locales,
    plugins,
    ...webchat
  })
} else if (process.env.BOTONIC_TARGET === 'node') {
  app = new NodeApp({ routes, locales, plugins })
} else if (process.env.BOTONIC_TARGET === 'webchat') {
  app = new WebchatApp(webchat)
} else if (process.env.BOTONIC_TARGET === 'webviews') {
  app = new WebviewApp({ webviews, locales })
}
