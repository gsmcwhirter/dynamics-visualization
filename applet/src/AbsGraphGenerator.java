/**
 *
 * @author gmcwhirt
 */
abstract class AbsGraphGenerator implements GraphGenerator {
    protected int A, B, C, D, E, F, G, H;

    protected float payoff(int typ, float[] pops) throws Exception{
        return payoff(1- typ, typ, pops);
    }

    protected float payoff(int str, int typ, float[] pops) throws Exception{
        //typ 0  is the column and typ 1 is the row
        /*
         * The grid is:
         *      A, B    |   C, D
         *      E, F    |   G, H
         */

        int opp = 1 - typ;
        float opp0 = pops[opp]; // this is the right col or top row
        float opp1 = 1f - opp0; // this is the left col or bottom row
        float score = 0f;

        switch (typ){
            case 1:
                //row player
                if (str == 0){
                    score = (float)A * opp1 + (float)C * opp0;
                } else if (str == 1){
                    score = (float)E * opp1 + (float)G * opp0;
                } else {
                    throw new Exception("Invalid str parameter");
                }
                break;
            case 0:
                //column player
                if (str == 0){
                    score = (float)B * opp0 + (float)F * opp1;
                } else if (str == 1){
                    score = (float)D * opp0 + (float)H * opp1;
                } else {
                    throw new Exception("Invalid str parameter");
                }
                break;
            default:
                throw new Exception("Invalid type parameter");
        }

        return score;
    }

    protected float avg_payoff(int typ, float[] pops) throws Exception{
        float score = 0f;

        /*
         * The grid is:
         *      A, B    |   C, D
         *      E, F    |   G, H
         */

        score = pops[typ] * payoff(1- typ, typ, pops) + (1f - pops[typ]) * payoff(typ, typ, pops);

        return score;
    }
}
