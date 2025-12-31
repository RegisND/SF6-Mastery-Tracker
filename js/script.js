const API_URL = 'http://localhost:5151/api/treino';

async function fetchTreino() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderizarCards(data);
    } catch (err) {
        console.error("Erro ao conectar ao Dojo:", err);
    }
}

function renderizarCards(treinos) {
    const container = document.getElementById('treino-container');
    container.innerHTML = treinos.map(t => `
        <div class="card">
            <div class="card-header">
                <div class="matchup">${t.personagem} vs ${t.oponente}</div>
                <div class="nivel-badge">NÍVEL ${t.nivel}</div>
            </div>
            <div class="detalhes">${t.fundamento} | Botão: ${t.botaoAtaque}</div>
            
            <div class="slots-grid">
                ${gerarSlots(t.slotsAtivos)}
            </div>

            <button onclick="concluirNivel('${t.id}')">Concluir 100 Repetições</button>
        </div>
    `).join('');
}

function gerarSlots(ativos) {
    let html = '';
    for (let i = 0; i < 8; i++) {
        html += `<div class="slot ${i < ativos ? 'active' : ''}"></div>`;
    }
    return html;
}

async function concluirNivel(id) {
    const confirmar = confirm("Você atingiu 100 repetições sem erros fatais?");
    if (!confirmar) return;

    try {
        const response = await fetch(API_URL + '/concluir/' + id, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            fetchTreino(); // Recarrega os dados para atualizar os slots
        }
    } catch (err) {
        alert("Erro ao comunicar com o Backend. Verifique se o dotnet run está ativo.");
    }
}

// Inicializa o dashboard
fetchTreino();