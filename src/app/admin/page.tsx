import { getStore } from "@/lib/store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "RestMenu — Admin" };

export default async function AdminPage() {
  const store = getStore();
  const menu = await store.getMenu();
  return <AdminDashboard initialMenu={menu} backend={store.backend} />;
}
