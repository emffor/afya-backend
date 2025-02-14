# Afya Backend Test

Este é um projeto backend que utiliza NestJS, MongoDB e Serverless Framework para processar relatórios de vendas.

## 🎥 Demo da Aplicação

[![Assista ao vídeo da demonstração](https://img.youtube.com/vi/nCvctiUvKr8/maxresdefault.jpg)](https://youtu.be/nCvctiUvKr8)

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

### 4. População em massa do Banco de Dados

Para popular em massa o banco com dados de teste:

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
yarn start
```

### Opção 2: Usando Serverless Offline
```bash
# Iniciar servidor local com Serverless
yarn offline
# OU
serverless offline start
```

## Endpoints Disponíveis

- GET `/api` - Documentação Swagger UI

## Documentação da API (Swagger)

O projeto possui documentação interativa das APIs através do Swagger UI.
Para acessar a documentação:

1. Inicie o servidor:
```bash
yarn start
```

2. Acesse no navegador ROTAS:
```
http://localhost:3000/api
```

A interface do Swagger permite:
- Visualizar todos os endpoints disponíveis
- Testar as APIs diretamente pelo navegador
- Ver os modelos de dados e schemas
- Verificar os parâmetros necessários para cada rota

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
```

## Docker

O projeto inclui configuração Docker para o MongoDB. Para reiniciar o banco:

```bash
# Parar containers
docker-compose down

# Remover volumes (caso necessário)
docker-compose down -v

# Build sem cache para o serviço nestjs
docker compose build --no-cache nestjs

# Iniciar os containers
docker compose up -d
```
````
