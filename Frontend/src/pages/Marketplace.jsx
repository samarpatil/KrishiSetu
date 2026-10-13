import {tr} from '../i18n'
import {useState,useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {getProducts} from '../services'
import {useAsync} from '../hooks/useAsync'
import {PageHeader,Page,Skeleton,Empty,ErrorState,SearchBar,Button,useApp} from '../components/common/ui'
import ProductCard from '../components/marketplace/ProductCard'
import FilterPanel,{defaultFilters,applyFilters} from '../components/marketplace/FilterPanel'
export default function Marketplace(){
 const {data,loading,error,reload}=useAsync(getProducts),[q,setQ]=useState(''),[f,setF]=useState(defaultFilters),[busy,setBusy]=useState(false),nav=useNavigate(),{addOrder,toast}=useApp()
 const list=useMemo(()=>applyFilters(data||[],q,f),[data,q,f])
 const buy=async p=>{setBusy(true);try{const id=await addOrder({product:p.name,qty:100,amount:100*p.price,seller:p.seller});toast(tr('Order #{id} placed for 100 kg {name}.',{id,name:tr(p.name)}));nav('/orders')}catch(e){toast(e.message)}setBusy(false)}
 return <><PageHeader title={tr("Marketplace")} sub={tr("Browse produce from farmers and FPOs. Demo Data.")}/><Page><SearchBar value={q} onChange={setQ} placeholder={tr("Search tomatoes, onions, wheat...")}/><div className="mt-3"><FilterPanel filters={f} onChange={setF}/></div>
 <div className="mt-6">{loading?<Skeleton n={6} h="h-72"/>:error?<ErrorState message={error} onRetry={reload}/>:list.length===0?<Empty text={tr("No produce matches these filters.")}><Button variant="outline" onClick={()=>{setQ('');setF(defaultFilters)}}>{tr("Clear filters")}</Button></Empty>:<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(p=><ProductCard key={p.id} p={p} onBuy={buy} busy={busy}/>)}</div>}</div></Page></>}
