import {Search} from 'lucide-react'
export default function SearchBar({value,onChange,placeholder}){return <div className="relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input aria-label="Search" type="search" className="inp !pl-9" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/></div>}
