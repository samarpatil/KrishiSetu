import {tr} from '../../i18n'
import {Link} from 'react-router-dom';import {MapPin,Truck} from 'lucide-react';import Badge from '../common/Badge';import {kg} from '../../utils/format'
export default function ProductCard({p,onBuy,busy}){return <div className="card pop flex flex-col transition hover:-translate-y-1 hover:shadow-md">
 <div className="grid h-28 place-items-center rounded-xl bg-field-100 text-5xl" role="img" aria-label={p.name}>{p.emoji}</div>
 <div className="mt-3 flex items-start justify-between gap-2"><h3 className="font-medium">{tr(p.name)}</h3><Badge>{tr(p.quality)}</Badge></div>
 <p className="text-sm text-gray-600">{p.seller}</p><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin size={12}/>{p.loc} · {kg(p.qty)} {tr("available")}</p><p className="flex items-center gap-1 text-xs text-gray-500"><Truck size={12}/>{tr("Delivery")}: {tr(p.delivery)}</p>
 <p className="mt-2 font-display text-2xl text-field-900">₹{p.price}<span className="text-sm text-gray-500">/kg</span></p>
 <div className="mt-3 flex gap-2"><Link to={`/marketplace/${p.id}`} className="btn-o flex-1">{tr("View Details")}</Link><button className="btn-p flex-1" disabled={busy} onClick={()=>onBuy(p)}>{tr("Buy Now")}</button></div></div>}
