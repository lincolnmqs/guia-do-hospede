# Guia Digital do Hóspede

Plataforma web que entrega a cada hóspede um guia personalizado e enriquecido por IA para o imóvel em que está hospedado. O hóspede acessa a URL do seu imóvel (`/FLN001`, por exemplo), encontra informações de acesso, regras da estadia e comodidades, além de um **Guia de Experiências** gerado pela OpenAI com restaurantes, atrações e serviços locais reais — e um **assistente de chat** que responde perguntas em linguagem natural exclusivamente com base nos dados daquele imóvel.

---

## Demo

> **URL pública:** `https://guia-do-hospede.projectsync.com.br`

Imóveis de exemplo disponíveis após rodar o seed:

| Código | Descrição |
|--------|-----------|
| [`/FLN001`](http://localhost:3000/FLN001) | Apartamento em Florianópolis/SC |
| [`/GRM001`](http://localhost:3000/GRM001) | Chalé em Gramado/RS |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, standalone output) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS v4 (`@theme` em CSS) |
| Banco de dados | PostgreSQL + Prisma 7.8 + `@prisma/adapter-pg` |
| IA | OpenAI SDK 6.x (raw) |
| Validação | Zod v4 |
| Testes | Vitest + Testing Library |
| Componentes | Atomic Design (atoms → molecules → organisms → templates) |
| Tipografia | Sora (títulos) + DM Sans (corpo) |
| Runtime | Node.js 20 / Docker multi-stage |

---

## Decisões técnicas

### Monolito Next.js (App Router)

A escolha por um único repositório Next.js elimina a latência de round-trip entre frontend e backend: as páginas de imóvel são **Server Components** que buscam dados diretamente no banco sem passar por uma API REST intermediária. Apenas componentes que precisam de interatividade (ExperienceGuide, ChatAssistant) são Client Components (`"use client"`), seguindo o padrão de "ilhas de interatividade". O output `standalone` permite deploy em qualquer VPS ou container sem a Vercel.

### OpenAI SDK raw (sem Vercel AI SDK)

O SDK oficial da OpenAI é usado diretamente, sem abstrações de terceiros. Isso dá controle total sobre o `response_format` (structured output com `json_schema` e `strict: true`) para geração do guia, e sobre o loop SSE manual para o chat. O formato SSE escolhido — `data: {"token":"..."}` com terminador `data: [DONE]` — é simples e não cria acoplamento com nenhum framework de streaming.

### Modelo de dados e idempotência do ExperienceGuide

O modelo `ExperienceGuide` tem relação `@unique` com `Property`, garantindo no nível do banco que cada imóvel tem no máximo um guia. A função `getOrCreateExperienceGuide` implementa o padrão **get-or-create idempotente**: na primeira requisição o guia é gerado via OpenAI e persistido; nas chamadas seguintes o registro já existente é retornado sem nova chamada à API. Isso evita custo desnecessário de tokens, garante consistência entre sessões e torna a resposta praticamente instantânea após a primeira geração.

### Chat grounded (anti-alucinação)

O system prompt do assistente injeta todos os dados estruturados do imóvel (endereço, Wi-Fi, regras, contato do anfitrião, restaurantes e atrações do guia) e contém instruções explícitas: _"Responda SOMENTE com base nos dados do imóvel fornecidos abaixo"_ e _"Nunca invente dados"_. Se o hóspede perguntar algo fora do escopo, o assistente é instruído a admitir a ausência da informação e sugerir contato com o anfitrião — em vez de aluciná-la.

### Streaming SSE no chat

A rota `POST /api/properties/[code]/chat` usa a API de streaming da OpenAI (`stream: true`) e converte o `AsyncIterable` em um `ReadableStream<Uint8Array>` com tokens SSE progressivos. No cliente, o hook `useChatStream` consome esse stream token a token, atualizando o estado React incrementalmente — o hóspede vê a resposta crescer em tempo real.

### Dados de seed em modelo externo (não no código)

Os dados dos imóveis vivem em `prisma/data/properties.json` — um **modelo de dados**, não literais espalhados no back-end. O `prisma/seed.ts` é pura orquestração: carrega o JSON, **valida com Zod** (`lib/schemas/property-seed.ts`, falha rápido se o arquivo estiver malformado) e faz **upsert idempotente** (cria quando novo, edita quando existente). Cadastrar um novo imóvel é adicionar uma entrada no JSON — nenhuma mudança de código.

### Armazenamento de imagens em object storage (MinIO/S3)

As fotos dos imóveis são **self-hosted** em um bucket MinIO (S3-compatível), em vez de hotlinks externos. O banco persiste apenas **URLs públicas estáveis** (nunca binários), derivadas do código do imóvel (`properties/<CODE>/<n>.jpg`). O script `npm run images:upload` (`scripts/seed-images.ts`) envia os bytes uma única vez e garante a policy de leitura pública; `lib/storage/minio.ts` encapsula o client. As URLs são servidas via `next/image` (host liberado em `next.config.ts`, derivado de `MINIO_ENDPOINT`), com `priority` na hero, `sizes` corretos e cache imutável.

### Rate limiting do chat

A rota de chat (que consome a OpenAI) é protegida por um rate limiter in-memory (`lib/rate-limit.ts`): 20 mensagens/minuto por IP, respondendo `429` com `Retry-After`. In-memory é suficiente para o alvo single-instance (VPS/Docker); um deploy horizontal trocaria por um store compartilhado atrás da mesma interface.

### Atomic Design

Os componentes seguem a hierarquia **atoms → molecules → organisms → templates**:

- **Atoms:** primitivas reutilizáveis sem lógica de domínio (`Badge`, `Button`, `Skeleton`, `SectionTitle`, `IconText`).
- **Molecules:** composições de atoms com semântica de domínio (`AmenityItem`, `ChatMessage`, `PolicyItem`, `RestaurantCard`, `AttractionCard`, `EssentialCard`, `InfoRow`, `ChatInput`).
- **Organisms:** seções completas da página (`PropertyDetails`, `StayRules`, `AccessInfo`, `ContactCard`, `ExperienceGuide`, `ChatAssistant`, `PropertyGallery`).
- **Templates:** layout de página que recebe slots via props (`GuidePageTemplate`).

### Next.js 16 — particularidades

- `params` em `page.tsx` e `route.ts` é uma **Promise** (`Promise<{ code: string }>`); é necessário `await params` antes de desestruturar.
- `generateMetadata` também recebe params como Promise.
- As diretivas `export const dynamic = "force-dynamic"` e `export const runtime = "nodejs"` são declaradas explicitamente nas rotas que acessam o banco ou chamam a OpenAI.

---

## Arquitetura / estrutura de pastas

```
guia-do-hospede/
├── app/
│   ├── [code]/
│   │   └── page.tsx              # Server Component — guia do imóvel
│   ├── api/properties/[code]/
│   │   ├── chat/route.ts         # POST → SSE stream
│   │   └── experience-guide/route.ts  # GET → get-or-create
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx                  # Redirect / landing
│
├── components/
│   ├── atoms/                    # Badge, Button, Skeleton, SectionTitle, IconText
│   ├── molecules/                # AmenityItem, ChatMessage, RestaurantCard, …
│   ├── organisms/                # ExperienceGuide, ChatAssistant, PropertyDetails, …
│   └── templates/                # GuidePageTemplate
│
├── lib/
│   ├── ai/
│   │   ├── client.ts             # Singleton OpenAI
│   │   ├── generate-content.ts   # generateExperienceGuideContent (structured output)
│   │   ├── generate-experience-guide.ts  # getOrCreateExperienceGuide (idempotent)
│   │   ├── chat.ts               # streamChatResponse (SSE)
│   │   └── prompts.ts            # buildChatSystemPrompt + buildExperienceGuidePrompt
│   ├── db/
│   │   ├── client.ts             # Singleton Prisma
│   │   ├── property.repository.ts
│   │   └── experience-guide.repository.ts
│   ├── schemas/
│   │   ├── experience-guide.ts   # Zod schema + ExperienceGuideContent
│   │   └── property.ts
│   ├── hooks/
│   │   └── useChatStream.ts      # Hook cliente para consumir SSE
│   ├── cn.ts                     # clsx + tailwind-merge
│   └── format.ts                 # Formatadores (amenityLabel, etc.)
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                   # Popula FLN001 e GRM001
│
├── Dockerfile                    # Multi-stage: deps → builder → runner
├── docker-compose.yml            # app + postgres com volume nomeado
└── docker-entrypoint.sh          # migrate deploy → seed → node server.js
```

---

## Pré-requisitos

- **Node.js** 20+
- **PostgreSQL** 16+ (local ou Docker)
- **Conta OpenAI** com `OPENAI_API_KEY` válida

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Obrigatória | Descrição | Padrão |
|---|---|---|---|
| `DATABASE_URL` | Sim | Connection string PostgreSQL | `postgresql://guia:guia@localhost:5432/guia?schema=public` |
| `OPENAI_API_KEY` | Sim | Chave da API OpenAI | — |
| `OPENAI_MODEL` | Não | Modelo OpenAI a usar | `gpt-4o-mini` |
| `MINIO_ENDPOINT` | Não¹ | Endpoint do object storage (S3-compatível) | — |
| `MINIO_ACCESS_KEY` | Não¹ | Access key do MinIO | — |
| `MINIO_SECRET_KEY` | Não¹ | Secret key do MinIO | — |
| `MINIO_BUCKET` | Não | Bucket das imagens | `guia-do-hospede` |

¹ Necessárias apenas para (re)enviar imagens com `npm run images:upload`. Em runtime a app serve as URLs já persistidas no banco, sem depender do MinIO.

```bash
cp .env.example .env
# edite .env com seus valores
```

---

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar o .env (DATABASE_URL e OPENAI_API_KEY)
cp .env.example .env
#   → edite o .env e coloque sua OPENAI_API_KEY (o DATABASE_URL padrão já aponta
#     para o Postgres do passo 3). Sem a chave, as features de IA não geram conteúdo.

# 3. Subir o Postgres (container) e rodar migrations + seed
npm run setup
#   = npm run db:up    (sobe o Postgres via docker compose, na porta 5432, e espera ficar saudável)
#   + npm run db:setup (prisma migrate deploy + seed dos imóveis FLN001 e GRM001)

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000/FLN001](http://localhost:3000/FLN001) ou [http://localhost:3000/GRM001](http://localhost:3000/GRM001).

> Já tem um Postgres próprio? Pule o `npm run db:up`, ajuste o `DATABASE_URL` no `.env` e rode só `npm run db:setup`. Para derrubar o banco do container: `npm run db:down`.

> Na primeira visita a um imóvel, o Guia de Experiências é gerado pela OpenAI e salvo no banco. As visitas seguintes servem o conteúdo diretamente do banco (sem nova chamada à API).

---

## Como rodar com Docker (deploy em VPS)

Exporte sua chave OpenAI e suba tudo com um único comando:

```bash
export OPENAI_API_KEY="sk-..."
docker compose up --build
```

O `docker-compose.yml` sobe dois serviços:

- **`db`** — PostgreSQL 16 com volume nomeado `pgdata` (dados persistem entre reinicializações).
- **`app`** — imagem multi-stage (Node 20 Alpine). O entrypoint executa automaticamente `prisma migrate deploy`, o seed e depois `node server.js`.

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

Para usar um modelo OpenAI diferente:

```bash
OPENAI_MODEL=gpt-4o docker compose up --build
```

---

## Como rodar os testes

```bash
npm run test
```

Os testes usam **Vitest** + **Testing Library** e rodam em ambiente jsdom. Não há dependência de banco ou de chave OpenAI — todas as chamadas externas são mockadas.

Para modo watch durante o desenvolvimento:

```bash
npm run test:watch
```

---

## Funcionalidades implementadas

- [x] Página de guia por imóvel em `/[code]` (Server Component, `notFound()` para código inexistente)
- [x] Normalização de código (case-insensitive, trim)
- [x] Exibição condicional de campos opcionais (estacionamento, complemento de endereço, etc.)
- [x] Guia de Experiências gerado via OpenAI structured output (`json_schema` + `strict: true`)
- [x] Persistência idempotente do ExperienceGuide no PostgreSQL (get-or-create)
- [x] Loading skeleton durante geração do guia
- [x] Retry em caso de falha na geração (erro 502)
- [x] Chat assistente com streaming SSE token a token
- [x] System prompt anti-alucinação (grounded nos dados do imóvel)
- [x] Seed com dois imóveis reais (FLN001 e GRM001)
- [x] Deploy containerizado com Docker Compose (migrate + seed automáticos no boot)
- [x] 43 testes automatizados passando
