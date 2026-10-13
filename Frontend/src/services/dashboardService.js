import {farmerDashboard,buyerDashboard,adminDashboard} from '../data/dashboards';import {users} from '../data/users';import {withMock,request} from './api'
export const getFarmerDashboard=()=>withMock(()=>farmerDashboard,()=>request('/dashboard/farmer'),400)
export const getBuyerDashboard=()=>withMock(()=>buyerDashboard,()=>request('/dashboard/buyer'),400)
export const getAdminDashboard=()=>withMock(()=>({...adminDashboard,recentUsers:users.slice(3)}),()=>request('/dashboard/admin'),400)
