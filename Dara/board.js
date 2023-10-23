const board = document.querySelector('#board')
const colors = ['#123456']
const SQUARES_NUM_1 = 25
const SQUARES_NUM_2 = 30

for(let i =0;i <SQUARES_NUM_2;i++){
    const square = document.createElement('div');
    square.classList.add('square')

    square.addEventListener('mouseover', () => setColor(square))
    square.addEventListener('mouseout', () => resetColor(square))

    board.append(square)
}

function setColor(element){
    const color = getRandomColor()
    element.style.backgroundColor=color
    element.style.boxShadow = '0 0 2px ${color},0 0 10px ${color}'

}

function resetColor(element){
    element.style.backgroundColor= 'rgba(104, 160, 229, 0)'
}

function getRandomColor(){
    const index = Math.floor(Math.random() * colors.length)
    return colors[index]
}

document.getElementById('instrbutton').addEventListener('click', function() {
    var rules = document.getElementById('rules');
    if (rules.style.display === 'none') {
        rules.style.display = 'show';
    } else {
        rules.style.display = 'none';
    }
});
