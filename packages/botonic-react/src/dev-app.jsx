import React from 'react'
import { render } from 'react-dom'

import { ReactBot } from './react-bot'
import { WebchatApp } from './webchat-app'
import { WebchatDev } from './webchat'

export class DevApp extends WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    blockInputs,
    webchatConfig = {},
    onInit,
    onOpen,
    onClose,
    onMessage,
    ...botOptions
  }) {
    super({
      theme,
      webchatConfig,
      persistentMenu,
      blockInputs,
      onInit,
      onOpen,
      onClose,
      onMessage
    })
    this.bot = new ReactBot({
      ...botOptions
    })
  }

  render(dest, optionsAtRuntime = {}) {
    let {
      theme = {},
      persistentMenu,
      blockInputs,
      webchatConfig = {},
      onInit,
      onOpen,
      onClose,
      onMessage,
      ...webchatOptions
    } = optionsAtRuntime
    theme = { ...this.theme, ...theme }
    persistentMenu = persistentMenu || this.persistentMenu
    blockInputs = blockInputs || this.blockInputs
    webchatConfig = { ...this.webchatConfig, ...webchatConfig }
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    render(
      <WebchatDev
        ref={this.webchatRef}
        {...webchatOptions}
        theme={theme}
        webchatConfig={webchatConfig}
        persistentMenu={persistentMenu}
        blockInputs={blockInputs}
        getString={(stringId, session) => this.bot.getString(stringId, session)}
        setLocale={(locale, session) => this.bot.setLocale(locale, session)}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
      />,
      dest
    )
  }

  async onUserInput({ input, session, lastRoutePath }) {
    this.onMessage && this.onMessage(this, { from: 'user', message: input })
    let resp = await this.bot.input({ input, session, lastRoutePath })
    this.onMessage &&
      resp.response.map(r => this.onMessage(this, { from: 'bot', message: r }))
    this.webchatRef.current.addBotResponse(resp)
  }
}
