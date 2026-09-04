(() => {
  'use strict';

  const CHAVE_DADOS = 'canalSeguro.denuncias.v1';
  const CHAVE_SESSAO = 'canalSeguro.admin';
  const CHAVE_ULTIMO_ENVIO = 'canalSeguro.ultimoEnvio';
  const STATUS_ANDAMENTO = ['Em triagem', 'Em análise', 'Encaminhada', 'Aguardando informações'];
  const ORDEM_PRIORIDADE = { Urgente: 4, Alta: 3, Média: 2, Baixa: 1 };
  const dataPagina = document.body.dataset.pagina;

  const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
  const $$ = (seletor, contexto = document) => [...contexto.querySelectorAll(seletor)];
  const agoraIso = () => new Date().toISOString();
  const dataRelativa = (dias, horas = 10) => {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    data.setHours(horas, 15, 0, 0);
    return data.toISOString();
  };
  const formatarData = (valor, incluirHora = true) => {
    if (!valor) return 'Não informado';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;
    return new Intl.DateTimeFormat('pt-BR', incluirHora
      ? { dateStyle: 'short', timeStyle: 'short' }
      : { dateStyle: 'short' }).format(data);
  };
  const normalizar = (valor = '') => valor.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function criarDadosDemonstrativos() {
    return [
      {
        id: 'demo-001', protocolo: 'ITP-2026-100001', codigoAcesso: 'DEMO-1001-ITP',
        categoria: 'Atividade suspeita', titulo: 'Movimentação recorrente em imóvel vazio',
        descricao: 'Durante algumas noites foi observada movimentação de veículos e pessoas em um imóvel aparentemente desocupado.',
        dataFato: dataRelativa(4, 23).slice(0, 10), horaFato: '23:00', bairro: 'Vila Nova Itapetininga',
        referencia: 'Próximo à praça do bairro', risco: 'Não sei informar',
        caracteristicas: 'Veículo escuro; demais características não puderam ser observadas com segurança.',
        complemento: 'O movimento costuma acontecer depois das 22h.', contato: '', status: 'Em análise', prioridade: 'Média',
        respostaPublica: 'O relato foi recebido e está em análise pela equipe responsável.',
        notasInternas: [{ data: dataRelativa(2, 14), texto: 'Verificar recorrência de relatos na mesma região.' }],
        criadoEm: dataRelativa(4, 9), atualizadoEm: dataRelativa(2, 14),
        historico: [{ data: dataRelativa(4, 9), descricao: 'Denúncia recebida.' }, { data: dataRelativa(3, 11), descricao: 'Status alterado para Em triagem.' }, { data: dataRelativa(2, 14), descricao: 'Status alterado para Em análise.' }]
      },
      {
        id: 'demo-002', protocolo: 'ITP-2026-100002', codigoAcesso: 'DEMO-1002-ITP',
        categoria: 'Perturbação do sossego', titulo: 'Ruído excessivo durante a madrugada',
        descricao: 'Som em volume muito alto tem ocorrido de forma recorrente durante a madrugada, afetando moradores próximos.',
        dataFato: dataRelativa(1, 1).slice(0, 10), horaFato: '01:30', bairro: 'Centro', referencia: 'Região próxima ao mercado municipal',
        risco: 'Não', caracteristicas: 'Som proveniente de um estabelecimento comercial.', complemento: 'Ocorrência relatada em mais de um fim de semana.', contato: '',
        status: 'Recebida', prioridade: 'Baixa', respostaPublica: '', notasInternas: [], criadoEm: dataRelativa(1, 8), atualizadoEm: dataRelativa(1, 8),
        historico: [{ data: dataRelativa(1, 8), descricao: 'Denúncia recebida.' }]
      },
      {
        id: 'demo-003', protocolo: 'ITP-2026-100003', codigoAcesso: 'DEMO-1003-ITP',
        categoria: 'Maus-tratos', titulo: 'Animal mantido sem abrigo adequado',
        descricao: 'Um animal permanece exposto ao sol e à chuva, aparentemente sem água disponível durante parte do dia.',
        dataFato: dataRelativa(8, 15).slice(0, 10), horaFato: '15:00', bairro: 'Jardim Fogaça', referencia: 'Próximo à unidade de saúde', risco: 'Não',
        caracteristicas: 'Cão de porte médio em quintal aberto.', complemento: '', contato: '', status: 'Encaminhada', prioridade: 'Alta',
        respostaPublica: 'A informação foi encaminhada ao setor competente para avaliação.',
        notasInternas: [{ data: dataRelativa(6, 10), texto: 'Encaminhamento demonstrativo registrado.' }], criadoEm: dataRelativa(8, 16), atualizadoEm: dataRelativa(6, 10),
        historico: [{ data: dataRelativa(8, 16), descricao: 'Denúncia recebida.' }, { data: dataRelativa(6, 10), descricao: 'Status alterado para Encaminhada.' }]
      },
      {
        id: 'demo-004', protocolo: 'ITP-2026-100004', codigoAcesso: 'DEMO-1004-ITP',
        categoria: 'Crime ambiental', titulo: 'Descarte irregular de resíduos',
        descricao: 'Foram observados descartes recorrentes de resíduos em uma área próxima a um curso d’água.',
        dataFato: dataRelativa(17, 7).slice(0, 10), horaFato: '07:40', bairro: 'Chapadinha', referencia: 'Estrada vicinal, após a ponte', risco: 'Não',
        caracteristicas: 'Resíduos de construção e sacos plásticos.', complemento: '', contato: '', status: 'Concluída', prioridade: 'Média',
        respostaPublica: 'A ocorrência demonstrativa foi verificada e concluída.', notasInternas: [], criadoEm: dataRelativa(17, 9), atualizadoEm: dataRelativa(10, 15),
        historico: [{ data: dataRelativa(17, 9), descricao: 'Denúncia recebida.' }, { data: dataRelativa(14, 10), descricao: 'Status alterado para Em análise.' }, { data: dataRelativa(10, 15), descricao: 'Status alterado para Concluída.' }]
      },
      {
        id: 'demo-005', protocolo: 'ITP-2026-100005', codigoAcesso: 'DEMO-1005-ITP',
        categoria: 'Violência doméstica', titulo: 'Pedidos de ajuda ouvidos em residência',
        descricao: 'Foram ouvidos pedidos de ajuda e ruídos de discussão vindos de uma residência durante a noite.',
        dataFato: dataRelativa(0, 21).slice(0, 10), horaFato: '21:10', bairro: 'Vila Barth', referencia: 'Próximo à avenida principal', risco: 'Sim',
        caracteristicas: 'Não foi possível observar o interior do imóvel.', complemento: 'Não houve aproximação para preservar a segurança.', contato: '', status: 'Em triagem', prioridade: 'Urgente',
        respostaPublica: 'O relato está em triagem prioritária. Em uma emergência real, ligue imediatamente para 190.',
        notasInternas: [{ data: dataRelativa(0, 21), texto: 'Marcada automaticamente como urgente por indicação de risco.' }], criadoEm: dataRelativa(0, 21), atualizadoEm: dataRelativa(0, 21),
        historico: [{ data: dataRelativa(0, 21), descricao: 'Denúncia recebida.' }, { data: dataRelativa(0, 21), descricao: 'Status alterado para Em triagem.' }]
      }
    ];
  }

  function obterDenuncias() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE_DADOS));
      if (Array.isArray(dados)) return dados;
    } catch (erro) {
      console.warn('Não foi possível ler os dados locais.', erro);
    }
    const iniciais = criarDadosDemonstrativos();
    salvarDenuncias(iniciais);
    return iniciais;
  }

  function salvarDenuncias(denuncias) {
    localStorage.setItem(CHAVE_DADOS, JSON.stringify(denuncias));
  }

  function criarElemento(tag, texto, classe) {
    const elemento = document.createElement(tag);
    if (texto !== undefined && texto !== null) elemento.textContent = texto;
    if (classe) elemento.className = classe;
    return elemento;
  }

  function preencherStatus(elemento, status) {
    elemento.textContent = status;
    elemento.dataset.status = status;
  }

  function gerarHex(bytes) {
    const valores = new Uint8Array(bytes);
    crypto.getRandomValues(valores);
    return [...valores].map((valor) => valor.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function gerarProtocolo(denuncias) {
    const ano = new Date().getFullYear();
    let protocolo;
    do { protocolo = `ITP-${ano}-${gerarHex(3)}`; } while (denuncias.some((item) => item.protocolo === protocolo));
    return protocolo;
  }

  function gerarCodigo() {
    const codigo = gerarHex(6);
    return `${codigo.slice(0, 4)}-${codigo.slice(4, 8)}-${codigo.slice(8, 12)}`;
  }

  function renderizarHistorico(lista, historico) {
    lista.replaceChildren();
    [...historico].sort((a, b) => new Date(b.data) - new Date(a.data)).forEach((evento) => {
      const item = criarElemento('li');
      const data = criarElemento('time', formatarData(evento.data));
      data.dateTime = evento.data;
      item.append(data, criarElemento('p', evento.descricao));
      lista.append(item);
    });
  }

  function exigirSessaoAdmin() {
    if (sessionStorage.getItem(CHAVE_SESSAO) !== 'autenticado') {
      const destino = encodeURIComponent(location.pathname.split('/').pop() + location.search);
      location.replace(`admin.html?destino=${destino}`);
      return false;
    }
    return true;
  }

  function destinoAdminSeguro(valor, padrao = 'painel-admin.html') {
    if (!valor) return padrao;
    const permitido = /^(painel-admin|detalhe-denuncia)\.html(?:[?#].*)?$/;
    return permitido.test(valor) ? valor : padrao;
  }

  function configurarSaida() {
    $$('[data-sair]').forEach((botao) => botao.addEventListener('click', () => {
      sessionStorage.removeItem(CHAVE_SESSAO);
      location.href = 'admin.html';
    }));
  }

  function configurarContadores(formulario) {
    $$('[data-contador]', formulario).forEach((saida) => {
      const campo = $(`#${saida.dataset.contador}`, formulario);
      const atualizar = () => { saida.textContent = `${campo.value.length}/${campo.maxLength}`; };
      campo.addEventListener('input', atualizar);
      atualizar();
    });
  }

  function mensagemCampo(campo, mensagem) {
    campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    const saida = $(`#erro-${campo.id}`);
    if (saida) saida.textContent = mensagem;
  }

  function validarEtapa(etapa) {
    let valido = true;
    const campos = $$('input, select, textarea', etapa).filter((campo) => !campo.disabled && campo.type !== 'hidden');
    const radiosTratados = new Set();
    campos.forEach((campo) => {
      let mensagem = '';
      if (campo.type === 'radio') {
        if (radiosTratados.has(campo.name)) return;
        radiosTratados.add(campo.name);
        const grupo = $$(`input[name="${campo.name}"]`, etapa);
        if (campo.required && !grupo.some((radio) => radio.checked)) {
          mensagem = 'Selecione uma opção.';
          const saida = $(`#erro-${campo.name}`);
          if (saida) saida.textContent = mensagem;
          grupo.forEach((radio) => radio.setAttribute('aria-invalid', 'true'));
          valido = false;
        } else {
          const saida = $(`#erro-${campo.name}`);
          if (saida) saida.textContent = '';
          grupo.forEach((radio) => radio.setAttribute('aria-invalid', 'false'));
        }
        return;
      }
      if (campo.required && campo.type === 'checkbox' && !campo.checked) mensagem = 'Confirme para continuar.';
      else if (campo.required && !campo.value.trim()) mensagem = 'Preencha este campo.';
      else if (campo.minLength > 0 && campo.value && campo.value.length < campo.minLength) mensagem = `Use pelo menos ${campo.minLength} caracteres.`;
      mensagemCampo(campo, mensagem);
      if (mensagem) valido = false;
    });
    if (!valido) {
      const primeiro = $('[aria-invalid="true"]', etapa);
      if (primeiro) primeiro.focus();
    }
    return valido;
  }

  function iniciarDenuncia() {
    const formulario = $('#form-denuncia');
    const dataFato = $('#data-fato');
    dataFato.max = new Date().toISOString().slice(0, 10);
    configurarContadores(formulario);

    let parcelaA = 0;
    let parcelaB = 0;
    const novaPergunta = () => {
      parcelaA = Math.floor(Math.random() * 7) + 2;
      parcelaB = Math.floor(Math.random() * 7) + 1;
      $('#pergunta-antispam').textContent = `${parcelaA} + ${parcelaB}`;
      $('#resposta-antispam').value = '';
    };
    novaPergunta();

    $$('input[name="risco"]').forEach((radio) => radio.addEventListener('change', () => {
      $('#alerta-risco').hidden = radio.value !== 'Sim';
    }));

    function exibirEtapa(numero) {
      $$('.etapa-formulario').forEach((etapa) => {
        const atual = Number(etapa.dataset.etapa) === numero;
        etapa.hidden = !atual;
        etapa.classList.toggle('ativa', atual);
      });
      $$('[data-indicador]').forEach((item) => item.classList.toggle('ativo', Number(item.dataset.indicador) === numero));
      const ativa = $(`[data-etapa="${numero}"]`);
      ativa.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const titulo = $('h2', ativa);
      if (titulo) titulo.setAttribute('tabindex', '-1'), titulo.focus({ preventScroll: true });
    }

    function adicionarResumo(rotulo, valor) {
      const bloco = criarElemento('div');
      bloco.append(criarElemento('dt', rotulo), criarElemento('dd', valor || 'Não informado'));
      $('#resumo-formulario').append(bloco);
    }

    function montarResumo() {
      const dados = new FormData(formulario);
      const dataHora = [dados.get('dataFato') ? formatarData(`${dados.get('dataFato')}T12:00:00`, false) : '', dados.get('horaFato')].filter(Boolean).join(' às ');
      $('#resumo-formulario').replaceChildren();
      adicionarResumo('Categoria', dados.get('categoria'));
      adicionarResumo('Resumo', dados.get('titulo'));
      adicionarResumo('Descrição', dados.get('descricao'));
      adicionarResumo('Risco imediato', dados.get('risco'));
      adicionarResumo('Data e horário', dataHora);
      adicionarResumo('Local', `${dados.get('bairro')} — ${dados.get('referencia')}`);
      adicionarResumo('Características', dados.get('caracteristicas'));
      adicionarResumo('Complemento', dados.get('complemento'));
      adicionarResumo('Contato opcional', dados.get('contato'));
    }

    $$('[data-proxima]').forEach((botao) => botao.addEventListener('click', () => {
      const etapaAtual = botao.closest('.etapa-formulario');
      if (!validarEtapa(etapaAtual)) return;
      const destino = Number(botao.dataset.proxima);
      if (destino === 3) montarResumo();
      exibirEtapa(destino);
    }));
    $$('[data-anterior]').forEach((botao) => botao.addEventListener('click', () => exibirEtapa(Number(botao.dataset.anterior))));

    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const etapa = $('[data-etapa="3"]');
      if (!validarEtapa(etapa)) return;
      if ($('#website').value) {
        $('#erro-antispam').textContent = 'Não foi possível concluir a verificação.';
        return;
      }
      if (Number($('#resposta-antispam').value) !== parcelaA + parcelaB) {
        mensagemCampo($('#resposta-antispam'), 'Resposta incorreta. Tente novamente.');
        novaPergunta();
        $('#resposta-antispam').focus();
        return;
      }
      const ultimo = Number(sessionStorage.getItem(CHAVE_ULTIMO_ENVIO) || 0);
      if (Date.now() - ultimo < 30000) {
        $('#erro-antispam').textContent = 'Aguarde 30 segundos antes de registrar outra denúncia nesta sessão.';
        return;
      }
      const dados = new FormData(formulario);
      const denuncias = obterDenuncias();
      const protocolo = gerarProtocolo(denuncias);
      const codigoAcesso = gerarCodigo();
      const criadoEm = agoraIso();
      denuncias.push({
        id: `den-${gerarHex(8)}`, protocolo, codigoAcesso,
        categoria: dados.get('categoria'), titulo: dados.get('titulo').trim(), descricao: dados.get('descricao').trim(),
        dataFato: dados.get('dataFato'), horaFato: dados.get('horaFato'), bairro: dados.get('bairro').trim(), referencia: dados.get('referencia').trim(),
        risco: dados.get('risco'), caracteristicas: dados.get('caracteristicas').trim(), complemento: dados.get('complemento').trim(), contato: dados.get('contato').trim(),
        status: 'Recebida', prioridade: dados.get('risco') === 'Sim' ? 'Urgente' : 'Média', respostaPublica: '', notasInternas: [], criadoEm, atualizadoEm: criadoEm,
        historico: [{ data: criadoEm, descricao: 'Denúncia recebida.' }]
      });
      salvarDenuncias(denuncias);
      sessionStorage.setItem(CHAVE_ULTIMO_ENVIO, String(Date.now()));
      formulario.hidden = true;
      $('.barra-etapas').hidden = true;
      $('#protocolo-gerado').textContent = protocolo;
      $('#codigo-gerado').textContent = codigoAcesso;
      const confirmacao = $('#confirmacao-envio');
      confirmacao.hidden = false;
      confirmacao.focus();

      $('#copiar-acesso').addEventListener('click', async () => {
        const texto = `Protocolo: ${protocolo}\nCódigo de acesso: ${codigoAcesso}`;
        try { await navigator.clipboard.writeText(texto); $('#mensagem-copia').textContent = 'Dados copiados.'; }
        catch { $('#mensagem-copia').textContent = 'Não foi possível copiar automaticamente. Selecione os dados acima.'; }
      });
    });
    $('#imprimir-acesso').addEventListener('click', () => window.print());
  }

  function iniciarAcompanhamento() {
    const formulario = $('#form-acompanhar');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const protocolo = $('#consulta-protocolo').value.trim().toUpperCase();
      const codigo = $('#consulta-codigo').value.trim().toUpperCase();
      const erro = $('#erro-consulta');
      const resultado = $('#resultado-acompanhamento');
      erro.textContent = '';
      resultado.hidden = true;
      if (!protocolo || !codigo) { erro.textContent = 'Informe o protocolo e o código de acesso.'; return; }
      const denuncia = obterDenuncias().find((item) => item.protocolo.toUpperCase() === protocolo && item.codigoAcesso.toUpperCase() === codigo);
      if (!denuncia) { erro.textContent = 'Protocolo ou código de acesso inválido neste navegador.'; return; }
      $('#resultado-protocolo').textContent = denuncia.protocolo;
      $('#resultado-titulo').textContent = denuncia.titulo;
      preencherStatus($('#resultado-status'), denuncia.status);
      $('#resultado-categoria').textContent = denuncia.categoria;
      $('#resultado-data').textContent = formatarData(denuncia.criadoEm);
      $('#resultado-atualizacao').textContent = formatarData(denuncia.atualizadoEm);
      $('#resultado-descricao').textContent = denuncia.descricao;
      $('#resultado-resposta').textContent = denuncia.respostaPublica || 'Ainda não há uma resposta publicada pela equipe demonstrativa.';
      renderizarHistorico($('#resultado-historico'), denuncia.historico);
      resultado.hidden = false;
      resultado.focus();
    });
  }

  function iniciarLogin() {
    if (sessionStorage.getItem(CHAVE_SESSAO) === 'autenticado') {
      const destino = destinoAdminSeguro(new URLSearchParams(location.search).get('destino'));
      location.replace(destino);
      return;
    }
    $('#form-login').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const usuario = $('#usuario-admin').value;
      const senha = $('#senha-admin').value;
      if (usuario === 'operador.demo' && senha === 'Itapetininga2026!') {
        sessionStorage.setItem(CHAVE_SESSAO, 'autenticado');
        const destino = destinoAdminSeguro(new URLSearchParams(location.search).get('destino'));
        location.href = destino;
      } else {
        $('#erro-login').textContent = 'Credenciais demonstrativas incorretas.';
        $('#usuario-admin').focus();
      }
    });
  }

  function iniciarPainel() {
    if (!exigirSessaoAdmin()) return;
    configurarSaida();
    $('#data-painel').textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date());
    const controles = ['#filtro-busca', '#filtro-status', '#filtro-categoria', '#filtro-periodo', '#filtro-ordem'];

    function popularCategorias(denuncias) {
      const seletor = $('#filtro-categoria');
      const atual = seletor.value;
      const categorias = [...new Set(denuncias.map((item) => item.categoria))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
      seletor.replaceChildren(new Option('Todas', ''));
      categorias.forEach((categoria) => seletor.add(new Option(categoria, categoria)));
      seletor.value = atual;
    }

    function renderizarIndicadores(denuncias) {
      $('#indicador-total').textContent = denuncias.length;
      $('#indicador-recebidas').textContent = denuncias.filter((item) => item.status === 'Recebida').length;
      $('#indicador-andamento').textContent = denuncias.filter((item) => STATUS_ANDAMENTO.includes(item.status)).length;
      $('#indicador-risco').textContent = denuncias.filter((item) => item.risco === 'Sim').length;
      $('#indicador-concluidas').textContent = denuncias.filter((item) => item.status === 'Concluída').length;
      const contagem = denuncias.reduce((total, item) => ({ ...total, [item.categoria]: (total[item.categoria] || 0) + 1 }), {});
      const maior = Math.max(...Object.values(contagem), 1);
      const barras = $('#barras-categorias');
      barras.replaceChildren();
      Object.entries(contagem).sort((a, b) => b[1] - a[1]).forEach(([categoria, total]) => {
        const bloco = criarElemento('div', null, 'barra-categoria');
        const cabecalho = criarElemento('div', null, 'barra-categoria__cabecalho');
        cabecalho.append(criarElemento('span', categoria), criarElemento('strong', String(total)));
        const trilho = criarElemento('div', null, 'barra-categoria__trilho');
        const valor = criarElemento('div', null, 'barra-categoria__valor');
        valor.style.width = `${(total / maior) * 100}%`;
        trilho.append(valor); bloco.append(cabecalho, trilho); barras.append(bloco);
      });
    }

    function estadoParaUrl() {
      const params = new URLSearchParams();
      controles.forEach((seletor) => {
        const campo = $(seletor);
        if (campo.value) params.set(campo.id.replace('filtro-', ''), campo.value);
      });
      history.replaceState(null, '', `${location.pathname}${params.toString() ? `?${params}` : ''}`);
    }

    function restaurarFiltrosUrl() {
      const params = new URLSearchParams(location.search);
      controles.forEach((seletor) => {
        const campo = $(seletor);
        campo.value = params.get(campo.id.replace('filtro-', '')) || '';
      });
    }

    function renderizarTabela() {
      const denuncias = obterDenuncias();
      renderizarIndicadores(denuncias);
      const busca = normalizar($('#filtro-busca').value.trim());
      const status = $('#filtro-status').value;
      const categoria = $('#filtro-categoria').value;
      const periodo = Number($('#filtro-periodo').value || 0);
      const limiteData = periodo ? new Date(Date.now() - periodo * 86400000) : null;
      let filtradas = denuncias.filter((item) => {
        const texto = normalizar([item.protocolo, item.categoria, item.bairro, item.titulo, item.descricao].join(' '));
        return (!busca || texto.includes(busca)) && (!status || item.status === status) && (!categoria || item.categoria === categoria) && (!limiteData || new Date(item.criadoEm) >= limiteData);
      });
      const ordem = $('#filtro-ordem').value;
      filtradas.sort((a, b) => ordem === 'antigas' ? new Date(a.criadoEm) - new Date(b.criadoEm) : ordem === 'prioridade' ? ORDEM_PRIORIDADE[b.prioridade] - ORDEM_PRIORIDADE[a.prioridade] : new Date(b.criadoEm) - new Date(a.criadoEm));
      const corpo = $('#tabela-denuncias');
      corpo.replaceChildren();
      const retorno = encodeURIComponent(location.search);
      filtradas.forEach((item) => {
        const linha = criarElemento('tr');
        linha.append(criarElemento('td', item.protocolo));
        const ocorrencia = criarElemento('td'); ocorrencia.append(criarElemento('strong', item.titulo), criarElemento('small', item.categoria)); linha.append(ocorrencia);
        linha.append(criarElemento('td', item.bairro), criarElemento('td', formatarData(item.criadoEm)));
        linha.append(criarElemento('td', item.prioridade, `prioridade prioridade--${normalizar(item.prioridade).replace(/\s/g, '-')}`));
        const celulaStatus = criarElemento('td'); const etiqueta = criarElemento('span', null, 'etiqueta-status'); preencherStatus(etiqueta, item.status); celulaStatus.append(etiqueta); linha.append(celulaStatus);
        const celulaAcao = criarElemento('td'); const link = criarElemento('a', 'Abrir', 'link-tabela'); link.href = `detalhe-denuncia.html?id=${encodeURIComponent(item.id)}&retorno=${retorno}`; celulaAcao.append(link); linha.append(celulaAcao);
        corpo.append(linha);
      });
      $('#quantidade-filtrada').textContent = `${filtradas.length} ${filtradas.length === 1 ? 'registro' : 'registros'}`;
      $('#estado-vazio').hidden = filtradas.length > 0;
      $('.tabela-responsiva').hidden = filtradas.length === 0;
      estadoParaUrl();
    }

    const denuncias = obterDenuncias();
    popularCategorias(denuncias);
    restaurarFiltrosUrl();
    controles.forEach((seletor) => $(seletor).addEventListener(seletor === '#filtro-busca' ? 'input' : 'change', renderizarTabela));
    $('#form-filtros').addEventListener('submit', (evento) => evento.preventDefault());
    $('#restaurar-dados').addEventListener('click', () => {
      if (!confirm('Restaurar os dados demonstrativos? Denúncias criadas e alterações locais serão substituídas.')) return;
      salvarDenuncias(criarDadosDemonstrativos());
      controles.forEach((seletor) => { $(seletor).value = ''; });
      popularCategorias(obterDenuncias());
      renderizarTabela();
    });
    renderizarTabela();
  }

  function iniciarDetalhe() {
    if (!exigirSessaoAdmin()) return;
    configurarSaida();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const retorno = params.get('retorno') || '';
    $('#voltar-painel').href = `painel-admin.html${retorno}`;
    let denuncias = obterDenuncias();
    let denuncia = denuncias.find((item) => item.id === id);
    if (!denuncia) { $('#detalhe-nao-encontrado').hidden = false; return; }
    $('#conteudo-detalhe').hidden = false;

    function adicionarDado(lista, rotulo, valor) {
      const bloco = criarElemento('div'); bloco.append(criarElemento('dt', rotulo), criarElemento('dd', valor || 'Não informado')); lista.append(bloco);
    }

    function renderizar() {
      $('#detalhe-protocolo').textContent = denuncia.protocolo;
      $('#detalhe-titulo').textContent = denuncia.titulo;
      $('#detalhe-categoria').textContent = denuncia.categoria;
      preencherStatus($('#detalhe-status'), denuncia.status);
      $('#detalhe-descricao').textContent = denuncia.descricao;
      $('#detalhe-caracteristicas').textContent = denuncia.caracteristicas || 'Não informado.';
      $('#detalhe-complemento').textContent = denuncia.complemento || 'Não informado.';
      const lista = $('#dados-ocorrencia'); lista.replaceChildren();
      adicionarDado(lista, 'Data do fato', denuncia.dataFato ? formatarData(`${denuncia.dataFato}T12:00:00`, false) : 'Não informado');
      adicionarDado(lista, 'Horário', denuncia.horaFato);
      adicionarDado(lista, 'Bairro', denuncia.bairro);
      adicionarDado(lista, 'Referência', denuncia.referencia);
      adicionarDado(lista, 'Risco imediato', denuncia.risco);
      adicionarDado(lista, 'Contato opcional', denuncia.contato || 'Não informado');
      adicionarDado(lista, 'Criada em', formatarData(denuncia.criadoEm));
      adicionarDado(lista, 'Atualizada em', formatarData(denuncia.atualizadoEm));
      renderizarHistorico($('#detalhe-historico'), denuncia.historico);
      $('#novo-status').value = denuncia.status;
      $('#nova-prioridade').value = denuncia.prioridade;
      $('#resposta-publica-admin').value = denuncia.respostaPublica || '';
      const notas = $('#lista-notas-internas'); notas.replaceChildren();
      if (!denuncia.notasInternas.length) notas.append(criarElemento('li', 'Nenhuma nota interna registrada.'));
      else [...denuncia.notasInternas].reverse().forEach((nota) => { const item = criarElemento('li', nota.texto); const data = criarElemento('time', formatarData(nota.data)); data.dateTime = nota.data; item.prepend(data); notas.append(item); });
    }

    function persistir() {
      denuncias = denuncias.map((item) => item.id === denuncia.id ? denuncia : item);
      salvarDenuncias(denuncias);
      renderizar();
    }

    $('#form-operacao').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const novoStatus = $('#novo-status').value;
      const novaPrioridade = $('#nova-prioridade').value;
      const novaResposta = $('#resposta-publica-admin').value.trim();
      const novaNota = $('#nota-interna-admin').value.trim();
      const alteracoes = [];
      if (novoStatus !== denuncia.status) alteracoes.push(`Status alterado para ${novoStatus}.`);
      if (novaPrioridade !== denuncia.prioridade) alteracoes.push(`Prioridade alterada para ${novaPrioridade}.`);
      if (novaResposta !== denuncia.respostaPublica) alteracoes.push(novaResposta ? 'Resposta pública atualizada.' : 'Resposta pública removida.');
      if (novaNota) alteracoes.push('Nota interna adicionada.');
      if (!alteracoes.length) { $('#mensagem-operacao').textContent = 'Nenhuma alteração para salvar.'; return; }
      const data = agoraIso();
      denuncia.status = novoStatus; denuncia.prioridade = novaPrioridade; denuncia.respostaPublica = novaResposta; denuncia.atualizadoEm = data;
      alteracoes.forEach((descricao) => denuncia.historico.push({ data, descricao }));
      if (novaNota) denuncia.notasInternas.push({ data, texto: novaNota });
      $('#nota-interna-admin').value = '';
      persistir();
      $('#mensagem-operacao').textContent = 'Atualização salva neste navegador.';
    });

    $('#arquivar-denuncia').addEventListener('click', () => {
      if (denuncia.status === 'Arquivada') { $('#mensagem-operacao').textContent = 'Esta denúncia já está arquivada.'; return; }
      if (!confirm(`Arquivar a denúncia ${denuncia.protocolo}?`)) return;
      const data = agoraIso(); denuncia.status = 'Arquivada'; denuncia.atualizadoEm = data; denuncia.historico.push({ data, descricao: 'Denúncia arquivada.' });
      persistir(); $('#mensagem-operacao').textContent = 'Denúncia arquivada.';
    });

    $('#copiar-protocolo').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(denuncia.protocolo); $('#mensagem-operacao').textContent = 'Protocolo copiado.'; }
      catch { $('#mensagem-operacao').textContent = 'Não foi possível copiar automaticamente.'; }
    });
    renderizar();
  }

  try {
    if (dataPagina === 'inicio') obterDenuncias();
    if (dataPagina === 'denunciar') iniciarDenuncia();
    if (dataPagina === 'acompanhar') iniciarAcompanhamento();
    if (dataPagina === 'admin-login') iniciarLogin();
    if (dataPagina === 'painel-admin') iniciarPainel();
    if (dataPagina === 'detalhe-admin') iniciarDetalhe();
  } catch (erro) {
    console.error('Erro ao iniciar o protótipo:', erro);
  }
})();
