import javax.swing.JApplet;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;
import javax.swing.SwingUtilities;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Container;
import java.awt.GridLayout;


/**
 * Main class of the applet. It kicks off everything else.
 *
 * @author gmcwhirt
 */
public class DynVizGraph extends JApplet {

    /**
     * Width, height, and spacing for the pictures
     *
     */
    private int chartWidth = 210;  // The width of the canvas panel
    private int chartHeight = 210; // The height of the canvas panel
    private int chartPadding = 5;
    private int labelPaddingXL = 20;
    private int labelPaddingXR = 0;
    private int labelPaddingYT = 0;
    private int labelPaddingYB = 20;

    /**
     * The widgets on which the pictures are drawn
     *
     */
    private CanvasPanel BRChart;
    private CanvasPanel DtRChart;
    private CanvasPanel CtRChart;
    private CanvasPanel VFChart;

    /*
     * The grid is:
     *      A, B    |   C, D
     *      E, F    |   G, H
     */

    /**
     * Payoff values
     */
    private int payoffA;
    private int payoffB;
    private int payoffC;
    private int payoffD;
    private int payoffE;
    private int payoffF;
    private int payoffG;
    private int payoffH;

    /**
     * Default payoff values should none be passed in.
     */
    private int payoffAd = 1;
    private int payoffBd = -1;
    private int payoffCd = -1;
    private int payoffDd = 1;
    private int payoffEd = -1;
    private int payoffFd = 1;
    private int payoffGd = 1;
    private int payoffHd = -1;

    /**
     * Values for the labels
     *
     */
    private String CL1;
    private String CL2;
    private String RL1;
    private String RL2;

    /**
     * Default values for the labels
     *
     */
    private String CL1d = "C";
    private String CL2d = "D";
    private String RL1d = "C";
    private String RL2d = "D";

    /**
     * Worker threads to draw the pictures and repaint to show progress.
     *
     */
    private Thread BRThread;
    private Thread DtRThread;
    private Thread CtRThread;
    private Thread VFThread;
    private Thread RepaintThread;

    /**
     * Flags for the worker threads being done so that we can stop the repainter
     *
     */
    private boolean BRThreadDone = false;
    private boolean DtRThreadDone = false;
    private boolean CtRThreadDone = false;
    private boolean VFThreadDone = false;

    @Override
    public void init(){
        try {
            SwingUtilities.invokeAndWait(new Runnable() {
                @Override
                public void run() {
                    goBabyGo();
                }
            });
        } catch (Exception e) {
            System.err.println("goBabyGo failed.");
        }
    }

