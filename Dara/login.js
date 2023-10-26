document.querySelector(".submit").addEventListener("click", function(e) {
    e.preventDefault();
    var usuario = document.getElementById("usuario").value;
    var password = document.getElementById("password").value;

    // Aqui você pode verificar o usuário e a senha, e, se corretos, fazer a transição para o index1.html
    // Exemplo:
    if (usuario === "Player" && password === "123") {
        window.location.href = "file:///Users/henrique/Desktop/Dara/Dara/index2.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
});