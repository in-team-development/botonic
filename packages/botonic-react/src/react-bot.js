import React from 'react'
import { CoreBot } from '@botonic/core'
import { Text } from './components/text'
import { RequestContext } from './contexts'

export class ReactBot extends CoreBot {
  constructor(options) {
    super({
      defaultRoutes: [
        {
          path: '404',
          action: () => <Text>I don't understand you</Text>
        }
      ],
      renderer: args => this.renderReactActions(args),
      ...options
    })
  }

  async renderReactActions({ request, actions }) {
    let renderedActions = []
    let props
    let renderedAction
    for (let Action of actions) {
      if (Action) {
        props = Action.botonicInit ? await Action.botonicInit(request) : {}
        renderedAction = (
          <RequestContext.Provider value={request}>
            <Action {...props} />
          </RequestContext.Provider>
        )
        renderedActions.push(renderedAction)
      }
    }
    return renderedActions
  }
}
