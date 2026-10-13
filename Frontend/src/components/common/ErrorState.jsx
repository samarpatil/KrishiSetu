import {tr} from '../../i18n'
import {AlertTriangle} from 'lucide-react';import Button from './Button'
export default function ErrorState({message,onRetry}){return <div role="alert" className="card grid place-items-center gap-2 border-red-200 py-12 text-center"><AlertTriangle className="text-red-500"/><p className="font-medium">{tr("We couldn't load this.")}</p><p className="text-sm text-gray-500">{message}</p>{onRetry&&<Button variant="outline" onClick={onRetry}>{tr("Try again")}</Button>}</div>}
