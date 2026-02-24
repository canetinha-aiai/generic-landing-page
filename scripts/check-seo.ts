import { fetchStoreData } from "../src/services/dataService";

async function checkSEO() {
  const url = process.env.SHEET_BASE_URL;

  if (!url) {
    console.error(
      "\x1b[31mError: SHEET_BASE_URL not found in environment variables.\x1b[0m",
    );
    process.exit(1);
  }

  console.log(
    "\x1b[36m%s\x1b[0m",
    "--- Verificando Informações de SEO da Planilha ---",
  );
  console.log(`URL: ${url.substring(0, 50)}...`);

  try {
    const data = await fetchStoreData(url);
    const { business } = data;

    console.log("\n\x1b[1m[ Informações Gerais ]\x1b[0m");
    console.log(`Nome da Loja:     \x1b[32m${business.name}\x1b[0m`);
    console.log(
      `Tagline:          ${business.tagline || "\x1b[90m(vazio)\x1b[0m"}`,
    );
    console.log(
      `Descrição (Site): \x1b[32m${business.description || "\x1b[90m(vazio)\x1b[0m"}\x1b[0m`,
    );

    console.log("\n\x1b[1m[ Metadados de SEO ]\x1b[0m");
    console.log(
      `Palavras-chave:   \x1b[33m${business.keywords || "\x1b[90m(não configurado)\x1b[0m"}\x1b[0m`,
    );
    console.log(
      `Descrição (Google): \x1b[34m${business.seoDescription || business.description || "\x1b[90m(vazio)\x1b[0m"}\x1b[0m`,
    );

    console.log("\n\x1b[1m[ Preview Social (Open Graph) ]\x1b[0m");
    console.log(
      `Título Social:    \x1b[35m${business.ogTitle || business.name + " (Fallback)"}\x1b[0m`,
    );
    console.log(
      `Descrição Social: \x1b[35m${business.ogDescription || business.description || business.tagline || "(Fallback)"}\x1b[0m`,
    );

    console.log("\n\x1b[1m[ Assets ]\x1b[0m");
    console.log(
      `Logo URL:         ${business.logo || "\x1b[90m(nenhum)\x1b[0m"}`,
    );
    console.log(
      `Favicon URL:      ${business.favicon || "\x1b[90m(nenhum)\x1b[0m"}`,
    );

    console.log("\n\x1b[32m%s\x1b[0m", "✓ Verificação completa!");
  } catch (error) {
    console.error(
      "\n\x1b[31mErro ao buscar dados:\x1b[0m",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

checkSEO();
