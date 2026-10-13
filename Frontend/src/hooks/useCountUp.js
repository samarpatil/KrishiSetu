import {useEffect,useState} from 'react'
export function useCountUp(target,ms=900){
 const [v,setV]=useState(0)
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches){setV(target);return}let raf,t0;const f=t=>{t0??=t;const p=Math.min((t-t0)/ms,1);setV(target*(1-Math.pow(1-p,3)));if(p<1)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f);return()=>cancelAnimationFrame(raf)},[target,ms])
 return v}
