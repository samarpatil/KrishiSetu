const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],months=['May','Jun','Jul','Aug','Sep','Oct']
export const farmerDashboard={stats:{expectedDemand:2850,estimatedRevenue:74500,activeOrders:12},weeklyDemand:days.map((n,i)=>({n,v:2400+i*75+(i%2)*60})),
 recommendations:['Tomato demand is expected to increase by 18.7%.','Consider listing 2,700–3,000 kg for the coming week.'],earnings:{estimated:74500,paidOut:52300},profile:{name:'Green Valley FPO',loc:'Sehore, Madhya Pradesh',type:'Farmer Producer Organization'}}
export const buyerDashboard={stats:{totalPurchases:213000,savedSuppliers:4},monthly:months.map((n,i)=>({n,v:42000+[0,8,-4,15,22,31][i]*1000,o:[8,11,9,14,16,19][i]})),
 insight:'Tomato demand in Bhopal is expected to rise 18.7%.'}
export const adminDashboard={stats:{farmers:128,buyers:86,ordersToday:38,tradedTonnes:14.2,activeDeliveries:17},
 ordersOverTime:days.map((n,i)=>({n,v:38+i*4+(i%3)*5})),supplyDemand:days.map((n,i)=>({n,sup:2200+i*90,dem:2000+i*160})),
 topProducts:[{n:'Tomato',v:46},{n:'Onion',v:38},{n:'Wheat',v:31},{n:'Potato',v:24},{n:'Soybean',v:19}],regions:[{n:'Bhopal',v:52},{n:'Indore',v:44},{n:'Sehore',v:30},{n:'Ujjain',v:22},{n:'Vidisha',v:15}],
 alerts:[{text:'Demand spike detected for tomatoes in Bhopal.',to:'/ai-insights'},{text:'5 deliveries require route optimization.',to:'/logistics'}]}
