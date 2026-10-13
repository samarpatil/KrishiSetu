import {tr} from '../i18n'
import {useState} from 'react'
import {useParams,Link,useNavigate} from 'react-router-dom'
import {Star,Check} from 'lucide-react'
import {getProduct} from '../services'
import {useAsync} from '../hooks/useAsync'
import {Page,Badge,Skeleton,Empty,ErrorState,Button,useApp} from '../components/common/ui'
import {inr,kg} from '../utils/format'
export default function ProductDetails(){
 const {productId}=useParams(),{data:p,loading,error,reload}=useAsync(()=>getProduct(productId),[productId]),[qty,setQty]=useState(300),[busy,setBusy]=useState(false),nav=useNavigate(),{addOrder,toast}=useApp()
 if(loading)return <Page><Skeleton n={2} h="h-64"/></Page>
 if(error)return <Page><ErrorState message={error} onRetry={reload}/></Page>
 if(!p)return <Page><Empty text={tr("This product was not found.")}><Link to="/marketplace" className="btn-p">{tr("Back to marketplace")}</Link></Empty></Page>
 const ok=qty>=1&&qty<=p.qty
 const add=async()=>{if(!ok)return toast(`Enter a quantity between 1 and ${p.qty} kg.`);setBusy(true);try{const id=await addOrder({product:p.name,qty,amount:qty*p.price,seller:p.seller});toast(`Added to order #${id}.`);nav('/orders')}catch(e){toast(e.message)}setBusy(false)}
 return <Page><Link to="/marketplace" className="text-sm text-field-700">{tr("← Marketplace")}</Link><div className="mt-4 grid gap-8 lg:grid-cols-2">
  <div className="grid h-72 place-items-center rounded-3xl bg-field-100 text-8xl lg:h-96" role="img" aria-label={p.name}>{p.emoji}</div>
  <div><h1 className="font-display text-3xl">{p.name}</h1><p className="text-gray-600">{p.seller} · {p.loc}</p><p className="mt-1 flex items-center gap-1 text-sm"><Star size={14} className="fill-amber-400 text-amber-400"/>{p.rating} {tr("seller rating")}</p>
   <p className="mt-4 font-display text-4xl text-field-900">₹{p.price}<span className="text-base text-gray-500">/kg</span></p>
   <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-gray-500">{tr("Available")}</dt><dd>{kg(p.qty)}</dd></div><div><dt className="text-gray-500">{tr("Quality")}</dt><dd><Badge>{p.quality}</Badge></dd></div><div><dt className="text-gray-500">{tr("Harvest date")}</dt><dd>{p.harvest}</dd></div><div><dt className="text-gray-500">{tr("Delivery")}</dt><dd>{p.delivery}</dd></div></dl>
   <div className="mt-5 flex items-end gap-3"><label className="text-sm">{tr("Quantity (kg)")}<input type="number" min="1" max={p.qty} className="inp mt-1 w-32" value={qty} onChange={e=>setQty(+e.target.value)}/></label><Button loading={busy} onClick={add}>{tr("Add to Order")}</Button></div>
   {!ok?<p className="mt-2 text-sm text-red-600">Quantity must be between 1 and {p.qty} kg.</p>:<p className="mt-2 text-sm text-gray-600">{tr("Total")}: {inr(qty*p.price)}</p>}
   <div className="card mt-6"><h2 className="font-medium">{tr("Why KrishiSetu recommends this supplier")}</h2><ul className="mt-2 space-y-1 text-sm">{['96% requirement match',`${p.km} km away`,'Required quantity available',p.quality,`Delivery: ${p.delivery}`].map(x=><li key={x} className="flex gap-2"><Check size={16} className="text-field-600"/>{tr(x)}</li>)}</ul><p className="mt-2 text-xs text-gray-500">{tr("Demo Data")}</p></div></div></div></Page>}
