import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const skillDir='C:/Users/Alunos/.codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/presentations';
const runtime='C:/Users/Alunos/.cache/codex-runtimes/codex-primary-runtime/dependencies';
process.env.RUNTIME_NODE_MODULES=path.join(runtime,'node/node_modules');
const source=path.join(process.cwd(),'deliverables/Pet-Joyful-Previa-15min-v6-seguranca.pptx');
const workspace=process.cwd();
const build=path.join(workspace,'.pptx-cloudstack-work');
const final=path.join(workspace,'deliverables/Pet-Joyful-Previa-15min-v7-cloudstack.pptx');
await fs.mkdir(build,{recursive:true});
const {PresentationFile,FileBlob}=await import(pathToFileURL(path.join(runtime,'node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')));
const p=await PresentationFile.importPptx(await FileBlob.load(source));
// Bring the previous CloudStack mentions up to date with the verified lab state.
p.resolve('sh/lkzmhwvm').text='CLOUDSTACK LOCAL  ·  ESTADO VERIFICADO EM 20/10/2026';
p.resolve('sh/yh8nmhcv').text='VM Ubuntu com Docker/Compose testada; containers Pet Joyful ainda não implantados. Render segue online.';
p.resolve('sh/e1sf65o3').text='Implantar e testar os containers Pet Joyful no CloudStack; evoluir o mobile.';
p.resolve('sh/q50nydsj').text='09  /  REDAÇÃO TÉCNICA';
p.resolve('sh/xc7eds76').text='10  /  DEMONSTRAÇÃO';
p.resolve('sh/547mhg3m').text='11  /  VALIDAÇÃO';
const slide=p.slides.insert({after:p.slides.items[11],layout:'CONTENT'}).slide;
slide.background.fill='#F6FBF7';
function shape(name,geometry,pos,fill='none',stroke='none',strokeWidth=0){return slide.shapes.add({geometry,name,position:pos,fill,line:{style:'solid',fill:stroke,width:strokeWidth},insets:0});}
function text(name,value,x,y,w,h,size,color,bold=false){const s=shape(name,'textbox',{left:x,top:y,width:w,height:h});s.text=value;s.text.style={fontSize:size,typeface:'Arial',color,bold,alignment:'left'};s.text.insets=0;return s;}
function card(name,x,y,w,h,title,body,bodySize=15){
 shape(`${name} fundo`,'roundRect',{left:x,top:y,width:w,height:h},'#FFFFFF','#B6E2C5',1.2);
 const compact=h<=64;
 text(`${name} título`,title,x+16,y+(compact?7:12),w-32,compact?19:23,compact?13.5:16.5,'#144A34',true);
 text(`${name} detalhe`,body,x+16,y+(compact?29:40),w-32,h-(compact?33:48),bodySize,'#263D32');
}
text('Seção','08  /  CLOUDSTACK · LABORATÓRIO LOCAL',58,36,900,27,16,'#258357',true);
text('Título','Mapa da nuvem: laboratório Apache CloudStack',58,68,1162,58,39,'#144A34',true);
text('Subtítulo','Topologia local e recursos configurados; a aplicação Pet Joyful ainda não foi implantada.',58,132,1162,34,19,'#63796C');

// Actual nested lab topology, not the future production architecture.
shape('Mapa local','roundRect',{left:58,top:187,width:744,height:421},'#E3F4E9','#B6E2C5',1.2);
text('Rótulo da infraestrutura','HOST WINDOWS · VM HYPER-V',78,198,690,20,13,'#63796C',true);
card('Host Windows',78,224,184,64,'Windows + Hyper-V','Host local',14);
shape('Seta para CloudStack','rightArrow',{left:272,top:243,width:30,height:26},'#258357','#258357',0);
card('VM CloudStack',312,224,470,64,'PetJoyful-CloudStack · 192.168.240.10','Ubuntu 24.04 · CloudStack 4.22.1.1 · KVM/libvirt · MySQL + NFS',14);

