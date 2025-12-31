namespace Backend.Services;

public class TreinoService
{
    public (int slotsPulo, int slotsNada, int slotsNeutro) CalcularConfiguracaoSlots(int nivel)
    {
        // Regra baseada no seguinte plano: Nível 1 começa com 1 slot de pulo.
        // À medida que o nível sobe, preenchemos os 8 slots totais do jogo.

        int totalSlots = 8;
        int slotsPulo = 1;
        int slotsNada = 0;
        int slotsNeutro = 0;

        if (nivel == 1)
        {
            return (1, 7, 0); // 1 Pulo para frente, 7 sem fazer nada
        }

        // Lógica de progressão para os níveis subsequentes (Fase Ha)
        // Aumenta a complexidade misturando Pulo Neutro e "Nada"
        if (nivel <= 4)
        {
            slotsPulo = nivel;
            slotsNeutro = 1;
            slotsNada = totalSlots - (slotsPulo + slotsNeutro);
        }
        else
        {
            // Níveis avançados: Reduz o Pulo para frente para testar a reação pura (Ri)
            slotsPulo = 1;
            slotsNeutro = 1;
            slotsNada = 6;
        }

        return (slotsPulo, slotsNada, slotsNeutro);
    }
}