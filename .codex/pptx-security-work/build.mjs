import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const skillDir='C:/Users/Alunos/.codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/presentations';
const runtime='C:/Users/Alunos/.cache/codex-runtimes/codex-primary-runtime/dependencies';
process.env.RUNTIME_NODE_MODULES=path.join(runtime,'node/node_modules');
const source='C:/Users/Alunos/Downloads/Pet-Joyful-Previa-15min-v5 (1) (1).pptx';
const workspace=process.cwd();
const build=path.join(workspace,'.pptx-security-work');
const outDir=path.join(workspace,'deliverables');
const final=path.join(outDir,'Pet-Joyful-Previa-15min-v6-seguranca.pptx');
await fs.mkdir(build,{recursive:true}); await fs.mkdir(outDir,{recursive:true});
const {PresentationFile,FileBlob}=await import(pathToFileURL(path.join(runtime,'node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')));
const p=await PresentationFile.importPptx(await FileBlob.load(source));
const reference=p.slides.items[9];
 p.resolve('sh/atwbelcn').text='Ativo nas rotas cobertas; compartilhar estado entre instâncias.';
 p.resolve('sh/yxgbilcj').text='Também aceita admin_key na URL; restringir ao header.';
const slide=p.slides.insert({after:reference,layout:'CONTENT'}).slide;
slide.background.fill='#F6FBF7';
function shape(name,geometry,pos,fill='none',stroke='none',strokeWidth=0){return slide.shapes.add({geometry,name,position:pos,fill,line:{style:'solid',fill:stroke,width:strokeWidth},insets:0});}
function text(name,value,x,y,w,h,size,color,bold=false){const s=shape(name,'textbox',{left:x,top:y,width:w,height:h});s.text=value;s.text.style={fontSize:size,typeface:'Arial',color,bold,alignment:'left'};s.text.insets=0;return s;}
text('Seção','06  /  SEGURANÇA',58,36,900,27,16,'#258357',true);
text('Título','Segurança implementada: controles e localização',58,68,1162,58,41,'#144A34',true);
text('Subtítulo','O que cada proteção faz e onde está implementada no backend.',58,132,1162,34,20,'#63796C');
const cards=[
 {x:58,y:188,title:'Senhas e sessões',body:'bcrypt com salt 10. JWT de acesso expira em 7 dias e é revalidado com a conta e sua versão de autenticação.',where:'userModel.ts  ·  mfaService.ts  ·  verifyToken.ts'},
 {x:454,y:188,title:'MFA opcional',body:'TOTP e desafio de 5 min; segredo cifrado com AES-256-GCM; códigos de recuperação em hash; bloqueio após 5 falhas por 15 min.',where:'services/mfaService.ts  ·  controllers/mfaController.ts'},
 {x:850,y:188,title:'Limite de tentativas',body:'API: 30 req/min; login: 5/15 min; consulta de CPF no cadastro/validação: 20/min por IP.',where:'app.ts  ·  middlewares/rateLimiter.ts  ·  cpfRateLimit.ts'},
 {x:58,y:374,title:'HTTP e origens',body:'Helmet define CSP e frameguard. CORS restringe origens, métodos e cabeçalhos permitidos.',where:'backend/src/app.ts'},
 {x:454,y:374,title:'Segredos e respostas',body:'JWT_SECRET, ADMIN_KEY e MFA_ENCRYPTION_KEY vêm do ambiente. O modelo omite senha, CPF e segredos MFA do JSON.',where:'docker-compose.yml  ·  models/userModel.ts'},
 {x:850,y:374,title:'Dados da conta',body:'JWT protege as rotas; exportação e exclusão verificam que a conta autenticada corresponde ao titular solicitado.',where:'routes/userRoutes.ts  ·  controllers/userController.ts  ·  services/userDataService.ts'},
];
for(let i=0;i<cards.length;i++){
 const c=cards[i];
 shape(`Cartão ${i+1}`,'roundRect',{left:c.x,top:c.y,width:372,height:170},'#FFFFFF','#B6E2C5',1.3);
 shape(`Destaque ${i+1}`,'rect',{left:c.x+1,top:c.y+17,width:4,height:28},'#258357','#258357',0);
 text(`Título ${i+1}`,c.title,c.x+20,c.y+18,330,28,19,'#144A34',true);
 text(`Descrição ${i+1}`,c.body,c.x+20,c.y+56,330,68,15.5,'#263D32');
 text(`Local ${i+1}`,c.where,c.x+20,c.y+132,330,30,12.5,'#63796C');
}
shape('Faixa de limites','roundRect',{left:58,top:566,width:1164,height:88},'#E3F4E9','#B6E2C5',1);
text('Atenção','Pontos de atenção',82,579,195,24,16,'#144A34',true);
text('Limitações','Limitadores usam memória local; /api/chat não passa pelo limite global; Admin Key também aceita admin_key na URL.',276,578,920,54,15,'#263D32');
shape('Fundo do rodapé','rect',{left:0,top:670,width:1280,height:50},'#F6FBF7','#F6FBF7',0);
text('Rodapé','PET JOYFUL  ·  PRÉVIA  ·  15 MIN',58,683,500,20,12,'#63796C');
text('Número do slide','11',1160,683,48,20,13,'#63796C');
const preview=await slide.export({format:'png',scale:1});
await fs.writeFile(path.join(build,'slide-security-added.png'),new Uint8Array(await preview.arrayBuffer()));
const exported=await PresentationFile.exportPptx(p);
const candidate=path.join(build,'candidate.pptx'); await exported.save(candidate);
const refSha=crypto.createHash('sha256').update(await fs.readFile(source)).digest('hex');
const {finalizePresentation}=await import(pathToFileURL(path.join(skillDir,'container_tools/artifact_tool_utils.mjs')).href);
const receipt=path.join(build,'Pet-Joyful-Previa-15min-v6.validation.json');
const result=await finalizePresentation({
 explicitTotalSlideCount:16, workspaceDir:workspace, candidatePath:candidate, finalPath:final,
 pythonExecutable:path.join(runtime,'python/python.exe'),
 integrityValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'reference',families:['Arial','Consolas'],referencePath:source,referenceSha256:refSha},
 verifyArtifactToolImport:true,receiptPath:receipt,
});
console.log(JSON.stringify({final,slideCount:p.slides.items.length,receipt,result},null,2));
