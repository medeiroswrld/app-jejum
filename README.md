# FemReset — App Web MVP

Este é o código-fonte do **FemReset** — um aplicativo web MVP de acompanhamento de jejum intermitente personalizado para mulheres acima de 39 anos. 

O projeto é **100% client-side**, sem qualquer necessidade de backend ou bancos de dados externos. Todo o estado e histórico da usuária são mantidos e sincronizados localmente no `localStorage` do próprio navegador.

---

## 🚀 Funcionalidades Implementadas

1. **Bem-vindo (Login Local):** Portal elegante de entrada para capturar o nome de preferência da usuária.
2. **Onboarding em 7 Passos:**
   - Triagem de faixa de idade (+39).
   - Medidor de altura em centímetros.
   - Seleção interativa de peso atual e meta de peso com sliders táteis.
   - Nível de experiência com jejum (Iniciante, Intermediário, Avançado).
   - Restrições alimentares (Lactose, Glúten, Vegana, Vegetariana).
   - **Triagem Médica e de Segurança (Obrigatória):** Questionário com flags de saúde críticas (Diabetes, Pressão alta, Cardiopatia, Tireoide, Gravidez/Lactação, Histórico de transtorno alimentar).
3. **Plano Personalizado:**
   - Geração automática e conservadora do protocolo ideal (`12:12` com alerta para condições de risco, `14:10` para iniciantes e `16:8` para experientes).
   - Mensagens de segurança personalizadas.
   - Orientações e dicas nutricionais exclusivas de hidratação.
4. **Cronômetro de Jejum:**
   - Anel de progresso circular animado dinamicamente via SVG nativo.
   - Mostrador em tempo real (`hh:mm:ss`) do jejum decorrente.
   - Identificação do **Estágio Metabólico** atual (Digestão, Estabilização, Transição, Queima de gordura, Foco e leveza) com descrições informativas baseadas na biologia.
   - Registro de histórico de jejuns.
5. **Acompanhamento de 21 Dias:**
   - Grade de 21 círculos do programa com preenchimento interativo ao concluir sessões.
   - Streak de consistência diária (dias seguidos 🔥).
   - Check-in de peso diário e bloco de notas.
   - **Gráfico de Evolução de Peso:** Construído inteiramente com SVG nativo dinâmico, sem peso de bibliotecas extras, mostrando a curva rumo à meta.
6. **Guias Bônus:**
   - Leitor integrado para os três guias de hábitos e mentalidade ("Desinchando em 7 Dias", "Anti-Efeito Sanfona", "Mente no Lugar").
7. **Reinicialização de Dados:** Opção discreta para apagar todo o progresso local e reiniciar o onboarding.

---

## 🎨 Sistema de Design & Estética

- **Aparência Premium Feminina:** Paleta de cores baseada em tons suaves de creme, rosa seco, vinho e acentos dourados.
- **Mobile-first:** A interface foi moldada no formato de aplicativo móvel centralizado (`max-w-[430px]`) e envolto por uma borda suave com sombreamento, garantindo visual requintado no desktop e responsividade impecável no celular.
- **Tipografia Fina:** Integração com Google Fonts: **Playfair Display** (para cabeçalhos refinados) e **DM Sans** (para o corpo do aplicativo).
- **Animações Fluidas:** Utilização da biblioteca `framer-motion` para transições suaves de abas e sliders do onboarding.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passos
1. Instale todas as dependências do projeto:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador em [http://localhost:3000](http://localhost:3000) para testar a aplicação.

---

## 📦 Como Compilar e Fazer o Deploy

### Compilação de Produção
Para verificar se tudo está compilando perfeitamente e gerar a versão de produção otimizada:
```bash
npm run build
```

### Deploy na Vercel (Recomendado)
Sendo um projeto estático Next.js 14 sem backend, o deploy na Vercel leva menos de 1 minuto:
1. Instale o CLI da Vercel globalmente ou faça login no painel da [Vercel](https://vercel.com).
2. Associe seu repositório Git ou execute o comando na pasta raiz do projeto:
   ```bash
   vercel
   ```
3. O build estático será otimizado de forma automática pelo ecossistema Vercel sem necessidade de qualquer configuração de variáveis de ambiente.
