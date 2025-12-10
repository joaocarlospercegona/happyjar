# Especificação Completa do Backend - HappyJar Mobile App

## 📋 Visão Geral

Este documento descreve todas as rotas, endpoints, modelos de dados e regras de negócio necessárias para o backend do aplicativo HappyJar - um app mobile para registrar momentos de felicidade.

## 🗺️ Fluxo Completo do Usuário

1. **SplashScreen** (`/`) → Vídeo de 5 segundos → Redireciona para `/boasVindas`
2. **BoasVindas** (`/boasVindas`) → Login com Google OAuth → Sucesso → `/momento`
3. **Momento** (`/momento`) → Tela principal para registrar felicidade
4. **MeusDados** (`/meusDados`) → Ver/editar dados do usuário
5. **ApagarDados** (`/apagarDados`) → Fluxo de 3 etapas para deletar conta
6. **Termos** (`/termos`) → Política de privacidade e termos

---

## 🔐 1. AUTENTICAÇÃO

### 1.1. POST `/auth/google`
**Descrição**: Autentica usuário via Google OAuth e cria/atualiza registro no banco

**Request Body**:
```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4ZDg..." // JWT token do Google
}
```

**Processo Backend**:
1. Validar o `googleToken` com a API do Google (`https://oauth2.googleapis.com/tokeninfo?id_token={token}`)
2. Extrair dados: `email`, `name`, `picture`, `sub` (Google ID)
3. Verificar se usuário já existe no banco pelo `email` ou `googleId`
4. Se NÃO existir:
   - Criar novo registro na tabela `usuarios`
   - Setar `criadoEm` = data/hora atual
   - Setar `ativo` = true
5. Se existir:
   - Atualizar `ultimoLogin` = data/hora atual
   - Atualizar `foto` se mudou
   - Atualizar `nome` se mudou
6. Gerar JWT token da aplicação (com `userId`, `email`, expiração 30 dias)
7. Retornar dados do usuário + token

**Response Sucesso (200)**:
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT da aplicação
  "usuario": {
    "id": "uuid-v4-aqui",
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "foto": "https://lh3.googleusercontent.com/a/ACg8ocK..."
  }
}
```

**Response Erro (401)**:
```json
{
  "sucesso": false,
  "erro": "Token do Google inválido ou expirado"
}
```

**Response Erro (500)**:
```json
{
  "sucesso": false,
  "erro": "Erro ao processar autenticação"
}
```

---

## 📝 2. MOMENTOS DE FELICIDADE

### 2.1. POST `/momentos`
**Descrição**: Salva um novo momento de felicidade do usuário

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Request Body**:
```json
{
  "texto": "Hoje fiquei feliz quando meu filho aprendeu a andar!"
}
```

**Validações**:
- `texto` é obrigatório
- `texto` deve ter entre 1 e 1000 caracteres
- Token JWT deve ser válido
- Usuário deve estar ativo (`ativo = true`)

**Processo Backend**:
1. Validar JWT e extrair `userId`
2. Verificar se usuário existe e está ativo
3. Criar registro na tabela `momentos`:
   - `id` = UUID v4
   - `usuarioId` = extraído do token
   - `texto` = texto enviado
   - `criadoEm` = data/hora atual
4. **IMPORTANTE**: Verificar regra de enquete de sentimento:
   - A cada 10 momentos salvos pelo usuário, retornar `mostrarEnquete: true`
   - Contar total de momentos do usuário no banco
   - Se `(totalMomentos % 10) === 0`, então `mostrarEnquete = true`
5. Retornar sucesso

**Response Sucesso (201)**:
```json
{
  "sucesso": true,
  "momento": {
    "id": "uuid-do-momento",
    "texto": "Hoje fiquei feliz quando meu filho aprendeu a andar!",
    "criadoEm": "2025-12-09T14:30:00Z"
  },
  "mostrarEnquete": true // true se deve mostrar tela de sentimento (a cada 10 momentos)
}
```

**Response Erro (400)**:
```json
{
  "sucesso": false,
  "erro": "O texto do momento é obrigatório"
}
```

**Response Erro (401)**:
```json
{
  "sucesso": false,
  "erro": "Token inválido ou expirado"
}
```

---

### 2.2. GET `/momentos`
**Descrição**: Lista todos os momentos do usuário autenticado

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Query Parameters** (opcionais):
- `page` (default: 1) - Página da paginação
- `limit` (default: 20) - Itens por página
- `dataInicio` - Filtrar momentos a partir desta data (ISO 8601)
- `dataFim` - Filtrar momentos até esta data (ISO 8601)

**Processo Backend**:
1. Validar JWT e extrair `userId`
2. Buscar momentos do usuário ordenados por `criadoEm DESC`
3. Aplicar paginação
4. Retornar lista

**Response Sucesso (200)**:
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

### 2.3. GET `/momentos/estatisticas`
**Descrição**: Retorna estatísticas dos momentos do usuário

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Response Sucesso (200)**:
```json
{
  "sucesso": true,
  "estatisticas": {
    "totalMomentos": 87,
    "momentosEstaSemana": 5,
    "momentosEsteMes": 23,
    "primeiroMomento": "2024-01-15T08:00:00Z",
    "ultimoMomento": "2025-12-09T14:30:00Z",
    "diasConsecutivos": 12 // sequência atual de dias com pelo menos 1 momento
  }
}
```

---

## 😊 3. REGISTRO DE SENTIMENTOS

### 3.1. POST `/sentimentos`
**Descrição**: Salva o sentimento atual do usuário (aparece a cada 10 momentos)

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Request Body**:
```json
{
  "nivel": 1  // 1 = triste, 2 = normal, 3 = feliz
}
```

**Validações**:
- `nivel` é obrigatório
- `nivel` deve ser 1, 2 ou 3

**Processo Backend**:
1. Validar JWT e extrair `userId`
2. Criar registro na tabela `sentimentos`:
   - `id` = UUID v4
   - `usuarioId` = extraído do token
   - `nivel` = 1, 2 ou 3
   - `criadoEm` = data/hora atual
3. Retornar sucesso

**Response Sucesso (201)**:
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

**Response Erro (400)**:
```json
{
  "sucesso": false,
  "erro": "Nível de sentimento inválido. Deve ser 1, 2 ou 3"
}
```

---

### 3.2. GET `/sentimentos/historico`
**Descrição**: Retorna histórico de sentimentos registrados

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Response Sucesso (200)**:
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
    "mediaGeral": 2.4, // média dos níveis
    "distribuicao": {
      "triste": 2,   // quantos nivel 1
      "normal": 6,   // quantos nivel 2
      "feliz": 7     // quantos nivel 3
    }
  }
}
```

