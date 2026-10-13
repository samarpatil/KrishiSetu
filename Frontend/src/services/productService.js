import {products} from '../data/products';import {seedProduce} from '../data/produce';import {withMock,request} from './api'
let mine=seedProduce.map(p=>({...p})),n=100
export const getProducts=()=>withMock(()=>products,()=>request('/products'),500)
export const getProduct=id=>withMock(()=>products.find(p=>p.id===id)||null,()=>request(`/products/${id}`),300)
export const getMyProduce=()=>withMock(()=>mine.map(p=>({...p})),()=>request('/produce/mine'),300)
export const createProduce=p=>withMock(()=>{const x={...p,id:'m'+ ++n,status:'Active'};mine=[x,...mine];return x},()=>request('/produce',{method:'POST',body:p}),400)
export const deleteProduce=id=>withMock(()=>{mine=mine.filter(p=>p.id!==id);return {id}},()=>request(`/produce/${id}`,{method:'DELETE'}),300)
