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
    // [HttpGet]
    // public async Task<ActionResult<IEnumerable<FilaTreino>>> GetFila()   {
    //     // Por enquanto, como não temos login, vamos passar um GUID qualquer ou
    //     // buscar todos. Para teste, vamos buscar os 4 primeiros da fila.
    //     return await _context.FilaTreinos
    //         .Include(f => f.Resposta)
    //         .Where(f => f.Concluido == false)
    //         .OrderBy(f => f.OrdemFila)
    //         .Take(4)
    //         .ToListAsync();
    // }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FilaTreino>>> GetFila()
    {
        var lista = await _context.FilaTreinos
            .Include(f => f.Resposta)
            .Where(f => f.Concluido == false)
            .OrderBy(f => f.OrdemFila)
            .ToListAsync();

        return Ok(lista);
    }

    // POST: api/treino/finalizar-round/{id}
    [HttpPost("finalizar-round/{id}")]
    public async Task<IActionResult> FinalizarRound(Guid id, [FromQuery] int segundosRestantes)
    {
        var itemFila = await _context.FilaTreinos.FindAsync(id);
        if (itemFila == null) return NotFound();
        
        if (segundosRestantes > 0)
        {
            // SUCESSO: Marca como concluído
            itemFila.Concluido = true;
        }
        else
        {
            // FALHA: Joga para o fim da fila
            var maiorOrdem = await _context.FilaTreinos.MaxAsync(f => f.OrdemFila);
            itemFila.OrdemFila = maiorOrdem + 1;
            itemFila.TentativasFalhas++;
        }

        await _context.SaveChangesAsync();
        return Ok(new { mensagem = "Round processado", itemFila });
    }
}