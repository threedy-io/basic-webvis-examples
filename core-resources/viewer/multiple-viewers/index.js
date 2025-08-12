/**
 * Multiple Viewers Example
 * This example demonstrates multiple viewers attached to the same WebVis context
 */

// =========================
// Variable Declarations
// =========================
let activityLog = [];
let context = null;

const initBtn = document.querySelector('#initBtn');
const addModelBtn = document.querySelector('#addModelBtn');
const clipBtn = document.querySelector('#clipBtn');

/**
 * Initializes the WebVis context and creates multiple viewers
 */
async function init() {
    try {
        logActivity('info', 'Initializing WebVis context...');

        // WEBVIS_API: Create Context
        context = await webvis.getContext('myContext');
        logActivity('success', 'WebVis context initialized');

        logActivity('info', 'Creating multiple viewers...');

        initBtn.disabled = true;
        initBtn.textContent = '✅ Initialized';
        addModelBtn.disabled = false;

        logActivity('success', 'Multiple Viewers example ready!');
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Adds a model to the given context
 * @param {Object} ctx - The WebVis context
 */
async function addModel(ctx) {
    try {
        logActivity('info', 'Adding model to context...');
        // WEBVIS_API: Add a simple box model to the scene
        const modelId = ctx.add({
            dataURI: 'urn:x-i3d:examples:catia:bike',
        });

        // WEBVIS_API: Enable the Dataset
        await ctx.setProperty(modelId, webvis.Property.ENABLED, true);

        addModelBtn.disabled = true;
        addModelBtn.textContent = '✅ Model Added';
        clipBtn.disabled = false;

        logActivity('success', 'Model successfully added to all viewers');
    } catch (error) {
        logActivity('error', `Failed to add model: ${error.message}`);
    }
}

/**
 * Adds a clip plane to the given context
 * @param {Object} ctx - The WebVis context
 */
async function addClipPlane(ctx) {
    try {
        logActivity('info', 'Adding clip plane...');

        // WEBVIS_API: Get the Bounding Box of our Model
        const boundingBox = await ctx.getProperty(1, webvis.Property.GLOBAL_VOLUME);

        // WEBVIS_API: Create a Clip Plane at the center of the Model
        const clipPlaneId = ctx.createClipPlane({
            position: boundingBox.getCenter(),
        });

        clipBtn.disabled = true;
        clipBtn.textContent = '✅ Clip Plane Added';

        logActivity('success', 'Clip plane successfully added to all viewers');
    } catch (error) {
        logActivity('error', `Failed to add clip plane: ${error.message}`);
    }
}

/**
 * Logs an activity message with a timestamp.
 * @param {string} type - The type of log entry ('info', 'success', 'warning', 'error')
 * @param {string} message - The message to log
 */
function logActivity(type = 'info', message) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = { type, message, timestamp };
    activityLog.push(entry);

    const logContainer = document.getElementById('activityLog');
    if (logContainer) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `<span class="log-time">${timestamp}</span> <span class="log-message">${message}</span>`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// Event listeners for buttons
initBtn.addEventListener('click', () => {
    init();
});

addModelBtn.addEventListener('click', () => {
    addModel(context);
});

clipBtn.addEventListener('click', () => {
    addClipPlane(context);
});

// Initialize the template
logActivity('info', 'WebVis Multiple Viewers example loaded');
