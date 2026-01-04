namespace Backend.Models;

public class FilaTreino
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; } // Identificador do utilizador no Supabase Auth
    public Guid RespostaId { get; set; }
    public int NivelId { get; set; }
    public string Situacao { get; set; } = "Neutro"; // Neutro, Tech Hit, etc.
    public string AcaoPrincipal { get; set; } = "Pulo Frontal";
    public string AcaoDistracao { get; set; } = "Nada/Andar";

    public int OrdemFila { get; set; } // Para gerir o final da fila
    public bool Concluido { get; set; }
    public int TentativasFalhas { get; set; }
    public DateTime DataProgramada { get; set; }

    // Propriedades de navegação para facilitar o JSON no Frontend
    public virtual RespostaTreino? Resposta { get; set; }
}