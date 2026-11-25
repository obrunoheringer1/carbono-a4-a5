// Etapa 2 do vídeo: fornecedores e rotas dos dois casos, com as mesmas regras da ferramenta
// (src/dados/fornecedores.ts e src/dados/rotas.ts):
// - base fixa public/dados/fornecedores-br.json, raio igual nos dois casos;
// - 10 candidatos mais próximos em linha reta por categoria;
// - UMA matriz de distâncias do OSRM por caso; vence a menor distância por estrada;
// - geometria só das rotas escolhidas; no máximo 1 requisição por segundo.
// Respostas guardadas em demo/data/cache/ e reaproveitadas (não consulta de novo).

import { access, readFile, writeFile } from 'node:fs/promises'

const RAIO_KM = 200
const CANDIDATOS = 10
const OSRM = ['https://router.project-osrm.org', 'https://routing.openstreetmap.de/routed-car']
const CATEGORIAS = ['concreto', 'aco', 'madeira', 'agregados', 'geral', 'residuos']

const ler = async (caminho) => JSON.parse(await readFile(new URL(caminho, import.meta.url), 'utf8'))
const base = await ler('../../public/dados/fornecedores-br.json')
const { casos } = await ler('../data/lotes.json')

const rad = (x) => (x * Math.PI) / 180
function distanciaKm([lon1, lat1], [lon2, lat2]) {
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2
  return 2 * 6371.0088 * Math.asin(Math.sqrt(a)) // mesmo raio da Terra do Turf
}
const coords = (lista) => lista.map(([lon, lat]) => `${lon.toFixed(6)},${lat.toFixed(6)}`).join(';')
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms))

async function osrm(caminho) {
  for (const servidor of OSRM) {
    await esperar(1100)
    const r = await fetch(`${servidor}${caminho}`).catch(() => null)
    if (r?.ok) {
      const dados = await r.json()
      if (dados.code === 'Ok') return { dados, servidor, consultadoEm: new Date().toISOString() }
    }
    console.warn(`  ${servidor}: ${r?.status ?? 'sem resposta'}`)
  }
  throw new Error('OSRM indisponível')
}

for (const [id, caso] of Object.entries(casos)) {
  const arquivo = new URL(`../data/cache/rotas-${id}.json`, import.meta.url)
  if (await access(arquivo).then(() => true, () => false)) {
    console.log(id, 'já em cache')
    continue
  }
  const centro = caso.centro
  const candidatos = []
  for (const cat of CATEGORIAS) {
    base.pontos
      .filter((p) => p.categoria === cat)
      .map((p) => ({ ...p, retaKm: distanciaKm(centro, [p.lon, p.lat]) }))
      .filter((p) => p.retaKm <= RAIO_KM)
      .sort((a, b) => a.retaKm - b.retaKm)
      .slice(0, CANDIDATOS)
      .forEach((p) => candidatos.push(p))
  }

  const matriz = await osrm(
    `/table/v1/driving/${coords([centro, ...candidatos.map((p) => [p.lon, p.lat])])}?sources=0&annotations=distance&generate_hints=false`,
  )
  candidatos.forEach((p, i) => {
    const m = matriz.dados.distances[0][i + 1]
    p.estradaKm = m === null ? null : m / 1000
  })

  const escolhidos = {}
  for (const cat of CATEGORIAS) {
    const lista = candidatos.filter((p) => p.categoria === cat && p.estradaKm !== null)
    escolhidos[cat] = lista.sort((a, b) => a.estradaKm - b.estradaKm)[0] ?? null
  }

  const rotas = {}
  for (const [cat, p] of Object.entries(escolhidos)) {
    if (!p) continue
    const rota = await osrm(
      `/route/v1/driving/${coords([[p.lon, p.lat], centro])}?overview=full&geometries=geojson&alternatives=false&steps=false&generate_hints=false`,
    )
    rotas[cat] = { geometria: rota.dados.routes[0].geometry, km: rota.dados.routes[0].distance / 1000, servidor: rota.servidor, consultadoEm: rota.consultadoEm }
  }

  await writeFile(
    arquivo,
    JSON.stringify({ raioKm: RAIO_KM, matriz: { servidor: matriz.servidor, consultadoEm: matriz.consultadoEm }, candidatos, escolhidos, rotas }),
  )
  console.log(id)
  for (const cat of CATEGORIAS) {
    const p = escolhidos[cat]
    console.log('  ', cat.padEnd(10), p ? `${p.estradaKm.toFixed(1)} km (reta ${p.retaKm.toFixed(1)}) ${p.id} ${p.nome ?? 'sem nome'}` : `nenhum em ${RAIO_KM} km`)
  }
}
