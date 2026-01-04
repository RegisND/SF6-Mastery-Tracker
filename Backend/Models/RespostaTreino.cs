namespace Backend.Models;

public class RespostaTreino
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty; // Ex.: st.MK
    public string? Comando { get; set; }
    public string Personagem { get; set; } = "Chun-Li";
    public Guid FundamentoId { get; set; }
    public Guid? UserId { get; set; } // Nulo se for uma resposta padrão do sistema
}