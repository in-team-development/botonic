import { Command, flags } from '@oclif/command'

import { track } from '../utils'
import * as colors from 'colors'

import { spawn, exec } from 'child_process'

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic serve\n> Project is running at http://localhost:8080/`
  ]

  static flags = {}

  static args = []

  private botonic: any

  async run() {
    track('Served Botonic CLI')
    const { args, flags } = this.parse(Run)

    try {
      exec('npm run start'])
      console.log(colors.blue('\nServing Botonic...'))
    } catch (e) {
      console.log(e)
    }
  }
}
