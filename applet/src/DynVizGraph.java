/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

import javax.swing.JApplet;
import javax.swing.JPanel;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Container;
import java.awt.GridLayout;
import javax.swing.border.LineBorder;
import java.awt.Graphics2D;

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

    public DynVizGraph(){
        Container c = getContentPane();

        setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));

        c.setPreferredSize(new Dimension(chartWidth * 3 + 2, chartHeight));

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
    }

    // Class to provide a drawing surface for graphics display
    class CanvasPanel extends JPanel {

        // Constructor
        public CanvasPanel(){
           setBackground(Color.white);
           setPreferredSize( new Dimension( chartWidth, chartHeight ) );  // Set its size
           setVisible( true );   // Make the window visible
        }

        @Override
        public void paintComponent ( Graphics g ){
           super.paintComponent( g );

           Graphics2D g2d = (Graphics2D) g;

           g2d.drawRect(5, 5, 205, 205);
           //g2d.drawLine(50, 50, 50, 250);
           //g2d.drawLine(50, 250, 250, 250);

           
           //g.setFont( HelvBold14 );

           // Compute the sum of the data numbers input by the user
           //int sum = 0;
           //if (dataNumb != null){
           //   for (int i = 0; i < dataNumb.length; i++){
           //      sum += dataNumb[i];
           //   }
           //
           //   // If not all the data items are zero, draw a pie chart and bar chart
           //   if (sum != 0){
           //      g.setFont( HelvBold14 );
           //
           //      g.drawString( "Pie Chart:", PChartXPos, PChartYPos );
           //      drawPieChart( PChartXPos, PChartYPos+30, chartSide, dataNumb, g);
           //
           //      g.setColor( Color.black);
           //      g.drawString( "Bar Chart:", BChartXPos, BChartYPos );
           //      drawBarChart( BChartXPos, BChartYPos+30, chartWidth, chartHeight, dataNumb, g);
           //      g.setFont( HelvBold14 );
           //   }
           //}
        }
     } // End canvasPanel class

}
