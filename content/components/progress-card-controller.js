function createDietfitProgressCard(root) {
  if (!root) return;
  const stage = root.querySelector('.df-progress-scene__stage');
  const screen = root.querySelector('.df-progress-ui');
  if (!stage || !screen) return;

  // Screen corners in the source photograph, including the extrapolated lower
  // right corner outside the crop. The native UI stays editable and legible.
  const corners = [[72 / 1122, 444 / 1402], [746 / 1122, 293 / 1402], [1243 / 1122, 1217 / 1402], [500 / 1122, 1]];
  const source = [[0, 0], [420, 0], [420, 630], [0, 630]];

  function project() {
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const rows = [];
    source.forEach(([x, y], index) => {
      const u = corners[index][0] * bounds.width;
      const v = corners[index][1] * bounds.height;
      rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
      rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
    });
    for (let column = 0; column < 8; column += 1) {
      let pivot = column;
      for (let row = column + 1; row < 8; row += 1) {
        if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row;
      }
      [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
      const divisor = rows[column][column];
      if (Math.abs(divisor) < 1e-10) return;
      for (let cell = column; cell < 9; cell += 1) rows[column][cell] /= divisor;
      for (let row = 0; row < 8; row += 1) {
        if (row === column) continue;
        const factor = rows[row][column];
        for (let cell = column; cell < 9; cell += 1) rows[row][cell] -= factor * rows[column][cell];
      }
    }
    const [a, b, c, d, e, f, g, h] = rows.map(row => row[8]);
    screen.style.transform = 'matrix3d(' + [a, d, 0, g, b, e, 0, h, 0, 0, 1, 0, c, f, 0, 1].join(',') + ')';
    screen.dataset.ready = 'true';
  }

  const observer = new ResizeObserver(project);
  observer.observe(stage);
  project();
  return () => observer.disconnect();
}
