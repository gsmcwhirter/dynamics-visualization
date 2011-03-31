import java.awt.image.BufferedImage;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.geom.Line2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.Ellipse2D;
import java.awt.Font;
import java.awt.FontMetrics;

/**
 * Wrapper around a buffered image to allow for easier drawing
 * 
 * @author gmcwhirt
 */
public class CanvasImage {
    public static final int FontTL = 1;
    public static final int FontTR = 2;
    public static final int FontBL = 3;
    public static final int FontBR = 4;

    private BufferedImage _bi;
    private int _xpad, _ypad, _boxh, _boxw;

    /**
     * Constructor
     * @param bi The buffered image to wrap.
     */
    public CanvasImage(BufferedImage bi){
        _bi = bi;
        Graphics2D g2d = _bi.createGraphics();
        g2d.setColor(Color.lightGray);
        g2d.drawRect(0, 0, _bi.getWidth() - 1, _bi.getHeight() - 1);
        _xpad = 0;
        _ypad = 0;
        _boxh = _bi.getWidth();
        _boxw = _bi.getHeight();
    }

    public CanvasImage(BufferedImage bi, int boxh, int boxw, int xpad, int ypad){
        _bi = bi;
        Graphics2D g2d = _bi.createGraphics();
        g2d.setColor(Color.lightGray);
        g2d.drawRect(xpad, ypad, boxw - 1, boxh - 1);
        _xpad = xpad;
        _ypad = ypad;
        _boxw = boxw;
        _boxh = boxh;

        System.out.print("Box Width: ");
        System.out.print(boxw);
        System.out.print(" / ");
        System.out.println(_bi.getWidth());
    }

    /**
     * Get the buffered image being wrapped
     * @return The buffered image
     */
    public BufferedImage getImage(){
        return _bi;
    }

    /**
     * Flush the buffered image
     */
    public void flush(){
        _bi.flush();
    }

    /**
     * Draw a line from and to the specified coordinates with the specified color
     *
     * @param x1 Starting x in (0,1)
     * @param y1 Starting y in (0,1)
     * @param x2 Ending x in (0,1)
     * @param y2 Ending y in (0,1)
     * @param color The color of the line
     */
    public void drawLine(float x1, float y1, float x2, float y2, Color color){
        int _height = _boxh - 1;//_bi.getHeight() - 1;
        int _width = _boxw - 1;//_bi.getWidth() - 1;
        Graphics2D g2d = _bi.createGraphics();

        float xx1, xx2, yy1, yy2;
        xx1 = (float) Math.floor(_width * x1) + _xpad;
        xx2 = (float) Math.floor(_width * x2) + _xpad;
        yy1 = (float) Math.floor(_height * (1f - y1)) + _ypad;
        yy2 = (float) Math.floor(_height * (1f - y2)) + _ypad;

        g2d.setComposite(makeComposite(1f));
        g2d.setColor(color);
        g2d.draw(new Line2D.Float(xx1, yy1, xx2, yy2));
    }

    /**
     * Draw a black line from and to the specified coordinates
     *
     * @param x1 Starting x in (0,1)
     * @param y1 Starting y in (0,1)
     * @param x2 Ending x in (0,1)
     * @param y2 Ending y in (0,1)
     */
    public void drawLine(float x1, float y1, float x2, float y2){
        drawLine(x1, y1, x2, y2, Color.black);
    }

    private AlphaComposite makeComposite(float alpha) {
        int type = AlphaComposite.SRC_OVER;
        return(AlphaComposite.getInstance(type, alpha));
    }

    /**
     * Draw a dot at the specified location with the specified radius in the
     * specified color
     *
     * @param x Coordinate x in (0,1)
     * @param y Coordinate y in (0,1)
     * @param r Radius of the dot (in raw units, not just (0,1))
     * @param color Color of the dot
     */
    public void drawDot(float x, float y, float r, Color color){
        Graphics2D g = _bi.createGraphics();
        
        int _height = _boxh - 1;//_bi.getHeight() - 1;
        int _width = _boxw - 1;//_bi.getWidth() - 1;
        
        float xp = (float) Math.floor(_width * x) - r + _xpad;
        float yp = (float) Math.floor(_height * (1f - y)) - r + _ypad;

        g.setColor(color);
        g.setPaint(color);
        g.fill(new Ellipse2D.Float(xp, yp, 2 * r, 2 * r));
    }

