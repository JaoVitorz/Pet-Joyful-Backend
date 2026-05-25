Instruções para disparar o workflow CI/CD

Este arquivo foi criado localmente para facilitar um commit de teste que dispara o workflow GitHub Actions.

Passos sugeridos (PowerShell / Windows):

1. Confirme o branch atual e troque para `develop` ou `main` conforme deseja executar:

```powershell
git checkout develop
git pull origin develop
```

2. Crie um commit de teste (somente alteração pequena):

```powershell
git add .github/TRIGGER_WORKFLOW.md
git commit -m "ci: trigger workflow de teste"
```

3. Envie para o repositório remoto (isso acionará o workflow):

```powershell
git push origin develop
```

Notas:
- O workflow está configurado para rodar em push para `main` e `develop`.
- A etapa de deploy para Render só roda em `main` (protegida), então se quiser testar deploy, envie para `main`.
- Secrets já configuradas: `RENDER_API_KEY`, `DOCKERHUB_USERNAME`, `DOCKER_PASSWORD`, `SONAR_TOKEN`, `DISCORD_WEBHOOK_URL`.

Se quiser, eu crio um commit local com uma alteração que você pode apenas `git push` (me diga em qual branch prefere enviar). 
