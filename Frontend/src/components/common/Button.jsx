import {tr} from '../../i18n'
export default function Button({variant='primary',loading,children,className='',...p}){return <button className={`${variant==='primary'?'btn-p':variant==='danger'?'btn bg-red-600 text-white hover:bg-red-700':'btn-o'} ${className}`} disabled={loading||p.disabled} {...p}>{loading?tr('Please wait…'):children}</button>}
