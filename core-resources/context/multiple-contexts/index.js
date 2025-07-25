const canvas1 = document.querySelector('#firstCanvas');
const canvas2 = document.querySelector('#secondCanvas');
const canvas3 = document.querySelector('#thirdCanvas');
const canvas4 = document.querySelector('#fourthCanvas');

const ctx1Btn = document.querySelector('#ctx1Btn');
const ctx2Btn = document.querySelector('#ctx2Btn');
const clipBtn = document.querySelector('#ctx1ClipBtn');

let context1 = null;
let context2 = null;

/**
 * Adds a model to the given context and disables the button
 * @param {Object} ctx - The WebVis context
 * @param {HTMLButtonElement} btn - The button to disable after adding the model
 */
async function addModel(ctx, btn) {
    const modelId = ctx.add({
        dataURI: 'urn:x-i3d:examples:catia:bike',
    });
    // Enable the Dataset
    console.log('adding model with id ' + modelId);
    await ctx.setProperty(modelId, webvis.Property.ENABLED, true);

    btn.disabled = true;
}

/**
 * Adds a clip plane to the given context and disables the button
 * @param {Object} ctx - The WebVis context
 * @param {HTMLButtonElement} btn - The button to disable after adding the clip plane
 */
async function addClipPlane(ctx, btn) {
    // Get the Bounding Box of our Model
    const boundingBox = await ctx.getProperty(1, webvis.Property.GLOBAL_VOLUME);

    // Create a Clip Plane at the center of the Model
    const clipPlaneId = ctx.createClipPlane({
        position: boundingBox.getCenter(),
    });

    btn.disabled = true;
}

/**
 * Initializes multiple WebVis contexts and creates viewers for each
 */
async function init() {
    // Create contexts
    context1 = await webvis.requestContext('myFirstContext');
    context2 = await webvis.requestContext('mySecondContext');

    //create viewers
    const viewer1 = context1.createViewer('myFirstViewer', canvas1);
    const viewer2 = context1.createViewer('mySecondViewer', canvas2);
    const viewer3 = context2.createViewer('myThirdViewer', canvas3);
    const viewer4 = context2.createViewer('myFourthViewer', canvas4);

    // Set up event listeners
    ctx1Btn.addEventListener('click', () => {
        addModel(context1, ctx1Btn);
        clipBtn.disabled = false;
    });
    ctx2Btn.addEventListener('click', () => addModel(context2, ctx2Btn));
    ctx1ClipBtn.addEventListener('click', () => addClipPlane(context1, ctx1ClipBtn));
}

// Initialize the application
init();