    /**
     * Draw a r=3px dot at the specified location in the specified color
     *
     * @param x Coordinate x in (0,1)
     * @param y Coordinate y in (0,1)
     * @param color Color of the dot
     */
    public void drawDot(float x, float y, Color color){
        drawDot(x, y, 3f, color);
    }

    /**
     * Draw a black r=3px dot at the specified location
     *
     * @param x Coordinate x in (0,1)
     * @param y Coordinate y in (0,1)
     */
    public void drawDot(float x, float y){
        drawDot(x, y, Color.black);
    }

    /**
     * Draw a black dot at the specified location with the specified radius
     *
     * @param x Coordinate x in (0,1)
     * @param y Coordinate y in (0,1)
     * @param r Radius of the dot (in raw units, not just (0,1))
     */
    public void drawDot(float x, float y, float r){
        drawDot(x, y, r, Color.black);
    }

    /**
     * Draw an arrow from one point to another with the specified body and head colors
     *
     * @param x1 Starting x in (0,1)
     * @param y1 Starting y in (0,1)
     * @param x2 Ending x in (0,1)
     * @param y2 Ending y in (0,1)
     * @param lcolor The color of the line
     * @param acolor The color of the arrow head
     */
    public void drawArrow(float x1, float y1, float x2, float y2, Color lcolor, Color acolor){
        int _height = _boxh - 1;//_bi.getHeight() - 1;
        int _width = _boxw - 1;//_bi.getWidth() - 1;

        if (x1 > 1f){
            x1 = 1f;
        }
        else if(x1 < 0f)
        {
            x1 = 0f;
        }

        if (x2 > 1f){
            x2 = 1f;
        }
        else if(x2 < 0f)
        {
            x2 = 0f;
        }

        if (y1 > 1f){
            y1 = 1f;
        }
        else if(y1 < 0f)
        {
            y1 = 0f;
        }

        if (y2 > 1f){
            y2 = 1f;
        }
        else if(y2 < 0f)
        {
            y2 = 0f;
        }

        float xx1, xx2, yy1, yy2;
        xx1 = (float) Math.floor(_width * x1) + _xpad;
        xx2 = (float) Math.floor(_width * x2) + _xpad;
        yy1 = (float) Math.floor(_height * (1f - y1)) + _ypad;
        yy2 = (float) Math.floor(_height * (1f - y2)) + _ypad;

        _drawArrow(xx1, yy1, xx2, yy2, lcolor, acolor);
    }

    /**
     * Draw an arrow from one point to another with the specified body and head color
     *
     * @param x1 Starting x in (0,1)
     * @param y1 Starting y in (0,1)
     * @param x2 Ending x in (0,1)
     * @param y2 Ending y in (0,1)
     * @param color The color of the line and arrow head
     */
    public void drawArrow(float x1, float y1, float x2, float y2, Color color){
        drawArrow(x1, y1, x2, y2, color, color);
    }

    /**
     * Draw a black arrow from one point to another
     *
     * @param x1 Starting x in (0,1)
     * @param y1 Starting y in (0,1)
     * @param x2 Ending x in (0,1)
     * @param y2 Ending y in (0,1)
     */
    public void drawArrow(float x1, float y1, float x2, float y2){
        drawArrow(x1, y1, x2, y2, Color.black, Color.black);
    }

