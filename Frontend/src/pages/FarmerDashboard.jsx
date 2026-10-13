import {tr} from '../i18n'
import {useState} from 'react'
import {Sprout,ClipboardList,TrendingUp,IndianRupee,Sparkles,Trash2} from 'lucide-react'
import {getFarmerDashboard} from '../services'
import {useAsync} from '../hooks/useAsync'
import {StatCard,Skeleton,ErrorState,Empty,Badge,Button,ConfirmDialog,useApp} from '../components/common/ui'
import Sidebar from '../components/dashboard/Sidebar'
import AddProduceModal from '../components/dashboard/AddProduceModal'
import DataTable from '../components/analytics/DataTable'
import {AreaCard} from '../components/analytics/ChartCard'
import {inr,kg} from '../utils/format'
const nav=[['dash','Dashboard'],['produce','My Produce'],['inv','Inventory'],['fc','Demand Forecast','/ai-insights'],['sm','Smart Match','/smart-match'],['ord','Orders','/orders'],['del','Deliveries','/logistics'],['earn','Earnings'],['prof','Profile']]
export default function FarmerDashboard(){
 const {data:d,loading,error,reload}=useAsync(getFarmerDashboard),{produce,addProduce,removeProduce,toast,orders}=useApp(),[tab,setTab]=useState('dash'),[open,setOpen]=useState(false),[del,setDel]=useState(null)
 const total=produce.reduce((s,p)=>s+p.qty,0)
 const save=async p=>{await addProduce(p);toast(`${p.name} added to your produce.`)}
 const confirmDel=async()=>{try{await removeProduce(del.id);toast(`${del.name} removed.`)}catch(e){toast(e.message)}setDel(null)}
 const table=<DataTable cols={['Product','Quantity','Price','Quality','Location','Status','']} rows={produce.map(p=>[p.name,kg(p.qty),`₹${p.price}/kg`,p.quality,p.loc,<Badge tone={p.status==='Active'?'green':'amber'}>{p.status}</Badge>,<button aria-label={`Remove ${p.name}`} className="text-gray-400 hover:text-red-600" onClick={()=>setDel(p)}><Trash2 size={16}/></button>])}/>
 return <Sidebar title="Farmer / FPO" nav={nav} tab={tab} setTab={setTab}>
  {loading?<Skeleton n={4}/>:error?<ErrorState message={error} onRetry={reload}/>:<>
  {tab==='dash'&&<><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Sprout} label={tr("Produce Listed")} value={kg(total)}/><StatCard icon={ClipboardList} label={tr("Active Orders")} value={d.stats.activeOrders+orders.filter(o=>o.status===0).length}/><StatCard icon={TrendingUp} label={tr("Expected Demand")} value={kg(d.stats.expectedDemand)}/><StatCard icon={IndianRupee} label={tr("Estimated Revenue")} value={inr(d.stats.estimatedRevenue)}/></div>
   <AreaCard title={tr("Expected weekly demand, tomatoes (kg)")} data={d.weeklyDemand}/><div className="card"><div className="flex items-center gap-2 font-medium"><Sparkles size={18} className="text-field-600"/>{tr("AI Recommendations")} <Badge tone="amber">{tr("Prototype AI Insight")}</Badge></div>{d.recommendations.map(r=><p key={r} className="mt-2 text-sm">{tr(r)}</p>)}</div></>}
  {(tab==='produce'||tab==='inv')&&<><div className="flex items-center justify-between"><h2 className="font-display text-2xl">{tr(tab==='produce'?'My Produce':'Inventory')}</h2><Button onClick={()=>setOpen(true)}>{tr("Add Produce")}</Button></div>{produce.length?table:<Empty text={tr("No produce listed yet.")}/>}</>}
  {tab==='earn'&&<><h2 className="font-display text-2xl">{tr("Earnings")}</h2><div className="grid gap-4 sm:grid-cols-2"><StatCard icon={IndianRupee} label={tr("Estimated revenue")} value={inr(d.earnings.estimated)} hint={tr("Demo Data")}/><StatCard icon={IndianRupee} label={tr("Paid out this month")} value={inr(d.earnings.paidOut)} hint={tr("Demo Data")}/></div></>}
  {tab==='prof'&&<div className="card"><h2 className="font-display text-2xl">{d.profile.name}</h2><p className="text-sm text-gray-600">{d.profile.loc} · {d.profile.type} · Demo Data</p></div>}</>}
  <AddProduceModal open={open} onClose={()=>setOpen(false)} onSave={save}/>
  <ConfirmDialog open={!!del} title={tr("Remove produce?")} message={`Remove ${del?.name} from your listings?`} confirmLabel={tr("Remove")} onConfirm={confirmDel} onCancel={()=>setDel(null)}/></Sidebar>}
