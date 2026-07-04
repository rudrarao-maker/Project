export const addRecentlyVisited = (item) => {
  try {
    let visited = JSON.parse(localStorage.getItem("recentlyVisited") || "[]");
    visited = visited.filter((v) => v.id !== item.id);
    visited.unshift({
      id: item.id,
      name: item.name || item.title,
      category: item.category,
      url: item.officialWebsite || item.detailsUrl || "#",
      type: item.title ? "scheme" : "service",
      date: new Date().toISOString()
    });
    if (visited.length > 5) visited = visited.slice(0, 5);
    localStorage.setItem("recentlyVisited", JSON.stringify(visited));
  } catch (e) {
    console.error("Failed to save recently visited item", e);
  }
};
