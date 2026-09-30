import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function run(name, cwd) {
  const child = spawn('npm', ['run', 'dev'], {
    cwd: resolve(root, cwd),
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`)
    }
  })
}

run('backend', 'backend')
run('frontend', 'frontend')
