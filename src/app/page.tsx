import { getStore } from "@/lib/store";
import MenuExperience from "@/components/menu/MenuExperience";
import EmptyMenu from "@/components/menu/EmptyMenu";

// The menu should reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const menu = await getStore().getMenu();
  if (menu.length === 0) return <EmptyMenu />;
  return <MenuExperience menu={menu} />;
}