---

## 👤 4. DADOS DO USUÁRIO

### 4.1. GET `/usuarios/me`
**Descrição**: Retorna dados completos do usuário autenticado

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Response Sucesso (200)**:
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

### 4.2. PUT `/usuarios/me`
**Descrição**: Atualiza dados do usuário

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Request Body**:
```json
{
  "nome": "João Pedro Silva",  // opcional
  "email": "novoemail@gmail.com"  // opcional
}
```

**Validações**:
- `email` deve ser válido (regex)
- `nome` deve ter entre 2 e 100 caracteres
- Se alterar email, verificar se já não existe outro usuário com esse email

**Response Sucesso (200)**:
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

**Response Erro (409)**:
```json
{
  "sucesso": false,
  "erro": "Este email já está sendo usado por outra conta"
}
```

---

### 4.3. DELETE `/usuarios/me`
**Descrição**: Deleta permanentemente a conta do usuário e TODOS os seus dados

**Headers**:
```
Authorization: Bearer {token-jwt-da-aplicacao}
```

**Processo Backend** (MUITO IMPORTANTE - GDPR Compliance):
1. Validar JWT e extrair `userId`
2. **DELETAR EM CASCATA** (nesta ordem):
   - Deletar todos registros de `sentimentos` onde `usuarioId = userId`
   - Deletar todos registros de `momentos` onde `usuarioId = userId`
   - Deletar registro de `usuarios` onde `id = userId`
3. Invalidar o token JWT (adicionar à blacklist ou expirar)
4. Retornar sucesso

