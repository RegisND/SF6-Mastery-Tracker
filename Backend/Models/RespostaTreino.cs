namespace Backend.Models;

public class RespostaTreino
{
    public Guid Id { get; set; }
    public string Personagem { get; set; } = null!;
    public string Nome { get; set; } = null!;
    public string Foco { get; set; } = null!;
    public string Distracao { get; set; } = null!;

    // CAMPOS NOVOS:
    public string Jogo { get; set; } = "SF6"; // NOVO: "SF6" ou "GGST"
    public int LimiteDerrotas { get; set; } = 2; // Sua trava anti-vício.
    public int NivelDisciplina { get; set; } = 1; // NOVO: 1 a 7 (Musashi Levels)
}