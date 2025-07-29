const canvas = document.querySelector('canvas');

const initBtn = document.querySelector('#initBtn');
const viewerBtn = document.querySelector('#viewerBtn');
const addModelBtn = document.querySelector('#addModelBtn');

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
 * Creates a viewer and attaches it to the given canvas
 * @param {Object} ctx - The WebVis context
 * @param {HTMLCanvasElement} canvas - The canvas element to attach the viewer to
 */
async function addViewer(ctx, canvas) {
    const viewer = ctx.createViewer('myFirstViewer', canvas);
    console.log('initialized viewer');
}

/**
 * Initializes the WebVis context
 */
async function init() {
    // Create context
    context = await webvis.requestContext('myFirstContext');
    console.log('initialized context');
}

// Event listeners for buttons
initBtn.addEventListener('click', () => {
    init();
    viewerBtn.disabled = false;
    initBtn.disabled = true;
});

viewerBtn.addEventListener('click', () => {
    addViewer(context, canvas);
    viewerBtn.disabled = true;
    addModelBtn.disabled = false;
});

addModelBtn.addEventListener('click', () => {
    addModel(context);
    addModelBtn.disabled = true;
});
