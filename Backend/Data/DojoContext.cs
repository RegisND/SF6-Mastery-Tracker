using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class DojoContext : DbContext
    {
        public DojoContext(DbContextOptions<DojoContext> options) : base(options) { }

        // Tabelas para o Sistema SaaS e Mental Stack
        public DbSet<Fundamento> Fundamentos { get; set; }
        public DbSet<RespostaTreino> RespostasTreino { get; set; }
        public DbSet<FilaTreino> FilaTreinos { get; set; }
        public DbSet<NivelStack> NiveisStack { get; set; } // Caso queira mapear a tabela de configurações
        public DbSet<HistoricoTreino> HistoricoTreino { get; set; }
        public DbSet<Personagem> Personagens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Mapeamento da Tabela Fundamentos
            modelBuilder.Entity<Fundamento>(entity =>
            {
                entity.ToTable("fundamentos");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nome).HasColumnName("nome").IsRequired();
                entity.Property(e => e.Descricao).HasColumnName("descricao");
            });

            // Mapeamento da Tabela RespostasTreino
            modelBuilder.Entity<RespostaTreino>(entity =>
            {
                entity.ToTable("respostas_treino");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Personagem).IsRequired();
                entity.Property(e => e.Nome).IsRequired();
                entity.Property(e => e.Foco);
                entity.Property(e => e.Distracao);
                entity.Property(e => e.Jogo);
                entity.Property(e => e.LimiteDerrotas);
                entity.Property(e => e.NivelDisciplina);

                // Relacionamento Resposta -> Fundamento
                // entity.HasOne<Fundamento>()
                    //   .WithMany()
                    //   .HasForeignKey(e => e.FundamentoId);
            });

            // Mapeamento da Tabela FilaTreino (O coração do SaaS)
            modelBuilder.Entity<FilaTreino>(entity =>
            {
                entity.ToTable("fila_treino_diario");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired(false);
                entity.Property(e => e.RespostaId).HasColumnName("resposta_id");
                entity.Property(e => e.NivelId).HasColumnName("nivel_id");
                entity.Property(e => e.Situacao).HasColumnName("situacao").HasDefaultValue("Neutro");
                entity.Property(e => e.AcaoPrincipal).HasColumnName("acao_principal").HasDefaultValue("Pulo Frente");
                entity.Property(e => e.AcaoDistracao).HasColumnName("acao_distracao").HasDefaultValue("Nada/Andar");
                entity.Property(e => e.OrdemFila).HasColumnName("ordem_fila").ValueGeneratedOnAdd();
                entity.Property(e => e.Concluido).HasColumnName("concluido").HasDefaultValue(false);
                entity.Property(e => e.TentativasFalhas).HasColumnName("tentativas_falhas").HasDefaultValue(0);
                entity.Property(e => e.DataProgramada).HasColumnName("data_programada");

                // Relacionamento Fila -> Resposta
                entity.HasOne(e => e.Resposta)
                      .WithMany()
                      .HasForeignKey(e => e.RespostaId);
            });

            modelBuilder.Entity<NivelStack>(entity =>
            {
                entity.ToTable("configuracao_niveis");
                entity.HasKey(e => e.Nivel);
                entity.Property(e => e.Nivel).HasColumnName("nivel");
                entity.Property(e => e.SlotsFoco).HasColumnName("slots_foco!");
                entity.Property(e => e.SlotsDistracao).HasColumnName("slots_distracao");
                entity.Property(e => e.DescricaoSetup).HasColumnName("descricao_setup");
            });

            modelBuilder.Entity<HistoricoTreino>(entity =>
            {
                entity.ToTable("historico_treino");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired(false);
                entity.Property(e => e.RespostaId).HasColumnName("resposta_id");
                entity.Property(e => e.FundamentoId).HasColumnName("fundamento_id");
                entity.Property(e => e.NivelInt).HasColumnName("nivel_int");
                entity.Property(e => e.SegundosRestantes).HasColumnName("segundos_restantes");
                entity.Property(e => e.DataConclusao).HasColumnName("data_conclusao");
                entity.Property(e => e.Personagem).HasColumnName("personagem");
                entity.HasOne(d => d.Resposta)
                    .WithMany()
                    .HasForeignKey(d => d.RespostaId);  
            });
            
            base.OnModelCreating(modelBuilder);
        }
    }
}