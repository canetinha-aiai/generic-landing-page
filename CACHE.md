# Estratégia de Cache e Performance

Este documento detalha como o site gerencia o cache para garantir que as informações da planilha estejam sempre atualizadas, sem sacrificar a velocidade de carregamento e a experiência do usuário.

## 1. Cache de Página (ISR)

Utilizamos a **Incremental Static Regeneration (ISR)** do Next.js. Isso significa que as páginas são geradas estaticamente no servidor, mas são validadas em segundo plano após um intervalo definido.

- **Frequência de Atualização:** 60 segundos.
- **Como funciona:** Se um usuário acessa o site e a versão em cache tem mais de 60 segundos, o Next.js serve a versão antiga instantaneamente e inicia uma atualização em segundo plano com os dados novos da planilha.
- **Onde encontrar:**
  - [src/app/page.tsx](file:///Volumes/PedroSSD/Projetos/generic-landing-page/src/app/page.tsx) (`export const revalidate = 60`)
  - [src/app/cardapio/page.tsx](file:///Volumes/PedroSSD/Projetos/generic-landing-page/src/app/cardapio/page.tsx)

## 2. Deduplicação de Dados (React.cache)

Para evitar que o site faça várias chamadas repetidas para a planilha na mesma requisição (ex: uma para os metadados e outra para o conteúdo da página), utilizamos a função `cache` do React.

- **Escopo:** Request-level (por requisição).
- **Vantagem:** Garante que a planilha seja baixada exatamente **uma vez** por renderização de página, economizando banda e tempo.
- **Onde encontrar:** [src/lib/getData.ts](file:///Volumes/PedroSSD/Projetos/generic-landing-page/src/lib/getData.ts)

## 3. Otimização de Imagens (Next/Image)

As imagens externas (como logo e fotos do cardápio vindas do S3) são processadas automaticamente pelo servidor do Next.js.

- **Otimizações Automáticas:**
  - Redimensionamento para o tamanho exato de exibição.
  - Conversão para formatos modernos (WebP/AVIF).
  - Compressão de arquivos pesados (ajuda muito com o logo de 6MB).
- **Cache de Assets:** O Next.js armazena essas versões otimizadas em cache permanentemente após o primeiro acesso.

## 4. Fontes Nativas (Next/Font)

As fontes `Outfit` e `Great Vibes` não são mais baixadas do Google. Elas são baixadas durante o build do projeto e servidas diretamente pelo seu domínio.

- **Diferencial:** Removemos a "Critical Chain" (cadeia de dependências) que atrasava o carregamento do texto. Atualmente, o site já sabe exatamente quais fontes usar sem precisar consultar servidores externos.

## 5. Navegação Instantânea (BFcache)

Removemos restrições de cabeçalho (`no-store`) que impediam o navegador de guardar a página na memória RAM. Graças a isso, ao usar o botão "Voltar" ou "Avançar" do navegador, a página carrega **zero delay** (instantaneamente).

---

> [!TIP]
> **Recomendação para S3:** Para ativos fixos como o `favicon.ico` e o `logo.png`, recomendamos adicionar o metadado no console da AWS:
> `Cache-Control: public, max-age=31536000, immutable`
