const { useMemo, useState } = React;

const STATUS_META = {
  PRE: { label: 'Pré-projeto', color: 'bg-slate-100 text-slate-700' },
  BRIEF_DONE: { label: 'Briefing respondido', color: 'bg-indigo-100 text-indigo-700' },
  BUDGET_SENT: { label: 'Orçamento enviado', color: 'bg-amber-100 text-amber-700' },
  ACTIVE: { label: 'Projeto ativo', color: 'bg-emerald-100 text-emerald-700' },
};

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
      summary: 'Pré-projeto criado no novo painel React + Tailwind.',
    };

    setProjects((current) => [created, ...current]);
    setForm({ name: '', client: '', owner: '' });
    setFilter('all');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:w-80">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Gruta Núcleo Studio</p>
          <h1 className="mt-2 text-2xl font-semibold">Painel em React</h1>
          <p className="mt-2 text-sm text-slate-400">
            Migração inicial concluída: interface agora renderizada com React e utilitários Tailwind.
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Resumo rápido</p>
            <p className="text-sm text-slate-300">Projetos cadastrados: <strong>{projects.length}</strong></p>
            <p className="text-sm text-slate-300">Projetos ativos: <strong>{activeCount}</strong></p>
            <p className="text-sm text-slate-300">Pré-projetos: <strong>{projects.filter((item) => item.status === 'PRE').length}</strong></p>
          </div>
        </aside>

        <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <section className="grid gap-3 md:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, cliente ou ID"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring"
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring"
            >
              <option value="all">Todos</option>
              <option value="pre">Pré-projeto</option>
              <option value="brief">Briefing</option>
              <option value="budget">Orçamento</option>
              <option value="active">Ativo</option>
            </select>
            <button
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Limpar filtros
            </button>
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const meta = STATUS_META[project.status] || STATUS_META.PRE;
                return (
                  <article key={project.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-base font-medium">{project.name}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${meta.color}`}>{meta.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{project.id} • Cliente: {project.client} • Responsável: {project.owner}</p>
                    <p className="mt-3 text-sm text-slate-300">{project.summary}</p>
                  </article>
                );
              })}

              {filteredProjects.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                  Nenhum projeto encontrado para os filtros atuais.
                </div>
              )}
            </div>

            <form onSubmit={createProject} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="text-lg font-semibold">Novo pré-projeto</h3>
              <p className="mt-1 text-sm text-slate-400">Fluxo inicial para capturar briefing e evoluir para orçamento.</p>
              <div className="mt-4 space-y-3">
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Nome do projeto"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring"
                />
                <input
                  value={form.client}
                  onChange={(event) => setForm((current) => ({ ...current, client: event.target.value }))}
                  placeholder="Cliente"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring"
                />
                <input
                  value={form.owner}
                  onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))}
                  placeholder="Responsável interno"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring"
                />
              </div>
              <button type="submit" className="mt-4 w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                Criar projeto
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
