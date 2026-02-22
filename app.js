const { useMemo, useState } = React;
const h = React.createElement;

const STATUS_META = {
  PRE: { label: 'Pré-projeto', color: 'bg-slate-100 text-slate-700' },
  BRIEF_DONE: { label: 'Briefing respondido', color: 'bg-indigo-100 text-indigo-700' },
  BUDGET_SENT: { label: 'Orçamento enviado', color: 'bg-amber-100 text-amber-700' },
  ACTIVE: { label: 'Projeto ativo', color: 'bg-emerald-100 text-emerald-700' },
};

const QUILLFORMS_EMBED_URL = '';

const INITIAL_PROJECTS = [
  {
    id: 'PRJ-2401',
    name: 'Pré-projeto — Samba Trial',
    client: 'Daniel Branco',
    owner: 'Equipe Design',
    status: 'BRIEF_DONE',
    summary: 'Objetivo: identidade visual para apresentação do projeto.',
  },
  {
    id: 'PRJ-2402',
    name: 'Pré-projeto — Site Conserve',
    client: 'Conserve',
    owner: 'Equipe Design',
    status: 'BUDGET_SENT',
    summary: 'Site institucional com foco em conteúdo e captação.',
  },
  {
    id: 'PRJ-2403',
    name: 'Identidade Visual — Instituto Araripe',
    client: 'Instituto Araripe',
    owner: 'Helton',
    status: 'ACTIVE',
    summary: 'Projeto em andamento; base de marca e aplicações.',
  },
];

function statusGroup(status) {
  if (status === 'PRE') return 'pre';
  if (status === 'BRIEF_DONE') return 'brief';
  if (status === 'BUDGET_SENT') return 'budget';
  return 'active';
}

