import {tr} from '../i18n'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import {ShoppingCart,IndianRupee,Truck,Heart} from 'lucide-react'
import {getBuyerDashboard,getSuppliers} from '../services'
import {useAsync} from '../hooks/useAsync'
import {StatCard,StatusBadge,Skeleton,ErrorState,Badge,useApp} from '../components/common/ui'
import Sidebar from '../components/dashboard/Sidebar'
import DataTable from '../components/analytics/DataTable'
import {BarCard,AreaCard} from '../components/analytics/ChartCard'
import {inr} from '../utils/format'
export default function BuyerDashboard(){
 const {data:d,loading,error,reload}=useAsync(getBuyerDashboard),{data:sup}=useAsync(getSuppliers),{orders}=useApp(),[tab,setTab]=useState('dash'),pending=orders.filter(o=>o.status<5).length
 return <Sidebar title="Buyer" nav={[['dash','Dashboard'],['mk','Marketplace','/marketplace'],['sm','Smart Match','/smart-match'],['ord','Orders','/orders']]} tab={tab} setTab={setTab}>
 {loading?<Skeleton n={4}/>:error?<ErrorState message={error} onRetry={reload}/>:<>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={ShoppingCart} label={tr("Active Orders")} value={pending}/><StatCard icon={IndianRupee} label={tr("Total Purchases")} value={inr(d.stats.totalPurchases)}/><StatCard icon={Truck} label={tr("Pending Deliveries")} value={pending}/><StatCard icon={Heart} label={tr("Saved Suppliers")} value={d.stats.savedSuppliers}/></div>
  <div className="grid gap-4 lg:grid-cols-2"><BarCard title={tr("Monthly purchases (₹)")} data={d.monthly}/><AreaCard title={tr("Order volume")} data={d.monthly} y="o"/></div>
  <h2 className="font-display text-xl">{tr("Recommended Suppliers")}</h2><div className="grid gap-4 sm:grid-cols-3">{(sup||[]).slice(0,3).map(s=><div key={s.id} className="card"><b>{s.name}</b><p className="text-sm text-gray-600">{s.loc} · {s.km} km</p><Badge>{s.base}% {tr("match")}</Badge></div>)}</div>
  <h2 className="font-display text-xl">{tr("Current Orders & Upcoming Deliveries")}</h2><DataTable cols={['Order','Product','Qty','Status','ETA']} rows={orders.map(o=>[`#${o.id}`,o.product,`${o.qty} kg`,<StatusBadge status={o.status}/>,o.eta])}/>
  <div className="card"><h3 className="font-medium">{tr("Market Insights")} <Badge tone="amber">{tr("Prototype AI Insight")}</Badge></h3><p className="mt-1 text-sm">{tr(d.insight)} <Link to="/ai-insights" className="text-field-700 underline">{tr("See forecast")}</Link></p></div></>}</Sidebar>}
