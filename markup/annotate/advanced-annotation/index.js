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
    // the simple cube is has an edge length of 1 with the center at [0,0,0],
    // therefore the left-front-lower corner is at [-0.5, -0.5, -0.5]
    // and the right-back-upper corner at [0.5, 0.5, 0.5]

    const label = `This corner <b>0</b>`;
    const pdf = `<iframe src="assets/i3dhub-logo.pdf" width="400" height="400"></iframe>`;
    const img = `<img src="assets/cube.jpg" alt="cube" width="100" height="120">`;
    const vid = `<iframe width="560" height="315" src="https://www.youtube.com/embed/mGM1zRz9eW8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

    const x = -0.5,
        y = -0.5,
        z = -0.5;
    const x1 = -0.5,
        y1 = -0.5,
        z1 = 0.5;
    const x2 = -0.5,
        y2 = 0.5,
        z2 = -0.5;
    const x3 = 0.5,
        y3 = -0.5,
        z3 = 0.5;

    webvisContext.createAnnotation(nodeId, img, true, [x, y, z], [x * 0.2, y * 0.2, z * 0.2]);
    webvisContext.createAnnotation(
        nodeId,
        label,
        true,
        [x1, y1, z1],
        [x1 * 0.2, y1 * 0.2, z1 * 0.2]
    );
    webvisContext.createAnnotation(nodeId, pdf, true, [x2, y2, z2], [x2 * 0.2, y2 * 0.2, z2 * 0.2]);
    webvisContext.createAnnotation(nodeId, vid, true, [x3, y3, z3], [x3 * 0.2, y3 * 0.2, z3 * 0.2]);
}

init();
