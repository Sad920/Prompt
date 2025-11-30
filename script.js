const equationCountSelect = document.getElementById('equationCount');
const grid = document.getElementById('equationsGrid');
const solveButton = document.getElementById('solve');
const generateButton = document.getElementById('generate');
const solutionContainer = document.getElementById('solution');
const statusText = document.getElementById('status');
const methodSelect = document.getElementById('method');

function buildGrid() {
  const n = Number(equationCountSelect.value);
  grid.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (let i = 1; i <= n; i += 1) {
    const th = document.createElement('th');
    th.textContent = `x${i}`;
    headRow.appendChild(th);
  }
  const constantTh = document.createElement('th');
  constantTh.textContent = 'Constant';
  headRow.appendChild(constantTh);
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let row = 0; row < n; row += 1) {
    const tr = document.createElement('tr');
    for (let col = 0; col <= n; col += 1) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.className = 'coeff-input';
      input.placeholder = '0';
      input.setAttribute('aria-label', col === n ? `Constant for equation ${row + 1}` : `x${col + 1} for equation ${row + 1}`);
      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  grid.appendChild(table);
  statusText.textContent = '';
  statusText.classList.remove('error');
  solutionContainer.innerHTML = '';
}

function readMatrix() {
  const inputs = Array.from(grid.querySelectorAll('tbody tr'));
  if (!inputs.length) return null;
  const n = Number(equationCountSelect.value);
  const matrix = [];
  const constants = [];
  for (const row of inputs) {
    const values = Array.from(row.querySelectorAll('input'));
    const coeffs = values.slice(0, n).map((input) => Number(input.value || 0));
    const constant = Number(values[n].value || 0);
    matrix.push(coeffs);
    constants.push(constant);
  }
  return { matrix, constants };
}

function solveLinearSystem(A, b) {
  const n = A.length;
  const mat = A.map((row, idx) => [...row, b[idx]]);

  for (let i = 0; i < n; i += 1) {
    let maxRow = i;
    for (let k = i + 1; k < n; k += 1) {
      if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(mat[maxRow][i]) < 1e-12) {
      return { error: 'The system does not have a unique solution (zero pivot detected).' };
    }

    [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];

    for (let k = i + 1; k < n; k += 1) {
      const factor = mat[k][i] / mat[i][i];
      for (let j = i; j <= n; j += 1) {
        mat[k][j] -= factor * mat[i][j];
      }
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    let sum = mat[i][n];
    for (let j = i + 1; j < n; j += 1) {
      sum -= mat[i][j] * x[j];
    }
    x[i] = sum / mat[i][i];
  }
  return { solution: x };
}

function showSolution(result) {
  solutionContainer.innerHTML = '';
  if (result.error) {
    statusText.textContent = result.error;
    statusText.classList.add('error');
    return;
  }
  statusText.textContent = `Solved using Method ${methodSelect.value.toUpperCase()}`;
  statusText.classList.remove('error');
  const list = document.createElement('div');
  list.className = 'solutions-list';
  result.solution.forEach((value, idx) => {
    const card = document.createElement('div');
    card.className = 'solution-card';
    card.innerHTML = `<strong>x${idx + 1}</strong><div>${Number(value.toFixed(6))}</div>`;
    list.appendChild(card);
  });
  solutionContainer.appendChild(list);
}

function handleSolve() {
  const data = readMatrix();
  if (!data) return;
  const { matrix, constants } = data;
  const result = solveLinearSystem(matrix, constants);
  showSolution(result);
}

generateButton.addEventListener('click', buildGrid);
solveButton.addEventListener('click', handleSolve);
window.addEventListener('DOMContentLoaded', buildGrid);
