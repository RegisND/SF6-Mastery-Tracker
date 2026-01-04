namespace Backend.Models;

public class Fundamento
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty; // Ex.: Anti-Aéreo
    public string? Descricao { get; set; }
}