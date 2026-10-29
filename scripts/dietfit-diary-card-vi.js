function createDietfitDiaryCard(root) {
  if (!root) return;
  const stage = root.querySelector('.df-diary-scene__stage');
  const screen = root.querySelector('.df-diary-ui');
  if (!stage || !screen) return;

  // Display corners measured in the original 1200 × 1800 photograph.
  // Project the editable 375 × 812 Figma Home layout inside the green case.
  const corners = [[301 / 1200, 330 / 1800], [534 / 1200, 292 / 1800], [680 / 1200, 807 / 1800], [447 / 1200, 865 / 1800]];
  const source = [[0, 0], [375, 0], [375, 812], [0, 812]];

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

document.querySelectorAll('#dietfit-highlights .df-diary-card').forEach(createDietfitDiaryCard);
