import {seedOrders} from '../data/orders';import {withMock,request} from './api'
let list=seedOrders.map(o=>({...o})),n=1024+5
export const getOrders=()=>withMock(()=>list.map(o=>({...o})),()=>request('/orders'),300)
export const createOrder=o=>withMock(()=>{const x={...o,id:'KS'+ ++n,status:0,eta:'Tomorrow, 11:00 AM'};list=[x,...list];return x},()=>request('/orders',{method:'POST',body:o}),500)
