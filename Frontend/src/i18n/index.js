// Tiny i18n: English text is the key. Missing translations fall back to English.
// Add a language: create src/i18n/<code>.js and register it below.
import hi from './hi'
const dicts={en:{},hi}
export const languages=[['en','English'],['hi','हिन्दी']]
let lang='en'
export const getLang=()=>lang
export const setLang=l=>{lang=dicts[l]?l:'en'}
const fill=(s,v)=>v?s.replace(/\{(\w+)\}/g,(m,k)=>v[k]??m):s
export function tr(key,vars){
 if(typeof key!=='string')return key
 const d=dicts[lang]
 if(d[key])return fill(d[key],vars)
 const m=key.match(/\d[\d,.]*/)           // "18 km away" -> "{n} km away"
 if(m){const k2=key.replace(m[0],'{n}');if(d[k2])return d[k2].replace('{n}',m[0])}
 return fill(key,vars)}
