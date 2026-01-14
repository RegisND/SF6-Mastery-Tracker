using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class RespostaTreino
{   
    [Column("id")] // ADICIONE ESTA LINHA
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [Column("personagem")]
    [JsonPropertyName("personagem")]
    public string Personagem { get; set; } = null!;

    [Column("oponente")]
    [JsonPropertyName("oponente")]
    public string Oponente { get; set; } = null!;

    [Column("nome")]
    [JsonPropertyName("nome")]
    public string Nome { get; set; } = null!;

    [Column("foco")]
    [JsonPropertyName("foco")]
    public string Foco { get; set; } = null!;

    [Column("distracao")]
    [JsonPropertyName("distracao")]
    public string Distracao { get; set; } = null!;

    [Column("jogo")]
    [JsonPropertyName("jogo")]
    public string Jogo { get; set; } = "SF6";

    [Column("limite_derrotas")]
    [JsonPropertyName("limiteDerrotas")]
    public int LimiteDerrotas { get; set; } = 2;

    [Column("nivel_disciplina")]
    [JsonPropertyName("nivelDisciplina")]
    public int NivelDisciplina { get; set; } = 1;
}