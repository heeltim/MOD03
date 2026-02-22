const STATUS = {
      PRE: { key:'PRE', label:'Pré-projeto', badge:'pre', group:'pre' },
      BRIEF_SENT: { key:'BRIEF_SENT', label:'Briefing enviado', badge:'briefSent', group:'brief' },
      BRIEF_DONE: { key:'BRIEF_DONE', label:'Briefing respondido', badge:'briefDone', group:'brief' },
      BUDGET_SENT: { key:'BUDGET_SENT', label:'Orçamento enviado', badge:'budgetSent', group:'budget' },
      APPROVED: { key:'APPROVED', label:'Aprovado', badge:'approved', group:'active' },
      ACTIVE: { key:'ACTIVE', label:'Projeto ativo', badge:'active', group:'active' },
      DONE: { key:'DONE', label:'Concluído', badge:'done', group:'active' },
      REJECTED: { key:'REJECTED', label:'Recusado', badge:'rejected', group:'budget' },
      ARCHIVED: { key:'ARCHIVED', label:'Arquivado', badge:'archived', group:'active' },
    };

    const METHOD_LIBRARY = [
      { id:'M-01', name:'Identidade Visual — Essencial', hours: 42, steps:[
        ['Diagnóstico', 6], ['Pesquisa e referências', 8], ['Conceito', 10], ['Desenvolvimento', 14], ['Finalização', 4]
      ]},
      { id:'M-02', name:'Identidade Visual — Completa', hours: 78, steps:[
        ['Diagnóstico', 8], ['Pesquisa e repertório', 14], ['Conceito', 14], ['Sistema visual', 28], ['Guia rápido', 10], ['Entrega', 4]
      ]},
      { id:'M-03', name:'Site Institucional — Base', hours: 64, steps:[
        ['Estratégia', 10], ['Arquitetura', 12], ['Wireframes', 12], ['UI', 18], ['Ajustes e entrega', 12]
      ]},
    ];

    // Porte é interno (não perguntado ao cliente)
    const PORTE_TABLE = {
      PEQUENO: { label:'Pequeno', multiplier: 1.00 },
      MEDIO: { label:'Médio', multiplier: 1.20 },
      GRANDE: { label:'Grande', multiplier: 1.45 }
    };

    let projects = [
      seedProject({
        id:'PRJ-2401',
        name:'Pré-projeto — Samba Trial',
        client:'Daniel Branco',
        owner:'Equipe Design',
        briefingModel:'IdentidadeVisualBase',
        status:'BRIEF_DONE',
        briefing: { respondedAt:'2026-02-18', contact:'daniel@exemplo.com', summary:'Objetivo: identidade visual para apresentação do projeto.' },
        budget: null,
      }),
      seedProject({
        id:'PRJ-2402',
        name:'Pré-projeto — Site Conserve',
        client:'Conserve',
        owner:'Equipe Design',
        briefingModel:'SiteInstitucional',
        status:'BUDGET_SENT',
        briefing: { respondedAt:'2026-02-16', contact:'contato@conserve.com', summary:'Site institucional com foco em conteúdo e captação.' },
        budget: { sentAt:'2026-02-17', methodId:'M-03', hours:64, porte:'MEDIO', hourly: 180, notes:'Versão com contrato.' }
      }),
      seedProject({
        id:'PRJ-2403',
        name:'Identidade Visual — Instituto Araripe',
        client:'Instituto Araripe',
        owner:'Helton',
        briefingModel:'Jotform-2604338',
        status:'ACTIVE',
        briefing: { respondedAt:'2026-02-10', contact:'equipe@araripe.org', summary:'Projeto em andamento; base de marca e aplicações.' },
        budget: { sentAt:'2026-02-11', approvedAt:'2026-02-12', methodId:'M-02', hours:78, porte:'GRANDE', hourly: 220, notes:'Orçamento aprovado; iniciar execução.' }
      }),
    ];

    const CLIENT_USERS = [
      { id:'CLI-001', name:'Daniel Branco', email:'daniel@exemplo.com', projects:['PRJ-2401'] },
      { id:'CLI-002', name:'Conserve', email:'contato@conserve.com', projects:['PRJ-2402'] },
      { id:'CLI-003', name:'Instituto Araripe', email:'equipe@araripe.org', projects:['PRJ-2403'] },
    ];

    function seedProject(p){
      const now = new Date().toISOString().slice(0,10);
      const base = {
        createdAt: now,
        updatedAt: now,
        files: [],
        messages: [],
        statusHistory: [],
        clientPortalEnabled: true,
        modules: [],
      };
      const project = Object.assign(base, p);
      project.statusHistory = project.statusHistory.length ? project.statusHistory : [
        { at: project.createdAt, by: project.owner, status: project.status, note: 'Estado inicial (mock).' }
      ];
      if(project.briefing?.respondedAt){
        project.files.push({ name:'Briefing — Respostas.pdf (placeholder)', type:'briefing_pdf', at: project.briefing.respondedAt });
      }
      if(project.budget?.sentAt){
        project.files.push({ name:'Orçamento — Proposta.pdf (placeholder)', type:'budget_pdf', at: project.budget.sentAt });
      }
      if(project.status === 'ACTIVE'){
        project.modules.push({ key:'moodart', name:'Mood Art (stub)', desc:'Painel que agregará fontes, paleta, referências e decisões.' });
      }
      return project;
    }

    let selectedProjectId = null;
    let currentView = 'home';
    let filterStatus = 'all';
    let searchQuery = '';
    let nextTemplateId = 4;
    let briefingTemplates = [
      {
        id:'BRF-01',
        name:'Briefing — Identidade Visual (base)',
        channel:'Link público',
        updatedAt:'2026-02-19',
        questions:[
          { id:'Q-1', type:'Date/time', label:'Carimbo de data/hora' },
          { id:'Q-2', type:'Short text', label:'Vamos começar? Como você se chama?' },
          { id:'Q-3', type:'Short text', label:'E o seu email?' },
          { id:'Q-4', type:'Short text', label:'Deixe um telefone para contato' },
          { id:'Q-5', type:'Short text', label:'Agora precisamos saber se seu negócio já tem um nome e, se sim, qual é?' },
          { id:'Q-6', type:'Short text', label:'E onde fica localizado?' },
          { id:'Q-7', type:'Short text', label:'Agora precisamos saber qual é o nosso prazo de entrega.' },
          { id:'Q-8', type:'Long text', label:'Fale um pouco sobre o seu negócio.' },
          { id:'Q-9', type:'Long text', label:'Você conhece bem seus clientes? Fale um pouco sobre eles.' },
          { id:'Q-10', type:'Short text', label:'Três palavras que resumem seu negócio.' },
          { id:'Q-11', type:'Long text', label:'Que mensagem a marca deve transmitir?' },
          { id:'Q-12', type:'Long text', label:'E o que NÃO deve ser transmitido para seus clientes?' },
          { id:'Q-13', type:'Long text', label:'Existe alguma empresa na sua área que lhe inspira? Quais?' },
          { id:'Q-14', type:'Long text', label:'Qual é o seu diferencial?' },
          { id:'Q-15', type:'Short text', label:'Qual o nome que deve ficar visível na marca?' },
          { id:'Q-16', type:'Short text', label:'Possui slogan? Qual?' },
          { id:'Q-17', type:'Long text', label:'Principais características da marca:' },
          { id:'Q-18', type:'Long text', label:'Ainda tem algo a dizer? Fique à vontade para contribuir com outras informações que achar pertinente.' },
        ]
      },
      {
        id:'BRF-02',
        name:'Briefing — Site Institucional',
        channel:'Link público',
        updatedAt:'2026-02-18',
        questions:[
          { id:'Q-1', type:'Short text', label:'Qual o público principal do site?' },
          { id:'Q-2', type:'Long text', label:'Quais páginas ou áreas são obrigatórias no lançamento?' },
        ]
      },
      {
        id:'BRF-03',
        name:'Jotform (exemplo 2604338)',
        channel:'Importado',
        updatedAt:'2026-02-12',
        questions:[
          { id:'Q-1', type:'Long text', label:'Descreva sua instituição e o desafio atual.' },
        ]
      },
    ];

    let briefingResponses = [
      { id:'RES-01', templateId:'BRF-01', project:'Pré-projeto — Samba Trial', client:'Daniel Branco', respondedAt:'2026-02-18', status:'Completo', summary:'Foco em posicionamento e narrativa visual.' },
      { id:'RES-02', templateId:'BRF-02', project:'Pré-projeto — Site Conserve', client:'Conserve', respondedAt:'2026-02-16', status:'Completo', summary:'Prioridade em captação de leads e atualização de conteúdo.' },
      { id:'RES-03', templateId:'BRF-03', project:'Identidade Visual — Instituto Araripe', client:'Instituto Araripe', respondedAt:'2026-02-10', status:'Em análise', summary:'Escopo de identidade em expansão para materiais institucionais.' },
    ];
    let selectedBriefingTemplateId = briefingTemplates[0].id;
    let briefingBuilderContext = null;
    let activeSurveyCreator = null;

    const el = (id)=>document.getElementById(id);

    const leftNavLinks = Array.from(document.querySelectorAll('.nav a'));
    const chips = Array.from(document.querySelectorAll('.chip'));
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const modalBackdrop = el('modalBackdrop');

    wire();
    renderAll();

    function wire(){
      leftNavLinks.forEach(a=>{
        a.addEventListener('click', (ev)=>{
          ev.preventDefault();
          leftNavLinks.forEach(x=>x.classList.remove('active'));
          a.classList.add('active');
          currentView = a.dataset.view;
          selectedProjectId = null;
          renderAll();
        });
      });

      chips.forEach(c=>{
        c.addEventListener('click', ()=>{
          chips.forEach(x=>x.classList.remove('active'));
          c.classList.add('active');
          filterStatus = c.dataset.filter;
          renderMain();
        });
      });

      el('search').addEventListener('input', (e)=>{
        searchQuery = e.target.value.trim().toLowerCase();
        renderMain();
      });
      el('btnReset').addEventListener('click', ()=>{
        el('search').value='';
        searchQuery='';
        filterStatus='all';
        chips.forEach(x=>x.classList.remove('active'));
        chips[0].classList.add('active');
        renderMain();
      });

      el('btnNewProject').addEventListener('click', openModal);
      el('btnCloseModal').addEventListener('click', closeModal);
      el('btnCancelModal').addEventListener('click', closeModal);
      modalBackdrop.addEventListener('click', (e)=>{
        if(e.target === modalBackdrop) closeModal();
      });
      window.addEventListener('keydown', (e)=>{
        if(e.key !== 'Escape') return;
        if(el('briefingOverlayBackdrop')?.classList.contains('open')){
          closeBriefingOverlay();
          return;
        }
        closeModal();
      });

      el('btnCloseBriefingOverlay')?.addEventListener('click', closeBriefingOverlay);
      el('btnSaveBriefingOverlay')?.addEventListener('click', ()=>{
        if(activeSurveyCreator && typeof activeSurveyCreator.JSON === 'object'){
          const template = briefingTemplates.find(t=>t.id===selectedBriefingTemplateId);
          if(template){
            applySurveySchemaToTemplate(template, activeSurveyCreator.JSON);
            addToast('Formulário salvo com SurveyJS e link atualizado.');
            return;
          }
        }
        addToast('Formulário salvo com sucesso. Link compartilhável atualizado.');
      });
      el('briefingOverlayBackdrop')?.addEventListener('click', (e)=>{
        if(e.target === el('briefingOverlayBackdrop')) closeBriefingOverlay();
      });

      el('btnCreateProject').addEventListener('click', ()=>{
        const name = el('npName').value.trim() || 'Pré-projeto — Sem título';
        const client = el('npClient').value.trim() || 'Cliente não informado';
        const owner = el('npOwner').value.trim() || 'Equipe';
        const briefingModel = el('npBriefModel').value;
        const channel = el('npChannel').value;
        const notes = el('npNotes').value.trim();

        const id = 'PRJ-' + String(Math.floor(1000 + Math.random()*9000));
        const createdAt = new Date().toISOString().slice(0,10);

        const p = seedProject({
          id, name, client, owner, briefingModel,
          status:'PRE',
          briefing: { respondedAt:null, contact:'', summary:'', channel },
          budget:null,
        });

        if(notes){
          p.messages.push({
            at: createdAt,
            by: owner,
            visibility:'internal',
            text: notes
          });
        }

        projects = [p, ...projects];
        closeModal(true);
        selectedProjectId = id;
        currentView = 'projectDetail';
        leftNavLinks.forEach(x=>x.classList.remove('active'));
        leftNavLinks.find(x=>x.dataset.view==='projects')?.classList.add('active');
        renderAll();
      });

      const deselectBtn = el('btnDeselect');
      if(deselectBtn){
        deselectBtn.addEventListener('click', ()=>{
          selectedProjectId = null;
          renderDetail();
          highlightSelectedRow();
        });
      }

      tabs.forEach(t=>{
        t.addEventListener('click', ()=>{
          tabs.forEach(x=>x.classList.remove('active'));
          t.classList.add('active');
          renderDetail();
        });
      });
    }

    function openModal(){
      modalBackdrop.classList.add('open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      el('npName').value='';
      el('npClient').value='';
      el('npOwner').value='';
      el('npBriefModel').value='Jotform-2604338';
      el('npChannel').value='Email';
      el('npNotes').value='';
      setTimeout(()=> el('npName').focus(), 20);
    }
    function closeModal(){
      modalBackdrop.classList.remove('open');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }


    function addToast(message){
      window.alert(message);
    }

    function renderAll(){
      renderCounts();
      setMainHeader();
      renderMain();
    }

    function setMainHeader(){
      const selectedProject = projects.find(p=>p.id===selectedProjectId);
      const titleMap = {
        home: ['', ''],
        projects: ['Projetos', 'Visualização em cards. Clique em “Abrir” para acessar a página completa do projeto.'],
        projectDetail: selectedProject
          ? [selectedProject.name, `${selectedProject.client} • Responsável: ${selectedProject.owner} • ${STATUS[selectedProject.status]?.label || selectedProject.status}`]
          : ['Projeto', 'Página única com todas as informações, histórico e módulos do projeto.'],
        briefings: ['Briefing', 'Painel focado nas respostas recebidas e acesso aos modelos por botão.'],
        briefingSetup: ['Configurar briefing', 'Escolha como iniciar e abra o builder em sobreposição para editar em tempo real.'],
        budgets: ['Orçamento', 'Simulação • importação do briefing • metodologia + horas • porte interno • PDF (placeholder).'],
        methods: ['Metodologia', 'Banco de metodologias com horas estimadas (base para orçamento).'],
        clientPortal: ['Clientes', 'Administrar e gerenciar contas de clientes com acesso à plataforma.'],
      };
      const [t,s] = titleMap[currentView] || titleMap.home;
      el('mainTitle').textContent = t;
      el('mainSubtitle').textContent = s;

      const searchWrap = el('searchWrap');
      const filters = el('projectFilters');
      const showProjectTools = currentView === 'projects';
      if(searchWrap) searchWrap.style.display = showProjectTools ? 'flex' : 'none';
      if(filters) filters.style.display = showProjectTools ? 'flex' : 'none';
    }

    function renderCounts(){
      el('navCount').textContent = `${projects.length}`;
    }

    function renderKpis(){
      const counts = projects.reduce((acc,p)=>{
        acc.total++;
        acc[p.status]=(acc[p.status]||0)+1;
        return acc;
      }, {total:0});

      const active = (counts.ACTIVE||0);
      const pre = (counts.PRE||0);
      const brief = (counts.BRIEF_SENT||0) + (counts.BRIEF_DONE||0);
      const budget = (counts.BUDGET_SENT||0);

      return [
        { v: counts.total, k:'Total de projetos' },
        { v: active, k:'Projetos ativos' },
        { v: pre, k:'Pré-projetos' },
        { v: brief, k:'Em briefing' },
        { v: budget, k:'Em orçamento' },
      ];
    }

    function renderMain(){
      const body = el('mainBody');
      body.innerHTML = '';

      if(currentView === 'home'){
        body.appendChild(renderHomeView());
        return;
      }
      if(currentView === 'projects'){
        body.appendChild(renderProjectsTable());
        return;
      }
      if(currentView === 'projectDetail'){
        body.appendChild(renderProjectDetailView());
        return;
      }
      if(currentView === 'briefings'){
        body.appendChild(renderBriefingsView());
        return;
      }
      if(currentView === 'briefingSetup'){
        body.appendChild(renderBriefingSetupView());
        return;
      }
      if(currentView === 'budgets'){
        body.appendChild(renderBudgetsView());
        return;
      }
      if(currentView === 'methods'){
        body.appendChild(renderMethodsView());
        return;
      }
      if(currentView === 'clientPortal'){
        body.appendChild(renderClientPortalView());
        return;
      }
    }

    function renderProjectsTable(){
      const wrap = document.createElement('div');
      const list = getFilteredProjects();

      const cards = document.createElement('div');
      cards.className = 'projectList';

      list.forEach(p=>{
        const card = document.createElement('article');
        card.className = 'projectCard project-item';
        card.dataset.pid = p.id;

        const status = STATUS[p.status] || STATUS.PRE;
        const visual = projectVisual(p);

        card.innerHTML = `
          <div class="projectIdentity">
            <div class="projectGlyph" aria-hidden="true">${visual.glyph}</div>
            <div>
              <div class="projectCode">${escapeHtml(visual.code)}</div>
              <div class="projectLabel">${escapeHtml(visual.label)}</div>
            </div>
          </div>

          <div class="projectMain">
            <h3>${escapeHtml(p.name)}</h3>
            <p>${escapeHtml(p.client)} • ${escapeHtml(p.briefingModel)}</p>
          </div>

          <div class="projectMeta">
            <span>Responsável: <b>${escapeHtml(p.owner)}</b></span>
            <span>Criado: <b>${p.createdAt}</b></span>
            ${statusBadge(status)}
          </div>

          <div class="projectActions">
            <button class="btn small" data-action="open">Abrir</button>
            <button class="btn small" data-action="advance">Avançar etapa</button>
          </div>
        `;

        card.addEventListener('click', (e)=>{
          const btn = e.target.closest('button');
          if(btn && btn.dataset.action === 'advance'){
            e.preventDefault();
            advanceFlow(p.id);
            return;
          }
          selectedProjectId = p.id;
          currentView = 'projectDetail';
          leftNavLinks.forEach(x=>x.classList.remove('active'));
          leftNavLinks.find(x=>x.dataset.view==='projects')?.classList.add('active');
          renderAll();
        });

        cards.appendChild(card);
      });

      wrap.appendChild(cards);

      if(list.length === 0){
        const empty = document.createElement('div');
        empty.className = 'card';
        empty.innerHTML = `
          <h3>Nenhum projeto encontrado</h3>
          <p>Tente mudar os filtros ou criar um novo pré-projeto.</p>
        `;
        wrap.appendChild(empty);
      }

      return wrap;
    }


    function renderHomeView(){
      const wrap = document.createElement('div');
      const shortcuts = [
        { title:'Projetos pendentes', desc:'Abre projetos com pendências nas etapas de pré-projeto, briefing e orçamento.', action: ()=>navigateProjectsWithFilter('pending') },
        { title:'Briefings pendentes', desc:'Mostra somente projetos com briefing enviado e aguardando resposta.', action: ()=>navigateProjectsWithFilter('brief_pending') },
        { title:'Briefings respondidos', desc:'Lista projetos com briefing respondido para acelerar próximos passos.', action: ()=>navigateProjectsWithFilter('brief_done') },
        { title:'Orçamentos pendentes', desc:'Exibe propostas enviadas e que ainda aguardam decisão do cliente.', action: ()=>navigateProjectsWithFilter('budget_pending') },
        { title:'Orçamentos aprovados', desc:'Mostra projetos aprovados e prontos para seguir para execução.', action: ()=>navigateProjectsWithFilter('approved') },
        { title:'Adicionar metodologia', desc:'Acesso rápido para cadastrar uma nova metodologia com horas estimadas.', action: ()=>openNewMethodModal() },
      ];

      const now = new Date();
      const weekday = now.toLocaleDateString('pt-BR', { weekday:'long' });
      const date = now.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
      const kpis = renderKpis();

      const welcome = document.createElement('div');
      welcome.className='card';
      welcome.innerHTML = `
        <h3>Bem-vindo(a) 👋</h3>
        <p>Hoje é ${weekday}, ${date}. Que bom ter você por aqui — use os atalhos para abrir visões já filtradas e ganhar tempo no dia.</p>
      `;

      const kpiCard = document.createElement('div');
      kpiCard.className = 'card';
      kpiCard.innerHTML = '<h3>Indicadores da operação</h3><p>Visão rápida para apoiar sua tomada de decisão no dia.</p>';
      const kpiGrid = document.createElement('div');
      kpiGrid.className = 'kpiGrid';
      kpis.forEach(it=>{
        const d = document.createElement('div');
        d.className = 'kpi';
        d.innerHTML = `<div class="v">${it.v}</div><div class="k">${it.k}</div>`;
        kpiGrid.appendChild(d);
      });
      kpiCard.appendChild(kpiGrid);

      const grid = document.createElement('div');
      grid.className='homeShortcutGrid';
      shortcuts.forEach(({title,desc,action})=>{
        const c = document.createElement('article');
        c.className='homeShortcutCard';
        c.innerHTML = `<h3>${title}</h3><p>${desc}</p><button class="btn small">Abrir atalho</button>`;
        c.querySelector('button').addEventListener('click', action);
        grid.appendChild(c);
      });

      wrap.appendChild(welcome);
      wrap.appendChild(kpiCard);
      wrap.appendChild(grid);
      return wrap;
    }

    function renderProjectDetailView(){
      const wrap = document.createElement('div');
      const p = projects.find(x=>x.id===selectedProjectId);
      if(!p){
        const c = document.createElement('div');
        c.className='card';
        c.innerHTML = '<h3>Nenhum projeto selecionado</h3><p>Volte para Projetos e clique em “Abrir” para visualizar os detalhes.</p>';
        wrap.appendChild(c);
        return wrap;
      }
      const s = STATUS[p.status] || STATUS.PRE;
      const visual = projectVisual(p);
      const head = document.createElement('div');
      head.className='card projectHero';
      head.innerHTML = `
        <div class="projectHeroTop">
          <div class="projectIdentity">
            <div class="projectGlyph" aria-hidden="true">${visual.glyph}</div>
            <div>
              <div class="projectCode">${escapeHtml(visual.code)}</div>
              <h3>${escapeHtml(p.name)}</h3>
            </div>
          </div>
          ${statusBadge(s)}
        </div>
        <div class="projectHeroMeta">
          <span><b>Cliente:</b> ${escapeHtml(p.client)}</span>
          <span><b>Responsável:</b> ${escapeHtml(p.owner)}</span>
          <span><b>Modelo:</b> ${escapeHtml(p.briefingModel)}</span>
          <span><b>Atualizado:</b> ${p.updatedAt}</span>
        </div>
      `;

      const summary = document.createElement('div');
      summary.className='card';
      summary.innerHTML = `
        <h3>Resumo rápido</h3>
        <div class="projectQuickStats">
          <div class="kpi"><div class="v">${p.statusHistory.length}</div><div class="k">Movimentos no histórico</div></div>
          <div class="kpi"><div class="v">${p.modules.length}</div><div class="k">Módulos ativos</div></div>
          <div class="kpi"><div class="v">${p.files.length}</div><div class="k">Arquivos gerados</div></div>
          <div class="kpi"><div class="v">${daysSince(p.createdAt)}</div><div class="k">Dias desde criação</div></div>
        </div>
      `;

      const modules = document.createElement('div');
      modules.className='card';
      modules.innerHTML = `
        <h3>Módulos do projeto</h3>
        <div class="files">
          ${p.modules.length ? p.modules.map(m=>`
            <div class="file"><div><div class="name">${escapeHtml(m.name)}</div><div class="meta">${escapeHtml(m.desc)}</div></div></div>
          `).join('') : '<div class="muted" style="font-size:12px;">Nenhum módulo ativo.</div>'}
          <div class="file moduleHistory">
            <div>
              <div class="name">Histórico do projeto</div>
              <div class="meta">Linha do tempo incluída como módulo para manter o fluxo em um único lugar.</div>
            </div>
          </div>
        </div>
        <div class="timeline">${p.statusHistory.slice().reverse().map(h=>`<div class="tlItem"><div class="ic">⏱</div><div class="meta"><div class="t">${STATUS[h.status]?.label || h.status}</div><div class="s">${h.at} • ${escapeHtml(h.by)} • ${escapeHtml(h.note||'')}</div></div></div>`).join('')}</div>
      `;

      wrap.appendChild(head);
      wrap.appendChild(summary);
      wrap.appendChild(modules);
      return wrap;
    }

    function daysSince(dateString){
      const start = new Date(dateString);
      if(Number.isNaN(start.getTime())) return '-';
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      return Math.max(0, Math.floor(diff / 86400000));
    }

    function projectVisual(project){
      const base = `${project.name || project.client || 'Projeto'}`.trim();
      const words = base.split(/\s+/).filter(Boolean);
      const glyph = words.slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'P';
      const cleanId = project.id.replace(/^PRJ-/, '');
      return {
        glyph,
        code: `Projeto ${cleanId}`,
        label: `Ref. ${glyph}-${cleanId.slice(-2) || '00'}`
      };
    }

    function renderBriefingsView(){
      const wrap = document.createElement('div');

      const responsesCard = document.createElement('div');
      responsesCard.className = 'card';
      responsesCard.innerHTML = `
        <div class="briefingSectionHead">
          <div>
            <h3>Respostas de Briefing</h3>
            <p>Neste painel ficam visíveis apenas os projetos respondidos e as respostas recebidas.</p>
          </div>
          <button class="btn small" data-action="open-models">Modelos de briefing</button>
        </div>
        <div class="briefingAnswers" style="margin-top:12px">
          ${briefingResponses.map(response=>{
            const template = briefingTemplates.find(t=>t.id===response.templateId);
            return `
              <article class="briefingAnswerCard">
                <div class="briefingAnswerHead">
                  <strong>${escapeHtml(response.project)}</strong>
                  <span class="pill">${escapeHtml(response.status)}</span>
                </div>
                <div class="meta">Cliente: ${escapeHtml(response.client)} • Modelo: ${escapeHtml(template?.name || response.templateId)}</div>
                <p>${escapeHtml(response.summary)}</p>
                <div class="meta">Respondido em ${formatDatePtBR(response.respondedAt)}</div>
                <div class="briefingAnswerActions">
                  <button class="btn small" data-action="edit-existing" data-id="${response.templateId}">Editar briefing</button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `;

      const setupCard = document.createElement('div');
      setupCard.className = 'card';
      setupCard.innerHTML = `
        <h3>Novo briefing</h3>
        <p>Ao criar um novo briefing você entra em uma página de configuração para escolher como iniciar o processo.</p>
        <button class="btn primary" data-action="start-new-briefing">+ Criar novo briefing</button>
      `;

      wrap.appendChild(responsesCard);
      wrap.appendChild(setupCard);

      wrap.querySelector('[data-action="open-models"]')?.addEventListener('click', openBriefingTemplatesModal);
      wrap.querySelector('[data-action="start-new-briefing"]')?.addEventListener('click', ()=>openBriefingSetup('new'));
      wrap.querySelectorAll('[data-action="edit-existing"]').forEach(btn=>{
        btn.addEventListener('click', ()=>openBriefingSetup('edit', btn.dataset.id));
      });

      return wrap;
    }

    function renderBriefingSetupView(){
      const wrap = document.createElement('div');
      const selectedTemplate = briefingTemplates.find(t=>t.id===selectedBriefingTemplateId) || briefingTemplates[0];

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="briefingSectionHead">
          <div>
            <h3>${briefingBuilderContext?.mode === 'edit' ? 'Editar briefing existente' : 'Iniciar novo briefing'}</h3>
            <p>Escolha um modelo e abra o criador em sobreposição para montar o formulário com visualização em tempo real.</p>
          </div>
          <button class="btn small" data-action="back-briefings">Voltar ao painel</button>
        </div>
        <div class="briefingSetupGrid" style="margin-top:12px">
          ${briefingTemplates.map(template=>`
            <article class="briefingCard ${template.id===selectedBriefingTemplateId ? 'selected' : ''}">
              <div class="briefingCardTop">
                <div>
                  <h4>${escapeHtml(template.name)}</h4>
                  <div class="meta">${template.questions.length} perguntas • atualizado em ${formatDatePtBR(template.updatedAt)}</div>
                </div>
                <span class="pill">${escapeHtml(template.channel)}</span>
              </div>
              <div class="briefingCardActions">
                <button class="btn small" data-action="select-template" data-id="${template.id}">Selecionar</button>
                <button class="btn small" data-action="rename-template" data-id="${template.id}">Renomear</button>
                <button class="btn small" data-action="duplicate-template" data-id="${template.id}">Duplicar</button>
              </div>
            </article>
          `).join('')}
        </div>
        <div class="briefingSetupActions" style="margin-top:12px">
          <button class="btn" data-action="open-models">Modelos de briefing</button>
          <button class="btn primary" data-action="open-builder">Abrir criador de formulário</button>
        </div>
      `;

      wrap.appendChild(card);

      wrap.querySelector('[data-action="back-briefings"]')?.addEventListener('click', ()=>{
        currentView = 'briefings';
        renderAll();
      });
      wrap.querySelectorAll('[data-action="select-template"]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          selectedBriefingTemplateId = btn.dataset.id;
          renderMain();
        });
      });
      wrap.querySelectorAll('[data-action="rename-template"]').forEach(btn=>{
        btn.addEventListener('click', ()=>renameBriefingTemplate(btn.dataset.id));
      });
      wrap.querySelectorAll('[data-action="duplicate-template"]').forEach(btn=>{
        btn.addEventListener('click', ()=>duplicateBriefingTemplate(btn.dataset.id));
      });
      wrap.querySelector('[data-action="open-builder"]')?.addEventListener('click', ()=>openBriefingBuilderModal(selectedTemplate.id));
      wrap.querySelector('[data-action="open-models"]')?.addEventListener('click', openBriefingTemplatesModal);

      return wrap;
    }

    function openBriefingSetup(mode, templateId){
      briefingBuilderContext = { mode: mode || 'new' };
      if(templateId) selectedBriefingTemplateId = templateId;
      currentView = 'briefingSetup';
      renderAll();
    }

    function openBriefingTemplatesModal(){
      const selectedTemplate = briefingTemplates.find(t=>t.id===selectedBriefingTemplateId) || briefingTemplates[0];
      const html = `
        <div class="briefingModalHead">
          <div>
            <h3>Modelos de briefing</h3>
            <p>Todos os modelos ficam acessíveis aqui por botão, sem poluir o painel principal.</p>
          </div>
          <button class="btn small primary" data-action="new-template">+ Novo briefing</button>
        </div>
        <div class="briefingGrid" style="margin-top:12px">
          ${briefingTemplates.map(template=>`
            <article class="briefingCard ${template.id===selectedTemplate?.id ? 'selected' : ''}">
              <div class="briefingCardTop">
                <div>
                  <h4>${escapeHtml(template.name)}</h4>
                  <div class="meta">${template.questions.length} perguntas • atualizado em ${formatDatePtBR(template.updatedAt)}</div>
                </div>
                <span class="pill">${escapeHtml(template.channel)}</span>
              </div>
              <div class="briefingCardActions">
                <button class="btn small" data-action="pick-template" data-id="${template.id}">Usar</button>
                <button class="btn small" data-action="edit-template" data-id="${template.id}">Editar</button>
                <button class="btn small" data-action="duplicate-template" data-id="${template.id}">Duplicar</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
      openBriefingOverlay('Modelos de briefing', html, (container)=>{
        container.querySelector('[data-action="new-template"]')?.addEventListener('click', ()=>{
          createBriefingTemplate();
          openBriefingTemplatesModal();
        });
        container.querySelectorAll('[data-action="pick-template"]').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            selectedBriefingTemplateId = btn.dataset.id;
            closeBriefingOverlay();
            addToast('Modelo selecionado para o briefing.');
            renderAll();
          });
        });
        container.querySelectorAll('[data-action="edit-template"]').forEach(btn=>{
          btn.addEventListener('click', ()=>openBriefingBuilderModal(btn.dataset.id));
        });
        container.querySelectorAll('[data-action="duplicate-template"]').forEach(btn=>{
          btn.addEventListener('click', ()=>duplicateBriefingTemplate(btn.dataset.id));
        });
      });
    }

    function openBriefingBuilderModal(templateId, viewMode = 'edit'){
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      selectedBriefingTemplateId = template.id;

      const previewOnly = viewMode === 'preview';
      const html = `
        <div class="surveyBuilderShell">
          <div class="briefingSectionHead">
            <div>
              <h3>${previewOnly ? 'Pré-visualização do formulário' : 'SurveyJS Builder'}</h3>
              <p>${previewOnly ? 'Confira como o cliente verá o formulário final.' : 'Edite o briefing com recursos completos de arrastar e soltar do SurveyJS.'}</p>
            </div>
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <span class="pill">${template.questions.length} perguntas</span>
              <button class="btn small ${previewOnly ? '' : 'primary'}" data-action="toggle-preview" data-mode="${previewOnly ? 'edit' : 'preview'}">${previewOnly ? 'Voltar para edição' : 'Pré-visualizar cliente'}</button>
            </div>
          </div>
          <div id="surveyCreatorHost" class="surveyCreatorHost ${previewOnly ? 'hidden' : ''}"></div>
          <div id="surveyPreviewHost" class="surveyPreviewHost ${previewOnly ? '' : 'hidden'}"></div>
          <div class="briefingShareLink">https://gruta.studio/briefing/${template.id.toLowerCase()}</div>
          <button class="btn small" data-action="copy-link">Copiar link</button>
        </div>
      `;

      openBriefingOverlay(`Builder — ${template.name}`, html, (container)=>{
        container.querySelector('[data-action="toggle-preview"]')?.addEventListener('click', (ev)=>{
          if(activeSurveyCreator && typeof activeSurveyCreator.JSON === 'object'){
            applySurveySchemaToTemplate(template, activeSurveyCreator.JSON);
          }
          openBriefingBuilderModal(template.id, ev.currentTarget.dataset.mode);
        });

        container.querySelector('[data-action="copy-link"]')?.addEventListener('click', ()=>{
          addToast('Link do briefing copiado (mock).');
        });

        initializeSurveyJsBuilder(container, template, previewOnly);
      });
    }

    function initializeSurveyJsBuilder(container, template, previewOnly){
      const hasSurveyJs = typeof window.SurveyCreator !== 'undefined' && typeof window.Survey !== 'undefined';
      const creatorHost = container.querySelector('#surveyCreatorHost');
      const previewHost = container.querySelector('#surveyPreviewHost');
      const schema = template.surveyJson || templateQuestionsToSurveySchema(template);

      if(!hasSurveyJs){
        if(creatorHost) creatorHost.innerHTML = '<div class="card">SurveyJS indisponível no momento. Verifique conexão com CDN.</div>';
        if(previewHost) previewHost.innerHTML = '<div class="card">Não foi possível carregar a pré-visualização do formulário.</div>';
        return;
      }

      activeSurveyCreator = null;

      if(!previewOnly && creatorHost){
        const creator = new window.SurveyCreator.SurveyCreator(creatorHost, {
          showLogicTab: true,
          isAutoSave: false,
          showTranslationTab: false
        });
        creator.JSON = schema;
        creator.onModified.add(()=>{
          applySurveySchemaToTemplate(template, creator.JSON);
        });
        activeSurveyCreator = creator;
      }

      if(previewHost){
        previewHost.innerHTML = '';
        const survey = new window.Survey.Model(schema);
        survey.mode = 'edit';
        survey.render(previewHost);
      }
    }

    function templateQuestionsToSurveySchema(template){
      return {
        title: template.name,
        showQuestionNumbers: 'on',
        pages: [{
          name: 'pagina1',
          elements: (template.questions || []).map((question, idx)=>questionToSurveyElement(question, idx))
        }]
      };
    }

    function questionToSurveyElement(question, index){
      const key = `q_${index + 1}`;
      const base = { name: key, title: question.label || `Pergunta ${index + 1}` };
      switch(question.type){
        case 'Email':
          return { ...base, type:'text', inputType:'email' };
        case 'Short text':
          return { ...base, type:'text' };
        case 'Multiple choice':
        case 'Escolha única':
          return { ...base, type:'radiogroup', choices:['Opção 1', 'Opção 2', 'Opção 3'] };
        default:
          return { ...base, type:'comment' };
      }
    }

    function applySurveySchemaToTemplate(template, schema){
      template.surveyJson = schema;
      template.questions = surveySchemaToQuestions(schema);
      template.updatedAt = today();
    }

    function surveySchemaToQuestions(schema){
      const elements = (schema?.pages || []).flatMap(page=>page.elements || []);
      return elements.map((element, idx)=>({
        id: `Q-${idx + 1}`,
        type: surveyElementTypeToLegacy(element),
        label: element.title || element.name || `Pergunta ${idx + 1}`
      }));
    }

    function surveyElementTypeToLegacy(element){
      if(element.type === 'comment') return 'Long text';
      if(element.type === 'radiogroup' || element.type === 'checkbox') return 'Multiple choice';
      if(element.type === 'text' && element.inputType === 'email') return 'Email';
      if(element.type === 'text') return 'Short text';
      return element.type || 'Long text';
    }

    function openBriefingOverlay(title, contentHtml, onReady){
      const backdrop = el('briefingOverlayBackdrop');
      const titleEl = el('briefingOverlayTitle');
      const contentEl = el('briefingOverlayContent');
      if(!backdrop || !titleEl || !contentEl) return;
      titleEl.textContent = title;
      contentEl.innerHTML = contentHtml;
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      if(typeof onReady === 'function') onReady(contentEl);
    }

    function closeBriefingOverlay(){
      const backdrop = el('briefingOverlayBackdrop');
      if(!backdrop) return;
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      renderAll();
    }

    function createBriefingTemplate(){
      const name = window.prompt('Nome do novo briefing:', 'Briefing — Novo modelo');
      if(!name) return;
      const id = `BRF-${String(nextTemplateId++).padStart(2,'0')}`;
      briefingTemplates.unshift({
        id,
        name: name.trim(),
        channel: 'Link público',
        updatedAt: today(),
        questions:[
          { id:'Q-1', type:'Long text', label:'Qual é o contexto geral do projeto?' }
        ]
      });
      selectedBriefingTemplateId = id;
      renderMain();
      addToast('Novo briefing criado.');
    }

    function duplicateBriefingTemplate(templateId){
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      const id = `BRF-${String(nextTemplateId++).padStart(2,'0')}`;
      briefingTemplates.unshift({
        ...template,
        id,
        name: `${template.name} (cópia)`,
        updatedAt: today(),
        questions: template.questions.map((question, idx)=>({ ...question, id:`Q-${idx+1}` }))
      });
      selectedBriefingTemplateId = id;
      renderMain();
      addToast('Briefing duplicado com sucesso.');
    }

    function renameBriefingTemplate(templateId){
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      const nextName = window.prompt('Renomear briefing:', template.name);
      if(!nextName) return;
      template.name = nextName.trim();
      template.updatedAt = today();
      renderMain();
      addToast('Briefing renomeado.');
    }

    function addBriefingQuestion(templateId, label, type, keepBuilderOpen = false, viewMode = 'edit'){
      if(!label){
        addToast('Escreva a pergunta antes de adicionar.');
        return;
      }
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      template.questions.push({
        id: `Q-${template.questions.length + 1}`,
        type,
        label
      });
      template.updatedAt = today();
      if(keepBuilderOpen){
        openBriefingBuilderModal(templateId, viewMode);
        addToast('Pergunta adicionada e formulário salvo.');
        return;
      }
      renderMain();
    }

    function deleteBriefingQuestion(templateId, questionId, keepBuilderOpen = false, viewMode = 'edit'){
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      template.questions = template.questions.filter(q=>q.id !== questionId);
      template.questions = template.questions.map((question, idx)=>({ ...question, id: `Q-${idx + 1}` }));
      template.updatedAt = today();
      if(keepBuilderOpen){
        openBriefingBuilderModal(templateId, viewMode);
        addToast('Alterações salvas no formulário.');
        return;
      }
      renderMain();
    }

    function moveBriefingQuestion(templateId, questionId, dir, keepBuilderOpen = false, viewMode = 'edit'){
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      const idx = template.questions.findIndex(q=>q.id===questionId);
      if(idx < 0) return;
      const offset = dir === 'up' ? -1 : 1;
      const target = idx + offset;
      if(target < 0 || target >= template.questions.length) return;
      const [item] = template.questions.splice(idx, 1);
      template.questions.splice(target, 0, item);
      template.questions = template.questions.map((question, index)=>({ ...question, id: `Q-${index + 1}` }));
      template.updatedAt = today();
      if(keepBuilderOpen){
        openBriefingBuilderModal(templateId, viewMode);
        addToast('Ordem das perguntas atualizada.');
        return;
      }
      renderMain();
    }

    function reorderBriefingQuestion(templateId, fromIndex, toIndex, keepBuilderOpen = false, viewMode = 'edit'){
      const template = briefingTemplates.find(t=>t.id===templateId);
      if(!template) return;
      if(fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
      const [item] = template.questions.splice(fromIndex, 1);
      if(!item) return;
      template.questions.splice(toIndex, 0, item);
      template.questions = template.questions.map((question, index)=>({ ...question, id: `Q-${index + 1}` }));
      template.updatedAt = today();
      if(keepBuilderOpen){
        openBriefingBuilderModal(templateId, viewMode);
        addToast('Perguntas reordenadas com arrastar e soltar.');
        return;
      }
      renderMain();
    }

    function renderBudgetsView(){
      const wrap = document.createElement('div');

      const card1 = document.createElement('div');
      card1.className = 'card';
      card1.innerHTML = `
        <h3>Orçamentos (mock)</h3>
        <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn small" id="btnOpenBudgetTemplate">Abrir modelo GRUTA (2024)</button>
          <span class="pill" title="Exportação via impressão do navegador">Exportar via Print</span>
        </div>
        
        <p>O orçamento nasce do briefing respondido (importa dados institucionais) ou é criado do zero. O porte é interno.</p>
        <div class="files" style="margin-top:10px">
          ${projects
            .filter(p=>p.budget)
            .slice(0,8)
            .map(p=>{
              const v = calcBudgetValue(p.budget);
              return `
                <div class="file">
                  <div style="min-width:0">
                    <div class="name">${escapeHtml(p.name)}</div>
                    <div class="meta">Horas: ${p.budget.hours} • Porte: ${PORTE_TABLE[p.budget.porte].label} • Total (mock): R$ ${formatMoney(v)}</div>
                  </div>
                  <button class="btn small">Ver</button>
                </div>
              `;
            }).join('')
          }
        </div>
      `;

      const card2 = document.createElement('div');
      card2.className = 'card';
      card2.innerHTML = `
        <h3>Tabela interna: Porte (multiplicador)</h3>
        <p>Editável pela equipe. Influencia o valor final do projeto.</p>
        <div class="files" style="margin-top:10px">
          ${Object.entries(PORTE_TABLE).map(([k,v])=>`
            <div class="file">
              <div>
                <div class="name">${v.label}</div>
                <div class="meta">Multiplicador: <span class="mono">${v.multiplier.toFixed(2)}</span></div>
              </div>
              <span class="pill">interno</span>
            </div>
          `).join('')}
        </div>
      `;

      wrap.appendChild(card1);
      wrap.appendChild(card2);
      return wrap;
    }

    function renderMethodsView(){
      const wrap = document.createElement('div');

      const actions = document.createElement('div');
      actions.className = 'card';
      actions.innerHTML = `
        <h3>Gerenciar metodologias</h3>
        <p>Cadastre novos métodos para já utilizar no orçamento.</p>
        <button class="btn small" id="btnNewMethod">+ Nova metodologia</button>
      `;
      wrap.appendChild(actions);
      actions.querySelector('#btnNewMethod')?.addEventListener('click', openNewMethodModal);

      METHOD_LIBRARY.forEach(m=>{
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `
          <h3>${escapeHtml(m.name)} <span class="pill" style="margin-left:6px">${m.id}</span></h3>
          <p>Total estimado: <b>${m.hours}h</b> • Etapas: ${m.steps.length}</p>
          <div class="files" style="margin-top:10px">
            ${m.steps.map(([n,h])=>`
              <div class="file">
                <div class="name">${escapeHtml(n)}</div>
                <div class="meta">${h}h</div>
              </div>
            `).join('')}
          </div>
        `;
        wrap.appendChild(c);
      });

      const hint = document.createElement('div');
      hint.className='card';
      hint.innerHTML = `
        <h3>Como isso entra no orçamento</h3>
        <p>Ao criar orçamento, escolha uma metodologia para pré-preencher etapas + horas. Depois ajuste e gere o PDF.</p>
      `;
      wrap.appendChild(hint);

      return wrap;
    }

    function renderClientPortalView(){
      const wrap = document.createElement('div');

      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `
        <h3>Clientes cadastrados</h3>
        <p>Neste momento, esta área mostra apenas as contas de clientes adicionadas na plataforma.</p>
        <div class="files" style="margin-top:10px">
          ${CLIENT_USERS.map(client=>`
            <div class="file">
              <div style="min-width:0">
                <div class="name">${escapeHtml(client.name)}</div>
                <div class="meta">${escapeHtml(client.email)} • Projetos vinculados: ${client.projects.length}</div>
              </div>
              <span class="pill">cliente</span>
            </div>
          `).join('')}
        </div>
      `;
      wrap.appendChild(c);

      const c2 = document.createElement('div');
      c2.className='card';
      c2.innerHTML = `
        <h3>Onde configurar o que o cliente enxerga</h3>
        <p>As informações visíveis ao cliente serão definidas dentro de cada projeto: conteúdos, links e mensagens na página do projeto.</p>
      `;
      wrap.appendChild(c2);

      return wrap;
    }

    function renderDetail(){}

    function highlightSelectedRow(){
      const rows = Array.from(document.querySelectorAll('.project-item'));
      rows.forEach(r=>{
        r.classList.toggle('selected', r.dataset.pid === selectedProjectId);
      });
    }

    function advanceFlow(projectId){
      const p = projects.find(x=>x.id===projectId);
      if(!p) return;

      const next = getNextStatus(p.status);
      if(!next) return;

      if(next === 'BRIEF_SENT'){
        addMessage(projectId, {
          visibility:'internal',
          by:p.owner,
          text:`Link de briefing gerado e enviado ao cliente (modelo: ${p.briefingModel}).`
        });
      }
      if(next === 'BRIEF_DONE'){
        p.briefing.respondedAt = today();
        if(!p.briefing.summary) p.briefing.summary = 'Resumo capturado a partir das respostas (mock).';
        addFile(projectId, { name:'Briefing — Respostas.pdf (placeholder)', type:'briefing_pdf', at: p.briefing.respondedAt });
        if(p.name.startsWith('Pré-projeto')){
          p.name = `Projeto — ${p.client}`;
        }
      }
      if(next === 'BUDGET_SENT'){
        const method = METHOD_LIBRARY[0];
        p.budget = {
          sentAt: today(),
          methodId: method.id,
          hours: method.hours,
          porte: 'MEDIO',
          hourly: 180,
          notes: 'Proposta gerada a partir do briefing (mock).'
        };
        addFile(projectId, { name:'Orçamento — Proposta.pdf (placeholder)', type:'budget_pdf', at: p.budget.sentAt });
        addMessage(projectId, {
          visibility:'client',
          by:p.owner,
          text:'Enviamos a proposta de orçamento. Fique à vontade para responder por aqui com dúvidas.'
        });
      }
      if(next === 'APPROVED'){
        p.budget.approvedAt = today();
        addMessage(projectId, { visibility:'client', by:p.owner, text:'Ótima notícia: orçamento aprovado e projeto iniciado.' });
      }
      if(next === 'ACTIVE'){
        if(!p.modules.find(m=>m.key==='moodart')){
          p.modules.push({ key:'moodart', name:'Mood Art (stub)', desc:'Painel para fontes, paleta, referências e decisões.' });
        }
      }

      setStatus(projectId, next, 'Avanço automático (mock).');
    }

    function getNextStatus(current){
      const order = ['PRE','BRIEF_SENT','BRIEF_DONE','BUDGET_SENT','APPROVED','ACTIVE'];
      const idx = order.indexOf(current);
      if(idx === -1) return null;
      return order[idx+1] || null;
    }

    function setStatus(projectId, status, note=''){
      const p = projects.find(x=>x.id===projectId);
      if(!p) return;
      p.status = status;
      p.updatedAt = today();
      p.statusHistory.push({ at: today(), by: p.owner, status, note });
      selectedProjectId = projectId;
      renderAll();
      renderDetail();
      highlightSelectedRow();
    }

    function addMessage(projectId, { visibility='internal', text, by='Equipe' }){
      const p = projects.find(x=>x.id===projectId);
      if(!p) return;
      p.messages.push({ at: today(), by, visibility, text });
      p.updatedAt = today();
      renderDetail();
    }

    function addFile(projectId, { name, type='deliverable', at=today() }){
      const p = projects.find(x=>x.id===projectId);
      if(!p) return;
      p.files.push({ name, type, at });
      p.updatedAt = today();
      renderDetail();
    }

    function navigateProjectsWithFilter(nextFilter){
      currentView = 'projects';
      filterStatus = nextFilter;
      searchQuery = '';
      if(el('search')) el('search').value = '';
      chips.forEach(x=>x.classList.toggle('active', x.dataset.filter === nextFilter));
      leftNavLinks.forEach(x=>x.classList.toggle('active', x.dataset.view==='projects'));
      renderAll();
    }

    function openNewMethodModal(){
      const name = prompt('Nome da metodologia:');
      if(!name) return;
      const hoursRaw = prompt('Total de horas estimadas:', '40');
      const hours = Number(hoursRaw);
      if(!Number.isFinite(hours) || hours <= 0) return;

      const nextNum = METHOD_LIBRARY.length + 1;
      const id = `M-${String(nextNum).padStart(2,'0')}`;
      METHOD_LIBRARY.push({
        id,
        name: name.trim(),
        hours: Math.round(hours),
        steps: [
          ['Planejamento', Math.max(1, Math.round(hours*0.2))],
          ['Execução', Math.max(1, Math.round(hours*0.6))],
          ['Entrega', Math.max(1, Math.round(hours*0.2))],
        ],
      });
      currentView = 'methods';
      leftNavLinks.forEach(x=>x.classList.toggle('active', x.dataset.view==='methods'));
      renderAll();
    }

    function getFilteredProjects(){
      return projects
        .filter(p=>{
          if(filterStatus === 'all') return true;
          if(filterStatus === 'pre') return STATUS[p.status]?.group === 'pre';
          if(filterStatus === 'brief') return STATUS[p.status]?.group === 'brief';
          if(filterStatus === 'budget') return STATUS[p.status]?.group === 'budget';
          if(filterStatus === 'active') return STATUS[p.status]?.group === 'active';
          if(filterStatus === 'pending') return ['PRE','BRIEF_SENT','BRIEF_DONE','BUDGET_SENT'].includes(p.status);
          if(filterStatus === 'brief_pending') return p.status === 'BRIEF_SENT';
          if(filterStatus === 'brief_done') return p.status === 'BRIEF_DONE';
          if(filterStatus === 'budget_pending') return p.status === 'BUDGET_SENT';
          if(filterStatus === 'approved') return p.status === 'APPROVED';
          return true;
        })
        .filter(p=>{
          if(!searchQuery) return true;
          const hay = `${p.id} ${p.name} ${p.client} ${p.owner}`.toLowerCase();
          return hay.includes(searchQuery);
        });
    }

    function statusBadge(s){
      return `<span class="badge"><span class="b ${s.badge}"></span>${s.label}</span>`;
    }

    function fileRow(f){
      return `
        <div class="file">
          <div style="min-width:0">
            <div class="name">${escapeHtml(f.name)}</div>
            <div class="meta">${f.at} • ${escapeHtml(f.type)}</div>
          </div>
          <button class="btn small">Baixar</button>
        </div>
      `;
    }

    function budgetSummary(p){
      const b = p.budget;
      const method = METHOD_LIBRARY.find(m=>m.id===b.methodId);
      const total = calcBudgetValue(b);
      return `
        Método: <b>${method ? escapeHtml(method.name) : b.methodId}</b><br/>
        Horas: <b>${b.hours}h</b> • Porte (interno): <b>${PORTE_TABLE[b.porte].label}</b><br/>
        Valor/h (mock): <b>R$ ${formatMoney(b.hourly)}</b> • Total (mock): <b>R$ ${formatMoney(total)}</b>
      `;
    }

    function calcBudgetValue(b){
      const mult = PORTE_TABLE[b.porte]?.multiplier ?? 1;
      return b.hours * b.hourly * mult;
    }

    function formatMoney(n){
      return Number(n).toFixed(2).replace('.', ',');
    }

    function today(){
      return new Date().toISOString().slice(0,10);
    }

    function escapeHtml(str){
      return (str ?? '').toString()
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
    }
  
    // ===== Budget template (based on uploaded "Orçamento GRUTA 2024" PDF) =====
    function getProjectForBudgetTemplate(){
      // Prefer selected project; fallback to first project with budget
      let p = projects.find(x=>x.id===selectedProjectId);
      if(!p || !p.budget) p = projects.find(x=>x.budget) || projects[0];
      return p;
    }

    function formatDatePtBR(iso){
      if(!iso) return '—';
      const [y,m,d] = iso.split('-');
      if(!y||!m||!d) return iso;
      return `${d}/${m}/${y}`;
    }

    function moneyBRL(v){
      const n = Number(v||0);
      return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function buildBudgetPrintHTML(p){
      const b = p.budget || { hours: 0, hourly: 0, porte: 'MEDIO', methodId: METHOD_LIBRARY[0]?.id };
      const method = METHOD_LIBRARY.find(m=>m.id===b.methodId) || METHOD_LIBRARY[0];
      const mult = PORTE_TABLE[b.porte]?.multiplier ?? 1;
      const subtotal = (b.hours||0) * (b.hourly||0);
      const total = subtotal * mult;

      // Map minimal "campos" do PDF para o nosso modelo
      const headerCity = "Crato/PB";
      const headerDate = formatDatePtBR(today());
      const atendimento = (p.briefing?.contact || '').trim() || '—';
      const responsavel = p.owner || '—';
      const validade = '15 dias';
      const tipoServico = (p.briefingModel?.toLowerCase().includes('site') ? 'site institucional' : 'projeto de design');

      const clienteNome = p.client || '—';
      const projetoNome = p.name || '—';

      // Descrição do projeto: usa resumo do briefing como base
      const descricao = (p.briefing?.summary || '').trim() || 'Descrição do projeto (preencher a partir do briefing).';

      // Etapas: usa steps da metodologia
      const steps = (method?.steps || []).map(([name,h]) => ({ name, h }));

      // Itens de terceiros (mantém linhas do modelo; valores editáveis no futuro)
      const investimentoLinhas = [
        { item:'Domínio .org.br (anual)', wp:'R$ 40 a 60', wix:'Incluso 1º ano' },
        { item:'Hospedagem (anual)', wp:'R$ 300 a 600', wix:'Incluso no plano' },
        { item:'Google Workspace (anual por conta)', wp:'R$ 300 a 400', wix:'R$ 300 a 400' },
        { item:'Assinatura da plataforma (plano)', wp:'Gratuito (software livre)', wix:'R$ 180/ano (R$ 15/mês)' },
      ];

      return `
        <div class="max-w-[820px] mx-auto">
          <!-- Header -->
          <div class="flex items-start justify-between gap-6">
            <div>
              <div class="text-sm">${headerCity},</div>
              <div class="text-sm">${headerDate}</div>
              <div class="mt-4 text-sm"><span class="font-semibold">Atendimento:</span> ${escapeHtml(atendimento)}</div>
              <div class="text-sm"><span class="font-semibold">Responsável:</span> ${escapeHtml(responsavel)}</div>
            </div>
            <div class="text-right">
              <div class="text-sm"><span class="font-semibold">Validade:</span> ${validade}</div>
              <div class="text-sm mt-1">${escapeHtml(tipoServico)}</div>
            </div>
          </div>

          <div class="mt-6 border-t border-slate-200 pt-4">
            <div class="text-xl font-semibold tracking-tight">${escapeHtml(projetoNome)}</div>
            <div class="text-sm text-slate-600 mt-1">${escapeHtml(clienteNome)}</div>
          </div>

          <!-- Descrição -->
          <div class="mt-6">
            <div class="text-sm font-semibold tracking-wide">DESCRIÇÃO DO PROJETO</div>
            <div class="mt-2 text-sm leading-relaxed text-slate-800">
              ${escapeHtml(descricao)}
            </div>
          </div>

          <!-- Etapas -->
          <div class="mt-6">
            <div class="text-sm font-semibold tracking-wide">ETAPAS DE EXECUÇÃO / CRIAÇÃO</div>
            <div class="mt-2 grid grid-cols-1 gap-2">
              ${steps.map(s=>`
                <div class="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2">
                  <div class="text-sm">${escapeHtml(s.name)}</div>
                  <div class="text-sm font-semibold">${s.h}h</div>
                </div>
              `).join('')}
            </div>
            <div class="mt-3 text-sm text-slate-600">
              <span class="font-semibold">Total horas:</span> ${b.hours}h • 
              <span class="font-semibold">Valor/h:</span> R$ ${moneyBRL(b.hourly)} • 
              <span class="font-semibold">Multiplicador (interno):</span> ${PORTE_TABLE[b.porte]?.label || b.porte} (${mult.toFixed(2)})
            </div>
          </div>

          <!-- Investimento -->
          <div class="mt-8">
            <div class="text-sm font-semibold tracking-wide">INVESTIMENTO</div>

            <div class="mt-3 border border-slate-200 rounded-xl overflow-hidden">
              <div class="grid grid-cols-3 bg-slate-50 text-xs font-semibold">
                <div class="px-3 py-2">Item</div>
                <div class="px-3 py-2">WordPress</div>
                <div class="px-3 py-2">Wix Plano Básico*</div>
              </div>
              ${investimentoLinhas.map(r=>`
                <div class="grid grid-cols-3 text-xs border-t border-slate-200">
                  <div class="px-3 py-2">${escapeHtml(r.item)}</div>
                  <div class="px-3 py-2">${escapeHtml(r.wp)}</div>
                  <div class="px-3 py-2">${escapeHtml(r.wix)}</div>
                </div>
              `).join('')}
              <div class="grid grid-cols-3 text-xs border-t border-slate-200 bg-white">
                <div class="px-3 py-2 font-semibold">Valor do projeto (serviço)</div>
                <div class="px-3 py-2 font-semibold">R$ ${moneyBRL(total)}</div>
                <div class="px-3 py-2 font-semibold">R$ ${moneyBRL(total)}</div>
              </div>
            </div>

            <div class="mt-3 text-xs text-slate-600">
              <span class="font-semibold">Observação:</span> No MVP, itens de terceiros são apenas referência do modelo. O total do serviço vem de horas × valor/h × multiplicador interno.
            </div>
          </div>

          <!-- Cronograma (mock) -->
          <div class="mt-8">
            <div class="text-sm font-semibold tracking-wide">CRONOGRAMA</div>
            <div class="mt-3 grid grid-cols-1 gap-2 text-sm">
              <div class="border border-slate-200 rounded-lg p-3">
                <div class="font-semibold">Início</div>
                <div class="text-slate-600 text-xs mt-1">${formatDatePtBR(today())}</div>
                <div class="text-slate-700 text-sm mt-2">Kickoff, alinhamento de materiais e acesso.</div>
              </div>
              <div class="border border-slate-200 rounded-lg p-3">
                <div class="font-semibold">Etapas</div>
                <div class="text-slate-700 text-sm mt-2">As etapas seguem a metodologia selecionada e são ajustáveis na versão completa.</div>
              </div>
            </div>
          </div>

          <!-- Condições (resumo) -->
          <div class="mt-8">
            <div class="text-sm font-semibold tracking-wide">CONDIÇÕES GERAIS (resumo)</div>
            <ul class="mt-2 text-xs text-slate-700 list-disc pl-5 space-y-1">
              <li>Prazos dependem de envio de materiais e aprovações do cliente.</li>
              <li>Serviços de terceiros (tradução, imagens, impressão) não inclusos.</li>
              <li>Valores podem ser revistos por mudanças relevantes no briefing/escopo.</li>
              <li>Aprovação formal por assinatura ou e-mail.</li>
            </ul>
          </div>

          <!-- Rodapé -->
          <div class="mt-10 pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
            <div>Modelo visual inspirado em “Orçamento GRUTA 2024”.</div>
            <div>Gerado em ${headerDate}</div>
          </div>
        </div>
      `;
    }

    function openBudgetTemplate(p){
      const project = p || getProjectForBudgetTemplate();
      const host = document.getElementById('printHost');
      const area = document.getElementById('printArea');
      area.innerHTML = buildBudgetPrintHTML(project);
      host.style.display = 'block';
      // Jump to top so user sees it
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Offer quick actions
      const ok = confirm('Modelo de orçamento aberto em modo impressão.\n\nOK = abrir caixa de impressão (salvar como PDF)\nCancelar = apenas visualizar');
      if(ok) window.print();
    }

    function closeBudgetTemplate(){
      const host = document.getElementById('printHost');
      host.style.display = 'none';
    }

    // Wire buttons (budgets view + project detail)
    document.addEventListener('click', (e)=>{
      if(e.target?.id === 'btnOpenBudgetTemplate'){
        openBudgetTemplate();
      }
      if(e.target?.id === 'btnBudgetTemplateFromProject'){
        const p = projects.find(x=>x.id===selectedProjectId);
        openBudgetTemplate(p);
      }
      if(e.target?.id === 'btnBudgetPrintFromProject'){
        const p = projects.find(x=>x.id===selectedProjectId);
        openBudgetTemplate(p);
      }
    });
