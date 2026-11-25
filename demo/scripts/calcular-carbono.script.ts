// Etapa 2 do vídeo: monta demo/data/demo-data.json.
// O carbono é calculado com as próprias funções da ferramenta (src/carbono/calculo.ts),
// os fatores de src/dados-fixos/ e as rotas coletadas por coletar-rotas.mjs.
// Rodar com: npx vitest run --config demo/scripts/vitest.config.ts

import { readFileSync, writeFileSync } from 'node:fs'
import { it } from 'vitest'
import { calcularSistema } from '../../src/carbono/calculo'
import { SISTEMAS } from '../../src/carbono/sistemas'
import { CATEGORIA_POR_ID } from '../../src/compartilhado/categorias'
import { FATORES } from '../../src/compartilhado/fatores'
import type { IdCategoria, Rota } from '../../src/compartilhado/terreno'

const AREA_CONSTRUIDA_M2 = 1000
const VOLUME_TERRA_M3 = 0
const pasta = new URL('../data/', import.meta.url)
const ler = (nome: string) => JSON.parse(readFileSync(new URL(nome, pasta), 'utf8'))

it('monta demo-data.json', () => {
  const { casos } = ler('lotes.json')
  const base = JSON.parse(readFileSync(new URL('../../public/dados/fornecedores-br.json', import.meta.url), 'utf8'))
  const saida: Record<string, unknown> = {}

  for (const [id, caso] of Object.entries<Record<string, unknown>>(casos)) {
    const coleta = ler(`cache/rotas-${id}.json`)
    const rotas: Partial<Record<IdCategoria, Rota>> = {}
    const categorias: Record<string, unknown> = {}

    for (const [cat, p] of Object.entries<Record<string, unknown> | null>(coleta.escolhidos)) {
      const r = coleta.rotas[cat]
      if (!p || !r) {
        categorias[cat] = { categoria: CATEGORIA_POR_ID[cat as IdCategoria].nome, fornecedor: null, mensagem: `Nenhum fornecedor mapeado em ${coleta.raioKm} km` }
        continue
      }
      // Distância: a da matriz (é ela que a ferramenta usa para escolher e calcular).
      rotas[cat as IdCategoria] = { pontoId: String(p.id), distanciaKm: Number(p.estradaKm), geometria: null, estimada: false }
      categorias[cat] = {
        categoria: CATEGORIA_POR_ID[cat as IdCategoria].nome,
        fornecedor: p.nome ?? null,
        osm: p.id,
        coordenadas: [p.lon, p.lat],
        distanciaRetaKm: Number(Number(p.retaKm).toFixed(2)),
        distanciaEstradaKm: Number(Number(p.estradaKm).toFixed(2)),
        estimada: false,
        geometria: r.geometria,
        fonte: {
          tipo: 'Distância real por estrada (DEMO_VIDEO.md, seção 3, item 2)',
          fornecedor: `OpenStreetMap, base da ferramenta extraída em ${base.extraidoEm}`,
          distancia: `OSRM ${coleta.matriz.servidor}, matriz de ${coleta.matriz.consultadoEm}`,
          geometria: `OSRM ${r.servidor}, ${r.consultadoEm}`,
        },
      }
    }

    const edificio = { areaConstruidaM2: AREA_CONSTRUIDA_M2, volumeTerraM3: VOLUME_TERRA_M3 }
    const carbono = Object.fromEntries(
      SISTEMAS.map((s) => {
        const r = calcularSistema(s, edificio, rotas, FATORES)
        return [
          s.id,
          {
            sistema: s.nome,
            a4KgCO2e: r.a4KgCO2e,
            a5KgCO2e: r.a5KgCO2e,
            pendencias: r.pendencias,
            avisos: r.avisos,
            rotulo: r.a4KgCO2e === null && r.a5KgCO2e === null ? 'ilustrativo' : 'preliminar',
            fonte: 'Fórmulas da SPEC, seção 8, via src/carbono/calculo.ts; fatores de src/dados-fixos/ (não verificados) — DEMO_VIDEO.md, seção 3, item 3',
          },
        ]
      }),
    )

    saida[id] = { ...caso, raioKm: coleta.raioKm, edificio, categorias, carbono }
  }

  writeFileSync(
    new URL('demo-data.json', pasta),
    JSON.stringify(
      {
        _sobre: 'Dados do vídeo de demonstração (DEMO_VIDEO.md, seção 4). Mesmo edifício nos dois casos; só o lugar muda.',
        geradoEm: new Date().toISOString(),
        casos: saida,
      },
      null,
      2,
    ) + '\n',
  )
})
