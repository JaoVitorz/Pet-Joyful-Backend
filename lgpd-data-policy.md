# Exportação e exclusão de dados da conta

Esta implementação usa o ID do usuário autenticado como vínculo. Registros antigos que não possuem `userId` não são atribuídos automaticamente por coincidência de email, pois o email era preenchido livremente na requisição.

| Registro | Exportação | Exclusão | Justificativa |
| --- | --- | --- | --- |
| Conta (`users`) | Nome, email, CPF, tipo e datas | Remoção | Não há hipótese de conservação configurada no aplicativo. Senha e tokens não entram no JSON. |
| Comentários (`postmessages`) de autoria comprovada | Conteúdo e metadados do comentário | Remoção | O vínculo é o `userId` persistido. |
| Denúncias (`denunciamessages`) de autoria comprovada | Conteúdo sem identificador pessoal do alvo | Remoção | Evita expor dados de terceiros. |
| Posts (`posts`) de autoria comprovada | Conteúdo, datas e URL da imagem | Anonimização do post e remoção física da imagem | Somente o ID e um título neutro permanecem para preservar comentários de outras pessoas; autor, conteúdo e datas são removidos. |
| Denúncias de terceiros cujo alvo é a conta excluída | Não entram na exportação do alvo | Remoção do ID do alvo e substituição da descrição por texto neutro | Preserva o registro da outra pessoa sem manter referência pessoal ao titular excluído. |
| Registros legados sem `userId` | Exigem verificação independente | Exigem verificação independente | Correspondência de email não prova autoria. |

Não há retenção de dados pessoais implementada por hipótese legal específica. Se surgir obrigação de conservação, a base legal, a categoria, o prazo e o acesso restrito devem ser definidos antes de alterar esta política.

## Operação e limites

- O backend principal e o serviço de posts devem usar a mesma base MongoDB e o mesmo `JWT_SECRET`.
- Se houver imagens de posts, o backend principal precisa de `POSTS_SERVICE_URL` apontando para o serviço de posts. A exclusão é interrompida com HTTP 503 quando a remoção da mídia falha. A conta fica bloqueada e o mesmo pedido pode ser repetido.
- O serviço de posts usa `POSTS_UPLOAD_DIR` para localizar os arquivos; o padrão é `uploads` relativo ao diretório de execução. O serviço só entrega arquivos ainda referenciados por posts ativos.
- Logs de novas requisições não armazenam corpo, headers, email ou identificadores da rota. A política de retenção de backups e de logs anteriores depende da infraestrutura e precisa ser aplicada fora deste repositório.
- A resposta de exclusão informa os placeholders preservados em `retainedRecords`. O campo `manualReviewRequired` aponta os dados legados e cópias de infraestrutura que precisam de tratamento separado.

Referências: [LGPD, arts. 16 e 18](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) e [ANPD — Direitos dos Titulares](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares).
