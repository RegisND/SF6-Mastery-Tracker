let tempoRestante = 15 * 60;
let cronometro;
let rodando = false;

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

async function carregarDados() {
    try {
        const response = await fetch('http://localhost:5151/api/treino/fila');
        const data = await response.json();

        if (data && data.length > 0) {
            const treino = data[0].resposta;

            document.getElementById('titulo-treino').innerText = treino.nome.toUpperCase();
            document.getElementById('foco-acao').innerText = treino.foco;
            document.getElementById('distracao-acao').innerText = treino.distracao;
            document.getElementById('nivel-id').innerText = treino.nivelDisciplina;

            document.getElementById('game-logo-bg').src = `assets/image/logos/${treino.jogo}.png`;
            
            const pImg = document.getElementById('char-render-player');
            const eImg = document.getElementById('char-render-enemy');
            pImg.src = `assets/image/personagens/${treino.personagem.trim()}.png`;
            eImg.src = `assets/image/personagens/${treino.oponente.trim()}.png`;

            pImg.onload = () => pImg.style.opacity = "0.7";
            eImg.onload = () => eImg.style.opacity = "0.7";

            const corHex = treino.jogo === "SF6" ? "#ff00ff" : "#ffcc00";
            const corRgb = hexToRgb(corHex);
            document.documentElement.style.setProperty('--sf-pink-rgb', corRgb);
            document.querySelector('.circle-1').style.background = `rgba(${corRgb}, 1)`;
        }
    } catch (err) { console.error(err); }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    
    const card = document.querySelector(".form-musashi");
    if (card) {
        // Removemos qualquer inicialização anterior para evitar conflito
        if (card.vanillaTilt) card.vanillaTilt.destroy();
        
        VanillaTilt.init(card, {
            max: 10,
            speed: 400,
            glare: true,             // Ativa o brilho
            "max-glare": 0.3,          // Força o brilho ao máximo para testarmos
            "glare-prerender": false, 
            perspective: 1000,
            scale: 1.02,
            "full-page-listening": false, // Garante que o tilt só ocorra no card
            // gyroscope: true          // Adicional para mobile
        });
    }
});

document.getElementById('btn-timer').addEventListener('click', function() {
    if (!rodando) {
        rodando = true;
        this.innerText = "TREINANDO...";
        cronometro = setInterval(() => {
            if(tempoRestante <= 0) {
                clearInterval(cronometro);
                this.innerText = "FINALIZADO";
            } else {
                tempoRestante--;
                const min = Math.floor(tempoRestante / 60);
                const sec = tempoRestante % 60;
                document.getElementById('timer').innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
});