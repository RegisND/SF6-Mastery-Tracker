using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class NivelStack
{
    [Key]
    public int Nivel { get; set; }
    public int SlotsFoco { get; set; }
    public int SlotsDistracao { get; set; }
    public string DescricaoSetup { get; set; } = string.Empty;
}