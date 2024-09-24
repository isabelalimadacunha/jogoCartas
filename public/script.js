const socket = io(); // Conecta ao servidor


let salaAtual;
let usuarioNome;

// Oatualiza o número de jogadores
socket.on('atualizaJogadores', (data) => {
    const salaDiv = Array.from(document.querySelectorAll('.sala')).find(div => div.innerText.startsWith(data.sala));
    if (salaDiv) {
        salaDiv.innerText = `${data.sala}: ${data.numeroJogadores}/${data.maxJogadores}`; 
    }
});

//  mensagem de entrada e saída
socket.on('mensagem', (msg) => {
    console.log(msg); 
    alert(msg); 
});

// Função para entrar em uma sala
function entrarSala(sala) {
    usuarioNome = prompt("Por favor, insira seu nome:");
    
    if (!usuarioNome) {
        alert("Você precisa inserir um nome para entrar na sala.");
        return; // Se o nome não for fornecido, sai da função
    }

    salaAtual = sala; // Salva a sala atual
    socket.emit('entrarSala', { sala, usuarioNome }); // Envia o evento ao servidor
    
    // Muda da tela inicial para a tela do jogo
    document.getElementById("telaInicial").classList.add("hidden");
    document.getElementById("telaJogo").classList.remove("hidden");
    
    // Atualiza a tela com o nome do usuário e sala
    document.getElementById("nomeUsuario").innerText = `Usuário: ${usuarioNome}`;
    document.getElementById("salaAtual").innerText = `Sala: ${sala}`;
    
    console.log(`Entrou na ${sala} como ${usuarioNome}`);
}

// Função ao clicar no botão "Bater"
function bater() {
    console.log("Bateu na mesa!");
    socket.emit('bater', { usuarioNome, sala: salaAtual }); 
}

// Listener para a resposta do servidor sobre quem bateu
socket.on('bateu', (data) => {
    if (data.jogador === 'Você') {
        alert('Você bateu na mesa!');
    } else {
        alert(`${data.jogador} bateu na mesa!`);
    }
});