import javax.swing.JApplet;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;
import javax.swing.SwingUtilities;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Container;
import java.awt.GridLayout;


/**
 *
 * @author gmcwhirt
 */
public class DynVizGraph extends JApplet {

    private int chartWidth = 210;  // The width of the canvas panel
    private int chartHeight = 210; // The height of the canvas panel
    private int chartPadding = 5;

    private CanvasPanel BRChart;
    private CanvasPanel DtRChart;
    private CanvasPanel CtRChart;

    private int payoffA;
    private int payoffB;
    private int payoffC;
    private int payoffD;

    private Thread BRThread;
    private Thread DtRThread;
    private Thread CtRThread;

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

    public void goBabyGo(){
        Container c = getContentPane();

        setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));
        c.setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));

        JPanel panel = new JPanel(new GridLayout(1,3));

        BRChart = new CanvasPanel(chartWidth, chartHeight, chartPadding);
        DtRChart = new CanvasPanel(chartWidth, chartHeight, chartPadding);
        CtRChart = new CanvasPanel(chartWidth, chartHeight, chartPadding);

        panel.setBorder(new LineBorder(Color.LIGHT_GRAY));
        panel.setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));

        BRChart.setPreferredSize(new Dimension(chartWidth, chartHeight));
        DtRChart.setPreferredSize(new Dimension(chartWidth, chartHeight));
        CtRChart.setPreferredSize(new Dimension(chartWidth, chartHeight));
        panel.add(BRChart);
        panel.add(DtRChart);
        panel.add(CtRChart);

        c.add(panel);

        try {
            String pAS = getParameter("A");
            payoffA = Integer.parseInt(pAS);
        } catch (NumberFormatException e) {
            payoffA = -1;
        } catch (NullPointerException e) {
            payoffA = -1;
        }

        try {
            String pBS = getParameter("B");
            payoffB = Integer.parseInt(pBS);
        } catch (NumberFormatException e) {
            payoffB = -1;
        } catch (NullPointerException e) {
            payoffB = -1;
        }

        try {
            String pCS = getParameter("C");
            payoffC = Integer.parseInt(pCS);
        } catch (NumberFormatException e) {
            payoffC = 1;
        } catch (NullPointerException e) {
            payoffC = 1;
        }

        try {
            String pDS = getParameter("D");
            payoffD = Integer.parseInt(pDS);
        } catch (NumberFormatException e) {
            payoffD = 1;
        } catch (NullPointerException e) {
            payoffD = 1;
        }

        System.out.println(payoffA);
        System.out.println(payoffB);
        System.out.println(payoffC);
        System.out.println(payoffD);

        BRThread = new Thread(new GraphGeneratorRunner(new BRGraphGenerator(payoffA, payoffB, payoffC, payoffD, BRChart.getRealWidth(), BRChart.getRealHeight()), GraphGeneratorRunner.BR));
        DtRThread = new Thread(new GraphGeneratorRunner(new DtRGraphGenerator(payoffA, payoffB, payoffC, payoffD, DtRChart.getRealWidth(), DtRChart.getRealHeight()), GraphGeneratorRunner.DTR));
        CtRThread = new Thread(new GraphGeneratorRunner(new CtRGraphGenerator(payoffA, payoffB, payoffC, payoffD, CtRChart.getRealWidth(), CtRChart.getRealHeight()), GraphGeneratorRunner.CTR));
    }

    @Override
    public void start(){
        BRThread.start();
        DtRThread.start();
        CtRThread.start();
    }

    @Override
    public void stop(){
        BRThread.interrupt();
        DtRThread.interrupt();
        CtRThread.interrupt();
    }

    private void GraphInfo(CanvasImage ci, int typ){
        CanvasPanel chart = null;

        if (typ == GraphGeneratorRunner.BR){
            chart = BRChart;
        } else if (typ == GraphGeneratorRunner.DTR){
            chart = DtRChart;
        } else if (typ == GraphGeneratorRunner.CTR){
            chart = CtRChart;
        }

        if (chart != null){
            chart.setCImage(ci);
            chart.flush();
        }
    }

    class GraphGeneratorRunner implements Runnable {
        private GraphGenerator _gen;
        private int _typ;

        final static int BR = 1;
        final static int DTR = 2;
        final static int CTR = 3;

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
        }
    }
}
