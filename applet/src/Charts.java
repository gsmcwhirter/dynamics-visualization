// Name: James Slayton
// Assignment 07

package graphicspiechart;
import java.awt.*;
import java.awt.event.*;
import java.applet.*;
import javax.swing.*;
import javax.swing.border.*;
import java.util.*;
import java.lang.Object;
import java.util.Arrays;

public class Charts extends JApplet implements ActionListener {
     private Color col[];    // Array of colors for pie & bar charts

     private Random rand = new Random(456729334);

     private Font HelvBold14 = new Font ("Helvetica", Font.BOLD, 14);

     private int dataNumb[]; // Array of numbers input by user

     private int cPanelWidth = 700;  // The width of the canvas panel
     private int cPanelHeight = 350; // The height of the canvas panel

     private int chartWidth = 300;   // The width of the pie and bar charts
     private int chartHeight = 300;  // The height of the pie and bar charts
     private int chartSide = 300;    // The width/height of the pie chart

     private int PChartXPos = 30;    // X position for start of pie chart display
     private int PChartYPos = 30;    // Y position for start of pie chart display
     private int BChartXPos = 380;   // X position for start of bar chart display
     private int BChartYPos = 30;    // Y position for start of bar chart display

     private JTextField tfield = new JTextField(50);// Mechanism to get user input
     private canvasPanel Pan = new canvasPanel();  // JPanel canvas for graphics drawing

     // Default constructor
     public Charts() {
        Container c = getContentPane();   // Get content pane for JFrame window
        c.setLayout( new BorderLayout() ); // Set layout manager for window

        setFont ( HelvBold14 );

        // Create the JLabel needed for the graphical user interface
        JLabel prompta = new JLabel ("Enter a list of non-negative integer values, "
                 + "separated by commas or spaces");

        // "this" JFrame window will respond to user hit of Enter key
        tfield.addActionListener ( this );

        // Add the instructional labels to JPanel in GridLayout
        JPanel pan1 = new JPanel( new GridLayout(3,1));
        pan1.setBorder( new EtchedBorder() );
        pan1.add ( prompta );
        pan1.add ( tfield );

        // Add the panels to the content pane of applet
        c.add(pan1, BorderLayout.NORTH);
        Pan.setBorder( new EtchedBorder() );
        Pan.setPreferredSize( new Dimension( 730, 450 ) );
        c.add(Pan, BorderLayout.CENTER);
     }

     // Method to generate colors randomly
     private Color getRandomColor(){
        return new Color( rand.nextFloat(), rand.nextFloat(), rand.nextFloat() );
     }

     // Method to generate an array of randomly generated colors
     private Color[] getRandomColorArray(int num){
        Color cLst[] = new Color[num];
        for (int i = 0; i < num; i++) {
           cLst[i] = getRandomColor();
        }
        return cLst;
     }

     // Method to extract numbers from the textfield string of user-entered data
     private int[] getNumbsFromString( String st ) {
        if (st.length() == 0)
           return null;
        String substr = "";
        String str = st;
        String tempstr = "";
        int limit = str.length();
        int lst[] = new int[limit/2 + 2];
        int pos = str.indexOf(' ');

        int count = 0;
        while( (0 < pos) && (0 < limit) ) {
           substr = str.substring(0,pos);
           lst[count] = Integer.parseInt(substr);
           count++;
           tempstr = str.substring(pos + 1,limit);
           str = tempstr.trim();
           limit = str.length();
           pos = str.indexOf(' ');
        }

        if ((pos < 0) && (limit > 0)) {
           lst[count] = Integer.parseInt(str);
           count++;
        }

        int numLst[] = new int[count];
        for (int i = 0; i < count; i++){
           numLst[i] = lst[i];
        }
        return numLst;
     }

     // Process the user's action in JTextField input
     public void actionPerformed ( ActionEvent e) {

        // Get the user's data items from the JTextField and assign to data array
        dataNumb =  getNumbsFromString( tfield.getText().trim() );
        col = getRandomColorArray( dataNumb.length );

        // Repaint the window
        Pan.repaint();
     }

     //  Draw a pie chart for the array n[] of data items
     public void drawPieChart( int x, int y, int s, int n[], Graphics g ){
        // Compute the sum of the data numbers input by the user
        int sum = 0;
        for (int i = 0; i < n.length; i++){
           sum += dataNumb[i];
           System.out.print( " " + dataNumb[i]);
        }

        // Convert the data numbers to a portion of a 360 degree circle
        int normNumb[] = new int[n.length];
        for (int i = 0; i < n.length; i++){
           normNumb[i] = n[i] * 360/sum;
        }

        int normSum = 0;
        for (int i = 0; i < n.length; i++){

           g.setColor( col[i] );
           if (i == (n.length -1))
              normNumb[i] = 360 - normSum;
           g.fillArc ( x, y, s, s, normSum, normNumb[i]);
           normSum += normNumb[i];
        }

        g.setColor( Color.black );
        g.drawOval( x, y, s, s );
     }

     // Draw a bar chart for the array n[] of data items
     public void drawBarChart( int x, int y, int w, int h, int n[], Graphics g ) {

     // Write the code for this method. This method must draw a bar chart using
     // the parameters passed into the method. The bar chart must be normalized
     // so that the longest bar is contained within the enclosing rectangle
     // specified by the instance variables chartWidth and chartHeight declared
     // declared at the top of the class.

       // Compute the maximum value
       int max = 0;
       for (int i = 0; i < n.length; i++) {
         if (n[i] > max) {
           max = n[i];
         }
       }
       // Compute  height multiplier based on maxHeight and max
       // Compute height of each bar
       int widths[] = new int[n.length];
       for (int i = 0; i < n.length; i++) {
         widths[i] = (n[i] * w / max);
       }

       // Compute  bar width based on maxwidth and number of bars
       // and leaving an equal space between bars
       int barhight = h / n.length;
       int currenty = y;
       for ( int i = 0; i < n.length; i++) {
         g.setColor( col[i] );
         g.fillRect(x,currenty,widths[i] ,barhight );
         currenty += barhight;
       }

       g.setColor( Color.black );
       g.drawRect(x,y,w,h);

     }

     // Class to provide a drawing surface for graphics display
     class canvasPanel extends JPanel {

        // Constructor
        public canvasPanel(){
           setBackground(Color.white);
           setPreferredSize( new Dimension( cPanelWidth, cPanelHeight ) );  // Set its size
           setVisible( true );   // Make the window visible
        }

        public void paintComponent ( Graphics g ){
           super.paintComponent( g );
           g.setFont( HelvBold14 );

           // Compute the sum of the data numbers input by the user
           int sum = 0;
           if (dataNumb != null){
              for (int i = 0; i < dataNumb.length; i++){
                 sum += dataNumb[i];
              }

              // If not all the data items are zero, draw a pie chart and bar chart
              if (sum != 0){
                 g.setFont( HelvBold14 );

                 g.drawString( "Pie Chart:", PChartXPos, PChartYPos );
                 drawPieChart( PChartXPos, PChartYPos+30, chartSide, dataNumb, g);

                 g.setColor( Color.black);
                 g.drawString( "Bar Chart:", BChartXPos, BChartYPos );
                 drawBarChart( BChartXPos, BChartYPos+30, chartWidth, chartHeight, dataNumb, g);
                 g.setFont( HelvBold14 );
              }
           }
        }
     } // End canvasPanel class
}
