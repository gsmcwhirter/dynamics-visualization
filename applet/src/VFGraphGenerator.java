import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 *
 * @author gmcwhirt
 */
public class VFGraphGenerator extends AbsGraphGenerator {
    /*
     * The grid is:
     *      A, B    |   C, D
     *      E, F    |   G, H
     */
    private CanvasImage ci;
    //private int A, B, C, D, E, F, G, H;

    public VFGraphGenerator(int Ap, int Bp, int Cp, int Dp, int Ep, int Fp, int Gp, int Hp, int width, int height){
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

        float xf;
        float yf;
        float[] dxy;

        int dots = 9;
        for (int x = 0; x <= dots; x++){
            for (int y = 0; y <= dots; y++){
                xf = (float)x / (float)dots;
                yf = (float)y / (float)dots;

                try{
                    dxy = dxydt(xf, yf);
                } catch(Exception e){
                    dxy = new float[2];
                    dxy[0] = 0f;
                    dxy[1] = 0f;
                }

                ci.drawArrow(xf, yf, xf + dxy[0], yf + dxy[1], Color.gray);
            }
        }

        return ci;
    }

    private float[] dxydt(float xf, float yf) throws Exception{
        float[] pops = new float[2];
        pops[0] = xf;
        pops[1] = yf;

        float[] dxy = new float[2];

        dxy[0] = pops[0] * (payoff(1, 0, pops) - avg_payoff(0, pops));
        dxy[1] = pops[1] * (payoff(0, 1, pops) - avg_payoff(1, pops));

        return dxy;
    }
}
