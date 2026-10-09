import { defineConfig, loadEnv, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DEFAULT_MODEL = 'z-ai/glm-5.3-flash'
const ROOT = fileURLToPath(new URL('.', import.meta.url))
const TRANSCRIPTS = join(ROOT, 'transcripts')

/**
 * Local proxy to OpenRouter. The API key lives in .env and never reaches the browser.
 *   GET  /api/status -> { configured, model }
 *   POST /api/chat   -> { content } | { error }
 */
function openRouterProxy(env: Record<string, string>): Plugin {
  const key = env.OPENROUTER_API_KEY?.trim()
  const model = env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL

  const send = (res: ServerResponse, status: number, body: unknown) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
  }

  const readBody = (req: IncomingMessage) =>
    new Promise<string>((resolve, reject) => {
      let data = ''
      req.on('data', (c) => (data += c))
      req.on('end', () => resolve(data))
      req.on('error', reject)
    })

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.url === '/api/status') {
      return send(res, 200, { configured: Boolean(key), model })
    }
    if (req.url === '/api/transcript' && req.method === 'POST') {
      // Keep every AI interrogation so good lines can be curated into the fixed script later.
      try {
        const t = JSON.parse(await readBody(req))
        const safe = (s: string) => String(s).replace(/[^\w-]/g, '')
        await mkdir(TRANSCRIPTS, { recursive: true })
        await writeFile(join(TRANSCRIPTS, `${safe(t.interrogation)}_${safe(t.session)}.json`), JSON.stringify(t, null, 2))
        return send(res, 200, { ok: true })
      } catch (e) {
        return send(res, 400, { error: String(e) })
      }
    }
    if (req.url !== '/api/chat' || req.method !== 'POST') return next()
    if (!key) return send(res, 503, { error: 'OPENROUTER_API_KEY is not set in .env' })

    try {
      const { messages, temperature = 0.8 } = JSON.parse(await readBody(req))
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Crimson Crane',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 2000,
          // Dialogue needs little chain-of-thought; low effort cuts latency (some GLM endpoints can't disable it).
          reasoning: { effort: 'low', exclude: true },
        }),
      })
      const json: any = await r.json()
      if (!r.ok) return send(res, r.status, { error: json?.error?.message ?? `OpenRouter HTTP ${r.status}` })
      send(res, 200, { content: json.choices?.[0]?.message?.content ?? '' })
    } catch (e) {
      send(res, 500, { error: String(e) })
    }
  }

  return {
    name: 'openrouter-proxy',
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler),
  }
}

export default defineConfig(({ mode }) => {
  // Read .env next to this file, regardless of where the dev server was launched from.
  const env = loadEnv(mode, ROOT, '')
  return {
    plugins: [react(), openRouterProxy(env)],
    // The project may live behind a junction (e.g. Windows app folders); don't resolve through it.
    resolve: { preserveSymlinks: true },
    // Don't ignore public/: Vite only serves public files its watcher knows about.
    // Download into art-source/ first and copy, since a file mid-download can crash the watcher on Windows (EBUSY).
    server: { watch: { ignored: ['**/transcripts/**', '**/art-source/**', '**/.venv/**'] } },
  }
})
