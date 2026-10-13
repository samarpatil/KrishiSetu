import {tr} from '../../i18n'
import StatusBadge from '../common/StatusBadge';import {inr} from '../../utils/format'
export default function OrderCard({o,active,onSelect}){return <button onClick={()=>onSelect(o.id)} className={`card w-full text-left transition hover:shadow-md ${active?'ring-2 ring-field-500':''}`}><div className="flex justify-between"><b>{tr("Order")} #{o.id}</b><StatusBadge status={o.status}/></div><p className="text-sm text-gray-600">{o.product} · {o.qty} kg · {inr(o.amount)}</p></button>}
