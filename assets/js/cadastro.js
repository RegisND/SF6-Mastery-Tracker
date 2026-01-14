document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Montando o objeto exatamente como o Backend RespostaTreino.cs espera
        const dados = {
            nome: document.getElementById('nome').value,
            personagem: document.getElementById('personagem').value,
            oponente: document.getElementById('oponente').value,
            foco: document.getElementById('foco').value,
            distracao: document.getElementById('distracao').value,
            jogo: document.getElementById('jogo').value,
            nivelDisciplina: parseInt(document.getElementById('nivelDisciplina').value),
            limiteDerrotas: 2 // Valor padrão
        };

        try {
            const response = await fetch('http://localhost:5151/api/treino/cadastrar-fundamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("⚔️ Fundamento Consagrado com Sucesso!");
                window.location.href = 'index.html'; // Volta para o dashboard
            } else {
                const erro = await response.text();
                alert("Falha ao consagrar: " + erro);
            }
        } catch (err) {
            console.error("Erro na conexão:", err);
            alert("O Dojo está offline ou houve um erro de conexão.");
        }
    });
});