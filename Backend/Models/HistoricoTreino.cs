using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class HistoricoTreino
{
    [Key]
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public Guid RespostaId { get; set; }
    public Guid FundamentoId { get; set; }
    public int NivelInt { get; set; }
    public int SegundosRestantes { get; set; }
    public DateTime DataConclusao { get; set; } = DateTime.UtcNow;
    public string Personagem { get; set; } = string.Empty;
}