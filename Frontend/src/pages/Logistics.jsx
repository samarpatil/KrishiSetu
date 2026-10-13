import {tr} from '../i18n'
import {useState} from 'react'
import {Route,Gauge,Clock,Truck,PackageCheck} from 'lucide-react'
import {getRoutePlan,optimizeRoute} from '../services'
import {useAsync} from '../hooks/useAsync'
import {PageHeader,Page,StatCard,Badge,Skeleton,ErrorState,Button,useApp} from '../components/common/ui'
import RouteMap from '../components/logistics/RouteMap'
export default function Logistics(){
 const {data:plan,loading,error,reload}=useAsync(getRoutePlan),[opt,setOpt]=useState(null),[busy,setBusy]=useState(false),{toast}=useApp()
 const run=async()=>{setBusy(true);try{setOpt((await optimizeRoute()).route);toast(tr('Route optimized successfully.'))}catch(e){toast(e.message)}setBusy(false)}
 if(loading)return <Page><Skeleton n={5}/></Page>
 if(error)return <Page><ErrorState message={error} onRetry={reload}/></Page>
 const r=opt||plan.route,v=plan.vehicle
 return <><PageHeader title={tr("Smart Logistics")} sub={tr("Plan pickups and deliveries on shorter routes.")}><Button variant="outline" className="!bg-white" loading={busy} disabled={!!opt} onClick={run}>{tr(opt?'Route optimized':'Optimize Route')}</Button></PageHeader><Page>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><StatCard icon={Route} label={tr(opt?'Optimized route':'Before optimization')} value={`${r.km} km`}/><StatCard icon={Gauge} label={tr("Distance saved")} value={`${r.saved}%`}/><StatCard icon={PackageCheck} label={tr("Deliveries")} value={plan.deliveries.length}/><StatCard icon={Clock} label={tr("Estimated time")} value={r.time}/><StatCard icon={Truck} label={tr("Vehicle load")} value={`${v.load} / ${v.capacity} kg`}/></div>
  <div className="card mt-6"><div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="font-medium">{tr("Route map")}</h2><Badge tone="amber">{tr("Simulated map · Demo Data")}</Badge></div><RouteMap stops={plan.stops} before={plan.route} after={opt} optimized={!!opt}/>
  <p className="mt-2 text-xs text-gray-500"><span className="text-field-700">●</span> Farmer/FPO &nbsp;<span className="text-amber-600">●</span> Buyer delivery point. This is route optimization, not machine learning; a later backend can use OR-Tools with a Maps/Routing API.</p></div></Page></>}
