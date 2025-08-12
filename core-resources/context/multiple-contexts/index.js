/**
 * Multiple Contexts Example
 * This example demonstrates multiple WebVis contexts with shared viewers
 */

// =========================
// Variable Declarations
// =========================
let activityLog = [];
let firstContext = null;
let secondContext = null;

const firstContextBtn = document.querySelector('#ctx1Btn');
const secondContextBtn = document.querySelector('#ctx2Btn');
const clipBtn = document.querySelector('#ctx1ClipBtn');

/**
 * Initializes multiple WebVis contexts and creates viewers for each
 */
async function init() {
    try {
        logActivity('info', 'WebVis Multiple Contexts example initialized');
        logActivity('info', 'Creating WebVis contexts...');
        // WEBVIS_API: Create contexts
        firstContext = await document
            .querySelector('#firstViewer')
            .requestContext('myFirstContext');
        secondContext = await document
            .querySelector('#thirdViewer')
            .requestContext('mySecondContext');

        logActivity('success', 'WebVis contexts created successfully');

        // Set up event listeners
        firstContextBtn.addEventListener('click', () => {
            addModel(firstContext, firstContextBtn, 'Context 1');
        });

        secondContextBtn.addEventListener('click', () => {
            addModel(secondContext, secondContextBtn, 'Context 2');
        });

        clipBtn.addEventListener('click', () => {
            addClipPlane(firstContext, clipBtn);
        });

        logActivity('success', 'Multiple Contexts example ready!');
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Adds a model to the given context and disables the button
 * @param {Object} ctx - The WebVis context
 * @param {HTMLButtonElement} btn - The button to disable after adding the model
 * @param {string} contextName - Name of the context for logging
 */
async function addModel(ctx, btn, contextName) {
    try {
        logActivity('info', `Adding model to ${contextName}...`);
        // WEBVIS_API: Add a model to the context
        const modelId = ctx.add({
            dataURI: 'urn:x-i3d:examples:catia:bike',
        });

        logActivity('info', 'adding model with id ' + modelId);
        // WEBVIS_API: Enable the Dataset
        await ctx.setProperty(modelId, webvis.Property.ENABLED, true);

        btn.disabled = true;
        btn.textContent = '✅ Model Added';

        logActivity('success', `Model successfully added to ${contextName}`);

        // Enable clip plane button only for context 1
        if (contextName === 'Context 1') {
            clipBtn.disabled = false;
        }
    } catch (error) {
        logActivity('error', `Failed to add model to ${contextName}: ${error.message}`);
    }
}

/**
 * Adds a clip plane to the given context and disables the button
 * @param {Object} ctx - The WebVis context
 * @param {HTMLButtonElement} btn - The button to disable after adding the clip plane
 */
async function addClipPlane(ctx, btn) {
    try {
        logActivity('info', 'Adding clip plane to Context 1...');

        // WEBVIS_API: Get the Bounding Box of our Model
        const boundingBox = await ctx.getProperty(1, webvis.Property.GLOBAL_VOLUME);

        // WEBVIS_API: Create a Clip Plane at the center of the Model
        const clipPlaneId = ctx.createClipPlane({
            position: boundingBox.getCenter(),
        });

        btn.disabled = true;
        btn.textContent = '✅ Clip Plane Added';

        logActivity('success', 'Clip plane successfully added to Context 1');
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

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
