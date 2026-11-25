# Fontes dos números do vídeo

Gerado de `demo-data.json` (2026-11-25T00:23:18.322Z).

## Centro, Rio de Janeiro (RJ)

- Lote: [way/320725829](https://www.openstreetmap.org/way/320725829), 1016 m², centro -22.908659, -43.183327. Fonte: https://overpass-api.de/api/interpreter, 2026-11-25T00:19:54.770Z.
- Edifício: 1000 m² de área construída (dado de entrada, igual nos dois casos). Raio de busca: 200 km.

| Categoria | Fornecedor mapeado | OSM | Distância na tela | Fonte da distância |
|---|---|---|---|---|
| Concreto e cimento | CSN Cimento | node/9900884350 | 131 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:36.043Z |
| Aço | CSN Aços Longos | node/9900884351 | 129 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:36.043Z |
| Madeira | sem nome | node/12453514134 | 10 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:36.043Z |
| Agregados | sem nome | way/155470893 | 13 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:36.043Z |
| Material de construção em geral | Irmãos Unidos | node/10992861760 | 1 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:36.043Z |
| Destino de resíduos | sem nome | node/12453508850 | 7 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:36.043Z |

| Sistema | A4 na tela | A5 na tela | Rótulo | Pendências |
|---|---|---|---|---|
| Concreto armado | 8.500 kgCO₂e | 21 kgCO₂e | preliminar | — |
| Aço | 810 kgCO₂e | 0,41 kgCO₂e | preliminar | Concreto (lajes): massa por m² sem fonte. |
| Madeira | sem valor | sem valor | ilustrativo | Madeira estrutural: massa por m² sem fonte. Aço (ligações): massa por m² sem fonte. |

Carbono: Fórmulas da SPEC, seção 8, via src/carbono/calculo.ts; fatores de src/dados-fixos/ (não verificados) — DEMO_VIDEO.md, seção 3, item 3.

## Nova Friburgo (RJ)

- Lote: [way/1566504403](https://www.openstreetmap.org/way/1566504403), 1575 m², centro -22.288694, -42.531682. Fonte: https://overpass-api.de/api/interpreter, 2026-11-25T00:20:53.822Z.
- Edifício: 1000 m² de área construída (dado de entrada, igual nos dois casos). Raio de busca: 200 km.

| Categoria | Fornecedor mapeado | OSM | Distância na tela | Fonte da distância |
|---|---|---|---|---|
| Concreto e cimento | CSN Cimento | node/9900884350 | 236 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:46.518Z |
| Aço | CSN Aços Longos | node/9900884351 | 234 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:46.518Z |
| Madeira | Vm Madeiras | node/2334755061 | 79 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:46.518Z |
| Agregados | sem nome | way/709525280 | 28 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:46.518Z |
| Material de construção em geral | Estrelar | node/10929372706 | 78 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:46.518Z |
| Destino de resíduos | sem nome | node/13154542768 | 71 km | OSRM https://router.project-osrm.org, matriz de 2026-11-25T00:22:46.518Z |

| Sistema | A4 na tela | A5 na tela | Rótulo | Pendências |
|---|---|---|---|---|
| Concreto armado | 15.000 kgCO₂e | 230 kgCO₂e | preliminar | — |
| Aço | 1.500 kgCO₂e | 4,4 kgCO₂e | preliminar | Concreto (lajes): massa por m² sem fonte. |
| Madeira | sem valor | sem valor | ilustrativo | Madeira estrutural: massa por m² sem fonte. Aço (ligações): massa por m² sem fonte. |

Carbono: Fórmulas da SPEC, seção 8, via src/carbono/calculo.ts; fatores de src/dados-fixos/ (não verificados) — DEMO_VIDEO.md, seção 3, item 3.

Dados de mapa © colaboradores do OpenStreetMap (ODbL). Rotas: OSRM, servidor de demonstração da FOSSGIS.
