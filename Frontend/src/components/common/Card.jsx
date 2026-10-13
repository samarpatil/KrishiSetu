export default function Card({children,className='',hover}){return <div className={`card ${hover?'transition hover:-translate-y-1 hover:shadow-md':''} ${className}`}>{children}</div>}
