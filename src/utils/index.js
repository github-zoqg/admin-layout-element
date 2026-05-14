export function formatRoutes(routes) {
  for (const item of routes) {
    if (item.children) {
      item.children = formatRoutes(item.children);
    }
  }
  return routes.filter((route) => !route.meta.isHide);
}
