import {tr} from '../i18n'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {PageHeader,Page,Field,Button,useApp} from '../components/common/ui'
import {useAuth} from '../context/AuthContext'
const roles=[['Farmer / FPO','farmer'],['Buyer','buyer'],['Admin','admin']]
export default function Login(){
 const [r,setR]=useState('farmer'),[email,setEmail]=useState(''),[pw,setPw]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false),nav=useNavigate(),{toast}=useApp(),{login,demo}=useAuth()
 const finish=async fn=>{setBusy(true);setErr('');try{const u=await fn();toast(tr('Signed in as {name}.',{name:u.name}));nav(`/dashboard/${u.role}`)}catch(e){setErr(e.message);setBusy(false)}}
 const submit=e=>{e.preventDefault();if(!/\S+@\S+\.\S+/.test(email))return setErr(tr('Enter a valid email address.'));if(pw.length<4)return setErr(tr('Password must be at least 4 characters.'));finish(()=>login({email,password:pw,role:r}))}
 return <><PageHeader title={tr("Login")} sub={tr("Prototype sign-in. No real authentication is used.")}/><Page><div className="mx-auto max-w-md"><div className="card">
  <div role="tablist" className="mb-4 grid grid-cols-3 gap-1 rounded-lg bg-field-100 p-1">{roles.map(([l,k])=><button key={k} role="tab" aria-selected={r===k} onClick={()=>setR(k)} className={`rounded-md py-1.5 text-sm ${r===k?'bg-white font-medium shadow-sm':'text-gray-600'}`}>{tr(l)}</button>)}</div>
  <form onSubmit={submit} className="space-y-3"><Field label={tr("Email")}><input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label={tr("Password")}><input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)}/></Field>{err&&<p className="text-sm text-red-600">{err}</p>}<Button className="w-full" loading={busy}>{tr("Sign in")}</Button></form>
  <div className="my-4 text-center text-xs text-gray-500">{tr("Demo Login")}</div><div className="grid gap-2">{[['Continue as Farmer','farmer'],['Continue as Buyer','buyer'],['Continue as Admin','admin']].map(([l,k])=><Button key={k} variant="outline" disabled={busy} onClick={()=>finish(()=>demo(k))}>{tr(l)}</Button>)}</div></div></div></Page></>}
