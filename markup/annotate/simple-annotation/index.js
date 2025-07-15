/**
 * initialize function
 * - adds a simple cube and enables it
 * - creates the PoIs (Points of Interest)
 * - registers a listener to update the PoIs if the view changes
 */
async function init() {
    // Get the context object from the webvis-viewer element.
    const webvisComponent = document.querySelector('webvis-viewer');
    const webvisContext = await webvisComponent.requestContext();

    console.log('Viewer is created...DONE');
    // add box and enable it
    const rootNode = webvisContext.add({
        dataURI: 'urn:x-i3d:shape:box',
    });
    await webvisContext.setProperty(rootNode, 'enabled', true);

    // create the HTML elements representing the POIs (Point of interests)
    createAnnotations(rootNode, webvisContext);
}

/**
 * creates the HTML elements representing the POIs.
 *
 * @param {number} - The id of the cube-node.
 */
function createAnnotations(nodeId, webvisContext) {
    // variable to enumerate the corners
    let corner = 0;
    // the simple cube is has an edge length of 1 with the center at [0,0,0],
    // therefore the left-front-lower corner is at [-0.5, -0.5, -0.5]
    // and the right-back-upper corner at [0.5, 0.5, 0.5]
    for (let x = -0.5; x <= 0.5; x++) {
        for (let y = -0.5; y <= 0.5; y++) {
            for (let z = -0.5; z <= 0.5; z++) {
                const label = `This corner <b>${corner}</b>`;
                webvisContext.createAnnotation(
                    nodeId,
                    label,
                    true,
                    [x, y, z],
                    [x * 0.2, y * 0.2, z * 0.2]
                );
                corner++;
            }
        }
    }
}

init();