    /**
     * Grabs the parameter values and kicks everything off
     *
     */
    public void goBabyGo(){
        Container c = getContentPane();

        setPreferredSize(new Dimension((chartWidth + labelPaddingXL + labelPaddingXR) * 2 + 2, (chartHeight + labelPaddingYT + labelPaddingYB) * 2 + 2));
        c.setPreferredSize(new Dimension((chartWidth + labelPaddingXL + labelPaddingXR) * 2 + 2, (chartHeight + labelPaddingYT + labelPaddingYB) * 2 + 2));

        JPanel panel = new JPanel(new GridLayout(2,2));

        BRChart = new CanvasPanel(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB, chartPadding);
        DtRChart = new CanvasPanel(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB, chartPadding);
        VFChart = new CanvasPanel(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB, chartPadding);
        CtRChart = new CanvasPanel(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB, chartPadding);

        panel.setBorder(new LineBorder(Color.LIGHT_GRAY));
        panel.setPreferredSize(new Dimension((chartWidth + labelPaddingXL + labelPaddingXR) * 2 + 2, (chartHeight + labelPaddingYT + labelPaddingYB) * 2 + 2));

        BRChart.setPreferredSize(new Dimension(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB));
        DtRChart.setPreferredSize(new Dimension(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB));
        VFChart.setPreferredSize(new Dimension(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB));
        CtRChart.setPreferredSize(new Dimension(chartWidth + labelPaddingXL + labelPaddingXR, chartHeight + labelPaddingYT + labelPaddingYB));

        panel.add(BRChart);
        panel.add(CtRChart);
        panel.add(VFChart);
        panel.add(DtRChart);

        c.add(panel);

        try {
            String pAS = getParameter("A");
            payoffA = Integer.parseInt(pAS);
        } catch (NumberFormatException e) {
            payoffA = payoffAd;
        } catch (NullPointerException e) {
            payoffA = payoffAd;
        }

        try {
            String pBS = getParameter("B");
            payoffB = Integer.parseInt(pBS);
        } catch (NumberFormatException e) {
            payoffB = payoffBd;
        } catch (NullPointerException e) {
            payoffB = payoffBd;
        }

        try {
            String pCS = getParameter("C");
            payoffC = Integer.parseInt(pCS);
        } catch (NumberFormatException e) {
            payoffC = payoffCd;
        } catch (NullPointerException e) {
            payoffC = payoffCd;
        }

        try {
            String pDS = getParameter("D");
            payoffD = Integer.parseInt(pDS);
        } catch (NumberFormatException e) {
            payoffD = payoffDd;
        } catch (NullPointerException e) {
            payoffD = payoffDd;
        }

        try {
            String pES = getParameter("E");
            payoffE = Integer.parseInt(pES);
        } catch (NumberFormatException e) {
            payoffE = payoffEd;
        } catch (NullPointerException e) {
            payoffE = payoffEd;
        }

        try {
            String pFS = getParameter("F");
            payoffF = Integer.parseInt(pFS);
        } catch (NumberFormatException e) {
            payoffF = payoffFd;
        } catch (NullPointerException e) {
            payoffF = payoffFd;
        }

        try {
            String pGS = getParameter("G");
            payoffG = Integer.parseInt(pGS);
        } catch (NumberFormatException e) {
            payoffG = payoffGd;
        } catch (NullPointerException e) {
            payoffG = payoffGd;
        }

        try {
            String pHS = getParameter("H");
            payoffH = Integer.parseInt(pHS);
        } catch (NumberFormatException e) {
            payoffH = payoffHd;
        } catch (NullPointerException e) {
            payoffH = payoffHd;
        }

        try {
            CL1 = getParameter("CL1");
            if (CL1 == null) {
                CL1 = CL1d;
            }
        } catch (NullPointerException e) {
            CL1 = CL1d;
        }

        try {
            CL2 = getParameter("CL2");
            if (CL2 == null) {
                CL2 = CL2d;
            }
        } catch (NullPointerException e) {
            CL2 = CL2d;
        }

        try {
            RL1 = getParameter("RL1");
            if (RL1 == null) {
                RL1 = RL1d;
            }
        } catch (NullPointerException e) {
            RL1 = RL1d;
        }

        try {
            RL2 = getParameter("RL2");
            if (RL2 == null) {
                RL2 = RL2d;
            }
        } catch (NullPointerException e) {
            RL2 = RL2d;
        }

        System.out.println(payoffA);
        System.out.println(payoffB);
        System.out.println(payoffC);
        System.out.println(payoffD);
        System.out.println(payoffE);
        System.out.println(payoffF);
        System.out.println(payoffG);
        System.out.println(payoffH);

        /*
         * The grid is:
         *      A, B    |   C, D
         *      E, F    |   G, H
         */

        RepaintThread = new Thread(new Repainter());
        BRThread = new Thread(new GraphGeneratorRunner(new BRIGraphGenerator(payoffA - payoffE, 
                                                                             payoffB - payoffD,
                                                                             payoffG - payoffC,
                                                                             payoffH - payoffF,
                                                                             BRChart.getRealWidth(),
                                                                             BRChart.getRealHeight(),
                                                                             labelPaddingXL,
                                                                             labelPaddingXR,
                                                                             labelPaddingYT,
                                                                             labelPaddingYB,
                                                                             CL1, CL2, RL1, RL2
                                                                             ), GraphGeneratorRunner.BR));
        DtRThread = new Thread(new GraphGeneratorRunner(new DtRGraphGenerator(payoffA, 
                                                                              payoffB,
                                                                              payoffC,
                                                                              payoffD,
                                                                              payoffE,
                                                                              payoffF,
                                                                              payoffG,
                                                                              payoffH,
                                                                              DtRChart.getRealWidth(),
                                                                              DtRChart.getRealHeight(),
                                                                              labelPaddingXL,
                                                                              labelPaddingXR,
                                                                              labelPaddingYT,
                                                                              labelPaddingYB,
                                                                              CL1, CL2, RL1, RL2
                                                                              ), GraphGeneratorRunner.DTR));
        CtRThread = new Thread(new GraphGeneratorRunner(new CtRGraphGenerator(payoffA, 
                                                                              payoffB,
                                                                              payoffC,
                                                                              payoffD,
                                                                              payoffE,
                                                                              payoffF,
                                                                              payoffG,
                                                                              payoffH,
                                                                              CtRChart.getRealWidth(),
                                                                              CtRChart.getRealHeight(),
                                                                              labelPaddingXL,
                                                                              labelPaddingXR,
                                                                              labelPaddingYT,
                                                                              labelPaddingYB,
                                                                              CL1, CL2, RL1, RL2
                                                                              ), GraphGeneratorRunner.CTR));
        VFThread = new Thread(new GraphGeneratorRunner(new VFGraphGenerator(payoffA, 
                                                                            payoffB,
                                                                            payoffC,
                                                                            payoffD,
                                                                            payoffE,
                                                                            payoffF,
                                                                            payoffG,
                                                                            payoffH,
                                                                            VFChart.getRealWidth(),
                                                                            VFChart.getRealHeight(),
                                                                            labelPaddingXL,
                                                                            labelPaddingXR,
                                                                            labelPaddingYT,
                                                                            labelPaddingYB,
                                                                            CL1, CL2, RL1, RL2
                                                                            ), GraphGeneratorRunner.VF));
    }

