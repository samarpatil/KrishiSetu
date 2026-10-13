import {tr} from '../../i18n'
import {useState} from 'react';import {Bell} from 'lucide-react';import {getNotifications} from '../../services';import {useAsync} from '../../hooks/useAsync'
export default function NotificationPanel(){
 const [open,setOpen]=useState(false),{data}=useAsync(getNotifications)
 return <div className="relative"><button aria-label="Notifications" aria-expanded={open} className="btn-o !p-2" onClick={()=>setOpen(!open)}><Bell size={18}/><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500"/></button>
 {open&&<div className="pop absolute right-0 mt-2 w-72 rounded-xl border border-field-200 bg-white p-2 shadow-xl"><p className="px-2 py-1 text-xs text-gray-500">{tr("Notifications · Demo Data")}</p>{(data||[]).map(n=><p key={n.id} className="rounded-lg px-2 py-2 text-sm hover:bg-field-50">{tr(n.text)}</p>)}</div>}</div>}
