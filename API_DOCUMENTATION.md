# HappyJar API - Documentação de Rotas

Base URL: `http://localhost:3333`

---

## 🔐 AUTENTICAÇÃO

### POST `/api/auth/google`
**Descrição**: Login com Google OAuth

**Headers**:
```
Content-Type: application/json
```

**Payload**:
```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4ZDg..."
}
```

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-v4-aqui",
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "foto": "https://lh3.googleusercontent.com/a/ACg8ocK..."
  }
}
```

**Resposta Erro (401)**:
```json
{
  "sucesso": false,
  "erro": "Token do Google inválido ou expirado"
}
```

**Resposta Erro (400)**:
```json
{
  "sucesso": false,
  "erro": "Erro ao processar autenticação"
}
```

---

## 📝 MOMENTOS

### POST `/api/momentos`
**Descrição**: Criar um novo momento de felicidade

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
Content-Type: application/json
```

**Payload**:
```json
{
  "texto": "Hoje fiquei feliz quando meu filho aprendeu a andar!"
}
```

**Validações**:
- `texto` é obrigatório
- `texto` deve ter no máximo 1000 caracteres

**Resposta Sucesso (201)**:
```json
{
  "sucesso": true,
  "momento": {
    "id": "uuid-do-momento",
    "texto": "Hoje fiquei feliz quando meu filho aprendeu a andar!",
    "criadoEm": "2025-12-09T14:30:00Z"
  },
  "mostrarEnquete": true
}
```

**Notas**:
- `mostrarEnquete` será `true` a cada 10 momentos salvos
- Quando `true`, frontend deve mostrar tela de sentimento

**Resposta Erro (400)**:
```json
{
  "sucesso": false,
  "erro": "O texto do momento é obrigatório"
}
```

**Resposta Erro (401)**:
```json
{
  "sucesso": false,
  "erro": "Token inválido ou expirado"
}
```

---

### GET `/api/momentos`
**Descrição**: Listar momentos do usuário com paginação

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
```

**Query Parameters**:
```
page=1              (opcional, default: 1)
limit=20            (opcional, default: 20)
dataInicio=2025-01-01T00:00:00Z  (opcional)
dataFim=2025-12-31T23:59:59Z     (opcional)
```

**Exemplo de URL**:
```
GET /api/momentos?page=1&limit=20
GET /api/momentos?dataInicio=2025-12-01T00:00:00Z&dataFim=2025-12-09T23:59:59Z
```

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "momentos": [
    {
      "id": "uuid-1",
      "texto": "Hoje fiquei feliz quando...",
      "criadoEm": "2025-12-09T14:30:00Z"
    },
    {
      "id": "uuid-2",
      "texto": "Fiquei feliz ao ver meu jardim florido",
      "criadoEm": "2025-12-08T10:15:00Z"
    }
  ],
  "paginacao": {
    "paginaAtual": 1,
    "totalPaginas": 5,
    "totalItens": 87,
    "itensPorPagina": 20
  }
}
```

---

### GET `/api/momentos/estatisticas`
**Descrição**: Obter estatísticas dos momentos do usuário

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
```

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "estatisticas": {
    "totalMomentos": 87,
    "momentosEstaSemana": 5,
    "momentosEsteMes": 23,
    "primeiroMomento": "2024-01-15T08:00:00Z",
    "ultimoMomento": "2025-12-09T14:30:00Z",
    "diasConsecutivos": 12
  }
}
```

**Notas**:
- `diasConsecutivos`: Sequência atual de dias com pelo menos 1 momento

---

## 😊 SENTIMENTOS

### POST `/api/sentimentos`
**Descrição**: Registrar sentimento atual (aparece a cada 10 momentos)

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
Content-Type: application/json
```

**Payload**:
```json
{
  "nivel": 3
}
```

**Validações**:
- `nivel` é obrigatório
- `nivel` deve ser 1, 2 ou 3
  - 1 = triste 😢
  - 2 = normal 😐
  - 3 = feliz 😊

**Resposta Sucesso (201)**:
```json
{
  "sucesso": true,
  "sentimento": {
    "id": "uuid-do-sentimento",
    "nivel": 3,
    "criadoEm": "2025-12-09T14:35:00Z"
  }
}
```

**Resposta Erro (400)**:
```json
{
  "sucesso": false,
  "erro": "Nível de sentimento inválido. Deve ser 1, 2 ou 3"
}
```

---

### GET `/api/sentimentos/historico`
**Descrição**: Obter histórico completo de sentimentos

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
```

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "sentimentos": [
    {
      "id": "uuid-1",
      "nivel": 3,
      "criadoEm": "2025-12-09T14:35:00Z"
    },
    {
      "id": "uuid-2",
      "nivel": 2,
      "criadoEm": "2025-12-01T09:20:00Z"
    }
  ],
  "resumo": {
    "totalRegistros": 15,
    "mediaGeral": 2.4,
    "distribuicao": {
      "triste": 2,
      "normal": 6,
      "feliz": 7
    }
  }
}
```

---

## 👤 USUÁRIOS

### GET `/api/usuarios/me`
**Descrição**: Obter dados completos do usuário autenticado

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
```

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "usuario": {
    "id": "uuid-do-usuario",
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "foto": "https://lh3.googleusercontent.com/a/ACg8ocK...",
    "criadoEm": "2024-01-15T08:00:00Z",
    "ultimoLogin": "2025-12-09T14:00:00Z",
    "ativo": true,
    "estatisticas": {
      "totalMomentos": 87,
      "totalSentimentos": 15
    }
  }
}
```

---

### PUT `/api/usuarios/me`
**Descrição**: Atualizar dados do usuário

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
Content-Type: application/json
```

