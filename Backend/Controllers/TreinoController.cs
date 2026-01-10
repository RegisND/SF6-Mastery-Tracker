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
        // 1. Busca o item na fila incluindo os dados da resposta (personagem/fundamento)
        var itemFila = await _context.FilaTreinos
            .Include(f => f.Resposta)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (itemFila == null) return NotFound();

        if (segundosRestantes > 0)
        {
            // SUCESSO: Marca como concluído
            itemFila.Concluido = true;

            // 2. CRIA O LOG DE HISTÓRICO PARA O BI
            var log = new HistoricoTreino
            {
                Id = Guid.NewGuid(),
                UserId = itemFila.UserId,
                RespostaId = itemFila.RespostaId,
                // FundamentoId = itemFila.Resposta!.FundamentoId,
                NivelInt = itemFila.NivelId,
                SegundosRestantes = segundosRestantes,
                DataConclusao = DateTime.UtcNow,
                Personagem = itemFila.Resposta.Personagem ?? "Chun-Li"
            };

            _context.HistoricoTreino.Add(log);
        }
        else
        {
            // FALHA: Joga para o fim da fila (regra que já tínhamos)
            var maiorOrdem = await _context.FilaTreinos.MaxAsync(f => f.OrdemFila);
            itemFila.OrdemFila = maiorOrdem + 1;
            itemFila.TentativasFalhas++;
        }

        await _context.SaveChangesAsync();
        return Ok(new { mensagem = "Round processado e histórico salvo", itemFila });
    }

    [HttpGet("estatisticas/por-fundamento")]
    public async Task<ActionResult> GetEstatisticasPorFundamento()
    {
        // 1. Buscamos os dados agrupados do banco (trazendo apenas o necessário)
        var dadosBrutos = await _context.HistoricoTreino
            .Include(h => h.Resposta) // Para pegar o nome do fundamento
            .GroupBy(h => h.Resposta.Nome)
            .Select(g => new
            {
                NomeFundamento = g.Key,
                Logs = g.Select(x => x.SegundosRestantes).ToList()
            })
            .ToListAsync();

        // 2. Agora o C# faz o cálculo (fora do banco de dados)
        var estatisticas = dadosBrutos.Select(d => new
        {
            Fundamento = d.NomeFundamento ?? "Outros",
            // Soma o tempo gasto: (15 min em seg - segundos que sobraram)
            TotalMinutos = Math.Round(d.Logs.Sum(seg => (15.0 * 60.0) - seg) / 60.0, 2),
            QuantidadeTreinos = d.Logs.Count
        })
        .OrderByDescending(x => x.TotalMinutos)
        .ToList();
        
        return Ok(estatisticas);
    }

    [HttpPost("cadastrar-fundamento")]
    public async Task<IActionResult> CadastrarFundamento([FromBody] RespostaTreino novoFundamento)
    {
        if (novoFundamento == null) return BadRequest("Dados inválidos");

        // 1. Salva o fundamento na biblioteca
        _context.RespostasTreino.Add(novoFundamento);
        await _context.SaveChangesAsync();

        // 2. Busca a última ordem para colocar no fim da fila
        var ultimaOrdem = await _context.FilaTreinos.AnyAsync()
            ? await _context.FilaTreinos.MaxAsync(f => f.OrdemFila)
            : 0;

        // 3. Cria a entrada na fila de treino
        var fila = new FilaTreino
        {
            Id = Guid.NewGuid(),
            RespostaId = novoFundamento.Id,
            UserId = Guid.Empty, // Ou o ID que você estiver usando para tests
            NivelId = 1,
            OrdemFila = ultimaOrdem + 1,
            Concluido = false,
            TentativasFalhas = 0
        };

        _context.FilaTreinos.Add(fila);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Fundamento consagrado!", Id = novoFundamento.Id});
    }
}