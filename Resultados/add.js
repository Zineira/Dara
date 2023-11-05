const fs = require('fs');

const filename = 'resultados.json'; // Replace with the actual path to your file
const rawData = fs.readFileSync(filename, 'utf-8');
const jsonData = JSON.parse(rawData);
var newObject = {
    Jogador: "Eve",
    Pontos: "28",
    Tabuleiro: "41x42",
    Adversário: "Bot",
    Dificuldade: "Súper"
    }; 

jsonData.push(newObject);
const updatedData = JSON.stringify(jsonData, null, 2);
fs.writeFileSync(filename, updatedData, 'utf-8');