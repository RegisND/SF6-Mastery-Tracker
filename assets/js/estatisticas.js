async function renderizarGrafico() {
    try {
        const response = await fetch('http://localhost:5151/api/treino/estatisticas/por-fundamento');
        const dados = await response.json();

        if (dados.length === 0) {
            document.querySelector('.estatisticas-section').innerHTML += "<p style='text-align:center'>Nenhum dado de treino registrado ainda.</p>";
            return;
        }

        const labels = dados.map(item => item.fundamento);
        const valores = dados.map(item => item.totalMinutos);

        const ctx = document.getElementById('graficoEvolucao').getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Minutos Treinados',
                    data: valores,
                    backgroundColor: 'rgba(237, 28, 36, 0.6)', // Vermelho SF
                    borderColor: '#ed1c24',
                    borderWidth: 2
                }]
            },
            Options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#aaa' } },
                    x: { ticks: { color: '#aaa' } }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } }
                }
            }
        });
    } catch (error) {
        console.error("Erro ao carregar gráfico:", error);
    }
}

renderizarGrafico();