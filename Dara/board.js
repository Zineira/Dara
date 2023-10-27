const rightbox = document.querySelector('.rightbox');
const pieces = document.querySelector('.pieces');
const colors = ['#123456'];
const SQUARES_NUM_1 =30;

for(let i =0;i <SQUARES_NUM_1;i++){
    const square = document.createElement('div');
    square.classList.add('square')

    square.addEventListener('mouseover', () => setColor(square))
    square.addEventListener('mouseout', () => resetColor(square))

    board.append(square)
}
// Crie e posicione as peças na "rightbox"
function createPiece(className) {
    const piece = document.createElement("div");
    piece.className = "game-piece " + className;
    pieces.appendChild(piece);
}

// Lista de peças (12 brancas e 12 pretas)
const piece_list = [];
for (let i = 0; i < 12; i++) {
    piece_list.push(createPiece("white"));
    piece_list.push(createPiece("black"));
}

function setColor(element) {
    const color = getRandomColor();
    element.style.backgroundColor = color;
}

function resetColor(element) {
    element.style.backgroundColor = 'rgba(104, 160, 229, 0)';
}

function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

window.onload = () => {
    const instructionsButton = document.getElementById('instrbutton');
    const rankingButton = document.getElementById('rankbutton');
    const box1 = document.querySelector('.rules');
    const box2 = document.querySelector('.box-main');
    const box3 = document.querySelector('.score');
    const overlay = document.querySelector('.overlay');

    instructionsButton.addEventListener('click', function() {
        if (box1.style.display != 'block') {
            box1.style.display = 'block';
            box2.style.display = 'none';
            box3.style.display = 'none';
            overlay.style.display = 'block'; // Mostra a cobertura
        } else {
            box1.style.display = 'none';
            box2.style.display = 'grid';
            box3.style.display = 'none';
            overlay.style.display = 'none'; // Oculta a cobertura
        }
    });

    rankingButton.addEventListener('click', function() {
        if (box3.style.display != 'block') {
            box3.style.display = 'block';
            box2.style.display = 'none';
            box1.style.display = 'none';
            overlay.style.display = 'block'; // Mostra a cobertura
        } else {
            box3.style.display = 'none';
            box2.style.display = 'grid';
            box1.style.display = 'none';
            overlay.style.display = 'none'; // Oculta a cobertura
        }
    });

    // Adicione um evento de clique na cobertura para fechar as instruções ou o ranking
    overlay.addEventListener('click', function() {
        box1.style.display = 'none';
        box2.style.display = 'grid';
        box3.style.display = 'none';
        overlay.style.display = 'none';
    });
};