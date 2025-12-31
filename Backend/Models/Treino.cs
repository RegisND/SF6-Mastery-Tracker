namespace Backend.Models;

public class Treino
{
    public Guid Id { get; set; }
    public string Personagem { get; set; } = string.Empty;
    public string Oponente { get; set; } = "Generico";
    public string Fundamento { get; set; } = string.Empty;
    public string Categoria { get; set; } = "Neutro"; // Neutro, Ataque, Defesa, Combo
    public int Nivel { get; set; }
    public int SlotsAtivos { get; set; }
    public string BotaoAtaque { get; set; } = "Chute Médio";
    public string Status { get; set; } = "Em curso"; // Em curso, Falha, Concluído
    public int TempoLimiteMinutos { get; set; } = 15;
    public int Prioridade { get; set; } = 1; // 1 (Alta) a 5 (Baixa)
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;
}