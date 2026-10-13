// Single switch between mock data and the real REST API.
// Set VITE_USE_MOCK=false and VITE_API_URL in .env to talk to the Express backend.
export const USE_MOCK=import.meta.env.VITE_USE_MOCK!=='false'
export const BASE_URL=import.meta.env.VITE_API_URL||'http://localhost:5000/api'
export const delay=(v,ms=450)=>new Promise(r=>setTimeout(()=>r(typeof v==='function'?v():v),ms))
export async function request(path,{method='GET',body}={}){
 const token=localStorage.getItem('ks_token')
 const res=await fetch(BASE_URL+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined})
 if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.message||`Request failed (${res.status})`)}
 return res.status===204?null:res.json()
}
export const withMock=(mock,real,ms)=>USE_MOCK?delay(mock,ms):real()
