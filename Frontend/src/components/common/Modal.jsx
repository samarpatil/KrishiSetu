import {useEffect} from 'react';import {X} from 'lucide-react'
export default function Modal({open,onClose,title,children}){
 useEffect(()=>{const f=e=>e.key==='Escape'&&onClose();if(open)addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[open,onClose])
 if(!open)return null
 return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={title} className="pop max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6" onClick={e=>e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl">{title}</h2><button aria-label="Close" onClick={onClose}><X size={18}/></button></div>{children}</div></div>}
