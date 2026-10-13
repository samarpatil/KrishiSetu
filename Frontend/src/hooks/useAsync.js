import {useEffect,useState,useCallback} from 'react'
// Runs an async loader; returns {data,loading,error,reload}.
export function useAsync(fn,deps=[]){
 const [s,setS]=useState({data:null,loading:true,error:null}),[tick,setTick]=useState(0)
 useEffect(()=>{let live=true;setS(x=>({...x,loading:true,error:null}));fn().then(d=>live&&setS({data:d,loading:false,error:null}),e=>live&&setS({data:null,loading:false,error:e.message||'Something went wrong'}));return()=>{live=false}},[...deps,tick])
 const reload=useCallback(()=>setTick(t=>t+1),[])
 return {...s,reload}}
