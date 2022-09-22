let size = 4;
let cells = [];
let table = document.getElementById('field');
let score = 0;
let scoreBoard = document.getElementById('score');
let hightScore = localStorage.getItem('hightScore')
let hightScoreBoard = document.getElementById('hight-score');
let htmlElements;
const colors = [
   { value: 2, color: 'rgba(255, 241, 128, 0.88)' },
   { value: 4, color: 'rgba(251, 202, 107, 0.88)' },
   { value: 8, color: 'rgba(248, 150, 108, 0.92)' },
   { value: 16, color: 'rgba(248, 108, 108, 0.92)' },
   { value: 32, color: 'rgba(255, 97, 173, 0.83)' },
   { value: 64, color: 'rgba(228, 108, 248, 0.92)' },
   { value: 128, color: 'rgba(170, 108, 248, 0.92)' },
   { value: 256, color: 'rgba(111, 108, 248, 0.92)' },
   { value: 512, color: 'rgba(112, 195, 255, 0.92)' },
   { value: 1024, color: 'rgba(54, 221, 151, 0.93)' },
   { value: 2048, color: 'rgba(129, 232, 49, 0.93)' },
]

const createField = () => {
   if (htmlElements) return
   htmlElements = [];
   for (let y = 0; y < size; y++) {
      let row = document.createElement('div');
      let rowElements = [];
      for (let x = 0; x < size; x++) {
         let cell = document.createElement('div');
         cell.setAttribute('class', 'cell ');
         row.appendChild(cell);
         rowElements.push(cell);
         table.appendChild(cell);
      }
      htmlElements.push(rowElements);
   }
}

const draw = () => {
   for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
         let cell = htmlElements[y][x];
         let v = cells[y][x];
         cell.innerHTML = v == 0 ? '' : String(v);
         if (v > 0) {
            cell.setAttribute('style', `background-color:${choseColor(v)}`)
         }
         else if (v === 0) {
            cell.removeAttribute('style');
         }
      }
   }

}

const choseColor = (v) => {
   let currentColor;
   colors.map(obj => {
      if (obj.value === v) currentColor = obj.color;
   })
   return currentColor
}

const createEmptyCells = () => {
   for (let y = 0; y < size; y++) {
      cells.push(new Array(size).fill(0))
   }
}

const genetateInEmptyCell = () => {
   let x, y;
   do {
      x = Math.floor(Math.random() * size),
         y = Math.floor(Math.random() * size);
      if (cells[y][x] == 0) {
         cells[y][x] = Math.random() >= 0.9 ? 4 : 2;
         animateCreating(htmlElements[y][x])
         break;
      }
   } while (true);
}

const animateCreating = (htmlElement) => {
   htmlElement.classList.add('creating');
   setTimeout(() => {
      htmlElement.classList.remove('creating')
   }, 1000)
}

function removeEmpty(row) {
   return row.filter(x => x != 0);
}

const combine = (row) => {        // Works to the left
   row = removeEmpty(row)        // [2,2,0,4] => [2,2,4] => [4,0,4] => [4,4] => [4,4,0,0]
   if (row.length > 0) {
      for (let i = 0; i < row.length - 1; i++) {
         if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];

         }
      }
   }
   row = removeEmpty(row)
   while (row.length < size) {
      row.push(0)
   }
   return row
}

const slideLeft = () => {
   let changed = false;
   for (let y = 0; y < size; y++) {
      let old = Array.from(cells[y]);
      cells[y] = combine(cells[y]);
      changed = changed || (cells[y].join(',') != old.join(','));
   }
   return changed;
}

const mirror = () => {
   cells.map(row => row.reverse())
}

const invert = () => {
   cells = cells[0].map((row, r) => cells.map((col, c) => cells[c][r]))
}

const rotate = () => {
   cells = cells[0].map((row, r) => cells.map((col, c) => cells[c][r]).reverse())
}

const moveLeft = () => {
   return slideLeft();
}

const moveRight = () => {
   mirror();
   let changed = moveLeft();
   mirror();
   return changed;
}

const moveUp = () => {
   invert();
   let changed = moveLeft();
   invert();
   return changed;
}

const moveDown = () => {
   rotate();
   let changed = moveLeft();
   mirror();
   invert();
   return changed;
}

addEventListener('keydown', (e) => {
   e.key === 'ArrowUp' && e.preventDefault();
   e.key === 'ArrowDown' && e.preventDefault();
   let ok;
   switch (e.key) {
      case 'ArrowLeft': ok = moveLeft(); break;
      case 'ArrowRight': ok = moveRight(); break;
      case 'ArrowUp': ok = moveUp(); break;
      case 'ArrowDown': ok = moveDown(); break;
      default: return;
   }
   if (ok) {
      genetateInEmptyCell();
      draw();
   }
   scoreBoard.innerText = score;
   score > hightScore ? hightScoreBoard.innerText = score : null;
   if (isGameOver()) {
      localStorage.setItem('hightScore', score);
      setTimeout(() => {
         alert('Game Over');
         initate();
      }, 1000)
   }
})

const isGameOver = () => {
   for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
         if (cells[y][x] == 0) return false;
      }
   }
   for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
         let c = cells[y][x];
         if (c != 0 && (c === cells[y + 1][x] || c === cells[y][x + 1])) {
            return false;
         }
      }
   }
   return true;
}

const initate = () => {
   hightScoreBoard.innerText = localStorage.getItem('hightScore')
   createField();
   createEmptyCells();
   new Array(3).fill(0).forEach(genetateInEmptyCell);
   draw();
}

initate()




