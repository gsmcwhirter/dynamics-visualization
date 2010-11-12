import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 *
 * @author gmcwhirt
 */
public class DtRGraphGenerator extends AbsGraphGenerator {
    private CanvasImage ci;
    /*
     * The grid is:
     *      A, B    |   C, D
     *      E, F    |   G, H
     */
    //private int A, B, C, D, E, F, G, H;

    private float tolerance = 1e-5f;

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

        System.out.println(A);
        System.out.println(B);
        System.out.println(C);
        System.out.println(D);
        System.out.println(E);
        System.out.println(F);
        System.out.println(G);
        System.out.println(H);


        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gs = ge.getDefaultScreenDevice();
        GraphicsConfiguration gc = gs.getDefaultConfiguration();

        ci = new CanvasImage(gc.createCompatibleImage(width, height, Transparency.BITMASK));
    }

    @Override
    public CanvasImage getCImage(){
        return ci;
    }

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

                System.out.println("new");

                System.out.print(newxy[0]);
                System.out.print(", ");
                System.out.println(newxy[1]);

                do {
                    oldxy = newxy.clone();
                    newxy = genstep(oldxy);

                    System.out.print(newxy[0]);
                    System.out.print(", ");
                    System.out.println(newxy[1]);

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
