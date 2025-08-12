/**
 * Simple Canvas Example
 * This is a minimalistic WebVis example demonstrating a basic viewer setup with an HTML canvas
 */

// =========================
// Variable Declarations
// =========================
let activityLog = [];
let webvisContext = null;
let currentModelId = null;

const initBtn = document.querySelector('#initBtn');
const viewerBtn = document.querySelector('#viewerBtn');
const addModelBtn = document.querySelector('#addModelBtn');

/**
 * Initializes the WebVis viewer with basic setup
 */
async function init() {
    try {
        logActivity('info', 'Canvas example initialized');
        // WEBVIS_API: Create WebVis context
        webvisContext = await webvis.requestContext('myFirstContext');

        if (!webvisContext) {
            throw new Error('Failed to get WebVis context');
        }

        logActivity('success', 'WebVis context created successfully');
        logActivity('success', 'Context ready! Click "Create Viewer" to continue.');

        // Enable the Create Viewer button, disable Initialize
        viewerBtn.disabled = false;
        initBtn.disabled = true;
        initBtn.textContent = '✅ Initialized';
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Loads the default model into the scene
 */
async function loadModel() {
    try {
        logActivity('info', 'Loading default model...');

        // WEBVIS_API: Add a simple box model to the scene
        currentModelId = webvisContext.add({
            dataURI: 'urn:x-i3d:shape:box',
        });

        // WEBVIS_API: Enable the model to make it visible
        await webvisContext.setProperty(currentModelId, webvis.Property.ENABLED, true);

        addModelBtn.disabled = true;
        addModelBtn.textContent = '✅ Model Loaded';
        logActivity('success', 'Default box model loaded successfully');
    } catch (error) {
        logActivity('error', `Failed to load model: ${error.message}`);
    }
}

async function addViewer() {
    try {
        // WEBVIS_API: Attach the viewer to the canvas
        const canvas = document.querySelector('#firstCanvas');
        await webvisContext.createViewer('myFirstViewer', canvas);
        logActivity('success', 'Viewer created and attached to canvas');
        viewerBtn.disabled = true;
        viewerBtn.textContent = '✅ Viewer Created';
        addModelBtn.disabled = false;
    } catch (error) {
        logActivity('error', `Failed to create viewer: ${error.message}`);
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
        logEntry.innerHTML = `
            <span class="log-time">${timestamp}</span>
            <span class="log-message">${message}</span>
        `;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// Event listeners for buttons
initBtn.addEventListener('click', () => {
    init();
});

viewerBtn.addEventListener('click', () => {
    addViewer();
});

addModelBtn.addEventListener('click', async () => {
    await loadModel();
});
