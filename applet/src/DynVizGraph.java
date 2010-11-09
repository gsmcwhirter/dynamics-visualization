/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

import javax.swing.JApplet;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Container;
import java.awt.GridLayout;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.awt.Composite;
import java.awt.AlphaComposite;

/**
 *
 * @author gmcwhirt
 */
public class DynVizGraph extends JApplet {

    private int chartWidth = 210;  // The width of the canvas panel
    private int chartHeight = 210; // The height of the canvas panel

    private CanvasPanel BRChart;  // JPanel canvas for graphics drawing
    private CanvasPanel DtRChart;
    private CanvasPanel CtRChart;

    private int payoffA;
    private int payoffB;
    private int payoffC;
    private int payoffD;

    public DynVizGraph(){
        Container c = getContentPane();

        setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));
        c.setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));

        try {
            String pAS = getParameter("A");
            if (pAS == null){
                payoffA = 2;
            } else {
                payoffA = Integer.parseInt(pAS);
            }
        } catch (NumberFormatException e) {
            payoffA = 0;
        } catch (NullPointerException e) {
            payoffA = 2;
        }

        try {
            String pBS = getParameter("B");
            if (pBS == null){
                payoffB = 1;
            } else {
                payoffB = Integer.parseInt(pBS);
            }
        } catch (NumberFormatException e) {
            payoffB = 0;
        } catch (NullPointerException e) {
            payoffB = 1;
        }

        try {
            String pCS = getParameter("C");
            if (pCS == null){
                payoffC = 1;
            } else {
                payoffC = Integer.parseInt(pCS);
            }
        } catch (NumberFormatException e) {
            payoffC = 0;
        } catch (NullPointerException e) {
            payoffC = 1;
        }

        try {
            String pDS = getParameter("D");
            if (pDS == null){
                payoffD = 2;
            } else {
                payoffD = Integer.parseInt(pDS);
            }
        } catch (NumberFormatException e) {
            payoffD = 0;
        } catch (NullPointerException e) {
            payoffD = 2;
        }

        JPanel panel = new JPanel(new GridLayout(1,3));

        BRChart = new CanvasPanel();
        DtRChart = new CanvasPanel();
        CtRChart = new CanvasPanel();

        panel.setBorder(new LineBorder(Color.LIGHT_GRAY));
        panel.setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));

        BRChart.setPreferredSize(new Dimension(chartWidth, chartHeight));
        DtRChart.setPreferredSize(new Dimension(chartWidth, chartHeight));
        CtRChart.setPreferredSize(new Dimension(chartWidth, chartHeight));
        panel.add(BRChart);
        panel.add(DtRChart);
        panel.add(CtRChart);

        c.add(panel);

        Thread BRGen = new Thread(new BRGraphGenerator(payoffA, payoffB, payoffC, payoffD));
        BRGen.start();
    }
    
    private void BRGraphInfo(int[] lines){
        //BRChart
        BRChart.setLines(lines);
        System.out.println("The test object is null");
        //BRChart.repaint();
    }
    
    private void DtRGraphInfo(BufferedImage bi){
        
    }
    
    private void CtRGraphInfo(BufferedImage bi){
        
    }

    class BRGraphGenerator implements Runnable {
        private int A, B, C, D;

        public BRGraphGenerator(int Ap, int Bp, int Cp, int Dp){
            A = Ap;
            B = Bp;
            C = Cp;
            D = Dp;
        }

        @Override
        public void run(){
            BufferedImage bi = new BufferedImage(200, 200, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = bi.createGraphics();

            //draw stuff
            int qlim = 200 * (1 - (int) Math.floor(C / (A + C)));
            System.out.println(qlim);

            g2d.setColor(Color.RED);
            if (A + C > 0){
                g2d.drawLine(200, qlim, 200, 0);
                g2d.drawLine(0, qlim, 0, 200);
                g2d.drawLine(0, qlim, 200, qlim);
            } else if (A + C < 0){
                g2d.drawLine(200, qlim, 200, 200);
                g2d.drawLine(0, qlim, 0, 0);
                g2d.drawLine(0, qlim, 200, qlim);
            } else if (0 >= C) {
                g2d.drawLine(200, 0, 200, 200);
            } else {
                g2d.drawLine(0, 0, 0, 200);
            }

            g2d.setColor(Color.BLUE);
            if (B + D > 0){
                g2d.drawLine(qlim, 200, 0, 200);
                g2d.drawLine(qlim, 0, 200, 0);
                g2d.drawLine(qlim, 0, qlim, 200);
            } else if (B + D < 0){
                g2d.drawLine(qlim, 200, 200, 200);
                g2d.drawLine(qlim, 0, 0, 0);
                g2d.drawLine(qlim, 0, qlim, 200);
            } else if (0 >= D) {
                g2d.drawLine(0, 200, 200, 200);
            } else {
                g2d.drawLine(0, 0, 200, 0);
            }

            BRGraphInfo(bi);
        }
    }

    // Class to provide a drawing surface for graphics display
    class CanvasPanel extends JPanel {

        private int[] _lines;

        // Constructor
        public CanvasPanel(){
           setBackground(Color.white);
           setPreferredSize( new Dimension( chartWidth, chartHeight ) );  // Set its size
           setVisible( true );   // Make the window visible
        }

        public void setLines(int[] lines){
            _lines = lines;
        }

        @Override
        public void paintComponent ( Graphics g ){
            super.paintComponent( g );

            Graphics2D g2d = (Graphics2D) g;

            g2d.drawRect(5, 5, 200, 200);

            if (_lines.length > 0) {
                g2d.drawLine(5, 205, 205, 5);

                
            }

        }
     } // End canvasPanel class

}
