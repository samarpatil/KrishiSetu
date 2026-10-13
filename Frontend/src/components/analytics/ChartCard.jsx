import {tr} from '../../i18n'
import {ResponsiveContainer,AreaChart,Area,BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,Legend} from 'recharts'
export const G='#2d7a3e',A='#c28a1e'
const axes=<><CartesianGrid strokeDasharray="3 3" stroke="#e3eedb"/><XAxis dataKey="n" fontSize={12}/><YAxis fontSize={12} width={44}/><Tooltip/></>
export const ChartCard=({title,children,h='h-60'})=><div className="card"><h3 className="mb-3 font-medium">{tr(title)}</h3><div className={h}><ResponsiveContainer>{children}</ResponsiveContainer></div></div>
export const BarCard=({title,data,y='v',color=G})=><ChartCard title={title}><BarChart data={data}>{axes}<Bar dataKey={y} fill={color} radius={[4,4,0,0]}/></BarChart></ChartCard>
export const AreaCard=({title,data,y='v'})=><ChartCard title={title}><AreaChart data={data}>{axes}<Area dataKey={y} stroke={G} fill="#c5ddb6"/></AreaChart></ChartCard>
export const MultiLineCard=({title,data,lines})=><ChartCard title={title}><LineChart data={data}>{axes}<Legend/>{lines.map(([k,name,c])=><Line key={k} name={tr(name)} dataKey={k} stroke={c} strokeWidth={2} dot={false}/>)}</LineChart></ChartCard>
