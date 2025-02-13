# Afya Backend Test

## Configuração do Ambiente

### Pré-requisitos
- Node.js - 20.18.2
- Yarn
- MongoDB (local ou via Docker)

### Instalação
```bash
# Instalar dependências
yarn install

# Iniciar MongoDB com Docker
docker-compose up -d

# Executar o seed para popular o banco com dados de teste
yarn seed