// VARIÁVEIS GLOBAIS
let tempo = 15 * 60; // 15 minutos em segundos
let rodando = false;
let cronometro;
let idTreinoFila = null; // Para saber qual item da fila estamos concluindo

// ELEMENTOS DA TELA
const btnTimer = document.getElementById('btn-timer');
const btnConcluir = document.getElementById('btn-concluir');
const displayTimer = document.getElementById('timer');

// 1. CARREGAR DADOS DO BANCO
async function carregarDadosIniciais() {
    try {
        const response = await fetch('http://localhost:5151/api/treino');
        const fila = await response.json();

        // Isso vai nos ajudar a confirmar no Console do F12 se os dados chegaram
        console.log("Dojo Data:", fila);

        if (fila && fila.length > 0) {
            const atual = fila[0]; 
            const r = atual.resposta; // Exatamente como aparece no seu JSON (minúsculo)

            if (r) {
                // Injetando os dados usando os nomes exatos do seu JSON:
                document.getElementById('titulo-treino').innerText = `${r.personagem} - ${r.nome}`;
                document.getElementById('jogo-display').innerText = `JOGO: ${r.jogo} | "O caminho é a própria prática."`;
                document.getElementById('nivel-id').innerText = atual.nivelId || 1;
                
                // Mapeando FOCO e DISTRAÇÃO que você acabou de cadastrar
                document.getElementById('foco-acao').innerText = r.foco || "Foco total";
                document.getElementById('distracao-acao').innerText = r.distracao || "Nenhuma";
                
                // Guarda o ID da fila para poder concluir o round depois
                idTreinoFila = atual.id;
            }
        } else {
            document.getElementById('titulo-treino').innerText = "Nenhum treino na fila";
        }
    } catch (error) {
        console.error("Erro ao conectar com o Dojo:", error);
    }
}

// 2. LÓGICA DO TIMER
btnTimer.addEventListener('click', function() {
    if (!rodando) {
        rodando = true;
        btnTimer.innerText = "Pausar";
        btnTimer.style.background = "#444"; // Muda a cor ao pausar
        btnConcluir.style.display = "block"; // Mostra o concluir

        cronometro = setInterval(() => {
            tempo--;
            atualizarDisplay();

            if (tempo <= 0) {
                clearInterval(cronometro);
                alert("Tempo esgotado! Excelente foco.");
                concluirRound();
            }
        }, 1000);
    } else {
        rodando = false;
        btnTimer.innerText = "Retomar";
        btnTimer.style.background = "var(--gold)";
        clearInterval(cronometro);
    }
});

function atualizarDisplay() {
    let min = Math.floor(tempo / 60);
    let sec = tempo % 60;
    displayTimer.innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// 3. FINALIZAR ROUND (ENVIO PARA O BACKEND)
async function concluirRound() {
    if (!idTreinoFila) return;

    try {
        // Envia os segundos restantes para o cálculo de BI no backend
        const response = await fetch(`http://localhost:5151/api/treino/finalizar-round/${idTreinoFila}?segundosRestantes=${tempo}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert("Round registrado com honra no seu histórico!");
            location.reload(); // Recarga para vir o próximo fundamento da fila
        } else {
            alert("Erro ao salvar progresso no servidor.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Não foi possível conectar ao servidor para salvar.");
    }
}

// Evento do botão concluir
btnConcluir.addEventListener('click', () => {
    if (confirm("Deseja encerrar o round agora e salvar o progresso?")) {
        concluirRound();
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', carregarDadosIniciais);