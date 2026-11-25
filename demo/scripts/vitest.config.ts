import { defineConfig } from 'vitest/config'

// Configuração só do vídeo: roda o script de carbono com as funções da ferramenta,
// sem entrar na suíte de testes do projeto (npm test).
export default defineConfig({
  test: {
    root: new URL('..', import.meta.url).pathname,
    include: ['scripts/calcular-carbono.script.ts'],
    environment: 'node',
  },
})