    @Override
    public void start(){
        BRThread.start();
        DtRThread.start();
        CtRThread.start();
        VFThread.start();
        RepaintThread.start();
    }

    @Override
    public void stop(){
        RepaintThread.interrupt();
        BRThread.interrupt();
        DtRThread.interrupt();
        CtRThread.interrupt();
        VFThread.interrupt();
    }

    /**
     * Sets the pictures onto their respective panes
     *
     * @param ci The picture to set
     * @param typ Indicator for which pane to place it on
     */
    private void GraphInfo(CanvasImage ci, int typ){
        CanvasPanel chart = null;

        if (typ == GraphGeneratorRunner.BR){
            chart = BRChart;
        } else if (typ == GraphGeneratorRunner.DTR){
            chart = DtRChart;
        } else if (typ == GraphGeneratorRunner.CTR){
            chart = CtRChart;
        } else if (typ == GraphGeneratorRunner.VF){
            chart = VFChart;
        }

        if (chart != null){
            chart.setCImage(ci);
            chart.flush();
        }
    }

    /**
     * Tell the repainter that one of the workers is done
     *
     * @param typ Indicator for which worker is done
     */
    private void DoneThread(int typ){

        if (typ == GraphGeneratorRunner.BR){
            BRThreadDone = true;
        } else if (typ == GraphGeneratorRunner.DTR){
            DtRThreadDone = true;
        } else if (typ == GraphGeneratorRunner.CTR){
            CtRThreadDone = true;
        } else if (typ == GraphGeneratorRunner.VF){
            VFThreadDone = true;
        }
    }

    /**
     * Repainter thread class
     */
    class Repainter implements Runnable{

        @Override
        public void run(){
            while (!BRThreadDone || !DtRThreadDone || !CtRThreadDone || !VFThreadDone){
                if (!BRThreadDone){
                    BRChart.repaint();
                }

                if (!DtRThreadDone){
                    DtRChart.repaint();
                }

                if (!CtRThreadDone){
                    CtRChart.repaint();
                }

                if (!VFThreadDone){
                    VFChart.repaint();
                }

                try{
                    Thread.sleep(2000);
                } catch(InterruptedException e){
                	BRThread.interrupt();
                	DtRThread.interrupt();
                	CtRThread.interrupt();
                	VFThread.interrupt();
                    break;
                }
                
            }
        }
    }

    /**
     * Picture worker thread class
     *
     */
    class GraphGeneratorRunner implements Runnable {
        private GraphGenerator _gen;
        private int _typ;

        /**
         * Indicator types
         */
        final static int BR = 1;
        final static int DTR = 2;
        final static int CTR = 3;
        final static int VF = 4;

        /**
         * Constructor
         *
         * @param gen A picture generator instance
         * @param typ Indicator for which type of generator it is
         */
        public GraphGeneratorRunner(GraphGenerator gen, int typ){
            _gen = gen;
            _typ = typ;

            GraphInfo(_gen.getCImage(), _typ);
        }

        @Override
        public void run(){
            CanvasImage ci = _gen.generate();

            ci.flush();
            GraphInfo(ci, _typ);
            DoneThread(_typ);
        }
    }
}
