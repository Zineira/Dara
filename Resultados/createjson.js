const fs = require('fs'); // Import the Node.js filesystem module

const data = [{
    Jogador : "John Doe",
    Pontos : "3",
    Tabuleiro : "6x5",
    Adversário : "Bot",
    Dificuldade : "Difícil"
},
	     {
    Jogador : "John Doe",
    Pontos : "3",
    Tabuleiro : "6x5",
    Adversário : "Bot",
    Dificuldade : "Difícil"
}];

const jsonContent = JSON.stringify(data, null, 2); // Convert the JavaScript object to a JSON string with 2-space indentation

fs.writeFile('resultados.json', jsonContent, 'utf8', (err) => {
    if (err) {
        console.error('Error writing JSON file:', err);
    } else {
        console.log('JSON file has been created successfully.');
    }
});
