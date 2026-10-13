import {tr} from '../i18n'
import {useState} from 'react'
import {Sparkles,TrendingUp,Gauge,Package} from 'lucide-react'
import {getForecast} from '../services'
import {useAsync} from '../hooks/useAsync'
import {products,locations,periods} from '../data/forecasts'
import {PageHeader,Page,Select,Field,Badge,Skeleton,ErrorState,StatCard} from '../components/common/ui'
import ForecastChart from '../components/analytics/ForecastChart'
import {kg} from '../utils/format'
export default function AIInsights(){
 const [pr,setPr]=useState('Tomato'),[lo,setLo]=useState('Bhopal'),[d,setD]=useState('7 Days'),{data:f,loading,error,reload}=useAsync(()=>getForecast(pr,lo,parseInt(d)),[pr,lo,d])
 return <><PageHeader title={tr("AI Demand Intelligence")} sub={tr("Understand what the market may need next.")}/><Page>
  <div className="grid gap-3 sm:grid-cols-3"><Field label={tr("Product")}><Select value={pr} onChange={setPr} options={products}/></Field><Field label={tr("Location")}><Select value={lo} onChange={setLo} options={locations}/></Field><Field label={tr("Time period")}><Select value={d} onChange={setD} options={periods}/></Field></div>
  {loading?<div className="mt-6"><Skeleton n={3}/></div>:error?<div className="mt-6"><ErrorState message={error} onRetry={reload}/></div>:<>
  <div className="mt-6 grid gap-4 sm:grid-cols-3"><StatCard icon={Package} label={tr("Current weekly demand")} value={kg(f.cur)}/><StatCard icon={TrendingUp} label={tr("Predicted demand")} value={kg(f.pred)} hint={`${f.growth>0?'+':''}${f.growth}% vs current`}/><StatCard icon={Gauge} label={tr("Forecast confidence")} value={`${f.conf}%`}/></div>
  <div className="mt-6 grid gap-4 lg:grid-cols-3"><ForecastChart data={f.data}/>
  <div className="card bg-field-50"><div className="flex items-center gap-2 font-medium"><Sparkles size={18} className="text-field-600"/>{tr("AI Supply Insight")}</div><Badge tone="amber">{tr("Prototype AI Insight")}</Badge>
   <p className="mt-3 text-sm">{tr(f.growth>=0?'Demand for {p} in {l} is expected to increase over the coming {d}.':'Demand for {p} in {l} is expected to soften over the coming {d}.',{p:tr(pr),l:tr(lo),d:d==='7 Days'?tr('week'):tr(d)})}</p><p className="mt-2 text-sm">{tr("Suggested supply range")}: {f.low.toLocaleString('en-IN')}–{f.high.toLocaleString('en-IN')} kg.</p><p className="mt-3 text-xs text-gray-500">{tr("AI-generated demand forecast. Demo Data.")}</p></div></div></>}</Page></>}
