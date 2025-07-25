const canvas1 = document.querySelector('#firstCanvas');
const canvas2 = document.querySelector('#secondCanvas');
const canvas3 = document.querySelector('#thirdCanvas');
const canvas4 = document.querySelector('#fourthCanvas');

const initBtn = document.querySelector('#initBtn');
const addModelBtn = document.querySelector('#addModelBtn');
const clipBtn = document.querySelector('#clipBtn');

let context = null;

/**
 * Adds a model to the given context
 * @param {Object} ctx - The WebVis context
 */
async function addModel(ctx) {
    const modelId = ctx.add({
        dataURI: 'urn:x-i3d:examples:catia:bike',
    });
    // Enable the Dataset
    await ctx.setProperty(modelId, webvis.Property.ENABLED, true);
}

/**
 * Adds a clip plane to the given context
 * @param {Object} ctx - The WebVis context
 */
async function addClipPlane(ctx) {
    // Get the Bounding Box of our Model
    const boundingBox = await ctx.getProperty(1, webvis.Property.GLOBAL_VOLUME);

    // Create a Clip Plane at the center of the Model
    const clipPlaneId = ctx.createClipPlane({
        position: boundingBox.getCenter(),
    });
}

/**
 * Initializes the WebVis context and creates multiple viewers
 */
async function init() {
    // Create Context
    context = await webvis.requestContext('myContext');
    console.log('initialized context');
    //Create Viewers
    const viewer1 = context.createViewer('myFirstViewer', canvas1);
    const viewer2 = context.createViewer('mySecondViewer', canvas2);
    const viewer3 = context.createViewer('myThirdViewer', canvas3);
    const viewer4 = context.createViewer('myFourthViewer', canvas4);
    console.log('initialized viewers');
}

// Event listeners for buttons
initBtn.addEventListener('click', () => {
    init();
    initBtn.disabled = true;
    addModelBtn.disabled = false;
});

addModelBtn.addEventListener('click', () => {
    addModel(context);
    addModelBtn.disabled = true;
    clipBtn.disabled = false;
});

clipBtn.addEventListener('click', () => {
    addClipPlane(context);
    clipBtn.disabled = true;
});
