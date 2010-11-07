
import java.awt.image.BufferedImage;
import java.awt.Graphics;
import java.awt.Graphics2D;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author gmcwhirt
 */
public class DrawingPanel extends javax.swing.JPanel {
    private BufferedImage bi;

    public void init() {
        bi = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = bi.createGraphics();
        g2d.fillRect(0, 0, 200, 200);
        g2d.drawString("Test", 0, 0);
    }

    @Override
    public void paint(Graphics g){
        g.drawImage(bi, 0, 0, null);
    }

    public void demoText(String text) {
        
    }
}
