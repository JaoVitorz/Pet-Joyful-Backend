// =============================================================
// backend/src/rag/retriever.ts
// Motor de busca do RAG — tipado com TypeScript
// =============================================================

import fs   from 'fs';
import path from 'path';

// ── Tipos ─────────────────────────────────────────────────────

export interface KnowledgeDoc {
  id:       string;
  titulo:   string;
  tags:     string[];
  conteudo: string;
  source?:  string;
  score?:   number;
}

// ── Indexação ────────────────────────────────────────────────
// Carrega todos os JSONs da pasta /knowledge uma única vez

const KNOWLEDGE_DIR = path.join(__dirname, '../../../../knowledge');

let knowledgeBase: KnowledgeDoc[] = [];

function loadKnowledgeBase(): void {
  try {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      console.warn('⚠️  [RAG] Pasta knowledge/ não encontrada em:', KNOWLEDGE_DIR);
      return;
    }

    const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const raw:  string         = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8');
      const docs: KnowledgeDoc[] = JSON.parse(raw);

      const docsWithSource = docs.map((d) => ({ ...d, source: file.replace('.json', '') }));
      knowledgeBase = knowledgeBase.concat(docsWithSource);

      console.log(`📚 [RAG] ${file} — ${docs.length} docs carregados`);
    }

    console.log(`📚 [RAG] Total: ${knowledgeBase.length} documentos indexados`);
  } catch (err: unknown) {
    console.error('❌ [RAG] Erro ao carregar knowledge base:', (err as Error).message);
  }
}

// Executa ao importar o módulo
loadKnowledgeBase();

// ── Busca ────────────────────────────────────────────────────

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ');
}

function calcularScore(query: string, doc: KnowledgeDoc): number {
  const tokens: string[] = normalizar(query).split(/\s+/).filter((t) => t.length > 2);
  let score = 0;

  const tagsNorm     = doc.tags.map(normalizar);
  const tituloNorm   = normalizar(doc.titulo);
  const conteudoNorm = normalizar(doc.conteudo);

  for (const token of tokens) {
    for (const tag of tagsNorm) {
      if (tag.includes(token) || token.includes(tag)) score += 3;
    }
    if (tituloNorm.includes(token))   score += 2;
    if (conteudoNorm.includes(token)) score += 1;
  }

  return score;
}

export function retrieve(query: string, topK = 3, minScore = 1): KnowledgeDoc[] {
  if (!query || knowledgeBase.length === 0) return [];

  return knowledgeBase
    .map((doc) => ({ ...doc, score: calcularScore(query, doc) }))
    .filter((doc) => (doc.score ?? 0) >= minScore)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, topK);
}

export function formatarContexto(docs: KnowledgeDoc[]): string {
  if (docs.length === 0) return '';
  return docs
    .map((doc, i) => `[Documento ${i + 1} — ${doc.titulo}]\n${doc.conteudo}`)
    .join('\n\n');
}