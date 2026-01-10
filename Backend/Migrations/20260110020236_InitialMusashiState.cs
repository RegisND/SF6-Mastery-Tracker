using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMusashiState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "configuracao_niveis",
                columns: table => new
                {
                    nivel = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slots_foco = table.Column<int>(name: "slots_foco!", type: "integer", nullable: false),
                    slots_distracao = table.Column<int>(type: "integer", nullable: false),
                    descricao_setup = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_configuracao_niveis", x => x.nivel);
                });

            migrationBuilder.CreateTable(
                name: "fundamentos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nome = table.Column<string>(type: "text", nullable: false),
                    descricao = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fundamentos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "respostas_treino",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Personagem = table.Column<string>(type: "text", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Foco = table.Column<string>(type: "text", nullable: false),
                    Distracao = table.Column<string>(type: "text", nullable: false),
                    Jogo = table.Column<string>(type: "text", nullable: false),
                    LimiteDerrotas = table.Column<int>(type: "integer", nullable: false),
                    NivelDisciplina = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_respostas_treino", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "fila_treino_diario",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    resposta_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nivel_id = table.Column<int>(type: "integer", nullable: false),
                    situacao = table.Column<string>(type: "text", nullable: false, defaultValue: "Neutro"),
                    acao_principal = table.Column<string>(type: "text", nullable: false, defaultValue: "Pulo Frente"),
                    acao_distracao = table.Column<string>(type: "text", nullable: false, defaultValue: "Nada/Andar"),
                    ordem_fila = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    concluido = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    tentativas_falhas = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    data_programada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fila_treino_diario", x => x.id);
                    table.ForeignKey(
                        name: "FK_fila_treino_diario_respostas_treino_resposta_id",
                        column: x => x.resposta_id,
                        principalTable: "respostas_treino",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "historico_treino",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    resposta_id = table.Column<Guid>(type: "uuid", nullable: false),
                    fundamento_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nivel_int = table.Column<int>(type: "integer", nullable: false),
                    segundos_restantes = table.Column<int>(type: "integer", nullable: false),
                    data_conclusao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    personagem = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_historico_treino", x => x.id);
                    table.ForeignKey(
                        name: "FK_historico_treino_respostas_treino_resposta_id",
                        column: x => x.resposta_id,
                        principalTable: "respostas_treino",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fila_treino_diario_resposta_id",
                table: "fila_treino_diario",
                column: "resposta_id");

            migrationBuilder.CreateIndex(
                name: "IX_historico_treino_resposta_id",
                table: "historico_treino",
                column: "resposta_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "configuracao_niveis");

            migrationBuilder.DropTable(
                name: "fila_treino_diario");

            migrationBuilder.DropTable(
                name: "fundamentos");

            migrationBuilder.DropTable(
                name: "historico_treino");

            migrationBuilder.DropTable(
                name: "respostas_treino");
        }
    }
}
