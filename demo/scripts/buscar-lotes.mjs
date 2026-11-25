// Etapa 1 do vídeo: procura estacionamentos a céu aberto perto do centro de cada local,
// como candidatos neutros a "lote plausível vazio ou de baixa altura" (DEMO_VIDEO.md, seção 2).
// Uma consulta por local; respostas guardadas em demo/data/cache/.

import { access, writeFile } from 'node:fs/promises'

const IDENTIFICACAO = 'carbono-a4-a5-demo/0.1 (+https://github.com/obrunoheringer1/carbono-a4-a5)'
const LOCAIS = {
  rio: { nome: 'Centro, Rio de Janeiro', lat: -22.9043934, lon: -43.1830653 },
  friburgo: { nome: 'Nova Friburgo', lat: -22.2800004, lon: -42.5325303 },
}

const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter']

async function consultar(consulta) {
  for (const servidor of SERVIDORES) {
    for (let tentativa = 1; tentativa <= 2; tentativa++) {
      const r = await fetch(servidor, {
        method: 'POST',
        headers: { 'User-Agent': IDENTIFICACAO, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: consulta }),
      }).catch(() => null)
      if (r?.ok) return { dados: await r.json(), servidor }
      console.warn(`  ${servidor}: ${r?.status ?? 'sem resposta'} (tentativa ${tentativa})`)
      await new Promise((ok) => setTimeout(ok, 20_000))
    }
  }
  throw new Error('Overpass indisponível')
}

for (const [id, l] of Object.entries(LOCAIS)) {
  const arquivo = new URL(`../data/cache/lotes-${id}.json`, import.meta.url)
  if (await access(arquivo).then(() => true, () => false)) {
    console.log(id, 'já em cache')
    continue
  }
  const consulta = `[out:json][timeout:60];
way["amenity"="parking"]["parking"!~"multi-storey|underground|rooftop"](around:1200,${l.lat},${l.lon});
out geom tags;`
  const { dados, servidor } = await consultar(consulta)
  await writeFile(arquivo, JSON.stringify({ consultadoEm: new Date().toISOString(), servidor, consulta, dados }))
  console.log(id, servidor, dados.elements.length, 'estacionamentos')
  await new Promise((ok) => setTimeout(ok, 5000))
}
