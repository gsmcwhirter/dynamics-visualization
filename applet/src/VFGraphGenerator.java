import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 * Generates a vector field picture
 * @author gmcwhirt
 */
public class VFGraphGenerator extends AbsGraphGenerator {
    /*
     * The grid is:
     *      A, B    |   C, D
     *      E, F    |   G, H
     */

    /**
     * Constructor
     * @param Ap Payoff A
     * @param Bp Payoff B
     * @param Cp Payoff C
     * @param Dp Payoff D
     * @param Ep Payoff E
     * @param Fp Payoff F
     * @param Gp Payoff G
     * @param Hp Payoff H
     * @param width The width of the image to generate
     * @param height The height of the image to generate
     */
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

    /**
     * Gets the image generated
     * @return the image generated
     */
    @Override
    public CanvasImage getCImage(){
        return ci;
    }

    /**
     * Generates the image
     * @return The image generated
     */
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

}
