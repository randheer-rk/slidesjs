import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import sirv from 'sirv'

export interface StaticServer {
  url: string
  close: () => Promise<void>
}

export async function serveDir(dir: string): Promise<StaticServer> {
  const handler = sirv(dir, { dev: true, single: true })
  const server = createServer((req, res) => handler(req, res))

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo

  return {
    url: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      ),
  }
}
