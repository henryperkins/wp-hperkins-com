// packages/boot/src/components/navigation/path-matching.ts
var isValidParentPath = (currentPath, menuPath) => {
  if (!menuPath || menuPath === currentPath) {
    return false;
  }
  const normalizePath = (path) => {
    const normalized = path.startsWith("/") ? path : "/" + path;
    return normalized.endsWith("/") && normalized.length > 1 ? normalized.slice(0, -1) : normalized;
  };
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedMenu = normalizePath(menuPath);
  return normalizedCurrent.startsWith(normalizedMenu) && (normalizedCurrent[normalizedMenu.length] === "/" || normalizedMenu === "/");
};
var findClosestMenuItem = (currentPath, menuItems) => {
  const exactMatch = menuItems.find((item) => item.to === currentPath);
  if (exactMatch) {
    return exactMatch;
  }
  let bestMatch = null;
  let bestPathLength = 0;
  for (const item of menuItems) {
    if (!item.to) {
      continue;
    }
    if (isValidParentPath(currentPath, item.to)) {
      if (item.to.length > bestPathLength) {
        bestMatch = item;
        bestPathLength = item.to.length;
      }
    }
  }
  return bestMatch;
};
var findDrilldownParent = (id, menuItems) => {
  if (!id) {
    return void 0;
  }
  const currentItem = menuItems.find((item) => item.id === id);
  if (!currentItem) {
    return void 0;
  }
  if (currentItem.parent) {
    const parentItem = menuItems.find(
      (item) => item.id === currentItem.parent
    );
    if (parentItem?.parent_type === "drilldown") {
      return parentItem.id;
    }
    if (parentItem) {
      return findDrilldownParent(parentItem.id, menuItems);
    }
  }
  return void 0;
};
var findDropdownParent = (id, menuItems) => {
  if (!id) {
    return void 0;
  }
  const currentItem = menuItems.find((item) => item.id === id);
  if (!currentItem) {
    return void 0;
  }
  if (currentItem.parent) {
    const parentItem = menuItems.find(
      (item) => item.id === currentItem.parent
    );
    if (parentItem?.parent_type === "dropdown") {
      return parentItem.id;
    }
  }
  return void 0;
};
export {
  findClosestMenuItem,
  findDrilldownParent,
  findDropdownParent
};
//# sourceMappingURL=path-matching.mjs.map
