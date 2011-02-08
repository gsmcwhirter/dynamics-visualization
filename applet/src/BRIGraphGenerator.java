import java.awt.Color;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Transparency;

/**
 *
 * @author gmcwhirt
 */
public class BRIGraphGenerator extends AbsGraphGenerator {

    /**
     * Constructor
     * @param Ap Normalized payoff A
     * @param Bp Normalized payoff B
     * @param Cp Normalized payoff C
     * @param Dp Normalized payoff D
     * @param width The width of the picture
     * @param height The height of the picture
     */
    public BRIGraphGenerator(int Ap, int Bp, int Cp, int Dp, int width, int height){
        A = Ap;
        B = Bp;
        C = Cp;
        D = Dp;

        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gs = ge.getDefaultScreenDevice();
        GraphicsConfiguration gc = gs.getDefaultConfiguration();

        ci = new CanvasImage(gc.createCompatibleImage(width, height, Transparency.BITMASK));
    }

    /**
     * Get the q-border (q for player 2)
     * @return The q-border
     */
    private float _lqresp(){
        if (A + C > 0){
            return 1f;
        } else if (A + C < 0){
            return 0f;
        } else if (A < 0) {
            return 0f;
        } else if (A > 0) {
            return 1f;
        } else {
            return Float.NaN;
        }
    }

    /**
     * Get the p-border (p for player 1)
     * @return The p-border
     */
    private float _lpresp(){
        if (B + D > 0){
            return 1f;
        } else if (B + D < 0){
            return 0f;
        } else if (D > 0){
            return 1f;
        } else if (D < 0) {
            return 0f;
        } else {
            return Float.NaN;
        }
    }

    /**
     * Get the generated image
     * @return The generated image
     */
    @Override
    public CanvasImage getCImage(){
        return ci;
    }

    protected void _drawFrom(float xf, float yf, Color color){

    }