function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', client: '', owner: '' });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = filter === 'all' || statusGroup(project.status) === filter;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        q.length === 0 ||
        project.id.toLowerCase().includes(q) ||
        project.name.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [projects, query, filter]);

  const activeCount = projects.filter((item) => item.status === 'ACTIVE').length;

  function createProject(event) {
    event.preventDefault();
    if (!form.name || !form.client || !form.owner) return;

    const nextId = `PRJ-${2400 + projects.length + 1}`;
    const created = {
      id: nextId,
      name: form.name,
      client: form.client,
      owner: form.owner,
      status: 'PRE',
      summary: 'Pré-projeto criado no painel React com integração QuillForms.',
    };

    setProjects((current) => [created, ...current]);
    setForm({ name: '', client: '', owner: '' });
    setFilter('all');
  }

  function onFormField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return h(
    'div',
    { className: 'min-h-screen bg-slate-950 text-slate-100' },
    h(
      'div',
      { className: 'mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 lg:flex-row' },
      h(
        'aside',
        { className: 'w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:w-80' },
        h('p', { className: 'text-xs uppercase tracking-[0.2em] text-cyan-300' }, 'Gruta Núcleo Studio'),
        h('h1', { className: 'mt-2 text-2xl font-semibold' }, 'Painel em React (sem Babel)'),
        h(
          'p',
          { className: 'mt-2 text-sm text-slate-400' },
          'Compatível com ambientes mais restritos: removido JSX em runtime e mantido React + Tailwind.'
        ),
        h(
          'div',
          { className: 'mt-6 space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4' },
          h('p', { className: 'text-xs uppercase tracking-wide text-slate-400' }, 'Resumo rápido'),
          h('p', { className: 'text-sm text-slate-300' }, ['Projetos cadastrados: ', h('strong', null, projects.length)]),
          h('p', { className: 'text-sm text-slate-300' }, ['Projetos ativos: ', h('strong', null, activeCount)]),
          h(
            'p',
            { className: 'text-sm text-slate-300' },
            ['Pré-projetos: ', h('strong', null, projects.filter((item) => item.status === 'PRE').length)]
          )
        )
      ),
      h(
        'main',
        { className: 'flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-5' },
        h(
          'section',
          { className: 'grid gap-3 md:grid-cols-3' },
          h('input', {
            value: query,
            onChange: (event) => setQuery(event.target.value),
            placeholder: 'Buscar por nome, cliente ou ID',
            className: 'rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring',
          }),
          h(
            'select',
            {
              value: filter,
              onChange: (event) => setFilter(event.target.value),
              className: 'rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring',
            },
            h('option', { value: 'all' }, 'Todos'),
            h('option', { value: 'pre' }, 'Pré-projeto'),
            h('option', { value: 'brief' }, 'Briefing'),
            h('option', { value: 'budget' }, 'Orçamento'),
            h('option', { value: 'active' }, 'Ativo')
          ),
          h(
            'button',
            {
              onClick: () => {
                setQuery('');
                setFilter('all');
              },
              className: 'rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800',
            },
            'Limpar filtros'
          )
        ),
        h(
          'section',
          { className: 'mt-5 grid gap-4 xl:grid-cols-[1.1fr,0.9fr]' },
          h(
            'div',
            { className: 'space-y-3' },
            filteredProjects.map((project) => {
              const meta = STATUS_META[project.status] || STATUS_META.PRE;
              return h(
                'article',
                { key: project.id, className: 'rounded-xl border border-slate-800 bg-slate-950/50 p-4' },
                h(
                  'div',
                  { className: 'flex flex-wrap items-center justify-between gap-2' },
                  h('h2', { className: 'text-base font-medium' }, project.name),
                  h('span', { className: `rounded-full px-2.5 py-1 text-xs font-medium ${meta.color}` }, meta.label)
                ),
                h('p', { className: 'mt-1 text-sm text-slate-400' }, `${project.id} • Cliente: ${project.client} • Responsável: ${project.owner}`),
                h('p', { className: 'mt-3 text-sm text-slate-300' }, project.summary)
              );
            }),
            filteredProjects.length === 0
              ? h(
                  'div',
                  { className: 'rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400' },
                  'Nenhum projeto encontrado para os filtros atuais.'
                )
              : null
          ),
          h(
            'div',
            { className: 'space-y-4' },
            h(
              'form',
              { onSubmit: createProject, className: 'rounded-xl border border-slate-800 bg-slate-950/60 p-4' },
              h('h3', { className: 'text-lg font-semibold' }, 'Novo pré-projeto'),
              h('p', { className: 'mt-1 text-sm text-slate-400' }, 'Cadastro rápido para evoluir briefing e orçamento.'),
              h(
                'div',
                { className: 'mt-4 space-y-3' },
                h('input', {
                  value: form.name,
                  onChange: (event) => onFormField('name', event.target.value),
                  placeholder: 'Nome do projeto',
                  className: 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring',
                }),
                h('input', {
                  value: form.client,
                  onChange: (event) => onFormField('client', event.target.value),
                  placeholder: 'Cliente',
                  className: 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring',
                }),
                h('input', {
                  value: form.owner,
                  onChange: (event) => onFormField('owner', event.target.value),
                  placeholder: 'Responsável interno',
                  className: 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring',
                })
              ),
              h(
                'button',
                { type: 'submit', className: 'mt-4 w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300' },
                'Criar projeto'
              )
            ),
            h(
              'section',
              { className: 'rounded-xl border border-slate-800 bg-slate-950/60 p-4' },
              h('h3', { className: 'text-lg font-semibold' }, 'Briefing com QuillForms'),
              h(
                'p',
                { className: 'mt-1 text-sm text-slate-400' },
                'Substituição do fluxo anterior: o formulário agora deve ser servido por um link embed do QuillForms.'
              ),
              QUILLFORMS_EMBED_URL
                ? h('iframe', {
                    src: QUILLFORMS_EMBED_URL,
                    title: 'QuillForms Briefing',
                    className: 'mt-3 h-72 w-full rounded-lg border border-slate-700 bg-white',
                    loading: 'lazy',
                  })
                : h(
                    'div',
                    { className: 'mt-3 rounded-lg border border-dashed border-slate-700 p-3 text-xs text-slate-300' },
                    'Defina a constante QUILLFORMS_EMBED_URL em app.js com a URL do seu formulário QuillForms para habilitar o embed.'
                  )
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
