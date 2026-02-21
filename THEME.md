# 🎨 Guia de Temas — Minha Doceria

Documento de referência para rebrandear este site para um novo cliente.

---

## Arquivos que você vai editar

| O que mudar          | Arquivo                               |
| -------------------- | ------------------------------------- |
| Cores (palette)      | `src/data/theme.js`                   |
| Fontes (nomes)       | `src/data/theme.js` + `src/index.css` |
| Importações de fonte | `src/index.css`                       |
| Dados do negócio     | `src/data/db.json`                    |

---

## Passo a passo para rebrandear

### 1. Trocar as cores

Abra `src/data/theme.js` e edite o objeto `colors`:

```js
colors: {
  primary:      'violet-600',  // era pink-600 → troque pelo nome da cor Tailwind
  primaryHover: 'violet-700',
  primaryLight: 'violet-50',
  // ...
},
```

Depois, busque (Ctrl+Shift+F) por `pink-` em `src/components/` e `src/pages/` para atualizar as classes nos arquivos de componente.

### 2. Trocar as fontes

**a)** Em `src/data/theme.js`, atualize os valores em `fonts`:

```js
fonts: {
  brand: '"Playfair Display", serif',  // nova fonte decorativa
  body:  '"Inter", sans-serif',         // nova fonte do corpo
  googleFontsUrls: [
    'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  ],
},
```

**b)** Em `src/index.css`, atualize os `@import` e o bloco `@theme`:

```css
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

@theme {
  --font-brand: "Playfair Display", serif;
  --font-sans: "Inter", sans-serif;
}
```

### 3. Trocar os dados do negócio

Edite `src/data/db.json` — nome, telefone, WhatsApp, Instagram, Place ID do Google Maps, horários e itens do cardápio.

---

## Paleta atual

| Token            | Classe Tailwind | Uso                        |
| ---------------- | --------------- | -------------------------- |
| `primary`        | `pink-600`      | Botões, títulos, destaques |
| `primaryHover`   | `pink-700`      | Hover de botões            |
| `primaryLight`   | `pink-50`       | Bordas de card, tags       |
| `primaryLighter` | `pink-100`      | Fundo de ícones            |
| `accentBg`       | `rose-50/50`    | Fundo de seções            |
| `success`        | `green-500`     | WhatsApp                   |

## Fontes atuais

| Token   | Valor       | Classe Tailwind |
| ------- | ----------- | --------------- |
| `brand` | Great Vibes | `font-brand`    |
| `body`  | Outfit      | `font-sans`     |
