let myContext;
let webvisComponent = document.querySelector('webvis-viewer');

/**
 * Initializes the WebVis context within the iframe and sets up event forwarding
 */
async function init() {
    // Get the webvis context, add a model and enable it
    myContext = await webvisComponent.requestContext();
    const rootNode = myContext.add('urn:x-i3d:shape:box');
    await myContext.setProperty(rootNode, 'enabled', true);

    // Register listener to forward events to parent window
    myContext.registerListener(
        [webvis.EventType.NODE_CHANGED],
        (event) => {
            const eventData = {
                source: 'my-iframe', // Add a unique identifier for filtering
                type: 'CUSTOM_EVENT',
                content: event,
            };
            // Send a message with event data to the parent
            window.parent.postMessage(eventData, '*');
        },
        0,
        true
    );
}

// Initialize the iframe WebVis setup
init();
