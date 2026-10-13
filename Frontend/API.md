# KrishiSetu — REST API contract

The frontend calls these endpoints when `VITE_USE_MOCK=false` (base URL `VITE_API_URL`, default `http://localhost:5000/api`).
Auth: send `Authorization: Bearer <token>` (token saved by the login call). Errors: non-2xx with JSON `{ "message": "..." }`.
The mock shapes live in `src/data/*`; your responses must match them.

| Method | Path | Body / query | Returns |
|---|---|---|---|
| POST | /auth/login | `{email,password,role}` | `{token,user:{id,name,org,role,email,loc,joined}}` |
| POST | /auth/demo | `{role}` | same as login |
| GET | /products | – | `[{id,name,emoji,category,seller,loc,km,qty,price,quality,harvest,delivery,rating}]` |
| GET | /products/:id | – | one product, or 404 |
| GET | /produce/mine | – | `[{id,name,qty,price,quality,loc,status}]` |
| POST | /produce | `{name,category,qty,unit,price,quality,harvest,loc}` | created produce `{id,...,status}` |
| DELETE | /produce/:id | – | 204 |
| GET | /suppliers | – | `[{id,name,loc,km,products[],stock{},grades[],price,delivery,base}]` |
| POST | /match | `{product,qty,quality,location,delivery,deliveryNeeded}` | suppliers sorted by `score` (0–100), each with `reasons:[["✓"|"✗","text"]]` |
| GET | /forecasts | `?product&location&days` | `{cur,pred,growth,conf,low,high,data:[{t,hist?,pred?}]}` |
| GET | /orders | – | `[{id,product,qty,amount,seller,status(0-5),eta}]` |
| POST | /orders | `{product,qty,amount,seller}` | created order `{id,status:0,eta,...}` |
| GET | /logistics/plan | – | `{stops:[{n,x,y,t:"farm"|"buyer"}],route:{km,time,saved,path},vehicle:{load,capacity},deliveries:[{id,order,to,status}]}` |
| POST | /logistics/optimize | – | `{route:{km,time,saved,path}}` |
| GET | /notifications | – | `[{id,text}]` |
| GET | /dashboard/farmer | – | see `farmerDashboard` in `src/data/dashboards.js` |
| GET | /dashboard/buyer | – | see `buyerDashboard` |
| GET | /dashboard/admin | – | see `adminDashboard` plus `recentUsers` |

Order `status`: 0 Placed, 1 Confirmed, 2 Preparing, 3 Picked Up, 4 In Transit, 5 Delivered.
Route `path` is an SVG polyline string for the simulated map; replace with real coordinates when you add a map library.
Forecasts: serve from the planned FastAPI service via Express. Routing: OR-Tools + Maps API.
