// packages/boot/src/components/navigation/use-sidebar-parent.ts
import { privateApis as routePrivateApis } from "@wordpress/route";
import { useEffect, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { unlock } from "../../lock-unlock.mjs";
import { STORE_NAME } from "../../store/index.mjs";
import {
  findDrilldownParent,
  findDropdownParent,
  findClosestMenuItem
} from "./path-matching.mjs";
var { useRouter, useMatches } = unlock(routePrivateApis);
function useSidebarParent() {
  const matches = useMatches();
  const router = useRouter();
  const menuItems = useSelect(
    (select) => (
      // @ts-ignore
      select(STORE_NAME).getMenuItems()
    ),
    []
  );
  const currentPath = matches[matches.length - 1].pathname.slice(
    router.options.basepath?.length ?? 0
  );
  const currentMenuItem = findClosestMenuItem(currentPath, menuItems);
  const [parentId, setParentId] = useState(
    findDrilldownParent(currentMenuItem?.id, menuItems)
  );
  const [parentDropdownId, setParentDropdownId] = useState(findDropdownParent(currentMenuItem?.id, menuItems));
  useEffect(() => {
    const matchedMenuItem = findClosestMenuItem(currentPath, menuItems);
    const updatedParentId = findDrilldownParent(
      matchedMenuItem?.id,
      menuItems
    );
    const updatedDropdownParent = findDropdownParent(
      matchedMenuItem?.id,
      menuItems
    );
    setParentId(updatedParentId);
    setParentDropdownId(updatedDropdownParent);
  }, [currentPath, menuItems]);
  return [
    parentId,
    setParentId,
    parentDropdownId,
    setParentDropdownId
  ];
}
export {
  useSidebarParent
};
//# sourceMappingURL=use-sidebar-parent.mjs.map
