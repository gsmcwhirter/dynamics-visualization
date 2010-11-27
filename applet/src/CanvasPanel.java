import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Dimension;
import java.awt.image.BufferedImage;

import javax.swing.JPanel;

/**
 * JPanel holding CanvasImage pictures
 * @author gmcwhirt
 */
public class CanvasPanel extends JPanel {

    private CanvasImage _ci;
    private int _chartWidth, _chartHeight, _chartPadding, _realWidth, _realHeight;

    /**
     * Constructor
     * @param chartWidth The width of the chart
     * @param chartHeight The height of the chart
     * @param chartPadding The spacing around the chart
     */
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

    /**
     * Gets the real chart height
     * @return The real picture height
     */
    public int getRealHeight(){
        return _realHeight;
    }

    /**
     * Gets the real chart width
     *
     * @return The real picture width
     */
    public int getRealWidth(){
        return _realWidth;
    }

    /**
     * Sets the image shown on this panel
     *
     * @param ci The image to display
     */
    public void setCImage(CanvasImage ci){
        _ci = ci;
    }

    @Override
    public void paintComponent ( Graphics g ){
        super.paintComponent( g );

        Graphics2D g2d = (Graphics2D) g;

        if (_ci != null){
            BufferedImage bi = _ci.getImage();
            if (g2d.drawImage(bi, _chartPadding, _chartPadding, null)){
            } else {
            }
            
        }
    }

    /**
     * Flush the displayed picture
     *
     */
    public void flush(){
        if (_ci != null){
            _ci.flush();
        }
        repaint();
    }

 } // End canvasPanel class