**Response Sucesso (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Sua conta e todos os seus dados foram deletados permanentemente"
}
```

**Response Erro (401)**:
```json
{
  "sucesso": false,
  "erro": "Token inválido ou expirado"
}
```

---

## 🗄️ 5. MODELO DE DADOS (DATABASE SCHEMA)

### Tabela: `usuarios`

```sql
CREATE TABLE usuarios (
  id VARCHAR(36) PRIMARY KEY,              -- UUID v4
  googleId VARCHAR(255) UNIQUE NOT NULL,   -- ID do usuário no Google
  email VARCHAR(255) UNIQUE NOT NULL,      -- Email do Google
  nome VARCHAR(255) NOT NULL,              -- Nome completo
  foto TEXT,                                -- URL da foto do Google
  ativo BOOLEAN DEFAULT true,              -- Se conta está ativa
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ultimoLogin TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_googleId (googleId),
  INDEX idx_ativo (ativo)
);
```

### Tabela: `momentos`

```sql
CREATE TABLE momentos (
  id VARCHAR(36) PRIMARY KEY,              -- UUID v4
  usuarioId VARCHAR(36) NOT NULL,          -- FK para usuarios.id
  texto TEXT NOT NULL,                     -- Texto do momento de felicidade
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_criadoEm (criadoEm)
);
```

### Tabela: `sentimentos`

```sql
CREATE TABLE sentimentos (
  id VARCHAR(36) PRIMARY KEY,              -- UUID v4
  usuarioId VARCHAR(36) NOT NULL,          -- FK para usuarios.id
  nivel TINYINT NOT NULL,                  -- 1 = triste, 2 = normal, 3 = feliz
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_criadoEm (criadoEm),
  CHECK (nivel IN (1, 2, 3))
);
```

---

## 🔒 6. SEGURANÇA E MIDDLEWARE

### 6.1. Middleware de Autenticação
Todas as rotas exceto `/auth/google` devem ter middleware que:
1. Verifica se header `Authorization` existe
2. Extrai token do formato `Bearer {token}`
3. Valida assinatura do JWT
4. Verifica se não expirou
5. Extrai `userId` do payload
6. Verifica se usuário existe e está ativo no banco
7. Injeta `userId` no contexto da requisição

### 6.2. CORS
Permitir origens:
- `http://localhost:9000` (dev)
- `capacitor://localhost` (mobile)
- `http://localhost` (mobile)

### 6.3. Rate Limiting
- Autenticação: 10 tentativas por 15 minutos por IP
- Criar momento: 100 por hora por usuário
- Outras rotas: 300 por hora por usuário

---

## 📱 7. COMPORTAMENTO DO FRONTEND (Para Referência)

### Fluxo de Login (`/boasVindas`)
1. Usuário clica "Entrar com Google"
2. Abre popup do Google OAuth
3. Usuário autentica no Google
4. Google retorna `credential` (JWT)
5. Frontend chama `POST /auth/google` com o `credential`
6. Backend valida e retorna token da aplicação
7. Frontend salva em `localStorage`:
   - `usuario`: objeto com nome, email, foto, id
   - `token`: JWT da aplicação
8. Redireciona para `/momento`

### Fluxo de Momento (`/momento`)
**Step 1 - GravarMomento**:
1. Usuário digita texto "Hoje fiquei feliz quando..."
2. Clica "Guardar a Felicidade"
3. Frontend chama `POST /momentos` com o texto
4. Backend retorna `{ mostrarEnquete: true/false }`
5. Se `mostrarEnquete === true`: vai para Step 4 (SentimentoMomento)
6. Se `mostrarEnquete === false`: vai para Step 2 (SucessoMomento)

**Step 2 - SucessoMomento**:
1. Mostra "Sua Felicidade está guardada!"
2. Usuário clica "Feito!"
3. Volta para Step 1

**Step 4 - SentimentoMomento** (a cada 10 momentos):
1. Mostra "Como você se sente no agora?"
2. 3 emojis: triste (1), normal (2), feliz (3)
3. Usuário clica em um emoji
4. Usuário clica "Salvar sentimento"
5. Frontend chama `POST /sentimentos` com o nível
6. Volta para Step 1
7. OU usuário clica "Não fazer isso agora" → Volta para Step 1 (sem salvar)

### Fluxo de Apagar Dados (`/apagarDados`)
**Step 1 - ApagarDados**:
1. Mostra aviso "Isso vai apagar sua conta e todas suas felicidades"
2. Opções: "NÃO! Ainda quero usar o App" → Step 3 (Desistiu)
3. Ou: "Sim, quero sair daqui" → Step 2 (Confirmar)

**Step 2 - ConfirmarApagarDados**:
1. Mostra "Essa ação não pode ser desfeita!"
2. Opções: "NÃO! Ainda quero usar o App" → Step 3 (Desistiu)
3. Ou: "Sim, pode apagar tudo" → Chama `DELETE /usuarios/me` → Limpa localStorage → Redireciona `/boasVindas`

**Step 3 - DesistiuApagarDados**:
1. Mostra "Ainda bem! Continue guardando suas felicidades"
2. Clica "Continuar Usando o App" → Redireciona `/momento`

