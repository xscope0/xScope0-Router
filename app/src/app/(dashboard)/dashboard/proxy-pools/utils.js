export function summarizeProxyHealthResults(results) {
  const deadIds = [];
  let alive = 0;

  for (const result of results) {
    if (result.ok) {
      alive += 1;
    } else if (result.id) {
      deadIds.push(result.id);
    }
  }

  return { alive, deadIds };
}
