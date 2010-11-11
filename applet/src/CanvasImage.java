import java.awt.image.BufferedImage;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.geom.Line2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.Ellipse2D;

/**
 *
 * @author gmcwhirt
 */
public class CanvasImage {
    private BufferedImage _bi;

    public CanvasImage(BufferedImage bi){
        _bi = bi;
        Graphics2D g2d = _bi.createGraphics();
        g2d.setColor(Color.lightGray);
        g2d.drawRect(0, 0, _bi.getWidth() - 1, _bi.getHeight() - 1);
    }

    public BufferedImage getImage(){
        return _bi;
    }

    public void flush(){
        _bi.flush();
    }

    public void drawLine(float x1, float y1, float x2, float y2, Color color){
        int _height = _bi.getHeight() - 1;
        int _width = _bi.getWidth() - 1;
        Graphics2D g2d = _bi.createGraphics();

        float xx1, xx2, yy1, yy2;
        xx1 = (float) Math.floor(_width * x1);
        xx2 = (float) Math.floor(_width * x2);
        yy1 = (float) Math.floor(_height * (1f - y1));
        yy2 = (float) Math.floor(_height * (1f - y2));

        g2d.setComposite(makeComposite(1f));
        g2d.setColor(color);
        g2d.draw(new Line2D.Float(xx1, yy1, xx2, yy2));
    }

    public void drawLine(float x1, float y1, float x2, float y2){
        drawLine(x1, y1, x2, y2, Color.black);
    }

    private AlphaComposite makeComposite(float alpha) {
        int type = AlphaComposite.SRC_OVER;
        return(AlphaComposite.getInstance(type, alpha));
    }
    
    public void drawDot(float x, float y, float r, Color color){
        Graphics2D g = _bi.createGraphics();
        
        int _height = _bi.getHeight() - 1;
        int _width = _bi.getWidth() - 1;
        
        float xp = (float) Math.floor(_width * x) - r;
        float yp = (float) Math.floor(_height * (1f - y)) - r;

        g.setColor(color);
        g.setPaint(color);
        g.fill(new Ellipse2D.Float(xp, yp, 2 * r, 2 * r));
    }

    public void drawDot(float x, float y, Color color){
        drawDot(x, y, 3f, color);
    }

    public void drawDot(float x, float y){
        drawDot(x, y, Color.black);
    }

    public void drawDot(float x, float y, float r){
        drawDot(x, y, r, Color.black);
    }

    public void drawArrow(float x1, float y1, float x2, float y2, Color lcolor, Color acolor){
        int _height = _bi.getHeight() - 1;
        int _width = _bi.getWidth() - 1;

        float xx1, xx2, yy1, yy2;
        xx1 = (float) Math.floor(_width * x1);
        xx2 = (float) Math.floor(_width * x2);
        yy1 = (float) Math.floor(_height * (1f - y1));
        yy2 = (float) Math.floor(_height * (1f - y2));

        _drawArrow(xx1, yy1, xx2, yy2, lcolor, acolor);
    }

    public void drawArrow(float x1, float y1, float x2, float y2, Color color){
        drawArrow(x1, y1, x2, y2, color, color);
    }

    public void drawArrow(float x1, float y1, float x2, float y2){
        drawArrow(x1, y1, x2, y2, Color.black, Color.black);
    }

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

        xPoints[ 0 ] = xx ;
        yPoints[ 0 ] = yy ;

        // build the line vector
        vecLine[ 0 ] = (float)xPoints[ 0 ] - x ;
        vecLine[ 1 ] = (float)yPoints[ 0 ] - y ;

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
}
