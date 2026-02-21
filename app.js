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
        briefingModel:'BrandingBase',
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
    let currentView = 'projects';
    let filterStatus = 'all';
    let searchQuery = '';

    const el = (id)=>document.getElementById(id);

    const leftNavLinks = Array.from(document.querySelectorAll('.nav a'));
    const chips = Array.from(document.querySelectorAll('.chip'));
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const modalBackdrop = el('modalBackdrop');

    renderAll();
    wire();

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
        if(e.key === 'Escape') closeModal();
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
        currentView = 'projects';
        leftNavLinks.forEach(x=>x.classList.remove('active'));
        leftNavLinks.find(x=>x.dataset.view==='projects')?.classList.add('active');
        renderAll();
      });

      el('btnDeselect').addEventListener('click', ()=>{
        selectedProjectId = null;
        renderDetail();
        highlightSelectedRow();
      });

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

    function renderAll(){
      renderCounts();
      renderKpis();
      renderMain();
      renderDetail();
      setMainHeader();
    }

    function setMainHeader(){
      const titleMap = {
        projects: ['Projetos', 'Home administrativa: pipeline completo (pré-projeto → briefing → orçamento → aprovado → projeto ativo).'],
        briefings: ['Briefings', 'Modelos (tipo Typeform) • respostas • PDF editorial (placeholder).'],
        budgets: ['Orçamentos', 'Simulação • importação do briefing • metodologia + horas • porte interno • PDF (placeholder).'],
        methods: ['Metodologias', 'Banco de metodologias com horas estimadas (base para orçamento).'],
        clientPortal: ['Portal do cliente', 'Visão do cliente: briefing, status, mensagens e downloads (stub).'],
      };
      const [t,s] = titleMap[currentView] || titleMap.projects;
      el('mainTitle').textContent = t;
      el('mainSubtitle').textContent = s;
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

      const grid = el('kpiGrid');
      grid.innerHTML = '';
      const items = [
        { v: counts.total, k:'Total de projetos' },
        { v: active, k:'Projetos ativos' },
        { v: pre, k:'Pré-projetos' },
        { v: brief, k:'Em briefing' },
      ];

      items.forEach(it=>{
        const d = document.createElement('div');
        d.className = 'kpi';
        d.innerHTML = `<div class="v">${it.v}</div><div class="k">${it.k}</div>`;
        grid.appendChild(d);
      });
    }

    function renderMain(){
      const body = el('mainBody');
      body.innerHTML = '';

      if(currentView === 'projects'){
        body.appendChild(renderProjectsTable());
        return;
      }
      if(currentView === 'briefings'){
        body.appendChild(renderBriefingsView());
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

      const table = document.createElement('table');
      table.className = 'table';
      table.innerHTML = `
        <thead>
          <tr>
            <th style="width:18%">ID</th>
            <th style="width:34%">Projeto</th>
            <th style="width:20%">Cliente</th>
            <th style="width:16%">Status</th>
            <th style="width:12%">Ações</th>
          </tr>
        </thead>
      `;

      const tbody = document.createElement('tbody');

      const list = getFilteredProjects();

      list.forEach(p=>{
        const tr = document.createElement('tr');
        tr.className = 'tr';
        tr.dataset.pid = p.id;
        tr.style.cursor='pointer';

        const status = STATUS[p.status] || STATUS.PRE;

        tr.innerHTML = `
          <td class="mono">${p.id}</td>
          <td>
            <div style="font-weight:700">${escapeHtml(p.name)}</div>
            <div class="muted" style="font-size:11px;margin-top:2px;">
              Responsável: ${escapeHtml(p.owner)} • Criado: ${p.createdAt}
            </div>
          </td>
          <td>
            <div>${escapeHtml(p.client)}</div>
            <div class="muted" style="font-size:11px;margin-top:2px;">
              Briefing: ${escapeHtml(p.briefingModel)}
            </div>
          </td>
          <td>${statusBadge(status)}</td>
          <td><button class="btn small" data-action="advance">Avançar</button></td>
        `;

        tr.addEventListener('click', (e)=>{
          const btn = e.target.closest('button');
          if(btn && btn.dataset.action === 'advance'){
            e.preventDefault();
            advanceFlow(p.id);
            return;
          }
          selectedProjectId = p.id;
          renderDetail();
          highlightSelectedRow();
        });

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      wrap.appendChild(table);

      if(list.length === 0){
        const empty = document.createElement('div');
        empty.className = 'card';
        empty.innerHTML = `
          <h3>Nenhum projeto encontrado</h3>
          <p>Tente mudar os filtros ou criar um novo pré-projeto.</p>
        `;
        wrap.appendChild(empty);
      }

      highlightSelectedRow();
      return wrap;
    }

    function renderBriefingsView(){
      const wrap = document.createElement('div');

      const card1 = document.createElement('div');
      card1.className = 'card';
      card1.innerHTML = `
        <h3>Modelos de Briefing (mock)</h3>
        <p>Interface de criação/edição semelhante a Typeform. Aqui listamos modelos e um link de compartilhamento (placeholder).</p>
        <div class="files" style="margin-top:10px">
          ${[
            ['Jotform (exemplo 2604338)', 'link externo: https://form.jotform.com/2604338'],
            ['Briefing — Branding Base', 'link interno (placeholder)'],
            ['Briefing — Site Institucional', 'link interno (placeholder)'],
          ].map(([n,m])=>`
            <div class="file">
              <div style="min-width:0">
                <div class="name">${escapeHtml(n)}</div>
                <div class="meta">${escapeHtml(m)}</div>
              </div>
              <button class="btn small">Abrir</button>
            </div>
          `).join('')}
        </div>
      `;

      const card2 = document.createElement('div');
      card2.className = 'card';
      card2.innerHTML = `
        <h3>Respostas de Briefing (mock)</h3>
        <p>Quando o cliente responde, o sistema gera dados estruturados + PDF editorial (placeholder) e alimenta o orçamento.</p>
        <div class="helper" style="margin-top:10px">
          Dica: na Home de Projetos, clique em “Avançar” para simular o fluxo e gerar o PDF de briefing no projeto.
        </div>
      `;

      wrap.appendChild(card1);
      wrap.appendChild(card2);
      return wrap;
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
        <h3>Portal do cliente (stub)</h3>
        <p>Área logada para acompanhar briefing, status, mensagens e baixar arquivos do projeto.</p>
        <div class="helper" style="margin-top:10px">
          Neste MVP, use a aba “Cliente” no painel da direita ao selecionar um projeto.
        </div>
      `;
      wrap.appendChild(c);

      const c2 = document.createElement('div');
      c2.className='card';
      c2.innerHTML = `
        <h3>Conteúdos previstos</h3>
        <p>Briefing • Timeline • Mensagens • Downloads • Módulos (Mood Art / Identidade: fontes, cores, decisões).</p>
      `;
      wrap.appendChild(c2);

      return wrap;
    }

    function renderDetail(){
      const body = el('detailBody');
      const p = projects.find(x=>x.id===selectedProjectId);

      if(!p){
        el('detailTitle').textContent = 'Selecione um projeto';
        el('detailSub').textContent = 'Detalhes, ações rápidas e visão cliente';
        body.innerHTML = `
          <div class="card">
            <h3>Nada selecionado</h3>
            <p>Selecione um projeto na Home para ver detalhes e ações.</p>
          </div>
          <div class="card">
            <h3>Atalho</h3>
            <p>Clique em “Novo pré-projeto” para começar.</p>
          </div>
        `;
        return;
      }

      const activeTab = document.querySelector('.tab.active')?.dataset.tab || 'overview';

      el('detailTitle').textContent = p.name;
      el('detailSub').textContent = `${p.client} • ${p.id}`;

      if(activeTab === 'overview'){
        body.innerHTML = '';
        const s = STATUS[p.status] || STATUS.PRE;

        const summary = document.createElement('div');
        summary.className='card';
        summary.innerHTML = `
          <h3>Resumo</h3>
          <p><b>Status:</b> ${s.label} • <b>Responsável:</b> ${escapeHtml(p.owner)}<br/>
          <b>Modelo de briefing:</b> ${escapeHtml(p.briefingModel)} • <b>Criado:</b> ${p.createdAt}</p>
        `;

        const actions = document.createElement('div');
        actions.className='card';
        actions.innerHTML = `
          <h3>Ações rápidas (mock)</h3>
          <p>Simule o fluxo do projeto. As ações criam histórico, mensagens e arquivos placeholders.</p>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
            <button class="btn small" id="actAdvance">Avançar status</button>
            <button class="btn small" id="actAddClientMsg">Mensagem ao cliente</button>
            <button class="btn small" id="actAddFile">Adicionar arquivo</button>
            <button class="btn small danger" id="actArchive">Arquivar</button>
          </div>
        `;

        const briefing = document.createElement('div');
        briefing.className='card';
        briefing.innerHTML = `
          <h3>Briefing</h3>
          <p>${p.briefing?.respondedAt ?
            `Respondido em <b>${p.briefing.respondedAt}</b><br/>Resumo: ${escapeHtml(p.briefing.summary || '—')}` :
            'Ainda não respondido pelo cliente. Gere o link e aguarde resposta.'}
          </p>
          <div class="files">
            ${p.files.filter(f=>f.type==='briefing_pdf').map(f=>fileRow(f)).join('') || `<div class="muted" style="font-size:12px;">Sem PDF de briefing ainda.</div>`}
          </div>
        `;

        const budget = document.createElement('div');
        budget.className='card';
        const budgetText = p.budget ? budgetSummary(p) : 'Ainda não existe orçamento.';
        budget.innerHTML = `
          <h3>Orçamento</h3>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
            <button class="btn small" id="btnBudgetTemplateFromProject">Modelo GRUTA (2024)</button>
            <button class="btn small" id="btnBudgetPrintFromProject">Exportar (Print/PDF)</button>
          </div>
          <p>${budgetText}</p>
          <div class="files">
            ${p.files.filter(f=>f.type==='budget_pdf').map(f=>fileRow(f)).join('') || `<div class="muted" style="font-size:12px;">Sem PDF de orçamento ainda.</div>`}
          </div>
        `;

        const modules = document.createElement('div');
        modules.className='card';
        modules.innerHTML = `
          <h3>Módulos do projeto</h3>
          <p>Estrutura prevista para crescer (ex: Mood Art, Identidade, Entregas, Decisões).</p>
          <div class="files">
            ${p.modules.length ? p.modules.map(m=>`
              <div class="file">
                <div style="min-width:0">
                  <div class="name">${escapeHtml(m.name)}</div>
                  <div class="meta">${escapeHtml(m.desc)}</div>
                </div>
                <button class="btn small">Abrir</button>
              </div>
            `).join('') : `<div class="muted" style="font-size:12px;">Nenhum módulo ainda (criado quando vira Projeto Ativo).</div>`}
          </div>
        `;

        body.appendChild(summary);
        body.appendChild(actions);
        body.appendChild(briefing);
        body.appendChild(budget);
        body.appendChild(modules);

        setTimeout(()=>{
          el('actAdvance')?.addEventListener('click', ()=> advanceFlow(p.id));
          el('actArchive')?.addEventListener('click', ()=> setStatus(p.id, 'ARCHIVED', 'Projeto arquivado (mock).'));
          el('actAddClientMsg')?.addEventListener('click', ()=>{
            const text = prompt('Mensagem visível ao cliente (mock):', 'Olá! Atualização rápida sobre o projeto…');
            if(!text) return;
            addMessage(p.id, { visibility:'client', text, by: p.owner });
          });
          el('actAddFile')?.addEventListener('click', ()=>{
            const name = prompt('Nome do arquivo (mock):', 'Entrega — Arquivo.zip (placeholder)');
            if(!name) return;
            addFile(p.id, { name, type:'deliverable', at: today() });
          });
        }, 0);

        return;
      }

      if(activeTab === 'timeline'){
        body.innerHTML = '';
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `
          <h3>Histórico de status</h3>
          <p>Rastreio interno para auditoria e clareza do pipeline.</p>
          <div class="timeline">
            ${p.statusHistory.slice().reverse().map(h=>`
              <div class="tlItem">
                <div class="ic">⏺</div>
                <div class="meta">
                  <div class="t">${STATUS[h.status]?.label || h.status}</div>
                  <div class="s">${h.at} • ${escapeHtml(h.by)}${h.note ? ' • ' + escapeHtml(h.note) : ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        body.appendChild(c);
        return;
      }

      if(activeTab === 'client'){
        body.innerHTML = '';

        const c = document.createElement('div');
        c.className='card';
        c.innerHTML = `
          <h3>Portal do cliente</h3>
          <p>Visão do cliente para este projeto.</p>
          <div class="files" style="margin-top:10px">
            <div class="file">
              <div style="min-width:0">
                <div class="name">Status atual</div>
                <div class="meta">${STATUS[p.status]?.label || p.status}</div>
              </div>
              ${statusBadge(STATUS[p.status] || STATUS.PRE)}
            </div>
            <div class="file">
              <div style="min-width:0">
                <div class="name">Briefing respondido</div>
                <div class="meta">${p.briefing?.respondedAt ? p.briefing.respondedAt : '—'}</div>
              </div>
              <button class="btn small">Ver</button>
            </div>
            <div class="file">
              <div style="min-width:0">
                <div class="name">Downloads</div>
                <div class="meta">${p.files.length} arquivo(s)</div>
              </div>
              <button class="btn small">Abrir</button>
            </div>
          </div>
        `;

        const msgs = document.createElement('div');
        msgs.className='card';
        const clientMsgs = p.messages.filter(m=>m.visibility==='client');
        msgs.innerHTML = `
          <h3>Mensagens</h3>
          <p>Atualizações visíveis para o cliente.</p>
          <div class="timeline">
            ${clientMsgs.length ? clientMsgs.slice().reverse().map(m=>`
              <div class="tlItem">
                <div class="ic">💬</div>
                <div class="meta">
                  <div class="t">${escapeHtml(m.text)}</div>
                  <div class="s">${m.at} • ${escapeHtml(m.by)}</div>
                </div>
              </div>
            `).join('') : `<div class="muted" style="font-size:12px;">Sem mensagens ainda.</div>`}
          </div>
          <div style="margin-top:10px; display:flex; gap:8px;">
            <button class="btn small" id="clientMsgBtn">Nova mensagem</button>
          </div>
        `;

        const dls = document.createElement('div');
        dls.className='card';
        dls.innerHTML = `
          <h3>Arquivos disponíveis</h3>
          <p>Downloads organizados.</p>
          <div class="files">
            ${p.files.length ? p.files.slice().reverse().map(f=>fileRow(f)).join('') : `<div class="muted" style="font-size:12px;">Sem arquivos.</div>`}
          </div>
        `;

        body.appendChild(c);
        body.appendChild(msgs);
        body.appendChild(dls);

        setTimeout(()=>{
          el('clientMsgBtn')?.addEventListener('click', ()=>{
            const text = prompt('Mensagem ao cliente (mock):', 'Olá! Seguimos para a próxima etapa…');
            if(!text) return;
            addMessage(p.id, { visibility:'client', text, by: p.owner });
          });
        }, 0);

        return;
      }
    }

    function highlightSelectedRow(){
      const rows = Array.from(document.querySelectorAll('.tr'));
      rows.forEach(r=>{
        if(r.dataset.pid === selectedProjectId){
          r.style.outline = '2px solid rgba(255,138,61,.35)';
          r.style.background = 'rgba(255,138,61,.08)';
        }else{
          r.style.outline = 'none';
          r.style.background = 'rgba(255,255,255,.04)';
        }
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
      renderAll();
      selectedProjectId = projectId;
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

    function getFilteredProjects(){
      return projects
        .filter(p=>{
          if(filterStatus === 'all') return true;
          if(filterStatus === 'pre') return STATUS[p.status]?.group === 'pre';
          if(filterStatus === 'brief') return STATUS[p.status]?.group === 'brief';
          if(filterStatus === 'budget') return STATUS[p.status]?.group === 'budget';
          if(filterStatus === 'active') return STATUS[p.status]?.group === 'active';
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
