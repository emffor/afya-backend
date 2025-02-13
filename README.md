# Afya Backend Test

Este é um projeto backend que utiliza NestJS, MongoDB e Serverless Framework para processar relatórios de vendas.

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- Node.js (versão 20+)
- Yarn
- Docker e Docker Compose
- MongoDB (será executado via Docker)

## Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/emffor/afya-teste-backend.git
cd afya-teste-backend
```

### 2. Instalação de dependências
```bash
yarn install
```

### 3. Configuração do Banco de Dados

O projeto utiliza MongoDB que será executado via Docker.

```bash
# Iniciar o MongoDB
docker-compose up -d
```

O MongoDB estará disponível em: `mongodb://localhost:27017/afyadb`

### 4. População do Banco de Dados

Para popular o banco com dados de teste:

```bash
yarn seed
```

Este comando irá criar:
- 5 categorias
- 10 produtos
- 8 pedidos de exemplo

## Executando o Projeto

Você tem duas opções para executar o projeto:

### Opção 1: Usando NestJS
```bash
# Modo desenvolvimento
yarn start:dev

# Modo produção
yarn start:prod
```

### Opção 2: Usando Serverless Offline
```bash
# Iniciar servidor local com Serverless
yarn offline
# OU
serverless offline start
```

## Endpoints Disponíveis

- GET `/process-sales` - Processa relatório de vendas

## Scripts Disponíveis

- `yarn start` - Inicia o servidor NestJS
- `yarn start:dev` - Inicia o servidor em modo desenvolvimento
- `yarn test` - Executa testes unitários
- `yarn test:e2e` - Executa testes end-to-end
- `yarn lint` - Executa verificação de código
- `yarn format` - Formata o código

## Estrutura do Projeto

```
└── src/
    ├── category/       # Módulo de categorias
    ├── product/        # Módulo de produtos
    ├── order/         # Módulo de pedidos
    └── ...
```

## Testes

```bash
# Executar testes unitários
yarn test

# Executar testes com coverage
yarn test:cov

# Executar testes e2e
yarn test:e2e
```

## Docker

O projeto inclui configuração Docker para o MongoDB. Para reiniciar o banco:

```bash
# Parar containers
docker-compose down

# Remover volumes (caso necessário)
docker-compose down -v

# Iniciar novamente
docker-compose up -d
```