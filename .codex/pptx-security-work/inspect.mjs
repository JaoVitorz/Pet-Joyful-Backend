import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const {PresentationFile, FileBlob}=await import(pathToFileURL('C:/Users/Alunos/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs'));
const p=await PresentationFile.importPptx(await FileBlob.load('C:/Users/Alunos/Downloads/Pet-Joyful-Previa-15min-v5 (1) (1).pptx'));
const s=p.slides.items[9];
const png=await s.export({format:'png',scale:1});
await fs.writeFile('.codex/pptx-security-work/slide10-before.png',new Uint8Array(await png.arrayBuffer()));
const res=await p.inspect({kind:'slide,textbox,shape',target:{id:'sl/'+s.id,beforeLines:2,afterLines:80},maxChars:12000});
console.log(res.ndjson);
