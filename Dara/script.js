function exibirRegras() {
    var regrasContainer = document.getElementById('instructionsText');

    if (regrasContainer.style.display === 'none') {
      regrasContainer.style.display = 'block';
    } else {
      regrasContainer.style.display = 'none';
    }
  }
