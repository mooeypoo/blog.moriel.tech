import { spawnSync } from 'node:child_process'

const npmCli = process.env.npm_execpath
if (!npmCli) throw new Error('Run this script through npm so npm_execpath is available.')

const result = spawnSync(process.execPath, [npmCli, 'ci', '--prefix', 'tools/listen-audio'], {
  env: { ...process.env, ONNXRUNTIME_NODE_INSTALL_CUDA: 'skip' },
  stdio: 'inherit',
})

if (result.error) throw result.error
process.exitCode = result.status ?? 1
