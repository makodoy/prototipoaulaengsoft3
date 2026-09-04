# Canal Seguro Itapetininga

Protótipo acadêmico de um sistema web de denúncias anônimas para Itapetininga/SP. O projeto demonstra o registro, o acompanhamento e a gestão administrativa de denúncias, sem depender de servidor ou etapa de compilação.

> **Atenção:** este projeto não é um canal oficial, não é monitorado e não deve receber denúncias reais ou dados pessoais. Em uma emergência real, ligue 190.

## Executar e publicar

O projeto usa somente HTML5, CSS3 e JavaScript. Abra `index.html` no navegador ou publique a raiz do repositório pelo GitHub Pages:

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch principal e a pasta `/ (root)`.
4. Salve e aguarde a URL pública.

Todos os caminhos são relativos e não é necessário instalar dependências.

## Estrutura

```text
.
├── index.html                Página inicial
├── denunciar.html            Formulário em três etapas
├── acompanhar.html           Consulta por protocolo e código
├── admin.html                Login administrativo demonstrativo
├── painel-admin.html         Dashboard, busca e filtros
├── detalhe-denuncia.html     Gestão de uma denúncia
├── css/
│   └── estilos.css           Sistema visual e responsividade
└── js/
    └── app.js                Dados, validações e fluxos
```

## Fluxo do denunciante

- Preenchimento do relato sem cadastro.
- Categorias, localização, data aproximada, risco, características e contato opcional.
- Validação por etapas, honeypot, operação matemática e intervalo local entre envios.
- Geração de protocolo e código com `crypto.getRandomValues()`.
- Consulta do status, resposta pública e histórico no mesmo navegador.

Para testar a consulta sem criar um relato, use:

```text
Protocolo: ITP-2026-100001
Código: DEMO-1001-ITP
```

## Fluxo administrativo

Credenciais demonstrativas:

```text
Usuário: operador.demo
Senha: Itapetininga2026!
```

O painel apresenta indicadores, categorias, busca, filtros e ordenação. No detalhe é possível mudar status e prioridade, publicar uma resposta, adicionar nota interna e arquivar a denúncia. As notas internas não aparecem na consulta do denunciante.

A autenticação usa `sessionStorage` apenas para simular uma sessão. A opção **Restaurar dados de demonstração** substitui todos os registros e alterações locais após confirmação.

## Armazenamento e limitações

Os dados ficam no `localStorage` do navegador. Isso permite apresentar o fluxo no GitHub Pages, mas **não oferece anonimato, confidencialidade ou segurança real**. Limpar os dados do site apaga as denúncias criadas, e outro navegador não terá acesso aos mesmos registros.

Uma versão para uso real exigiria, no mínimo:

- backend e banco de dados protegidos;
- autenticação, autorização e auditoria administrativas;
- criptografia e gestão segura de segredos;
- CAPTCHA e limitação de requisições validados no servidor;
- política de privacidade, retenção e descarte adequada à LGPD;
- proteção de anexos e remoção de metadados;
- revisão jurídica e homologação pelo órgão público responsável.

Nenhum brasão, logotipo ou símbolo oficial é utilizado. A paleta é apenas uma referência visual institucional e deve ser validada antes de qualquer uso oficial.
