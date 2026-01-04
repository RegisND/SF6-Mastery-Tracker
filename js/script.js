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

            // Lógica de exibição de slots (8 slots totais)
            // Se Nível 1: 8 slots de foco. Se nível 2: 7 slots de foco / 1 distração.
            const slotsFoco = 9 - item.nivelId;
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>${item.resposta.personagem} - ${item.situacao}</h3>
                    <span class="nivel-badge">NÌVEL ${item.nivelId}</span>
                </div>

                <div."stack-info">
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
                        <button onclick="iniciarRound('${item.id}' id="btn-start-${item.id}" class="btn-start">Iniciar Round</button>
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
    let tempoRestante = 15 * 60 + tempoBonusSegundos;
    tempoBonusSegundos = 0;

    document.getElementById(`btn-start-${id}`).style.display = 'none';
    document.getElementById(`btn-finish-${id}`).style.display = 'block';

    const display = document.getElementById(`timer-${id}`);

    cronometroInterval = setInterval(() => {
        let minutos = Math.floor(tempoRestante / 60);
        let segundos = tempoRestante % 60;

        display.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        if (tempoRestante <= 0) {
            clearInterval(cronometroInterval);
            finalizarNoBackend(id, 0); // Falha por tempo
        }
        tempoRestante--;
    }, 1000);
}

async function concluirRound(id) {
    clearInterval(cronometroInterval);

    // Pega quanto tempo sobrou para ser bônus
    const tempoTexto = document.getElementById(`timer-${id}`).innerText;
    const [min, seg] = tempoTexto.split(':').map(Number);
    const segundosRestantes = min * 60 + seg;

    if (confirm(`Você realmente concluiu as 100 repetições com foco?\nTempo bônus: ${min}:${seg}`)) {
        tempoBonusSegundos = segundosRestantes;
        await finalizarNoBackend(id, segundosRestantes);
    } else {
        iniciarRound(id); // Reinicia se clicar sem querer
    }
}

async function finalizarNoBackend(id, segundos) {
    try {
        const response = await fetch(`http://localhost:5151/api/treino/finalizar-round/${id}?segundosRestantes=${segundos}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert(segundos > 0 ? "Ótimo trabalho! Nível concluído." : "Tempo esgotado! O treino foi para o fim da fila.");
            carregarDashboard();
        }
    } catch (error) {
        console.error("Erro ao finalizar:", error);
    }
}

// Inicializa o Dojo
carregarDashboard();