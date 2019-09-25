import { Command } from '@oclif/command'

import { track } from '../utils'
import * as colors from 'colors'
import { spawn } from 'child_process'

export default class Run extends Command {

  async run() {
    track('Served Botonic CLI')

    try {
      const serve = spawn('npm', ['run', 'start'], {shell: true})
      console.log(colors.blue('\nServing Botonic...'))
      serve.stdout.on('data', out => {
        console.log(`${out}`)
      })
      serve.stderr.on('data', stderr => {
        console.log(colors.red(`${stderr}`))
      })
      serve.on('close', code => {
        console.log(colors.red(`child process exited with code ${code}`))
      })
    } catch (e) {
      console.log(e)
    }
  }
}
