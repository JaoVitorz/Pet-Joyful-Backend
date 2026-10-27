const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const repo = path.resolve(__dirname, '../Pet-Joyful---Projeto-Integrador--NextJs');
const branch = 'feature/compartibilidadeia';
const current = cp.execFileSync('git', ['branch', '--show-current'], {cwd: repo, encoding: 'utf8'}).trim();
if (current !== branch) cp.execFileSync('git', ['switch', '-c', branch], {cwd: repo});
const root = path.join(repo, 'pet-joyful/src/app');
const file = path.join(root, 'compatibilidade/page.tsx');
let source = fs.readFileSync(file, 'utf8');
source = source.replace('import { parseJsonFromText } from "@/app/utils/parseJsonFromText";\n', '').replace('import { parseJsonFromText } from "@/app/utils/parseJsonFromText";\r\n', '');
source = source.replace('useState, useRef, useEffect', 'useState, useRef');
source = source.replace('  // Adopter form', '  const [error, setError] = useState<string | null>(null);\n  const pending = useRef(false);\n\n  // Adopter form');
const start = source.indexOf('  const handleAnalyze = async () => {');
const end = source.indexOf('  const getScoreColor', start);
if (start < 0 || end < 0) throw new Error('Formulário inesperado');
source = source.slice(0, start) + `  const handleAnalyze = async () => {
    if (pending.current) return;
    if (![adopterData.livingSpace, adopterData.experience, adopterData.timeAvailable, petData.type, petData.breed].every(value => value.trim())) {
      setError("Preencha os campos obrigatórios do adotante e do pet.");
      return;
    }
    pending.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/compatibilidade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adopter: adopterData, pet: petData }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(typeof data.error === "string" ? data.error : typeof data.message === "string" ? data.message : "Não foi possível analisar. Tente novamente.");
      }
      const parsed = data.result;
      const validList = (value: unknown) => Array.isArray(value) && value.every(item => typeof item === "string" && item.trim());
      if (!parsed || typeof parsed.score !== "number" || !Number.isFinite(parsed.score) || parsed.score < 0 || parsed.score > 100 || typeof parsed.assessment !== "string" || !parsed.assessment.trim() || !validList(parsed.alerts) || !validList(parsed.tips)) {
        throw new Error("A análise retornou um resultado inválido. Tente novamente.");
      }
      setResult(parsed as CompatibilityResult);
      setStep("result");
    } catch (error) {
      setError(error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
        ? "A análise demorou demais. Tente novamente."
        : error instanceof SyntaxError ? "O serviço retornou uma resposta inválida. Tente novamente."
        : error instanceof TypeError ? "Não foi possível conectar ao serviço. Tente novamente."
        : error instanceof Error ? error.message : "Não foi possível analisar. Tente novamente.");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

` + source.slice(end);
for (const [field, limit] of Object.entries({familyComposition: 500, lifestyle: 1000, breed: 200, temperament: 500, specialNeeds: 1000, description: 1000})) {
  source = source.replace('name="' + field + '"', 'name="' + field + '"\n                  maxLength={' + limit + '}');
}
source = source.replace('!petData.breed}', '!petData.breed.trim()}');
source = source.replace('onClick={() => setStep("adopter")}', 'disabled={loading}\n                  onClick={() => { setError(null); setStep("adopter"); }}');
source = source.replace('        {step === "adopter" && (', '        {error && <div role="alert" className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">{error} Seus dados foram mantidos; tente analisar novamente.</div>}\n\n        {step === "adopter" && (');
source = source.replace('            {/* Score Card */}', '            <p className="rounded-lg bg-white p-4 text-sm text-gray-700">Esta análise é orientativa, baseada nos dados informados, e não garante o sucesso da adoção. Converse com os responsáveis pelo pet antes de decidir.</p>\n            {/* Score Card */}');
source = source.replace('                  setResult(null);', '                  setResult(null);\n                  setError(null);');
fs.writeFileSync(file, source);
const routeDir = path.join(root, 'api/compatibilidade');
fs.mkdirSync(routeDir, {recursive: true});
fs.writeFileSync(path.join(routeDir, 'route.ts'), `import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ success: false, error: "Dados inválidos." }, { status: 400 }); }
  const baseUrl = process.env.COMPATIBILITY_API_URL?.trim();
  if (!baseUrl) return NextResponse.json({ success: false, error: "Análise indisponível no momento." }, { status: 503 });
  try {
    const response = await fetch(baseUrl.replace(/\\/$/, "") + "/api/compatibilidade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(40000),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      const status = [400, 429, 502, 503, 504].includes(response.status) ? response.status : 503;
      const messages: Record<number, string> = {400: "Verifique os campos preenchidos.", 429: "Limite de análises atingido. Aguarde e tente novamente.", 502: "A IA retornou uma resposta inválida. Tente novamente.", 503: "Não foi possível analisar agora. Tente novamente mais tarde.", 504: "A análise demorou demais. Tente novamente."};
      return NextResponse.json({success: false, error: messages[status]}, {status});
    }
    return NextResponse.json(data);
  } catch (error) {
    const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json({success: false, error: timeout ? "A análise demorou demais. Tente novamente." : "Não foi possível conectar ao serviço de análise. Tente novamente."}, {status: timeout ? 504 : 502});
  }
}
`);
const envExample = path.join(repo, 'pet-joyful/.env.compatibilidade.example');
fs.writeFileSync(envExample, '# Copie esta variável para .env.local. URL base do backend do ambiente.\nCOMPATIBILITY_API_URL=http://localhost:5000\n');
console.log('Frontend atualizado na branch ' + branch);
