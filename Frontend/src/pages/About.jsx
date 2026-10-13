import {tr} from '../i18n'
import {Page,Badge} from '../components/common/ui'
import {Tech} from './sections'
const B=({t,children})=><div className="card"><h3 className="font-medium text-field-900">{tr(t)}</h3><p className="mt-1 text-sm text-gray-600">{tr(children)}</p></div>
export default function About(){return <><Page><h1 className="font-display text-3xl text-field-900">{tr("Building a More Connected Agricultural Ecosystem")}</h1>
 <p className="mt-3 max-w-3xl text-gray-700">KrishiSetu is an AI-powered farm-to-buyer supply-chain platform. It links farmers and Farmer Producer Organizations (FPOs) with consumers and bulk buyers, and adds demand intelligence and logistics planning. It is a frontend-first prototype running on <Badge tone="amber">Demo Data</Badge></p>
 <div className="mt-6 grid gap-4 md:grid-cols-2"><B t="Product vision">A supply chain where growers see demand before they sell and buyers find reliable supply quickly.</B><B t="Target users">Farmers, FPOs, restaurants, retailers, institutional buyers and platform administrators.</B><B t="Core capabilities">Marketplace, AI-generated demand forecast, smart matching, route optimization and order tracking.</B><B t="Future roadmap">Connect an Express + PostgreSQL API, a FastAPI forecasting service, OR-Tools routing and real-time delivery updates.</B></div></Page><Tech/></>}
