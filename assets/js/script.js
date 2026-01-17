let tempoRestante = 15 * 60;
let cronometro;
let rodando = false;

function formatarCaminhoImagem(jogo, nomePersonagem) {
    if (!nomePersonagem) return 'assets/image/personagens/placeholder.png';
    const pastaJogo = (jogo && jogo.trim().toUpperCase() === 'GGST') ? 'GGST' : 'SF6';
    const slug = nomePersonagem.trim().replace(/\s+/g, '_');
    return `assets/image/personagens/${pastaJogo}/${slug}.png`;
}

document.addEventListener('DOMContentLoaded', () => {
    const jogoSalvo = localStorage.getItem('ultimoJogo') || 'SF6';
    document.body.className = `theme-${jogoSalvo.toLowerCase()}`;

    // Inicialização Manual do Tilt no Card Principal para garantir o Brilho (Glare)
    const cardPrincipal = document.querySelector(".form-musashi");
    if (cardPrincipal) {
        // Destrói qualquer instância anterior para evitar conflitos
        if (cardPrincipal.vanillaTilt) cardPrincipal.vanillaTilt.destroy();

        VanillaTilt.init(cardPrincipal, {
            max: 10,
            speed: 400,         // Aumentamos a velocidade para ser mais responsivo
            glare: true,
            "max-glare": 0.5,   // Intensidade quando o mouse está em cima
            "glare-prerender": false, // IMPORTANTE: Impede que o brilho apareça antes do mouse
            perspective: 1000,
            scale: 1.01,
            reset: true,        // Garante que o card e o brilho voltem ao estado inicial ao sair
            gyroscope: true
        });
    }

    carregarFilaTreino();
    carregarDadosPrincipal();
});

async function carregarFilaTreino() {
    try {
        const res = await fetch('http://localhost:5151/api/treino/fila');
        const fila = await res.json();
        const container = document.getElementById('container-cards');
        if (!container) return;
        container.innerHTML = '';

        fila.forEach(item => {
            const dados = item.resposta;
            const imgPath = formatarCaminhoImagem(dados.jogo, dados.personagem);
            container.innerHTML += `
                <div class="card-fundamento" data-tilt>
                    <img src="${imgPath}" class="mini-render" alt="${dados.personagem}" 
                         onerror="this.src='assets/image/personagens/SF6/Ryu.png'">
                    <div class="card-info">
                        <h3>${dados.nome}</h3>
                        <p>${dados.personagem} vs ${dados.oponente}</p>
                    </div>
                </div>`;
        });
        
        VanillaTilt.init(document.querySelectorAll(".card-fundamento"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.3
        });
    } catch (err) { console.error("Erro na fila:", err); }
}

async function carregarDadosPrincipal() {
    try {
        const response = await fetch('http://localhost:5151/api/treino/fila');
        const data = await response.json();

        if (data && data.length > 0) {
            const treino = data[0].resposta;
            document.getElementById('titulo-treino').innerText = treino.nome.toUpperCase();
            document.getElementById('foco-acao').innerText = treino.foco;
            document.getElementById('distracao-acao').innerText = treino.distracao;
            document.getElementById('nivel-id').innerText = treino.nivelDisciplina;

            const jogoValido = (treino.jogo && treino.jogo.trim().toUpperCase() === 'GGST') ? 'GGST' : 'SF6';
            document.getElementById('game-logo-bg').src = `assets/image/logos/${jogoValido}.png`;
            
            const pImg = document.getElementById('char-render-player');
            const eImg = document.getElementById('char-render-enemy');
            pImg.src = formatarCaminhoImagem(treino.jogo, treino.personagem);
            eImg.src = formatarCaminhoImagem(treino.jogo, treino.oponente);
            pImg.onload = () => pImg.style.opacity = "0.7";
            eImg.onload = () => eImg.style.opacity = "0.7";
            pImg.onerror = () => pImg.src = 'assets/image/personagens/SF6/Chun-Li.png';
            eImg.onerror = () => eImg.src = 'assets/image/personagens/SF6/Ryu.png';
        }
    } catch (err) { console.error("Erro no card principal:", err); }
}

document.getElementById('btn-timer').addEventListener('click', function() {
    if (!rodando) {
        rodando = true;
        this.innerText = "TREINANDO...";
        cronometro = setInterval(() => {
            if(tempoRestante <= 0) {
                clearInterval(cronometro);
                this.innerText = "FINALIZADO";
                rodando = false;
            } else {
                tempoRestante--;
                const min = Math.floor(tempoRestante / 60);
                const sec = tempoRestante % 60;
                document.getElementById('timer').innerText = 
                    `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
});