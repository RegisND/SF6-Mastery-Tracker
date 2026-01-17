using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("personagens")] // Força o EF a usar o nome exato da tabela do banco
public class Personagem
{
    [Column("id")] // Mapeia para 'id' minúsculo
    public Guid Id { get; set; }

    [Column("nome")] // Mapeia para 'nome' minúsculo
    public string Nome { get; set; } = string.Empty;

    [Column("jogo")] // Mapeia para 'jogo' minúsculo
    public string Jogo { get; set; } = string.Empty;
    
    [Column("imagem_slug")] // Mapeia o nome da coluna do banco para a propriedade
    public string ImagemSlug { get; set; } = string.Empty;
}