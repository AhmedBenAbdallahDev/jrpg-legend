import { getCategoryMenu } from "@/lib/gameQueries";
import SideBarNav from "@/components/SideBarNav";

export default async function SideBar() {
  const categoryMenu = await getCategoryMenu();

  return (
    <aside className="w-64 p-4 hidden lg:flex flex-col">
      <SideBarNav categoryMenu={categoryMenu} />
    </aside>
  );
}
