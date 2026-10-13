export const Badge=({children,tone='green'})=><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${{green:'bg-field-100 text-field-700',amber:'bg-amber-100 text-amber-800',gray:'bg-gray-100 text-gray-700'}[tone]}`}>{children}</span>
export const DemoBadge=({children='Demo Data'})=><Badge tone="amber">{children}</Badge>
export default Badge
