import {Inbox} from 'lucide-react'
export default function EmptyState({text,children}){return <div className="card grid place-items-center gap-2 py-12 text-center text-gray-500"><Inbox/>{text}{children}</div>}