### Fluxo de Meus Dados (`/meusDados`)
1. Ao montar página: Chama `GET /usuarios/me` para preencher campos
2. Usuário edita nome e/ou email
3. Clica "Atualizar Dados"
4. Chama `PUT /usuarios/me` com novos dados
5. Atualiza `localStorage.usuario` com novos dados
6. Mostra notificação de sucesso

---

## 🧪 8. CASOS DE TESTE IMPORTANTES

### 8.1. Autenticação
- ✅ Login com Google válido deve criar novo usuário
- ✅ Login com Google de usuário existente deve atualizar `ultimoLogin`
- ✅ Token Google inválido deve retornar 401
- ✅ Token Google expirado deve retornar 401

### 8.2. Momentos
- ✅ Criar momento com token válido deve retornar 201
- ✅ A cada 10 momentos deve retornar `mostrarEnquete: true`
- ✅ Momento sem token deve retornar 401
- ✅ Momento com texto vazio deve retornar 400
- ✅ Momento com mais de 1000 caracteres deve retornar 400
- ✅ Listar momentos deve retornar apenas do usuário autenticado

### 8.3. Sentimentos
- ✅ Criar sentimento com nível 1, 2 ou 3 deve funcionar
- ✅ Criar sentimento com nível 0 ou 4 deve retornar 400
- ✅ Histórico de sentimentos deve calcular média corretamente

### 8.4. Usuários
- ✅ Atualizar email para um já existente deve retornar 409
- ✅ Deletar usuário deve deletar TODOS momentos e sentimentos em cascata
- ✅ Após deletar, token deve ser inválido

---

## 🚀 9. VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
# JWT
JWT_SECRET=seu-secret-muito-seguro-aqui-min-32-caracteres
JWT_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=happyjar
DB_USER=root
DB_PASSWORD=sua-senha

# Server
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=http://localhost:9000,capacitor://localhost,http://localhost
```

---

## 📝 10. HEADERS DE RESPOSTA RECOMENDADOS

Todas as respostas devem incluir:
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## 🎯 11. RESUMO DE ENDPOINTS

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/auth/google` | ❌ Não | Login com Google OAuth |
| POST | `/momentos` | ✅ Sim | Criar momento de felicidade |
| GET | `/momentos` | ✅ Sim | Listar momentos do usuário |
| GET | `/momentos/estatisticas` | ✅ Sim | Estatísticas de momentos |
| POST | `/sentimentos` | ✅ Sim | Registrar sentimento atual |
| GET | `/sentimentos/historico` | ✅ Sim | Histórico de sentimentos |
| GET | `/usuarios/me` | ✅ Sim | Dados do usuário |
| PUT | `/usuarios/me` | ✅ Sim | Atualizar dados |
| DELETE | `/usuarios/me` | ✅ Sim | Deletar conta permanentemente |

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 - Essencial
- [ ] Criar banco de dados com 3 tabelas
- [ ] Implementar autenticação Google OAuth
- [ ] Implementar middleware de JWT
- [ ] Endpoint POST `/auth/google`
- [ ] Endpoint POST `/momentos`
- [ ] Endpoint GET `/momentos`
- [ ] Lógica de "a cada 10 momentos mostrar enquete"

### Fase 2 - Importante
- [ ] Endpoint POST `/sentimentos`
- [ ] Endpoint GET `/usuarios/me`
- [ ] Endpoint PUT `/usuarios/me`
- [ ] Endpoint DELETE `/usuarios/me` com cascata
- [ ] CORS configurado
- [ ] Rate limiting

### Fase 3 - Extras
- [ ] Endpoint GET `/momentos/estatisticas`
- [ ] Endpoint GET `/sentimentos/historico`
- [ ] Cálculo de dias consecutivos
- [ ] Logs de auditoria
- [ ] Backup automático

---

## 🔧 TECNOLOGIAS RECOMENDADAS

- **Node.js** com Express.js ou Fastify
- **Database**: MySQL, PostgreSQL ou MongoDB
- **ORM**: Prisma, Sequelize ou TypeORM
- **JWT**: jsonwebtoken
- **Validação**: Joi ou Zod
- **Google OAuth**: google-auth-library

---

## 📞 INFORMAÇÕES ADICIONAIS

- Todos os IDs devem ser UUID v4
- Todas as datas devem ser em formato ISO 8601
- Timezone: UTC (converter no frontend)
- Encoding: UTF-8
- Todas as respostas devem ser JSON
- Paginação default: 20 itens por página
- Máximo de caracteres para momento: 1000

---

**Documento criado em**: 9 de dezembro de 2025
**Versão**: 1.0
**Para**: Implementação do backend do HappyJar Mobile App
