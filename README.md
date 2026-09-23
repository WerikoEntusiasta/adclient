# AdClient — Portal Executivo de Métricas de Tráfego Pago

> Um painel moderno e elegante para gestores de tráfego conectarem as contas de seus clientes no Meta Ads e fornecerem uma experiência de visualização de métricas e criativos (read-only) de nível executivo.

---

## 🎯 Proposta do Projeto

Diferente de ferramentas operacionais de gestão pesada, o **AdClient** foi projetado exclusivamente para a ponta do **Cliente**:
- **100% Visualização Segura (Read-Only):** Sem botões de pausar anúncios, alterar orçamentos ou deletar campanhas. O cliente pode explorar livremente sem risco de alterar as operações.
- **Design Executivo Escuro (Dark Luxury Theme):** Tipografia limpa, KPIs destacados em cartões de alta legibilidade, paleta moderna e gráficos com gradientes suaves em Recharts.
- **Galeria de Criativos & Vídeos com Reprodutor Integrado:** Reprodutor HTML5 para assistir vídeos em alta definição, visualizar thumbnails, copies, badges de performance (#1 ROAS, Mais Conversões) e taxas de retenção.
- **Dossiê & Relatórios Prontos para Impressão:** Geração de relatórios executivos com 1 clique para salvar em PDF ou exportar planilha em CSV.
- **Canal de Contato Direto com a Agência:** Botão de WhatsApp direto com o gestor de tráfego responsável, horários de atendimento e alinhamentos de estratégia.
- **Modo Demonstração Instantâneo:** Já vem com dados realistas pré-carregados para demonstração imediata antes mesmo de conectar as chaves da Meta.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com CSS Variables OKLCH
- **Componentes:** Radix UI primitives estilizados (estilo shadcn/ui)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) com persistência local
- **API:** Meta Graph API v21.0

---

## 🚀 Como Rodar o Projeto Localmente

1. Clone o repositório:
```bash
git clone https://github.com/WerikoEntusiasta/adclient.git
cd adclient
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

---

## ⚙️ Conectando a Conta do Meta Ads

1. Acesse o menu **Configurações de Conta** (`/dashboard/settings`).
2. Insira o **Token de Acesso do Usuário do Sistema ou Desenvolvedor** da Meta com permissões `ads_read` e `read_insights`.
3. Insira o **ID da Conta de Anúncios** (ex: `act_1234567890`).
4. Clique em **Testar Conexão com a Meta** para validar o acesso.
5. Personalize o **Nome do Cliente**, **Nome da Agência** e o **WhatsApp do Gestor**.
6. Clique em **Salvar Configurações**. O painel passará a puxar instantaneamente os dados em tempo real da Meta Graph API!

---

## 🔒 Segurança

- As chaves de acesso são mantidas no armazenamento local do navegador e processadas em memória pelas rotas internas de API.
- Todas as requisições à Meta Graph API são estritamente de leitura (`GET`), garantindo que nenhuma alteração possa ser feita na conta de anúncios.
