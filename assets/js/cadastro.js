const API_BASE = "http://localhost:5151/api/treino";

const selectPlayer = document.getElementById('personagem');
const selectOpponent = document.getElementById('oponente');
const playerImg = document.getElementById('player-render');
const opponentImg = document.getElementById('opponent-render');
const gameRadios = document.querySelectorAll('input[name="game-choice"]');
const form = document.getElementById('form-cadastro');

// 1. CARREGAR LUTADORES E LIMPAR TELA
async function carregarDados(jogo) {
    try {
        // --- LÓGICA DE RESET ---
        // Limpa os selects
        selectPlayer.innerHTML = `<option value="">Selecione...</option>`;
        selectOpponent.innerHTML = `<option value="">Selecione...</option>`;
        
        // Esconde as imagens com transição suave
        playerImg.style.opacity = "0";
        opponentImg.style.opacity = "0";
        
        // Pequeno delay para trocar o src após o fade out (opcional para estética)
        setTimeout(() => {
            playerImg.src = "";
            opponentImg.src = "";
        }, 200);

        // --- CARREGAMENTO DO NOVO JOGO ---
        const response = await fetch(`${API_BASE}/personagens/${jogo}`);
        const personagens = await response.json();

        // Salva tema e atualiza CSS
        localStorage.setItem('ultimoJogo', jogo);
        document.body.className = `theme-${jogo.toLowerCase()}`;

        personagens.forEach(p => {
            const option = `<option value="${p.nome}" data-slug="${p.imagemSlug}">${p.nome}</option>`;
            selectPlayer.innerHTML += option;
            selectOpponent.innerHTML += option;
        });
        
    } catch (err) {
        console.error("Erro ao carregar API:", err);
    }
}

// 2. ATUALIZAR PREVIEW DAS IMAGENS
function atualizarPreview(select, img) {
    const jogo = document.querySelector('input[name="game-choice"]:checked').value;
    const slug = select.options[select.selectedIndex]?.getAttribute('data-slug');
    
    if (slug) {
        // Garante que o JS busque com underline caso haja algum espaço perdido
        const slugLimpo = slug.replace(/\s+/g, '_');

        img.style.opacity = "0"; // Inicia transição
        setTimeout(() => {
            img.src = `assets/image/personagens/${jogo}/${slug}.png`;
            img.style.opacity = "0.6"; // Mostra a nova imagem
        }, 200);
    } else {
        img.style.opacity = "0";
    }
}

// 3. EVENTOS
gameRadios.forEach(r => {
    r.addEventListener('change', (e) => {
        // Quando o switch muda, chamamos a função que limpa tudo e carrega o novo jogo
        carregarDados(e.target.value);
    });
});

selectPlayer.addEventListener('change', () => atualizarPreview(selectPlayer, playerImg));
selectOpponent.addEventListener('change', () => atualizarPreview(selectOpponent, opponentImg));

// Lógica de envio do formulário (mantém a mesma)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const jogo = document.querySelector('input[name="game-choice"]:checked').value;
    
    const data = {
        nome: document.getElementById('nome').value,
        personagem: selectPlayer.value,
        oponente: selectOpponent.value,
        foco: document.getElementById('foco').value,
        distracao: document.getElementById('distracao').value,
        jogo: jogo,
        nivelDisciplina: parseInt(document.getElementById('nivelDisciplina').value)
    };

    const res = await fetch(`${API_BASE}/cadastrar-fundamento`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Fundamento Consagrado!");
        window.location.href = "index.html";
    }
});

// INICIAR - Carrega o jogo salvo ou o padrão SF6
document.addEventListener('DOMContentLoaded', () => {
    const jogoInicial = localStorage.getItem('ultimoJogo') || 'SF6';
    // Marca o rádio correspondente no HTML
    document.querySelector(`input[value="${jogoInicial}"]`).checked = true;
    carregarDados(jogoInicial);
});