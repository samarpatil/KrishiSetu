import {tr} from '../../i18n'
import {useState,useEffect} from 'react'
import {Link,NavLink,useLocation} from 'react-router-dom'
import {Menu,X} from 'lucide-react'
import logo from '../../assets/logo.svg'
import NotificationPanel from './NotificationPanel'
import LanguageSwitcher from './LanguageSwitcher'
import {useAuth} from '../../context/AuthContext'
export const links=[['/','Home'],['/problem','Problem'],['/solution','Solution'],['/how-it-works','How It Works'],['/marketplace','Marketplace'],['/ai-insights','AI Insights'],['/logistics','Logistics'],['/impact','Impact']]
export default function Navbar(){
 const [open,setOpen]=useState(false),[sc,setSc]=useState(false),{pathname}=useLocation(),{user,logout}=useAuth()
 useEffect(()=>{setOpen(false);scrollTo(0,0)},[pathname])
 useEffect(()=>{const f=()=>setSc(scrollY>10);addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[])
 const cls=({isActive})=>`rounded-md px-2.5 py-1.5 text-sm ${isActive?'bg-field-100 font-medium text-field-900':'text-gray-600 hover:text-field-900'}`
 const auth=user?<><Link to={`/dashboard/${user.role}`} className="btn-o hidden sm:inline-flex">{user.name.split(' ')[0]}</Link><button className="btn-p hidden sm:inline-flex" onClick={logout}>{tr("Log out")}</button></>:<><Link to="/login" className="btn-o hidden sm:inline-flex">{tr("Login")}</Link><Link to="/marketplace" className="btn-p hidden sm:inline-flex">{tr("Explore Platform")}</Link></>
 return <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur ${sc?'shadow-md':'border-b border-field-200/70'}`}>
  <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3" aria-label="Main">
   <Link to="/" className="flex items-center gap-2 font-display text-xl text-field-900"><img src={logo} alt="" className="h-7 w-7"/>KrishiSetu</Link>
   <div className="hidden items-center gap-0.5 lg:flex">{links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={cls}>{tr(l)}</NavLink>)}</div>
   <div className="flex items-center gap-2"><LanguageSwitcher/><NotificationPanel/>{auth}<button className="btn-o !p-2 lg:hidden" aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={18}/>:<Menu size={18}/>}</button></div></nav>
  {open&&<div className="grid gap-1 border-t border-field-200 bg-white px-4 py-3 lg:hidden">{links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={cls}>{tr(l)}</NavLink>)}{user?<><Link to={`/dashboard/${user.role}`} className="btn-o mt-2">{tr("My dashboard")}</Link><button className="btn-p" onClick={logout}>{tr("Log out")}</button></>:<><Link to="/login" className="btn-o mt-2">{tr("Login")}</Link><Link to="/marketplace" className="btn-p">{tr("Explore Platform")}</Link></>}</div>}</header>}
