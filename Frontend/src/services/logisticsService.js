import {stops,routeBefore,routeAfter,vehicle,deliveries} from '../data/deliveries';import {withMock,request} from './api'
export const getRoutePlan=()=>withMock(()=>({stops,route:routeBefore,vehicle,deliveries}),()=>request('/logistics/plan'),400)
export const optimizeRoute=()=>withMock(()=>({route:routeAfter}),()=>request('/logistics/optimize',{method:'POST'}),900)