    /**
     * Generates the picture
     * @return The generated picture
     */
    @Override
    public CanvasImage generate(){

        float lrespx = _lpresp();
        float lrespy = _lqresp();

        float qlim = (float)A / (float)(A + C); // mark on the x axis
        float plim = (float)D / (float)(B + D); // mark on the y axis

        Color[] colors = new Color[2];
        colors[0] = Color.green;
        colors[1] = Color.yellow;

        int colorct = 0;
        int ptct = 0;

        float xf, yf, xxf, yyf;
        boolean done, skipdraw;
        float m, b;
        float hitpx, hitpy, hitqx, hitqy;
        float pdist, qdist;
        float xfl, yfl;

        //graph arrows
        int dots = 9; //effectively 10
        float[][] startpoints = new float[(dots + 1) * (dots + 1)][2];
        float[] startpt;

        for (int x = 0; x <= dots; x++){
            for (int y = 0; y <= dots; y++){
                xf = (float)x / (float)dots;
                yf = (float)y / (float)dots;

                startpt = new float[2];
                startpt[0] = xf;
                startpt[1] = yf;

                startpoints[ptct++] = startpt;

                done = false;

                int iterations = 0;

                System.out.println("");
                System.out.print("Starting at ");
                System.out.print(xf);
                System.out.print(",");
                System.out.println(yf);

                xfl = xf;
                yfl = yf;

                do {
                    skipdraw = false;
                    iterations++;
                    System.out.print("iteration ");
                    System.out.println(iterations);
                    if (xf == qlim && yf == plim){
                        xxf = xf;
                        yyf = yf;
                    }
                    else if(xf == qlim)
                    {
                        if (xfl < qlim){
                            //moving left to right
                            xxf = xf + 0.00001f;
                            yyf = yf;
                            skipdraw = true;
                        }
                        else if (xfl > qlim){
                            //moving right to left
                            xxf = xf - 0.00001f;
                            yyf = yf;
                            skipdraw = true;
                        }
                        else {
                            //stayed on the line -- stay put on x
                            xxf = qlim;
                            yyf = yf;
                        }
                    }
                    else if (yf == plim){
                        if (yfl < plim){
                            //moving upward
                            yyf = yf + 0.00001f;
                            xxf = xf;
                            skipdraw = true;
                        }
                        else if (yfl > plim){
                            //moving downward
                            yyf = yf - 0.00001f;
                            xxf = xf;
                            skipdraw = true;
                        }
                        else {
                            //stayed on the line -- stay put on y
                            xxf = xf;
                            yyf = plim;
                        }
                    }
                    else if(xf < qlim && yf < plim)
                    {
                        if (lrespx > qlim || lrespy > plim){
                            m = (lrespy - yf) / (lrespx - xf);
                            b = yf - m * xf;

                            hitpx = (plim - b) / m;
                            hitpy = plim;

                            hitqx = qlim;
                            hitqy = m * qlim + b;

                            pdist = (float)Math.pow(xf - hitpx, 2) + (float)Math.pow(yf - hitpy, 2);
                            qdist = (float)Math.pow(xf - hitqx, 2) + (float)Math.pow(yf - hitqy, 2);

                            if (pdist < qdist){
                                xxf = hitpx;
                                yyf = hitpy;
                            }
                            else {
                                xxf = hitqx;
                                yyf = hitqy;
                            }
                        }
                        else {
                            xxf = lrespx;
                            yyf = lrespy;
                        }
                    }
                    else if (xf < qlim && yf > plim){
                        if (1f - lrespx > qlim || lrespy < plim){
                            m = (lrespy - yf) / (1f - lrespx - xf);
                            b = yf - m * xf;

                            hitpx = (plim - b) / m;
                            hitpy = plim;

                            hitqx = qlim;
                            hitqy = m * qlim + b;

                            pdist = (float)Math.pow(xf - hitpx, 2) + (float)Math.pow(yf - hitpy, 2);
                            qdist = (float)Math.pow(xf - hitqx, 2) + (float)Math.pow(yf - hitqy, 2);

                            if (pdist < qdist){
                                xxf = hitpx;
                                yyf = hitpy;
                            }
                            else {
                                xxf = hitqx;
                                yyf = hitqy;
                            }
                        }
                        else {
                            xxf = 1f - lrespx;
                            yyf = lrespy;
                        }
                    }
                    else if (xf > qlim && yf < plim){
                        if (lrespx < qlim || 1f - lrespy > plim){
                            m = (1f - lrespy - yf) / (lrespx - xf);
                            b = yf - m * xf;

                            hitpx = (plim - b) / m;
                            hitpy = plim;

                            hitqx = qlim;
                            hitqy = m * qlim + b;

                            pdist = (float)Math.pow(xf - hitpx, 2) + (float)Math.pow(yf - hitpy, 2);
                            qdist = (float)Math.pow(xf - hitqx, 2) + (float)Math.pow(yf - hitqy, 2);

                            if (pdist < qdist){
                                xxf = hitpx;
                                yyf = hitpy;
                            }
                            else {
                                xxf = hitqx;
                                yyf = hitqy;
                            }
                        }
                        else {
                            xxf = lrespx;
                            yyf = 1f - lrespy;
                        }
                    }
                    else if (xf > qlim && yf > plim){
                        if (1f - lrespx < qlim || 1f - lrespy < plim){
                            m = (1f - lrespy - yf) / (1f - lrespx - xf);
                            b = yf - m * xf;

                            hitpx = (plim - b) / m;
                            hitpy = plim;

                            hitqx = qlim;
                            hitqy = m * qlim + b;

                            pdist = (float)Math.pow(xf - hitpx, 2) + (float)Math.pow(yf - hitpy, 2);
                            qdist = (float)Math.pow(xf - hitqx, 2) + (float)Math.pow(yf - hitqy, 2);

                            if (pdist < qdist){
                                xxf = hitpx;
                                yyf = hitpy;
                            }
                            else {
                                xxf = hitqx;
                                yyf = hitqy;
                            }
                        }
                        else {
                            xxf = 1f - lrespx;
                            yyf = 1f - lrespy;
                        }
                    }
                    else {
                        xxf = xf;
                        yyf = yf;
                    }

                    System.out.print("iterating at ");
                    System.out.print(xxf);
                    System.out.print(",");
                    System.out.println(yyf);

                    //temp
                    //done = true;

                    xfl = xf;
                    yfl = yf;

                    if ((xf == xxf && yf == yyf) || (xxf == startpt[0] && yyf == startpt[1])){
                        done = true;
                    }
                    else {
                        xf = xxf;
                        yf = yyf;
                    }

                    if (!skipdraw){
                        ci.drawArrow(xfl, yfl, xxf, yyf, colors[colorct], Color.black);
                    }
                    
                } while (!done);

                colorct++;
                if (colorct >= 2){
                    colorct = 0;
                }
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

        for (int i = 0; i < (dots + 1) * (dots + 1); i++){
            ci.drawLine(startpoints[i][0], startpoints[i][1], startpoints[i][0], startpoints[i][1], Color.black);
        }

        return ci;
    }

}
