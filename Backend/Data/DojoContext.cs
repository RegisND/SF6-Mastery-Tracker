using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class DojoContext : DbContext
{
    public DojoContext(DbContextOptions<DojoContext> options) : base(options) { }
    public DbSet<Treino> Treinos => Set<Treino>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Treino>(entity =>
        {
            entity.ToTable("progresso_treino");
            // Mapeando cada coluna para o nome exato (minúsculo) do banco
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Personagem).HasColumnName("personagem");
            entity.Property(e => e.Oponente).HasColumnName("oponente");
            entity.Property(e => e.Fundamento).HasColumnName("fundamento");
            entity.Property(e => e.Categoria).HasColumnName("categoria");
            entity.Property(e => e.Nivel).HasColumnName("nivel");
            entity.Property(e => e.SlotsAtivos).HasColumnName("slots_ativos");
            entity.Property(e => e.BotaoAtaque).HasColumnName("botao_ataque");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.TempoLimiteMinutos).HasColumnName("tempo_limite_minutos");
            entity.Property(e => e.Prioridade).HasColumnName("prioridade");
            entity.Property(e => e.DataAtualizacao).HasColumnName("data_atualizacao");
        });
    }
}