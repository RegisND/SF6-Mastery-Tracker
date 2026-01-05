// Configuração do bônus de tempo global
let tempoBonusSegundos = 0;
let cronometroInterval;

async function carregarDashboard() {
    try {
        const response = await fetch('http://localhost:5151/api/treino');
        const treinos = await response.json();

        const container = document.getElementById('treino-container');
        container.innerHTML = '';

        if (treinos.length === 0) {
            container.innerHTML = "<h2>Dojo Limpo! Todos os fundamentos concluídos.</h2>";
            return;
        }

        treinos.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card-treino';
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>${item.resposta.personagem} - ${item.situacao}</h3>
                    <span class="nivel-badge">NÍVEL ${item.nivelId}</span>
                </div>

                <div class="stack-info">
                    <p><strong>Ação Foco:</strong> ${item.resposta.nome}</p>
                    <p><strong>Distração:</strong> ${item.acaoDistracao}</p>
                </div>

                <div class="slots-container">
                    ${Array(8).fill().map((_, i) => `
                        <div class="slot ${i < (9 - item.nivelId) ? 'foco' : 'distracao'}"></div>
                    `).join('')}
                </div>

                <div class="timer-display" id="timer-${item.id}">15:00</div>

                <div class="card-actions">
                    <button onclick="iniciarRound('${item.id}')" id="btn-start-${item.id}" class="btn-start">Iniciar Round</button>
                    <button onclick="concluirRound('${item.id}')" id="btn-finish-${item.id}" class="btn-finish" style="display:none">Concluir (100 Reps)</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar o Dojo:", error);
    }
}

function iniciarRound(id) {
    // Se já houver um timer rodando, para ele
    if (cronometroInterval) clearInterval(cronometroInterval);

    let tempoRestante = (15 * 60) + tempoBonusSegundos;
    tempoBonusSegundos = 0; // Consome o bônus

    // Troca os botões
    document.getElementById(`btn-start-${id}`).style.display = 'none';
    document.getElementById(`btn-finish-${id}`).style.display = 'block';

    const display = document.getElementById(`timer-${id}`);

    cronometroInterval = setInterval(() => {
        let minutos = Math.floor(tempoRestante / 60);
        let segundos = tempoRestante % 60;

        display.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        if (tempoRestante <= 0) {
            clearInterval(cronometroInterval);
            alert("Tempo esgotado! O treino irá para o fim da fila.");
            finalizarNoBackend(id, 0); 
        }
        tempoRestante--;
    }, 1000);
}

async function concluirRound(id) {
    clearInterval(cronometroInterval);

    const display = document.getElementById(`timer-${id}`);
    const tempoTexto = display.innerText;
    const [min, seg] = tempoTexto.split(':').map(Number);
    const segundosRestantes = (min * 60) + seg;

    if (confirm(`Você realmente concluiu as 100 repetições com foco?\nTempo bônus para o próximo: ${min}:${seg}`)) {
        tempoBonusSegundos = segundosRestantes; // Acumula bônus para o próximo card
        await finalizarNoBackend(id, segundosRestantes);
    } else {
        // Se cancelou, retoma o cronômetro (ajuste simples para não perder o tempo)
        iniciarRound(id); 
    }
}

async function finalizarNoBackend(id, segundos) {
    try {
        const response = await fetch(`http://localhost:5151/api/treino/finalizar-round/${id}?segundosRestantes=${segundos}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert(segundos > 0 ? "Ótimo trabalho! Log salvo no histórico." : "Treino movido para o fim da fila.");
            carregarDashboard(); // Recarrega os cards
        } else {
            alert("Erro ao salvar no backend.");
        }
    } catch (error) {
        console.error("Erro ao finalizar:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}

// Inicializa o Dojo ao carregar a página
carregarDashboard();