# Documentação de SEO e Acessibilidade

Este documento detalha todas as melhorias realizadas para garantir que o site tenha um excelente ranqueamento no Google e uma ótima experiência de uso.

## 1. SEO Técnico (Next.js)

### Meta Tags Dinâmicas

O site utiliza o **Server-Side Rendering (SSR)** do Next.js. Isso significa que o Google e outras ferramentas de busca recebem o HTML já preenchido com suas informações, sem precisar esperar o carregamento do JavaScript.

### Gerenciamento via Planilha (Aba "SEO")

Configuramos campos específicos para você ter controle total sobre como o site aparece na internet:

- **Descrição (Aba SEO):** Este campo é usado **exclusivamente para o Google (Meta Description)**. Ele não aparece visualmente no site, servindo apenas para os buscadores.
- **Descrição (Aba Loja):** Este campo continua sendo o texto que aparece na primeira dobra do seu site (Seção Hero).
- **Palavras-chave:** Melhora a indexação para termos específicos. temas principais (ex: "doces", "bolos", "Vix").
- **Título Social:** Título usado especificamente em links compartilhados no WhatsApp/Instagram.
- **Descrição Social:** Descrição usada especificamente no preview das redes sociais.
- **Link Canônico:** Define a URL oficial do site para evitar conteúdo duplicado.

### Otimização de Performance (ISR Cache)

Implementamos o **Incremental Static Regeneration (ISR)** com tempo de **60 segundos**.

**Como funciona o Cache:**

1. **Velocidade:** O site serve uma versão "congelada" (estática), por isso carrega instantaneamente.
2. **Atualização:** A cada 60 segundos, se alguém acessar o site, o Next.js verifica silenciosamente se você alterou algo na planilha.
3. **Background:** Se houver mudança, o site se atualiza sozinho nos bastidores. O próximo visitante já verá a versão nova.
4. **Benefício:** Você tem a velocidade de um site estático com a facilidade de atualização de um site dinâmico.

---

## 2. Acessibilidade (Padrões Google/W3C)

### Nomes Acessíveis (Aria-Labels)

Adicionamos `aria-label` em botões de ícone para que leitores de tela possam descrevê-los:

- Botão do Carrinho: _"Ver sacola"_
- Botão de Fechar: _"Fechar carrinho"_
- Ajustes de Qtd: _"Aumentar/Diminuir quantidade"_
- Menu Mobile: _"Menu"_

### Contraste e Hierarquia

- **Contraste:** Texto do rodapé escurecido para facilitar a leitura.
- **Headings:** Tags `<h1>`, `<h2>` e `<h3>` organizadas em ordem lógica, ajudando tanto na acessibilidade quanto no SEO.

---

## 3. Comandos Úteis

### Verificar dados no Terminal

```bash
npm run check-seo
```

### Ferramentas de Análise

1. **Google Lighthouse:** (Chrome > Inspecionar > Lighthouse) para auditar performance e SEO.
2. **MetaTags.io:** Para simular como o link aparece ao ser compartilhado.
