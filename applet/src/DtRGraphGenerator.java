import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 * Discrete-time replicator graph generator
 * @author gmcwhirt
 */
public class DtRGraphGenerator extends AbsGraphGenerator {
    /*
     * The grid is:
     *      A, B    |   C, D
     *      E, F    |   G, H
     */

    /**
     * Tolerance for fixation
     */
    private float tolerance = 1e-5f;

    /**
     * Constructor
     *
     * @param Ap Payoff A
     * @param Bp Payoff B
     * @param Cp Payoff C
     * @param Dp Payoff D
     * @param Ep Payoff E
     * @param Fp Payoff F
     * @param Gp Payoff G
     * @param Hp Payoff H
     * @param width The width of the picture
     * @param height The height of the picture
     */
    public DtRGraphGenerator(int Ap, int Bp, int Cp, int Dp, int Ep, int Fp, int Gp, int Hp, int width, int height){
        A = Ap;
        B = Bp;
        C = Cp;
        D = Dp;
        E = Ep;
        F = Fp;
        G = Gp;
        H = Hp;

        int min;

        //adjust all payoffs to be non-negative
        min = Math.min(Math.min(A, C), Math.min(E, G));
        if (min < 0){
            A -= min;
            C -= min;
            E -= min;
            G -= min;
        }

        min = Math.min(Math.min(B, D), Math.min(F, H));
        if (min < 0){
            B -= min;
            D -= min;
            F -= min;
            H -= min;
        }

        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gs = ge.getDefaultScreenDevice();
        GraphicsConfiguration gc = gs.getDefaultConfiguration();

        ci = new CanvasImage(gc.createCompatibleImage(width, height, Transparency.BITMASK));
    }

    /**
     * Get the generated image
     * @return The generated image
     */
    @Override
    public CanvasImage getCImage(){
        return ci;
    }

    /**
     * Generate the image
     * @return The generated image
     */
    @Override
    public CanvasImage generate(){

        float[] oldxy;
        float[] newxy;

        Color[] colors = new Color[2];
        colors[0] = Color.green;
        colors[1] = Color.yellow;

        int colorct = 0;
        int ptct = 0;

        int dots = 9;
        float[][] endpoints = new float[(dots + 1) * (dots + 1)][2];
        float[][] startpoints = new float[(dots + 1) * (dots + 1)][2];

        for (int x = 0; x <= dots; x++){
            for (int y = 0; y <= dots; y++){

                oldxy = new float[2];
                newxy = new float[2];
                newxy[0] = (float)x / (float)dots;
                newxy[1] = (float)y / (float)dots;

                startpoints[ptct] = newxy.clone();

                do {
                    oldxy = newxy.clone();
                    newxy = genstep(oldxy);

                    ci.drawArrow(oldxy[0], oldxy[1], newxy[0], newxy[1], colors[colorct]);
                } while (Math.abs(oldxy[0] - newxy[0]) > tolerance || Math.abs(oldxy[1] - newxy[1]) > tolerance);

                endpoints[ptct] = newxy;

                ptct++;

                colorct++;
                if (colorct >= 2){
                    colorct = 0;
                }
            }
        }

        for (int i = 0; i < (dots + 1) * (dots + 1); i++){
            ci.drawLine(startpoints[i][0], startpoints[i][1], startpoints[i][0], startpoints[i][1], Color.black);
            ci.drawDot(endpoints[i][0], endpoints[i][1], 5f, Color.black);
        }

        return ci;
    }

    /**
     * Calculate the next population proportions
     * @param oldxy The old population proportions
     * @return The new population proportions
     */
    private float[] genstep(float[] oldxy){
        float[] newxy = new float[2];

        try {
            float avg0 = avg_payoff(0, oldxy);
            float avg1 = avg_payoff(1, oldxy);

            if (avg0 != 0f){
                newxy[0] = (.1f + payoff(0, oldxy)) * oldxy[0] / (.1f + avg0);
            } else {
                newxy[0] = oldxy[0];
            }

            if (avg1 != 0f){
                newxy[1] = (.1f + payoff(1, oldxy)) * oldxy[1] / (.1f + avg1);
            } else {
                newxy[1] = oldxy[1];
            }
        } catch (Exception e){
            newxy = oldxy;
        }

        return newxy;
    }
}
