'use client';

import { useMemo, useState } from 'react';
import { Archive, ArrowRight, Bell, BookOpen, Box, CalendarDays, Check, ChevronDown, CircleHelp, Cloud, Code2, Command, CreditCard, Database, Filter, Folder, Globe2, HardDrive, Home, Layers3, LifeBuoy, Menu, Moon, MoreVertical, Plus, Search, Server, ShoppingBag, X } from 'lucide-react';
import '../dashboard.css';
import './projects.css';

type Project = { name: string; description: string; apps: number | null; databases: number | null; environments: number | null; archived?: boolean; tone: string };
const initialProjects: Project[] = [
 { name: 'Sistema Interno', description: 'Aplicações e serviços da operação interna', apps: 3, databases: 1, environments: 3, tone: 'purple' },
 { name: 'Site Institucional', description: 'Website institucional e portal de serviços', apps: 1, databases: 1, environments: 2, tone: 'cyan' },
 { name: 'App Agenda', description: 'Plataforma de agendamentos online', apps: 1, databases: null, environments: 2, tone: 'purple' },
 { name: 'E-commerce', description: 'Loja virtual e serviços de pagamento', apps: 2, databases: 1, environments: 2, tone: 'orange' },
 { name: 'Plataforma Educação', description: 'LMS e gestão de cursos', apps: 1, databases: 1, environments: 3, tone: 'cyan' },
 { name: 'Projecto Legado', description: 'Versão anterior da plataforma (arquivado)', apps: null, databases: null, environments: null, archived: true, tone: 'gray' },
];

