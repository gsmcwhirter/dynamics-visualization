import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Dimension;
import java.awt.image.VolatileImage;

import javax.swing.JPanel;

/**
 *
 * @author gmcwhirt
 */
public class CanvasPanel extends JPanel {

    private CanvasImage _ci;
    private int _chartWidth, _chartHeight, _chartPadding, _realWidth, _realHeight;

    // Constructor
    public CanvasPanel(int chartWidth, int chartHeight, int chartPadding){
        _chartWidth = chartWidth;
        _chartHeight = chartHeight;
        _chartPadding = chartPadding;
        _realWidth = _chartWidth - (2 * _chartPadding);
        _realHeight = _chartHeight - (2 * _chartPadding);

        setBackground(Color.white);
        setPreferredSize( new Dimension( _chartWidth, _chartHeight ) );  // Set its size
        setVisible( true );   // Make the window visible
    }

    public int getRealHeight(){
        return _realHeight;
    }

    public int getRealWidth(){
        return _realWidth;
    }

    public void setCImage(CanvasImage ci){
        _ci = ci;
    }

    @Override
    public void paintComponent ( Graphics g ){
        super.paintComponent( g );

        Graphics2D g2d = (Graphics2D) g;

        if (_ci != null){
            VolatileImage bi = _ci.getImage();
            System.out.println("adding buffered image");
            if (g2d.drawImage(bi, _chartPadding, _chartPadding, null)){
                System.out.println("ret true");
            } else {
                System.out.println("ret false");
            }
            
        }
    }

 } // End canvasPanel class
