import {useCountUp} from '../../hooks/useCountUp'
// value: number|string. Numbers inside strings (e.g. "₹74,500", "1,850 kg") count up.
function Num({value}){
 const m=typeof value==='string'&&value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/),n=m?parseFloat(m[2].replace(/,/g,'')):typeof value==='number'?value:null,dec=m&&m[2].includes('.')?m[2].split('.')[1].length:0
 const v=useCountUp(n??0)
 if(n===null)return value
 return <>{m?m[1]:''}{(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-IN'))}{m?m[3]:''}</>}
export default function StatCard({icon:I,label,value,hint}){return <div className="card pop"><div className="flex items-center gap-3 text-sm text-gray-600"><span className="grid h-9 w-9 place-items-center rounded-lg bg-field-100 text-field-700"><I size={18}/></span>{label}</div><div className="mt-3 font-display text-3xl text-field-900"><Num value={value}/></div>{hint&&<div className="mt-1 text-xs text-gray-500">{hint}</div>}</div>}
