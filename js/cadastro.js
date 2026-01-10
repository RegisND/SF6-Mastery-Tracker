document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoFundamento = {
        jogo: document.getElementById('jogo').value,
        personagem: document.getElementById('personagem').value,
        nome: document.getElementById('nome').value,
        foco: document.getElementById('foco').value,
        distracao: document.getElementById('distracao').value,
        limiteDerrotas: parseInt(document.getElementById('limiteDerrotas').value),
        nivelDisciplina: 1
    };

    try {
        const response = await fetch('http://localhost:5151/api/treino/cadastrar-fundamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFundamento)
        });

        if (response.ok) {
            alert("Fundamento consagrado! O caminho foi traçado.");
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            console.error("Erro do servidor:", errorData);
            alert("Erro ao cadastrar. " + (errorData.message || "Verifique o console"));
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Falha na conexão com o Dojo. O servidor está rodando?");
    }
});