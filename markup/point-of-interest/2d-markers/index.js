/**
 * The global viewer object.
 */
let viewer = null;

/**
 *  The array of POIs (Points of interest)
 */
const pois = [];

/**
 * initialize function
 * - adds a simple cube and enables it
 * - waits for the creation of the viewer element
 * - creates the PoIs (Points of Interest)
 * - registers a listener to update the PoIs if the view changes
 */
async function init() {
    // wait until the viewer object is created
    console.log('Wait until viewer is created...');
    const webvisComponent = document.querySelector('webvis-viewer');
    const myContext = await webvisComponent.requestContext();
    // get global viewer object
    viewer = await webvisComponent.requestViewer();
    console.log('Viewer is ready...');

    // add box and enable it
    const rootNode = myContext.add({
        dataURI: 'urn:x-i3d:shape:box',
    });
    await myContext.setProperty(rootNode, webvis.Property.ENABLED, true);

    // create the HTML elements representing the POIs (Point of interests)
    createPOIs();
    console.log('creating POIs');
    // register listener which will update the 2D location of the POIs each time the
    // view changes
    myContext.registerListener([webvis.EventType.VIEW_CHANGED], () => {
        // updates the position of the POIs
        updatePOIs();
    });
}

/**
 * Updates the position of the POIs.
 */
function updatePOIs() {
    for (let poi of pois) {
        const elem = poi[0];
        const pos = poi[1];
        worldToScreen(elem, pos);
    }
}

/**
 * creates the HTML elements representing the POIs.
 */
function createPOIs() {
    // counter for the number of the corner
    let counter = 0;
    // the simple cube is has an edge length of 1 with the center at [0,0,0],
    // therefore the left-front-lower corner is at [-0.5, -0.5, -0.5]
    // and the right-back-upper corner at [0.5, 0.5, 0.5]
    for (let x = -0.5; x <= 0.5; x++) {
        for (let y = -0.5; y <= 0.5; y++) {
            for (let z = -0.5; z <= 0.5; z++) {
                // create new HTML element with class "poi"
                const poi = document.createElement('span');
                poi.setAttribute('class', 'poi');
                // calculate the screen position of the poi and set the values accordingly
                worldToScreen(poi, [x, y, z, 1]);
                // add poi to HTML
                poi.innerHTML = counter;
                document.body.appendChild(poi);
                // add poi and 3D position to array
                pois.push([poi, [x, y, z]]);
                counter++;
            }
        }
    }
}

/**
 * calculates the screen position of a poi and sets the position accordingly
 */
function worldToScreen(poi, vec) {
    const position = [];
    // projects a 3D point to the 2D canvas
    viewer.projectPointToCanvas([vec[0], vec[1], vec[2], 1], position);
    // positions the poi (12.5 is half the size of the poi, this needs to be subtracted
    // to positions the center of the poi at the coordinate)
    poi.style.left = position[0] - 12.5 + 'px';
    poi.style.top = position[1] - 12.5 + 'px';
}

// Initialize the application when the page loads
init();
