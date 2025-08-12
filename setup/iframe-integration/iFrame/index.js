/** @type {Object} WebVis context object */
let myContext;

/** @type {HTMLElement} WebVis viewer component */
let webvisComponent = document.querySelector('webvis-viewer');

/**
 * Initializes the WebVis context and sets up event forwarding to parent window
 * @async
 * @function init
 * @returns {Promise<void>}
 */
async function init() {
    // WEBVIS_API: Request WebVis context from the viewer component
    myContext = await webvisComponent.requestContext();

    // WEBVIS_API: Add a box shape to the scene
    const rootNode = myContext.add('urn:x-i3d:shape:box');
    await myContext.setProperty(rootNode, 'enabled', true);

    // WEBVIS_API: Register event listener for node changes and forward to parent window
    myContext.registerListener(
        [webvis.EventType.NODE_CHANGED],
        /**
         * Event handler that forwards WebVis events to parent window
         * @param {Object} event - WebVis event object
         */
        (event) => {
            const eventData = {
                source: 'my-iframe',
                type: 'CUSTOM_EVENT',
                content: event,
            };
            window.parent.postMessage(eventData, '*');
        },
        0,
        true
    );
}

init();
