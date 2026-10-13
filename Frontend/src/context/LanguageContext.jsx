import {createContext,useContext,useState,useEffect} from 'react'
import {setLang} from '../i18n'
const Ctx=createContext({lang:'en',change(){}})
export const useLang=()=>useContext(Ctx)
const initial=()=>{let l='en';try{l=localStorage.getItem('ks_lang')||'en'}catch{}setLang(l);return l}
export function LanguageProvider({children}){
 const [lang,setL]=useState(initial)
 useEffect(()=>{document.documentElement.lang=lang},[lang])
 const change=l=>{setLang(l);try{localStorage.setItem('ks_lang',l)}catch{}setL(l)}
 return <Ctx.Provider value={{lang,change}}>{children}</Ctx.Provider>}
