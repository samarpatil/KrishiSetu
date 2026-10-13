import {lazy,Suspense} from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import Layout from './components/layout/Layout'
import {Skeleton,Page} from './components/common/ui'
import {AppProvider} from './context/AppContext'
import {useLang} from './context/LanguageContext'
import {AuthProvider} from './context/AuthContext'
const L=n=>lazy(()=>import(`./pages/${n}.jsx`).then(m=>({default:m.default})))
const P={Home:L('Home'),Problem:L('Problem'),Solution:L('Solution'),HowItWorks:L('HowItWorks'),Impact:L('Impact'),Marketplace:L('Marketplace'),ProductDetails:L('ProductDetails'),AIInsights:L('AIInsights'),SmartMatch:L('SmartMatch'),Logistics:L('Logistics'),Orders:L('Orders'),Login:L('Login'),About:L('About'),Farmer:L('FarmerDashboard'),Buyer:L('BuyerDashboard'),Admin:L('AdminDashboard')}
const r=(path,k)=><Route path={path} element={<Suspense fallback={<Page><Skeleton/></Page>}>{(()=>{const C=P[k];return <C/>})()}</Suspense>}/>
export default function App(){const {lang}=useLang();return <AuthProvider><AppProvider><Routes key={lang}><Route element={<Layout/>}>
 {r('/','Home')}{r('/problem','Problem')}{r('/solution','Solution')}{r('/how-it-works','HowItWorks')}{r('/impact','Impact')}{r('/marketplace','Marketplace')}{r('/marketplace/:productId','ProductDetails')}{r('/ai-insights','AIInsights')}{r('/smart-match','SmartMatch')}{r('/logistics','Logistics')}{r('/orders','Orders')}{r('/login','Login')}{r('/about','About')}{r('/dashboard/farmer','Farmer')}{r('/dashboard/buyer','Buyer')}{r('/dashboard/admin','Admin')}
 <Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></AppProvider></AuthProvider>}
