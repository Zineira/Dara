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
    var box1 = document.querySelector('.rules');
    var box2 = document.querySelector('#board')
    
    if (box1.style.display === 'none') {
        box1.style.display = 'block';
        box2.style.display = 'none';
    } else {
        box1.style.display = 'none';
        box2.style.display = 'block grid';
    }
});
