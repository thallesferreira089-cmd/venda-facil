# VendaFácil

SaaS simples de vendas (produtos, clientes, pedidos, estoque) em Next.js 14 (App Router) + Prisma + PostgreSQL.

## Como rodar localmente

Pré-requisitos: Node.js 18+, um banco PostgreSQL (local, Docker, Neon, Supabase, Railway, etc).

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de ambiente e preencha os valores:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: string de conexão do seu Postgres.
   - `SESSION_SECRET`: gere uma com `openssl rand -base64 32`.

3. Crie as tabelas no banco:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000`, clique em "Criar minha conta" e comece a usar.

## O que foi completado em relação ao código que você enviou

O código original tinha várias partes propositalmente incompletas (esqueleto de SaaS). Eu completei:

- **`lib/prisma.ts`** (não existia) — cliente Prisma singleton.
- **`lib/auth.ts`** (não existia) — sessão via cookie httpOnly assinado com JWT (`jose`), com `createSession`, `getSession`, `destroySession`.
- **`actions/auth.ts`** — `loginAction` e `registerAction` agora de fato criam usuário (com senha com hash via `bcryptjs`), autenticam e criam sessão real. Antes só faziam `redirect()` sem lógica nenhuma.
- **`actions/order.ts`** — reescrita para receber `FormData` direto de um `<form>` e, por segurança, **calcular preços e validar estoque a partir do banco** (a versão original confiava em preços vindos do cliente, o que permitiria fraude).
- **`actions/product.ts`** e **`actions/customer.ts`** (não existiam) — criação de produtos e clientes.
- **`components/mobile-nav.tsx`** — faltava a diretiva `'use client'` (obrigatória para usar `usePathname`); sem isso o build quebraria.
- **Páginas que o menu inferior já linkava mas não existiam**: `/` (dashboard), `/products`, `/customers`, `/orders`, `/menu` — criadas com listagem + formulário funcional para cada uma.
- **Arquivos de projeto que faltavam por completo**: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `app/layout.tsx`, `app/globals.css`, `.env.example`.
- Layout protegido em `app/(app)/layout.tsx`: redireciona para `/login` se não houver sessão, e para `/setup` se a loja ainda não tiver sido configurada.

## Limitações que você provavelmente vai querer resolver a seguir

- Não há recuperação de senha (a tela `/login` linka para `/recuperar`, que não existe).
- Não há edição/exclusão de produtos, clientes ou pedidos — só criação e listagem.
- O formulário de "novo pedido" tem 3 linhas fixas de produto; para algo mais dinâmico (adicionar linhas via JS) seria melhor um Client Component.
- Não há middleware de proteção adicional além do layout — para rotas de API futuras, considere um `middleware.ts`.
- Sem testes automatizados.

## Aviso importante

Este projeto **não foi compilado neste ambiente** porque o sandbox usado para gerar o código não tem acesso à internet (não dá para baixar `next`, `@prisma/client` etc. daqui). O código foi escrito e revisado manualmente com cuidado, mas rode `npm run build` na sua máquina antes de ir para produção, para pegar qualquer erro de tipo que eu possa ter deixado passar.
