import {tr} from '../../i18n'
export const Field=({label,children})=><label className="block text-sm"><span className="mb-1 block text-gray-600">{label}</span>{children}</label>
export const Select=({value,onChange,options,...p})=><select className="inp" value={value} onChange={e=>onChange(e.target.value)} {...p}>{options.map(o=><option key={o} value={o}>{tr(o)}</option>)}</select>
