/**
 * Interface for graph generator classes
 *
 * @author gmcwhirt
 */
public interface GraphGenerator {

    /**
     * Gets the image generated
     * @return The image generated
     */
    public CanvasImage getCImage();

    /**
     * Starts the image generation process
     * @return The image generated
     */
    public CanvasImage generate();
}