shape('Zona CloudStack','roundRect',{left:76,top:301,width:708,height:292},'#F6FBF7','#B6E2C5',1);
text('Nome da zona','ZONA ADVANCED  ·  PetJoyful-Local  ·  habilitada',94,312,670,24,16,'#144A34',true);
card('Pod',94,343,207,56,'POD','PetJoyful-Pod',14);
card('Cluster',319,343,207,56,'CLUSTER','PetJoyful-KVM · KVM',14);
card('Host KVM',544,343,222,56,'HOST KVM','Status: Up',14);
card('Rede das aplicações',94,415,190,88,'REDE ISOLADA','PetJoyful-App-Network\n172.16.1.0/24',14);
shape('Rota para VR','rightArrow',{left:290,top:445,width:25,height:24},'#258357','#258357',0);
card('Virtual Router',321,415,164,88,'ROUTER','Virtual Router + NAT\nEm execução',13.5);
shape('Rota para VM','rightArrow',{left:491,top:445,width:25,height:24},'#258357','#258357',0);
card('VM aplicação',522,415,244,88,'VM petjoyful-docker','IP privado: 172.16.1.153\nDocker / Compose',13.5);
card('Storage primário',94,519,322,55,'NFS · ARMAZENAMENTO PRIMÁRIO','/export/primary',13.5);
card('Storage secundário',433,519,333,55,'NFS · ARMAZENAMENTO SECUNDÁRIO','/export/secondary',13.5);

card('Recursos da VM',820,187,402,124,'VM DE WORKLOAD','Ubuntu 24.04 · 1 vCPU · 768 MB RAM\nDisco 20 GB · swap 1 GB\nDocker 29.1.3 · Compose 2.40.3',15);
card('Acesso e rede',820,323,402,145,'REDE E ACESSO','IP privado: 172.16.1.153\nSSH via NAT: 192.168.240.163:22, permitido apenas de 192.168.240.0/24\nSaída TCP 80/443; sem entrada pública para a aplicação.',14.5);
card('Limites do laboratório',820,480,402,128,'CAPACIDADE E DISPONIBILIDADE','VM CloudStack no Hyper-V: 6 vCPU, 4 GB RAM e VHDX de 100 GB. Ambiente all-in-one, sem alta disponibilidade; 4 GB limitam o laboratório.',14.5);

shape('Status atual fundo','roundRect',{left:58,top:619,width:1164,height:44},'#E3F4E9','#B6E2C5',1);
text('Status atual','ESTADO EM 20/10/2026  ·  Docker e Compose passaram pelo teste hello-world após reinício; containers Pet Joyful e CI/CD ainda pendentes. Render segue online.',78,627,1120,30,14.5,'#144A34',true);
// Cover the imported page-number/footer placeholders on this inserted slide, then restore the deck footer style.
shape('Fundo do rodapé','rect',{left:0,top:670,width:1280,height:50},'#F6FBF7','#F6FBF7',0);
text('Rodapé','PET JOYFUL  ·  PRÉVIA  ·  15 MIN',58,683,500,20,12,'#63796C');
text('Número do slide','13',1160,683,48,20,13,'#63796C');
const preview=await slide.export({format:'png',scale:1});
await fs.writeFile(path.join(build,'cloudstack-slide-preview.png'),new Uint8Array(await preview.arrayBuffer()));
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
const refSha=crypto.createHash('sha256').update(await fs.readFile(source)).digest('hex');
const {finalizePresentation}=await import(pathToFileURL(path.join(skillDir,'container_tools/artifact_tool_utils.mjs')).href);
try {
 const result=await finalizePresentation({
  explicitTotalSlideCount:17,workspaceDir:workspace,candidatePath:candidate,finalPath:final,
  pythonExecutable:path.join(runtime,'python/python.exe'),
  integrityValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
  fontPolicy:{basis:'reference',families:['Arial','Consolas'],referencePath:source,referenceSha256:refSha},
  verifyArtifactToolImport:true,receiptPath:path.join(build,'validation.json'),
 });
 console.log(JSON.stringify({slideCount:p.slides.items.length,final,result},null,2));
} catch(error) {
 // The workspace finalizer can validate the staged deck but Windows may block its final hard-link publish.
 if(error?.code!=='EPERM') throw error;
 console.log(JSON.stringify({slideCount:p.slides.items.length,final,validatedCandidate:candidate,publishError:'EPERM at final hard-link step'},null,2));
}
