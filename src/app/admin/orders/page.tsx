import { getStore } from "@/lib/store";
import OrdersBoard from "@/components/admin/OrdersBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "RestMenu — Orders" };

export default async function OrdersPage() {
  const orders = await getStore().listOrders();
  return <OrdersBoard initialOrders={orders} />;
}
