using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TreinoController : ControllerBase
{
    private readonly DojoContext _context;

    public TreinoController(DojoContext context)
    {
        _context = context;
    }

    // GET: api/treino (Para o dashboard ver o nível atual)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Treino>>> GetTreinos()
    {
        return await _context.Treinos.ToListAsync();
    }

    // POST: api/treino/concluir/id (Para quando eu terminar as 100 repetições)
    [HttpPost("concluir/{id}")]
    public async Task<IActionResult> ConcluirNivel(Guid id)
    {
        var treino = await _context.Treinos.FindAsync(id);
        if (treino == null) return NotFound();

        // Lógica Shu-Ha-Ri: Avançar para o próximo estágio
        treino.Nivel++;

        // Aqui o sistema atualiza automaticamente os slots ativos no banco
        // Conforme a dificuldade do próximo nível
        if (treino.SlotsAtivos < 8) treino.SlotsAtivos++;

        treino.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(treino);
    }

    [HttpPost("finalizar-round/{id}")]
    public async Task<IActionResult> FinalizarRound(Guid id, [FromQuery] int segundosRestantes)
    {
        var treino = await _context.Treinos.FindAsync(id);
        if (treino == null) return NotFound();

        if (segundosRestantes > 0)
        {
            // SUCESSO: Subir de nível seguindo a regra de slots
            treino.Nivel++;
            if (treino.SlotsAtivos < 8) treino.SlotsAtivos++;
            treino.Status = "Em curso";

            // Aqui poderíamos salvar o "bônus" de tempo se quiséssemos, 
            // mas por enquanto vamosfocar na progressão.
        }
        else
        {
            // FALHA: Tempo esgotado
            treino.Status = "Falha - Tentar amanhã";
        }

        treino.DataAtualizacao = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(new { mensagem = "Round processado", treino, bonusSugerido = segundosRestantes});
    }
}