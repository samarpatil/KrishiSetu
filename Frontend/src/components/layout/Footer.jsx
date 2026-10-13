import {tr} from '../../i18n'
import {Link} from 'react-router-dom';import logo from '../../assets/logo.svg';import {links} from './Navbar'
export default function Footer(){return <footer className="mt-16 bg-field-900 text-field-200"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
 <div><div className="flex items-center gap-2 font-display text-xl text-white"><img src={logo} alt="" className="h-7 w-7"/>KrishiSetu</div><p className="mt-2 text-sm">{tr("Connecting Farms to Markets, Smarter.")}</p></div>
 <div className="grid grid-cols-2 gap-1 text-sm">{links.slice(1).map(([to,l])=><Link key={to} to={to} className="hover:text-white">{tr(l)}</Link>)}<Link to="/smart-match" className="hover:text-white">{tr("Smart Match")}</Link><Link to="/orders" className="hover:text-white">{tr("Orders")}</Link><Link to="/about" className="hover:text-white">{tr("About")}</Link></div>
 <p className="text-xs">{tr("All farmers, FPOs, prices and forecasts shown are Demo Data from a frontend prototype. FPO = Farmer Producer Organization.")}</p></div></footer>}
