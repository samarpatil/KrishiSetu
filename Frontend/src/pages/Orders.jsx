import { tr } from "../i18n";
import { useState } from "react";
import {
  useApp,
  Page,
  PageHeader,
  StatusBadge,
  Empty,
} from "../components/common/ui";
import OrderCard from "../components/orders/OrderCard";
import OrderTimeline from "../components/orders/OrderTimeline";
import { inr } from "../utils/format";

export default function Orders() {
  const { orders } = useApp();
  const [sel, setSel] = useState(null);

  const o = orders.find((x) => x.id === sel) || orders[0];

  return (
    <>
      <PageHeader
        title={tr("Orders")}
        sub={tr("Track every order from placement to completion.")}
      />

      <Page>
        {!o ? (
          <Empty text={tr("No orders yet.")} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-2">
              {orders.map((x) => (
                <OrderCard
                  key={x.id}
                  o={x}
                  active={x.id === o.id}
                  onSelect={setSel}
                />
              ))}
            </div>

            <div className="card lg:col-span-3">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-display text-2xl">
                  {tr("Order")} #{o.id}
                </h2>
                <StatusBadge status={o.status} />
              </div>

              <p className="text-sm text-gray-600">
                {o.product} · {o.qty} kg · {inr(o.amount)} · {o.seller}
              </p>

              <div className="mt-5">
                <OrderTimeline status={o.status} />
              </div>
            </div>
          </div>
        )}
      </Page>
    </>
  );
}
