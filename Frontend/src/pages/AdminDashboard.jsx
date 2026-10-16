import { tr } from "../i18n";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  ClipboardList,
  Package,
  AlertTriangle,
} from "lucide-react";
import { getAdminDashboard } from "../services";
import { useAsync } from "../hooks/useAsync";
import {
  StatCard,
  StatusBadge,
  Skeleton,
  ErrorState,
  useApp,
} from "../components/common/ui";
import Sidebar from "../components/dashboard/Sidebar";
import DataTable from "../components/analytics/DataTable";
import {
  BarCard,
  AreaCard,
  MultiLineCard,
  A,
} from "../components/analytics/ChartCard";
export default function AdminDashboard() {
  const { data: d, loading, error, reload } = useAsync(getAdminDashboard),
    { orders } = useApp(),
    [tab, setTab] = useState("a");
  return (
    <Sidebar
      title="Admin"
      nav={[
        ["a", "Overview"],
        ["o", "Orders", "/orders"],
        ["i", "AI Insights", "/ai-insights"],
      ]}
      tab={tab}
      setTab={setTab}
    >
      {loading ? (
        <Skeleton n={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              icon={Store}
              label={tr("Farmers/FPOs")}
              value={d.stats.farmers}
            />
            <StatCard
              icon={Users}
              label={tr("Active Buyers")}
              value={d.stats.buyers}
            />
            <StatCard
              icon={ClipboardList}
              label={tr("Orders Today")}
              value={
                d.stats.ordersToday +
                orders.filter((o) => o.status === 0).length
              }
            />
            <StatCard
              icon={Package}
              label={tr("Produce Traded")}
              value={`${d.stats.tradedTonnes} t`}
            />
            <StatCard
              icon={Truck}
              label={tr("Active Deliveries")}
              value={d.stats.activeDeliveries}
            />
          </div>
          <p className="text-xs text-gray-500">
            {tr("All figures are Demo Data.")}
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <AreaCard title={tr("Orders over time")} data={d.ordersOverTime} />
            <MultiLineCard
              title={tr("Supply vs demand (kg)")}
              data={d.supplyDemand}
              lines={[
                ["sup", "Supply", "#1f6035"],
                ["dem", "Demand", A],
              ]}
            />
            <BarCard title={tr("Top products (orders)")} data={d.topProducts} />
            <BarCard
              title={tr("Regional activity")}
              data={d.regions}
              color={A}
            />
          </div>
          <div className="space-y-2">
            {d.alerts.map((a) => (
              <Link
                key={a.text}
                to={a.to}
                className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
              >
                <AlertTriangle size={16} className="text-amber-600" />
                {tr(a.text)}
              </Link>
            ))}
          </div>
          <h2 className="font-display text-xl">{tr("Recent Orders")}</h2>
          <DataTable
            cols={["Order", "Product", "Seller", "Status"]}
            rows={orders.map((o) => [
              `#${o.id}`,
              o.product,
              o.seller,
              <StatusBadge status={o.status} />,
            ])}
          />
          <h2 className="font-display text-xl">{tr("Recent Users")}</h2>
          <DataTable
            cols={["Name", "Role", "Joined"]}
            rows={d.recentUsers.map((u) => [
              u.name,
              u.role === "farmer" ? "FPO / Farmer" : "Buyer",
              u.joined,
            ])}
          />
        </>
      )}
    </Sidebar>
  );
}
