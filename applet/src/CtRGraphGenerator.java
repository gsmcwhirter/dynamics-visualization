import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 *
 * @author gmcwhirt
 */
public class CtRGraphGenerator extends AbsGraphGenerator {
    private CanvasImage ci;
    //private int A, B, C, D, E, F, G, H;
    private float RKTimestep = 1e-3f;
    private float RKDuration = 5e1f;

    public CtRGraphGenerator(int Ap, int Bp, int Cp, int Dp, int Ep, int Fp, int Gp, int Hp, int width, int height){
        A = Ap;
        B = Bp;
        C = Cp;
        D = Dp;
        E = Ep;
        F = Fp;
        G = Gp;
        H = Hp;

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
        //we use RK4 for both populations
        float xf, yf, xxf, yyf;

        float yk1, yk2, yk3, yk4, xk1, xk2, xk3, xk4;
        float[] dxy;

        int colorct = 0;
        Color[] colors = new Color[2];
        colors[0] = Color.green;
        colors[1] = Color.yellow;

        int dots = 9;
        for (int x = 0; x <= dots; x++){
            for (int y = 0; y <= dots; y++){
                xf = (float)x / (float)dots;
                yf = (float)y / (float)dots;

                for (float t = 0; t < RKDuration; t += RKTimestep){
                    dxy = dxydt(xf, yf);
                    xk1 = dxy[0];
                    yk1 = dxy[1];

                    dxy = dxydt(xf, yf + RKTimestep * yk1 / 2f);
                    yk2 = dxy[1];

                    dxy = dxydt(xf, yf + RKTimestep * yk2 / 2f);
                    yk3 = dxy[1];

                    dxy = dxydt(xf, yf + RKTimestep * yk3);
                    yk4 = dxy[1];

                    yyf = yf + RKTimestep * (yk1 + 2 * yk2 + 2 * yk3 + yk4) / 6f;

                    dxy = dxydt(xf + RKTimestep * xk1 / 2f, yf);
                    xk2 = dxy[0];

                    dxy = dxydt(xf + RKTimestep * xk2 / 2f, yf);
                    xk3 = dxy[0];

                    dxy = dxydt(xf + RKTimestep * xk3, yf);
                    xk4 = dxy[0];

                    xxf = xf + RKTimestep * (xk1 + 2 * xk2 + 2 * xk3 + xk4) / 6f;

                    if (t == 0f){
                        ci.drawArrow(xf, yf, xxf, yyf, colors[colorct]);
                    } else {
                        ci.drawLine(xf, yf, xxf, yyf, colors[colorct]);
                    }

                    xf = xxf;
                    yf = yyf;
                }

                colorct++;
                if (colorct >= 2){
                    colorct = 0;
                }
            }
        }

        return ci;
    }

    private float[] dxydt(float xf, float yf){
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
