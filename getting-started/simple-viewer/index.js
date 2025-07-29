/**
 * Initializes the WebVis viewer with a simple box model
 */
async function init() {
    // Get the webvis component and request context
    const webvisComponent = document.querySelector('webvis-viewer');
    const myContext = await webvisComponent.requestContext();

    // Add a simple box model to the scene
    const rootNode = myContext.add('urn:x-i3d:shape:box');

    // Enable the model to make it visible
    await myContext.setProperty(rootNode, webvis.Property.ENABLED, true);
}

// Initialize the application
init();
