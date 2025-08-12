/**
 * Simple Viewer Example
 * This is a minimalistic WebVis example demonstrating basic functionality
 */

// =========================
// Variable Declarations
// =========================
let activityLog = [];
let webvisContext = null;
let currentModelId = null;

const loadModelBtn = document.querySelector('#loadModelBtn');

/**
 * Initializes the WebVis viewer with basic setup
 */
async function init() {
    try {
        logActivity('info', 'WebVis Simple Viewer example initialized');

        // Event listeners
        loadModelBtn.addEventListener('click', loadModel);

        // WEBVIS_API: Get the webvis component and request context
        const webvisComponent = document.querySelector('webvis-viewer');
        webvisContext = await webvisComponent.requestContext();

        if (!webvisContext) {
            throw new Error('Failed to get WebVis context');
        }

        logActivity('success', 'Simple Viewer example ready! Click "Load Default Model" to begin.');
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
        logActivity('success', 'Default box model loaded successfully');
    } catch (error) {
        logActivity('error', `Failed to load model: ${error.message}`);
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
