import {createContext,useContext,useState,useCallback,useEffect} from 'react'
import {ToastStack} from '../components/common/Toast'
import {getOrders,createOrder,getMyProduce,createProduce,deleteProduce} from '../services'
const Ctx=createContext(null)
export const useApp=()=>useContext(Ctx)
export function AppProvider({children}){
 const [toasts,setToasts]=useState([]),[orders,setOrders]=useState([]),[produce,setProduce]=useState([])
 const toast=useCallback(m=>{const id=Math.random();setToasts(t=>[...t,{id,m}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000)},[])
 useEffect(()=>{getOrders().then(setOrders).catch(e=>toast(e.message));getMyProduce().then(setProduce).catch(()=>{})},[toast])
 const addOrder=async o=>{const x=await createOrder(o);setOrders(s=>[x,...s]);return x.id}
 const addProduce=async p=>{const x=await createProduce(p);setProduce(s=>[x,...s]);return x}
 const removeProduce=async id=>{await deleteProduce(id);setProduce(s=>s.filter(p=>p.id!==id))}
 return <Ctx.Provider value={{toast,orders,addOrder,produce,addProduce,removeProduce}}>{children}<ToastStack toasts={toasts}/></Ctx.Provider>}