export default function ProjectsPage(){
 const [projects,setProjects]=useState(initialProjects);
 const [tab,setTab]=useState<'Todos'|'Activos'|'Arquivados'>('Todos');
 const [query,setQuery]=useState('');
 const [filterOpen,setFilterOpen]=useState(false);
 const [toneFilter,setToneFilter]=useState('Todos');
 const [menuFor,setMenuFor]=useState<string|null>(null);
 const [modal,setModal]=useState(false);
 const [projectName,setProjectName]=useState('');
 const [projectDescription,setProjectDescription]=useState('');
 const [editingName,setEditingName]=useState<string|null>(null);
 const [mobileNav,setMobileNav]=useState(false);
 const counts={Todos:projects.length,Activos:projects.filter(p=>!p.archived).length,Arquivados:projects.filter(p=>p.archived).length};
 const visible=useMemo(()=>projects.filter(p=>{
  const matchesTab=tab==='Todos'||(tab==='Activos'&&!p.archived)||(tab==='Arquivados'&&p.archived);
  const searchText=`${p.name} ${p.description}`.toLocaleLowerCase();
  const matchesQuery=searchText.includes(query.toLocaleLowerCase());
  const matchesTone=toneFilter==='Todos'||p.tone===toneFilter;
  return matchesTab&&matchesQuery&&matchesTone;
 }),[projects,tab,query,toneFilter]);
 const nav=[['Dashboard',Home],['Projetos',Box],['Aplicações',Code2],['Bases de dados',Database],['Domínios',Globe2],['Armazenamento',HardDrive],['Marketplace',ShoppingBag],['Facturação',CreditCard],['Suporte',LifeBuoy]] as const;
 function toggleArchive(name:string){setProjects(items=>items.map(p=>p.name===name?{...p,archived:!p.archived}:p));setMenuFor(null)}
 function createProject(){if(!projectName.trim())return;const nextName=projectName.trim();const nextDescription=projectDescription.trim()||'Novo projecto Sirius Cloud';if(editingName){setProjects(items=>items.map(p=>p.name===editingName?{...p,name:nextName,description:nextDescription}:p));setEditingName(null)}else{setProjects(items=>[{name:nextName,description:nextDescription,apps:0,databases:null,environments:1,tone:'purple'},...items]);setTab('Todos')}setProjectName('');setProjectDescription('');setModal(false)}
 return <main className="ref-dashboard projects-shell">
  <aside className={`ref-sidebar ${mobileNav?'sidebar-open':''}`}><a href="/" className="ref-brand"><Cloud className="cloud-mark"/><b>Sirius <em>Cloud</em></b></a><button className="org-switch"><span className="org-mark">AC</span><span><b>Acme Angola</b><small>Organização</small></span><ChevronDown size={17}/></button><nav className="ref-nav">{nav.map(([title,Icon])=><a key={title} href={title==='Dashboard'?'/dashboard':title==='Projetos'?'/dashboard/projects':title==='Aplicações'?'/dashboard/apps':title==='Bases de dados'?'/dashboard/databases':title==='Domínios'?'/dashboard/domains':title==='Armazenamento'?'/dashboard/storage':title==='Marketplace'?'/dashboard/marketplace':title==='Facturação'?'/dashboard/billing':title==='Suporte'?'/dashboard/support':title==='Status'?'/dashboard/status':'/dashboard'} className={`ref-nav-link ${title==='Projetos'?'ref-active':''}`}><Icon/><span>{title}</span></a>)}<div className="ref-nav-separator"/><a className="ref-nav-link" href="/dashboard/documentation"><BookOpen/><span>Documentação</span></a><a className="ref-nav-link" href="/dashboard/status"><i className="online-dot"/><span>Status</span></a></nav><div className="upgrade-card"><Cloud className="cloud-mark"/><b>Faça upgrade do seu plano</b><p>Mais recursos, maior performance e suporte prioritário.</p><a href="/#precos" className="upgrade-button">Ver planos <ArrowRight/></a></div></aside>
  {mobileNav&&<button className="ref-overlay" onClick={()=>setMobileNav(false)} aria-label="Fechar navegação"/>}
  <section className="ref-main"><header className="ref-topbar"><button className="ref-mobile-menu" aria-label="Abrir menu" onClick={()=>setMobileNav(true)}><Menu/></button><label className="global-search"><Search/><input placeholder="Pesquisar projectos, aplicações, domínios..."/><kbd><Command/> K</kbd></label><div className="ref-top-actions"><button className="round-action notification" aria-label="Notificações"><Bell/><i/></button><button className="round-action" aria-label="Alternar tema"><Moon/></button><button className="profile-button"><span className="profile-photo">JS</span><span><b>João Silva</b><small>joao@siriuscloud.ao</small></span><ChevronDown/></button></div></header>
   <section className="ref-content projects-content"><div className="projects-page-title"><div><h1>Projetos</h1><p>Organize as suas aplicações, ambientes e recursos em projetos.</p></div><button className="project-new-button" onClick={()=>setModal(true)}><Plus/> Novo projecto</button></div>
    <div className="project-toolbar"><div className="project-tabs">{(['Todos','Activos','Arquivados'] as const).map((name,index)=><button key={name} className={tab===name?'selected-tab':''} onClick={()=>setTab(name)}>{index===0?<Layers3/>:index===1?<i className="active-tab-dot"/>:<Archive/>}<span>{name} ({counts[name]})</span></button>)}</div><div className="project-tools"><label className="project-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar projetos..."/><button onClick={()=>setQuery('')} aria-label="Limpar pesquisa" className={query?'clear-search':'hide-clear'}><X/></button></label><div className="filter-wrap"><button className={`filter-button ${filterOpen?'filter-active':''}`} onClick={()=>setFilterOpen(!filterOpen)}><Filter/> Filtrar</button>{filterOpen&&<div className="filter-popover"><b>Filtrar por cor</b>{['Todos','purple','cyan','orange','gray'].map(tone=><button key={tone} className={toneFilter===tone?'filter-choice-on':''} onClick={()=>setToneFilter(tone)}>{tone==='Todos'?'Todas as cores':<><i className={`filter-dot ${tone}`}/>{tone==='purple'?'Violeta':tone==='cyan'?'Azul':tone==='orange'?'Laranja':'Cinza'}</>}</button>)}</div>}</div></div></div>
    <div className="project-list">{visible.map(project=><article className="project-row" key={project.name} data-summary={`${project.apps===null?"–":project.apps} aplicações · ${project.databases===null?"–":project.databases} bases de dados · ${project.environments===null?"–":project.environments} ambientes`}><div className={`project-folder-icon folder-${project.tone}`}><Folder/></div><div className="project-row-name"><b>{project.name}</b><small>{project.description}</small></div><ProjectStat icon={Box} value={project.apps===null?'–':project.apps} label={project.apps===1?'Aplicação':'Aplicações'}/><ProjectStat icon={Database} value={project.databases===null?'–':project.databases} label="Base de dados"/><ProjectStat icon={Layers3} value={project.environments===null?'–':project.environments} label="Ambientes"/><span className={`project-state ${project.archived?'archived-state':''}`}><i/>{project.archived?'Arquivado':'Activo'}</span><div className="row-menu-wrap"><button className="row-menu-trigger" aria-label={`Opções de ${project.name}`} onClick={()=>setMenuFor(menuFor===project.name?null:project.name)}><MoreVertical/></button>{menuFor===project.name&&<div className="row-menu"><button onClick={()=>toggleArchive(project.name)}>{project.archived?'Restaurar projecto':'Arquivar projecto'}</button><button onClick={()=>{setEditingName(project.name);setProjectName(project.name);setProjectDescription(project.description);setMenuFor(null);setModal(true)}}>Editar detalhes</button></div>}</div></article>)}{visible.length===0&&<div className="projects-empty"><Folder/><b>Nenhum projecto encontrado</b><span>Ajuste a pesquisa ou os filtros para ver os seus projectos.</span></div>}</div>
    <footer className="ref-footer"><span>© 2026 Sirius Cloud · Angola</span><span><i className="online-dot"/>Todos os sistemas operacionais</span><a href="mailto:ola@siriuscloud.ao">Precisa de ajuda? <CircleHelp/></a></footer>
   </section>
  </section>
  {modal&&<div className="ref-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="ref-modal project-form" onSubmit={e=>{e.preventDefault();createProject()}}><button type="button" className="ref-modal-close" onClick={()=>setModal(false)} aria-label="Fechar"><X/></button><span className="modal-badge"><Folder/></span><small>{editingName?'EDITAR PROJECTO':'NOVO PROJECTO'}</small><h2>{editingName?'Actualize os detalhes':'Organize o seu trabalho'}</h2><p>{editingName?'Actualize o nome ou a descrição deste projecto.':'Crie um projecto para agrupar aplicações, bases de dados e ambientes.'}</p><label>Nome do projecto<input autoFocus required value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="Ex.: Loja online"/></label><label>Descrição<input value={projectDescription} onChange={e=>setProjectDescription(e.target.value)} placeholder="O que vai construir?"/></label><button type="submit" className="create-project modal-create"><Plus/> {editingName?'Guardar alterações':'Criar projecto'}</button><span className="modal-disclaimer">Demonstração local · Sem provisionamento de recursos</span></form></div>}
 </main>;
}
function ProjectStat({icon:Icon,value,label}:{icon:typeof Box;value:number|string;label:string}){return <div className="project-stat"><Icon/><span><b>{value}</b><small>{label}</small></span></div>}
