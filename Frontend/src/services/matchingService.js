import {suppliers} from '../data/suppliers';import {withMock,request} from './api'
function score({product,qty,quality,deliveryNeeded}){
 return suppliers.map(s=>{let score=s.base;const r=[],stock=s.stock[product]||0
  if(!s.products.includes(product)){score-=40;r.push(['✗','Product not listed'])}
  else if(stock>=qty)r.push(['✓','Quantity available']);else{score-=12;r.push(['✗',`Only ${stock} kg in stock`])}
  if(s.grades.includes(quality))r.push(['✓',quality]);else{score-=6;r.push(['✗',`${quality} not available`])}
  r.push(['✓',`${s.km} km away`],['✓',s.price<=29?'Competitive price':'Slightly higher price'])
  if(s.delivery)r.push(['✓','Delivery available']);else if(deliveryNeeded){score-=5;r.push(['✗','No delivery'])}
  return{...s,score:Math.max(20,score),reasons:r}}).sort((a,b)=>b.score-a.score)}
export const matchSuppliers=req=>withMock(()=>score(req),()=>request('/match',{method:'POST',body:req}),700)
export const getSuppliers=()=>withMock(()=>suppliers,()=>request('/suppliers'),300)
