import {tr} from '../../i18n'
import Badge from './Badge';import {steps} from '../../data/orders'
export default function StatusBadge({status}){return <Badge tone={status===5?'gray':status>=3?'green':'amber'}>{tr(steps[status])}</Badge>}