    /**
     * Draw the actual arrows from the drawArrow functions
     *
     * @param x Corrected starting x coordinate
     * @param y Corrected starting y coordinate
     * @param xx Corrected ending x coordinate
     * @param yy Corrected ending y coordinate
     * @param lcolor The color of the line
     * @param acolor The color of the arrow head
     */
    private void _drawArrow(float x, float y, float xx, float yy, Color lcolor, Color acolor )
    {
        Graphics2D g = _bi.createGraphics();

        float arrowWidth = 5.0f ;
        float theta = 0.423f ;
        float[] xPoints = new float[ 3 ] ;
        float[] yPoints = new float[ 3 ] ;
        float[] vecLine = new float[ 2 ] ;
        float[] vecLeft = new float[ 2 ] ;
        float fLength;
        float th;
        float ta;
        float baseX, baseY ;

        xPoints[ 0 ] = xx;
        yPoints[ 0 ] = yy;

        // build the line vector
        vecLine[ 0 ] = (float)xPoints[ 0 ] - x;
        vecLine[ 1 ] = (float)yPoints[ 0 ] - y;

        // build the arrow base vector - normal to the line
        vecLeft[ 0 ] = -vecLine[ 1 ] ;
        vecLeft[ 1 ] = vecLine[ 0 ] ;

        // setup length parameters
        fLength = (float)Math.sqrt( vecLine[0] * vecLine[0] + vecLine[1] * vecLine[1] ) ;
        if (fLength > 0f){
            th = arrowWidth / ( 2.0f * fLength ) ;
            ta = arrowWidth / ( 2.0f * ( (float)Math.tan( theta ) / 2.0f ) * fLength ) ;
        } else {
            th = 0f;
            ta = 0f;
        }

        // find the base of the arrow
        baseX = ( (float)xPoints[ 0 ] - ta * vecLine[0]);
        baseY = ( (float)yPoints[ 0 ] - ta * vecLine[1]);

        // build the points on the sides of the arrow
        xPoints[ 1 ] = (int)( baseX + th * vecLeft[0] );
        yPoints[ 1 ] = (int)( baseY + th * vecLeft[1] );
        xPoints[ 2 ] = (int)( baseX - th * vecLeft[0] );
        yPoints[ 2 ] = (int)( baseY - th * vecLeft[1] );

        g.setColor(lcolor);
        g.draw(new Line2D.Float(x, y, baseX, baseY));

        g.setColor(acolor);
        g.setPaint(acolor);
        GeneralPath tri = new GeneralPath();
        tri.append(new Line2D.Float(xPoints[0], yPoints[0], xPoints[1], yPoints[1]), true);
        tri.append(new Line2D.Float(xPoints[1], yPoints[1], xPoints[2], yPoints[2]), true);
        tri.append(new Line2D.Float(xPoints[2], yPoints[2], xPoints[0], yPoints[0]), true);
        g.fill(tri);
    }

    /**
     * Draw a string (usually a label) on the graph
     * @param x The x coordinate in [0,1]x[0,1]
     * @param y The y coordinate in [0,1]x[0,1]
     * @param s The string
     * @param font The font to use
     * @param color The color of the text
     */
    public void drawString(float x, float y, String s, int posref, int pad, Font font, Color color){
        Graphics2D g = _bi.createGraphics();

        int _height = _boxh - 1;//_bi.getHeight() - 1;
        int _width = _boxw - 1;//_bi.getWidth() - 1;

        float xp = (float) Math.floor(_width * x) + _xpad;
        float yp = (float) Math.floor(_height * (1f - y)) + _ypad;

        g.setColor(color);
        g.setPaint(color);

        g.setFont(font);

        FontMetrics fm = g.getFontMetrics();

        if (posref == CanvasImage.FontBR || posref == CanvasImage.FontTR) {
            xp = xp - fm.stringWidth(s) - pad;
        }
        else {
            xp = xp + pad;
        }

        if (posref == CanvasImage.FontTL || posref == CanvasImage.FontTR) {
            yp = yp + (float)fm.getHeight() + pad;
        }
        else {
            yp = yp - pad;
        }

        g.drawString(s, xp, yp);

    }

    /**
     * Draw a string (usually a label) on the graph
     * @param x The x coordinate in [0,1]x[0,1]
     * @param y The y coordinate in [0,1]x[0,1]
     * @param s The string
     */
    public void drawString(float x, float y, String s, int posref, int pad){
        drawString(x, y, s, posref, pad, new Font("SansSerif", Font.PLAIN, 12), Color.black);
    }

    /**
     * Draw a string (usually a label) on the graph
     * @param x The x coordinate in [0,1]x[0,1]
     * @param y The y coordinate in [0,1]x[0,1]
     * @param s The string
     * @param font The font to use
     */
    public void drawString(float x, float y, String s, int posref, int pad, Font font){
        drawString(x, y, s, posref, pad, font, Color.black);
    }

    /**
     * Draw a string (usually a label) on the graph
     * @param x The x coordinate in [0,1]x[0,1]
     * @param y The y coordinate in [0,1]x[0,1]
     * @param s The string
     * @param color The color to use
     */
    public void drawString(float x, float y, String s, int posref, int pad, Color color){
        drawString(x, y, s, posref, pad, new Font("SansSerif", Font.PLAIN, 12), color);
    }
}