**Payload**:
```json
{
  "nome": "João Pedro Silva",
  "email": "novoemail@gmail.com"
}
```

**Validações**:
- `nome` (opcional): Entre 2 e 100 caracteres
- `email` (opcional): Deve ser um email válido

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "usuario": {
    "id": "uuid-do-usuario",
    "nome": "João Pedro Silva",
    "email": "novoemail@gmail.com",
    "foto": "https://lh3.googleusercontent.com/a/ACg8ocK..."
  }
}
```

**Resposta Erro (409)**:
```json
{
  "sucesso": false,
  "erro": "Este email já está sendo usado por outra conta"
}
```

---

### DELETE `/api/usuarios/me`
**Descrição**: Deletar permanentemente a conta e todos os dados (GDPR)

**Headers**:
```
Authorization: Bearer {seu-token-jwt}
```

**Payload**: Nenhum

**Resposta Sucesso (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Sua conta e todos os seus dados foram deletados permanentemente"
}
```

**Notas IMPORTANTES**:
- Esta ação é IRREVERSÍVEL
- Deleta em cascata:
  - Todos os momentos do usuário
  - Todos os sentimentos do usuário
  - Registro do usuário
- Token JWT se torna inválido após deletar

---

## 📊 RESUMO DE ENDPOINTS

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/auth/google` | ❌ Não | Login com Google OAuth |
| POST | `/api/momentos` | ✅ Sim | Criar momento de felicidade |
| GET | `/api/momentos` | ✅ Sim | Listar momentos (paginado) |
| GET | `/api/momentos/estatisticas` | ✅ Sim | Estatísticas de momentos |
| POST | `/api/sentimentos` | ✅ Sim | Registrar sentimento (1-3) |
| GET | `/api/sentimentos/historico` | ✅ Sim | Histórico de sentimentos |
| GET | `/api/usuarios/me` | ✅ Sim | Dados do usuário |
| PUT | `/api/usuarios/me` | ✅ Sim | Atualizar dados |
| DELETE | `/api/usuarios/me` | ✅ Sim | Deletar conta permanentemente |

---

## 🔒 AUTENTICAÇÃO

Todas as rotas exceto `/api/auth/google` requerem autenticação JWT.

**Como usar**:
1. Faça login com `POST /api/auth/google`
2. Salve o `token` retornado
3. Envie o token em todas as outras requisições:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token JWT**:
- Validade: 30 dias
- Contém: `userId` e `email`
- Se expirado ou inválido: HTTP 401

---

## ⚠️ CÓDIGOS DE ERRO

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos (validação) |
| 401 | Não autenticado / Token inválido |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: email duplicado) |
| 500 | Erro interno do servidor |

---

## 🧪 EXEMPLOS DE USO (CURL)

### Login
```bash
curl -X POST http://localhost:3333/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"googleToken": "seu-token-do-google"}'
```

### Criar Momento
```bash
curl -X POST http://localhost:3333/api/momentos \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{"texto": "Hoje fiquei feliz quando aprendi algo novo!"}'
```

### Listar Momentos
```bash
curl -X GET "http://localhost:3333/api/momentos?page=1&limit=10" \
  -H "Authorization: Bearer seu-token-jwt"
```

### Registrar Sentimento
```bash
curl -X POST http://localhost:3333/api/sentimentos \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{"nivel": 3}'
```

### Obter Dados do Usuário
```bash
curl -X GET http://localhost:3333/api/usuarios/me \
  -H "Authorization: Bearer seu-token-jwt"
```

### Atualizar Dados
```bash
curl -X PUT http://localhost:3333/api/usuarios/me \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Novo Nome", "email": "novo@email.com"}'
```

### Deletar Conta
```bash
curl -X DELETE http://localhost:3333/api/usuarios/me \
  -H "Authorization: Bearer seu-token-jwt"
```

---

## 📝 NOTAS IMPORTANTES

1. **Datas**: Todas as datas estão em formato ISO 8601 (UTC)
2. **UUIDs**: Todos os IDs são UUIDs v4
3. **Encoding**: UTF-8
4. **Content-Type**: `application/json` para todas as requisições POST/PUT
5. **CORS**: Configurado para `capacitor://localhost` e `http://localhost:9000`

---

**Documento gerado em**: 9 de dezembro de 2025  
**Versão da API**: 1.0  
**Backend**: NestJS + PostgreSQL
