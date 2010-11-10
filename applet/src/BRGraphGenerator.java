import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 *
 * @author gmcwhirt
 */
public class BRGraphGenerator implements GraphGenerator {
    private CanvasImage ci;
    private int A, B, C, D;

    public BRGraphGenerator(int Ap, int Bp, int Cp, int Dp, int width, int height){
        A = Ap;
        B = Bp;
        C = Cp;
        D = Dp;

        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gs = ge.getDefaultScreenDevice();
        GraphicsConfiguration gc = gs.getDefaultConfiguration();

        ci = new CanvasImage(gc.createCompatibleImage(width, height, Transparency.BITMASK));
    }

    private float _lqresp(){
        if (A + C > 0){
            return 1f;
        } else if (A + C < 0){
            return 0f;
        } else if (A < 0) {
            return 0f;
        } else {
            return 1f;
        }
    }

    private float _lpresp(){
        if (B + D > 0){
            return 1f;
        } else if (B + D < 0){
            return 0f;
        } else if (D > 0){
            return 1f;
        } else {
            return 0f;
        }
    }

    @Override
    public CanvasImage getCImage(){
        return ci;
    }

    @Override
    public CanvasImage generate(){
        //draw stuff
        float lrespx = _lpresp();
        float lrespy = _lqresp();

        float qlim = (float)A / (float)(A + C);
        float plim = (float)D / (float)(B + D);

        //graph arrows
        int dots = 11; //effectively 10
        for (int x = 0; x <= dots; x++){
            for (int y = 0; y <= dots; y++){
                float xf = (float)x / (float)dots;
                float yf = (float)y / (float)dots;

                float xxf;
                float yyf;

                if (Float.isNaN(qlim) || Float.isInfinite(qlim)){
                    System.out.println("qlim is NaN");
                    if (A < 0){
                        yyf = 0f;
                    } else if (A > 0) {
                        yyf = 1f;
                    } else {
                        yyf = yf;
                    }
                } else if (xf < qlim){
                    yyf = lrespy;
                } else if (xf > qlim){
                    yyf = 1f - lrespy;
                } else {
                    yyf = yf;
                }

                if (Float.isNaN(plim) || Float.isInfinite(plim)){
                    System.out.println("plim is NaN");
                    if (D > 0){
                        xxf = 1f;
                    } else if (D < 0) {
                        xxf = 0f;
                    } else {
                        xxf = xf;
                    }
                } else if(yf < plim)
                {
                    xxf = lrespx;
                } else if (yf > plim){
                    xxf = 1f - lrespx;
                } else {
                    xxf = xf;
                }

                ci.drawArrow(xf, yf, xxf, yyf, Color.green, Color.black);
                ci.drawLine(xf, yf, xf, yf, Color.black);
            }
        }

        //row player response curve
        if (A + C > 0){
            if (qlim <= 1f && qlim >= 0f){
                ci.drawLine(0f, 1f, qlim, 1f, Color.red);
                ci.drawLine(qlim, 0f, 1f, 0f, Color.red);
                ci.drawLine(qlim, 0f, qlim, 1f, Color.red);
            } else if (qlim > 1f) {
                //play this
                ci.drawLine(0f, 1f, 1f, 1f, Color.red);
            } else {
                //play other
                ci.drawLine(0f, 0f, 1f, 0f, Color.red);
            }
        } else if (A + C < 0){
            if (qlim <= 1f && qlim >= 0f){
                ci.drawLine(0f, 0f, qlim, 0f, Color.red);
                ci.drawLine(qlim, 1f, 1f, 1f, Color.red);
                ci.drawLine(qlim, 0f, qlim, 1f, Color.red);
            } else if (qlim > 1f) {
                //play other
                ci.drawLine(0f, 0f, 1f, 0f, Color.red);
            } else {
                //play this
                ci.drawLine(0f, 1f, 1f, 1f, Color.red);
            }
        } else if (0 < A) {
            //play this
            ci.drawLine(0f, 1f, 1f, 1f, Color.red);
        } else if (0 > A) {
            //play other
            ci.drawLine(0f, 0f, 1f, 0f, Color.red);
        }

        //column player response curve
        if (B + D > 0){
            if (plim >= 0f && plim <= 1f){
                ci.drawLine(0f, 1f, 0f, plim, Color.blue);
                ci.drawLine(1f, plim, 1f, 0f, Color.blue);
                ci.drawLine(0f, plim, 1f, plim, Color.blue);
            } else if (plim > 1f){
                //play other
                ci.drawLine(1f, 1f, 1f, 0f, Color.blue);
            } else {
                //play this
                ci.drawLine(0f, 1f, 0f, 0f, Color.blue);
            }
        } else if (B + D < 0){
            if (plim >= 0f && plim <= 1f){
                ci.drawLine(0f, 0f, 0f, plim, Color.blue);
                ci.drawLine(1f, plim, 1f, 1f, Color.blue);
                ci.drawLine(0f, plim, 1f, plim, Color.blue);
            } else if (plim > 1f) {
                //play this
                ci.drawLine(0f, 1f, 0f, 0f, Color.blue);
            } else {
                //play other
                ci.drawLine(1f, 1f, 1f, 0f, Color.blue);
            }
        } else if (D > 0) {
            //play this
            ci.drawLine(1f, 0f, 1f, 1f, Color.blue);
        } else if (D < 0) {
            //play other
            ci.drawLine(0f, 0f, 0f, 1f, Color.blue);
        }

        return ci;
    }
}
