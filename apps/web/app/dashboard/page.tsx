'use client';

import { useMemo, useState } from 'react';
import { Activity, Archive, ArrowRight, ArrowUpRight, Bell, BookOpen, Box, CalendarDays, Check, ChevronDown, CircleHelp, Code2, Command, CreditCard, Cloud, Database, Folder, Globe2, HardDrive, Home, Layers3, LifeBuoy, Menu, Moon, Plus, Search, Server, Settings2, ShieldCheck, ShoppingBag, Sparkles, X, Zap } from 'lucide-react';
import './dashboard.css';

const projects = [
 { name: 'Sistema Interno', detail: '3 aplicações · 1 base de dados', apps: 3, icon: 'folder' },
 { name: 'Site Institucional', detail: '1 aplicação · 1 base de dados', apps: 1, icon: 'folder' },
 { name: 'App Agenda', detail: '1 aplicação', apps: 1, icon: 'folder' },
];
const deployments = [
 { name: 'minha-api', context: 'Produção · há 12 min' },
 { name: 'site-institucional', context: 'Staging · há 27 min' },
 { name: 'agenda-emo', context: 'Produção · há 1 h' },
];
const points = [34, 42, 50, 48, 43, 46, 55, 58, 50, 44, 47, 54, 62, 69];

export default function Dashboard() {
 const [period, setPeriod] = useState('Últimos 7 dias');
 const [search, setSearch] = useState('');
 const [modal, setModal] = useState(false);
 const [created, setCreated] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const [activeNav] = useState('Dashboard');
 const filteredProjects = useMemo(() => projects.filter(project => project.name.toLowerCase().includes(search.toLowerCase())), [search]);
 const links = [
  { title: 'Dashboard', icon: Home }, { title: 'Projetos', icon: Box }, { title: 'Aplicações', icon: Code2 },
  { title: 'Bases de dados', icon: Database }, { title: 'Domínios', icon: Globe2 }, { title: 'Armazenamento', icon: Archive },
  { title: 'Marketplace', icon: ShoppingBag }, { title: 'Facturação', icon: CreditCard }, { title: 'Suporte', icon: LifeBuoy },
 ];
 return <main className="ref-dashboard">
  <aside className={`ref-sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
   <a href="/" className="ref-brand"><CloudMark/><b>Sirius <em>Cloud</em></b></a>
   <button className="org-switch"><span className="org-mark">AC</span><span><b>Acme Angola</b><small>Organização</small></span><ChevronDown size={17}/></button>
   <nav className="ref-nav">{links.map(({title,icon:Icon})=>{const href=title==='Dashboard'?'/dashboard':title==='Projetos'?'/dashboard/projects':title==='Aplicações'?'/dashboard/apps':title==='Bases de dados'?'/dashboard/databases':title==='Domínios'?'/dashboard/domains':title==='Armazenamento'?'/dashboard/storage':title==='Marketplace'?'/dashboard/marketplace':title==='Facturação'?'/dashboard/billing':title==='Suporte'?'/dashboard/support':title==='Status'?'/dashboard/status':'/dashboard';return <a className={`ref-nav-link ${activeNav===title?'ref-active':''}`} href={href} onClick={()=>setMenuOpen(false)} key={title}><Icon/><span>{title}</span></a>})}<div className="ref-nav-separator"/><a className="ref-nav-link" href="/dashboard/documentation"><BookOpen/><span>Documentação</span></a><a className="ref-nav-link" href="/dashboard/status"><i className="online-dot"/><span>Status</span></a></nav>
   <div className="upgrade-card"><CloudMark/><b>Faça upgrade do seu plano</b><p>Mais recursos, maior performance e suporte prioritário.</p><a href="/" className="upgrade-button">Ver planos <ArrowRight/></a></div>
  </aside>
  {menuOpen&&<button aria-label="Fechar navegação" className="ref-overlay" onClick={()=>setMenuOpen(false)}/>}
  <div className="ref-main">
   <header className="ref-topbar"><button className="ref-mobile-menu" aria-label="Abrir menu" onClick={()=>setMenuOpen(true)}><Menu/></button><label className="global-search"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar projectos..."/><kbd><Command/> K</kbd></label><div className="ref-top-actions"><button className="round-action notification" aria-label="Notificações"><Bell/><i/></button><button className="round-action" aria-label="Alternar tema"><Moon/></button><button className="profile-button"><span className="profile-photo">JS</span><span><b>João Silva</b><small>joao@siriuscloud.ao</small></span><ChevronDown/></button></div></header>
   <section className="ref-content">
    <div className="ref-page-title"><div><h1>Bom dia, João Silva <span>👋</span></h1><p>Aqui está o resumo da sua infraestrutura na Sirius Cloud.</p></div><label className="period-select"><CalendarDays/><select value={period} onChange={e=>setPeriod(e.target.value)}><option>Últimas 24 horas</option><option>Últimos 7 dias</option><option>Últimos 30 dias</option></select><ChevronDown/></label></div>
    <div className="ref-metrics"><Metric icon={Layers3} label="Aplicações" value="3" trend="↑ +1" tone="pink"/><Metric icon={Database} label="Bases de dados" value="2" tone="cyan"/><Metric icon={Activity} label="CPU (média)" value="32%" progress={32} tone="blue"/><Metric icon={Server} label="Memória (média)" value="1,6 GB" suffix="/ 4 GB" progress={48} tone="pink"/></div>
    <div className="ref-main-grid"><section className="ref-panel usage-ref"><div className="ref-panel-heading"><h2>Utilização de Recursos</h2><div className="chart-key"><span><i className="cpu-key"/>CPU</span><span><i className="memory-key"/>Memória</span><span><i className="storage-key"/>Armazenamento</span></div></div><div className="resource-chart"><div className="chart-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart-canvas"><div className="chart-guides"><i/><i/><i/><i/><i/></div><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label={`Utilização de recursos nos ${period.toLowerCase()}`}><defs><linearGradient id="cpuFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b951ff" stopOpacity=".55"/><stop offset="1" stopColor="#b951ff" stopOpacity=".08"/></linearGradient><linearGradient id="memFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#10aaff" stopOpacity=".45"/><stop offset="1" stopColor="#10aaff" stopOpacity=".08"/></linearGradient><linearGradient id="storageFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0bcb82" stopOpacity=".38"/><stop offset="1" stopColor="#0bcb82" stopOpacity=".07"/></linearGradient></defs><path d={areaPath(points, 180)} fill="url(#cpuFill)"/><path d={linePath(points,180)} fill="none" stroke="#bd62ff" strokeWidth="3"/><path d={areaPath(points.map((point,i)=>Math.max(8,point*.61+(i%3)*4)),180)} fill="url(#memFill)"/><path d={linePath(points.map((point,i)=>Math.max(8,point*.61+(i%3)*4)),180)} fill="none" stroke="#11aaff" strokeWidth="3"/><path d={areaPath(points.map((point,i)=>Math.max(5,point*.33+(i%4)*3)),180)} fill="url(#storageFill)"/><path d={linePath(points.map((point,i)=>Math.max(5,point*.33+(i%4)*3)),180)} fill="none" stroke="#0ecb84" strokeWidth="3"/></svg><div className="chart-x-labels"><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span></div></div></div></section>
     <section className="ref-panel deployments-ref"><div className="ref-panel-heading"><h2>Deployments recentes</h2><a className="view-link" href="/dashboard/apps">Ver todos <ArrowRight/></a></div><div className="deployment-list">{deployments.map(item=><div className="deployment-item" key={item.name}><span className="git-badge"><GitHubMark/></span><span className="deployment-name"><b>{item.name}</b><small>{item.context}</small></span><span className="deployed-status">Concluído</span></div>)}</div></section>
     <section className="ref-panel platform-ref"><h2>Estado da plataforma</h2><div className="platform-list"><PlatformStatus name="Aplicações"/><PlatformStatus name="Bases de dados"/><PlatformStatus name="Rede e DNS"/><PlatformStatus name="Backups"/></div></section>
    </div>
    <div className="ref-lower-grid"><section className="projects-ref"><div className="projects-head"><h2>Os seus projectos</h2><button className="create-project" onClick={()=>setModal(true)}><Plus/> Novo projecto</button></div><div className="project-cards">{filteredProjects.map(project=><article className="project-card" key={project.name}><div className="project-card-top"><span className="project-icon"><Folder/></span><button className="project-more" aria-label={`Opções de ${project.name}`}><MoreDots/></button></div><h3>{project.name}</h3><p>{project.detail}</p><span className="project-status"><i/> Activo</span></article>)}{created&&<article className="project-card"><div className="project-card-top"><span className="project-icon"><Folder/></span><button className="project-more" aria-label="Opções"><MoreDots/></button></div><h3>Novo projecto</h3><p>1 aplicação · configuração pendente</p><span className="project-status"><i/> Activo</span></article>}{filteredProjects.length===0&&!created&&<p className="no-projects">Não encontrámos projectos com “{search}”.</p>}</div></section>
     <section className="ref-panel plan-usage"><div className="plan-heading"><h2>Consumo do plano</h2><span>Plano Developer</span></div><UsageRow icon={Activity} label="CPU" value="32% de 2 vCPU" percent={32} tone="green"/><UsageRow icon={Server} label="Memória" value="1,6 GB de 4 GB" percent={48} tone="pink"/><UsageRow icon={HardDrive} label="Armazenamento" value="24 GB de 100 GB" percent={24} tone="blue"/></section></div>
    <footer className="ref-footer"><span>© 2026 Sirius Cloud · Angola</span><span><i className="online-dot"/>Todos os sistemas operacionais</span><a href="mailto:ola@siriuscloud.ao">Precisa de ajuda? <CircleHelp/></a></footer>
   </section>
  </div>
  {modal&&<div className="ref-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><section className="ref-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><button className="ref-modal-close" onClick={()=>setModal(false)} aria-label="Fechar"><X/></button><span className="modal-badge"><Sparkles/></span><small>NOVO PROJECTO</small><h2 id="project-modal-title">Comece algo novo</h2><p>Crie um projecto para organizar as suas aplicações e bases de dados.</p><label>Nome do projecto<input autoFocus placeholder="Ex.: Loja online"/></label><button className="create-project modal-create" onClick={()=>{setCreated(true);setModal(false)}}><Plus/> Criar projecto de demonstração</button><span className="modal-disclaimer">Demonstração local · Não cria recursos cloud reais</span></section></div>}
 </main>;
}
function areaPath(values:number[],height:number){return `${linePath(values,height)} L 600 ${height} L 0 ${height} Z`}
function linePath(values:number[],height:number){return values.map((value,index)=>`${index===0?'M':'L'} ${(index/(values.length-1))*600} ${height-(value/100)*(height-4)}`).join(' ')}
function Metric({icon:Icon,label,value,suffix,trend,progress,tone}:{icon:typeof Layers3;label:string;value:string;suffix?:string;trend?:string;progress?:number;tone:string}){return <article className={`ref-metric metric-${tone}`}><span className="metric-icon"><Icon/></span><div className="metric-label"><b>{label}</b>{trend&&<small>—</small>}</div><strong>{value}<small>{suffix}</small></strong>{trend&&<span className="metric-trend">{trend}</span>}{progress!==undefined&&<div className="metric-progress"><i style={{width:`${progress}%`}}/></div>}{!progress&&<MiniSpark tone={tone}/>}</article>}
function MiniSpark({tone}:{tone:string}){return <svg className={`metric-sparkline spark-${tone}`} viewBox="0 0 140 40" preserveAspectRatio="none"><path d="M0 32 C20 29 21 17 40 22 S65 6 82 14 S105 23 120 11 S132 5 140 3" fill="none" stroke="currentColor" strokeWidth="3"/></svg>}
function PlatformStatus({name}:{name:string}){return <div className="platform-status"><span><Check/>{name}</span><b>Operacional</b></div>}
function UsageRow({icon:Icon,label,value,percent,tone}:{icon:typeof Activity;label:string;value:string;percent:number;tone:string}){return <div className="plan-usage-row"><span className={`usage-icon usage-${tone}`}><Icon/></span><span className="usage-name"><b>{label}</b><small>{value}</small></span><span className="usage-track"><i className={`usage-fill fill-${tone}`} style={{width:`${percent}%`}}/></span></div>}
function CloudMark(){return <Cloud className="cloud-mark"/>}
function GitHubMark(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .8A11.2 11.2 0 0 0 8.46 22.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.07-1.15 3.07-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.3-2.62 5.24-5.12 5.52.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>}
function MoreDots(){return <svg viewBox="0 0 4 20" aria-hidden="true"><circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="10" r="1.5"/><circle cx="2" cy="18" r="1.5"/></svg>}
