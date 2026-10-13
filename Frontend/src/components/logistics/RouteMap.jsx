// Simulated map. Swap for Leaflet/Google Maps later with the same props.
export default function RouteMap({stops,before,after,optimized,compact}){return <svg viewBox="0 0 560 360" className="w-full rounded-xl bg-field-50" role="img" aria-label="Simulated delivery route map">
 <g stroke="#d9e4d0" strokeWidth="10" fill="none" strokeLinecap="round"><path d="M0 200H560M0 90H560M120 0V360M300 0V360M470 0V360"/></g><g stroke="#c5ddb6" strokeWidth="2" fill="none"><path d="M0 330C140 250 260 330 560 250M0 20C200 60 380 0 560 40"/></g>
 {!optimized&&before&&<polyline points={before.path} fill="none" stroke="#c28a1e" strokeWidth="4" strokeDasharray="8 6" strokeLinejoin="round"/>}
 {optimized&&after&&<>{before&&<polyline points={before.path} fill="none" stroke="#bbb" strokeWidth="2" strokeDasharray="4 4"/>}<polyline points={after.path} fill="none" stroke="#1f6035" strokeWidth="5" strokeLinejoin="round"/></>}
 {stops.map(s=><g key={s.n}><circle cx={s.x} cy={s.y} r="10" fill={s.t==='farm'?'#1f6035':'#c28a1e'} stroke="#fff" strokeWidth="3"/>{!compact&&<text x={s.x} y={s.y-16} textAnchor="middle" fontSize="12" fill="#1d2420">{s.n}</text>}</g>)}</svg>}
