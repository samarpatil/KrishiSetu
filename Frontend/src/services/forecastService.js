import {demandBase,locationFactor,heroForecast} from '../data/forecasts';import {withMock,request} from './api'
function build(product,location,days){
 const cur=Math.round(demandBase[product]*locationFactor[location]/10)*10,hero=product===heroForecast.product&&location===heroForecast.location
 const growth=hero?heroForecast.growth:+(((product.length*7+location.length*3)%19)-3+.4).toFixed(1)
 const pred=Math.round(cur*(1+growth/100)/10)*10,n=days===7?7:days===30?10:12,step=days===7?1:days/n,data=[]
 for(let i=-n+1;i<=0;i++)data.push({t:i===0?'Today':`${Math.round(i*step)}d`,hist:Math.round(cur*(1+Math.sin(i*1.3)*.05+i*.004))})
 data[data.length-1].pred=data[data.length-1].hist
 for(let i=1;i<=n;i++)data.push({t:`+${Math.round(i*step)}d`,pred:Math.round(cur+(pred-cur)*i/n+Math.sin(i)*cur*.015)})
 return{cur,pred,growth,conf:hero?heroForecast.confidence:80+(product.length+location.length)%9,data,low:Math.round(pred*.95/100)*100,high:Math.round(pred*1.05/100)*100}}
export const getForecast=(product,location,days)=>withMock(()=>build(product,location,days),()=>request(`/forecasts?product=${product}&location=${location}&days=${days}`),600)
