const aRowsSelect = document.getElementById('aRows');
const aColsSelect = document.getElementById('aCols');
const bColsSelect = document.getElementById('bCols');
const updateButton = document.getElementById('update');
const calculateButton = document.getElementById('calculate');
const matrixAContainer = document.getElementById('matrixA');
const matrixBContainer = document.getElementById('matrixB');
const resultContainer = document.getElementById('result');
const statusText = document.getElementById('status');
const aSizeText = document.getElementById('aSize');
const bSizeText = document.getElementById('bSize');

const SIZE_OPTIONS = [2, 3, 4, 5, 6];

function populateSelect(select) {
  SIZE_OPTIONS.forEach((size) => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    select.appendChild(option);
  });
}

function buildMatrix(container, rows, cols, labelPrefix) {
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'table';

  const tbody = document.createElement('tbody');
  for (let r = 0; r < rows; r += 1) {
    const tr = document.createElement('tr');
    for (let c = 0; c < cols; c += 1) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.placeholder = '0';
      input.className = 'coeff-input';
      input.setAttribute('aria-label', `${labelPrefix} row ${r + 1} column ${c + 1}`);
      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  container.appendChild(table);
}

function updateSizeLabels(aRows, aCols, bCols) {
  aSizeText.textContent = `${aRows} × ${aCols}`;
  bSizeText.textContent = `${aCols} × ${bCols}`;
}

function buildMatrices() {
  const aRows = Number(aRowsSelect.value);
  const aCols = Number(aColsSelect.value);
  const bCols = Number(bColsSelect.value);

  updateSizeLabels(aRows, aCols, bCols);
  buildMatrix(matrixAContainer, aRows, aCols, 'Matrix A');
  buildMatrix(matrixBContainer, aCols, bCols, 'Matrix B');
  resultContainer.innerHTML = '';
  statusText.textContent = '';
  statusText.classList.remove('error');
}

function readMatrix(container) {
  const rows = Array.from(container.querySelectorAll('tbody tr'));
  return rows.map((row) => Array.from(row.querySelectorAll('input')).map((input) => Number(input.value || 0)));
}

function multiplyMatrices(A, B) {
  const aRows = A.length;
  const aCols = A[0]?.length || 0;
  const bRows = B.length;
  const bCols = B[0]?.length || 0;

  if (!aRows || !aCols || !bRows || !bCols) {
    return { error: 'Please fill out both matrices before calculating.' };
  }

  if (aCols !== bRows) {
    return { error: 'Matrix dimensions are incompatible (columns of A must match rows of B).' };
  }

  const result = Array.from({ length: aRows }, () => Array(bCols).fill(0));

  for (let i = 0; i < aRows; i += 1) {
    for (let j = 0; j < bCols; j += 1) {
      let sum = 0;
      for (let k = 0; k < aCols; k += 1) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }

  return { result };
}

function renderResult(resultMatrix) {
  resultContainer.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'table';
  const tbody = document.createElement('tbody');

  resultMatrix.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = Number(value.toFixed(4));
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  resultContainer.appendChild(table);
}

function handleCalculate() {
  const matrixA = readMatrix(matrixAContainer);
  const matrixB = readMatrix(matrixBContainer);
  const outcome = multiplyMatrices(matrixA, matrixB);

  if (outcome.error) {
    statusText.textContent = outcome.error;
    statusText.classList.add('error');
    resultContainer.innerHTML = '';
    return;
  }

  statusText.textContent = 'Calculated A × B successfully.';
  statusText.classList.remove('error');
  renderResult(outcome.result);
}

function initializeControls() {
  [aRowsSelect, aColsSelect, bColsSelect].forEach(populateSelect);
  aRowsSelect.value = '2';
  aColsSelect.value = '2';
  bColsSelect.value = '2';
}

updateButton.addEventListener('click', buildMatrices);
calculateButton.addEventListener('click', handleCalculate);

window.addEventListener('DOMContentLoaded', () => {
  initializeControls();
  buildMatrices();
});
