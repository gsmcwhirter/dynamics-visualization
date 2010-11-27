/**
 * Abstract picture generator class
 * 
 * @author gmcwhirt
 */
abstract class AbsGraphGenerator implements GraphGenerator {
    /**
     * The picture being generated
     *
     */
    protected CanvasImage ci;

    /**
     * Payoff values
     */
    protected int A, B, C, D, E, F, G, H;

    /**
     * Calculates the payoff for a type against the populations
     *
     * @param typ The type (index of pops)
     * @param pops The populations
     * @return The payoff for the type
     * @throws Exception
     */
    protected float payoff(int typ, float[] pops) throws Exception{
        return payoff(1- typ, typ, pops);
    }

    /**
     * Calculates the payoff for a type against the populations
     *
     * @param str A flag for the opponent's payoff
     * @param typ The type (index of pops)
     * @param pops The populations
     * @return The payoff for the type
     * @throws Exception
     */
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

    /**
     * Calculates the average payoff of a type against the population
     *
     * @param typ The type (index of pops)
     * @param pops The populations
     * @return The average payoff for the type
     * @throws Exception
     */
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

    /**
     * Calculates the derivatives
     *
     * @param xf The x parameter
     * @param yf The y parameter
     * @return A list (dx/dt, dy/dt) at (x,y)
     * @throws Exception
     */
    protected float[] dxydt(float xf, float yf){
        float[] pops = new float[2];
        pops[0] = xf;
        pops[1] = yf;

        float[] dxy = new float[2];

        try{
            dxy[0] = pops[0] * (payoff(1, 0, pops) - avg_payoff(0, pops));
        } catch (Exception e){
            dxy[0] = 0f;
        }

        try{
            dxy[1] = pops[1] * (payoff(0, 1, pops) - avg_payoff(1, pops));
        } catch (Exception e){
            dxy[1] = 0f;
        }

        return dxy;
    }
}
