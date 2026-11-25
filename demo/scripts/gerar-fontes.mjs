// Gera demo/data/SOURCES.md a partir de demo-data.json: cada número do vídeo, com fonte e data.
import { readFile, writeFile } from 'node:fs/promises'

const d = JSON.parse(await readFile(new URL('../data/demo-data.json', import.meta.url), 'utf8'))
const doisSignificativos = (n) => Number(n.toPrecision(2)).toLocaleString('pt-BR')
const km = (n) => `${Math.round(n)} km`
const linhas = ['# Fontes dos números do vídeo', '', `Gerado de \`demo-data.json\` (${d.geradoEm}).`, '']

for (const [id, c] of Object.entries(d.casos)) {
  linhas.push(`## ${c.local}`, '')
  linhas.push(`- Lote: [${c.osm}](${c.url}), ${c.areaLoteM2} m², centro ${c.centro[1]}, ${c.centro[0]}. Fonte: ${c.fonte.servico}, ${c.fonte.consultadoEm}.`)
  linhas.push(`- Edifício: ${c.edificio.areaConstruidaM2} m² de área construída (dado de entrada, igual nos dois casos). Raio de busca: ${c.raioKm} km.`, '')
  linhas.push('| Categoria | Fornecedor mapeado | OSM | Distância na tela | Fonte da distância |', '|---|---|---|---|---|')
  for (const cat of Object.values(c.categorias)) {
    if (!cat.fornecedor && !cat.osm) {
      linhas.push(`| ${cat.categoria} | — | — | ${cat.mensagem} | — |`)
      continue
    }
    linhas.push(`| ${cat.categoria} | ${cat.fornecedor ?? 'sem nome'} | ${cat.osm} | ${km(cat.distanciaEstradaKm)} | ${cat.fonte.distancia} |`)
  }
  linhas.push('', '| Sistema | A4 na tela | A5 na tela | Rótulo | Pendências |', '|---|---|---|---|---|')
  for (const s of Object.values(c.carbono)) {
    const v = (x) => (x === null ? 'sem valor' : `${doisSignificativos(x)} kgCO₂e`)
    linhas.push(`| ${s.sistema} | ${v(s.a4KgCO2e)} | ${v(s.a5KgCO2e)} | ${s.rotulo} | ${s.pendencias.join(' ') || '—'} |`)
  }
  linhas.push('', `Carbono: ${Object.values(c.carbono)[0].fonte}.`, '')
}
linhas.push('Dados de mapa © colaboradores do OpenStreetMap (ODbL). Rotas: OSRM, servidor de demonstração da FOSSGIS.', '')
await writeFile(new URL('../data/SOURCES.md', import.meta.url), linhas.join('\n'))
console.log(linhas.join('\n'))
