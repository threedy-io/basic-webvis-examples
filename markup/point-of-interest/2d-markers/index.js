/**
 * @fileoverview WebVis 2D Markers Example
 * Demonstrates HTML markers that track 3D positions in real-time on a cube model.
 */

let viewer = null;
const pois = [];

/**
 * Initialize WebVis viewer and cube model, setup event listeners
 * @async
 * @function initializeWebVisExample
 * @returns {Promise<void>}
 */
async function initializeWebVisExample() {
    const webvisComponent = document.querySelector('webvis-viewer');
    // WEBVIS_API: Request WebVis context from the viewer component
    const context = await webvisComponent.requestContext();
    viewer = await webvisComponent.requestViewer();

    // WEBVIS_API: Add a cube model to the scene
    const cube = context.add({ dataURI: 'urn:x-i3d:shape:box' });
    await context.setProperty(cube, webvis.Property.ENABLED, true);
    logActivity('info', 'cube loaded successfully');

    registerListeners(context);
    initControls();
}

/**
 * Updates all POI marker positions when the WebVis view changes
 * @function updatePOIs
 */
function updatePOIs() {
    pois.forEach(([element, position]) => worldToScreen(element, position));
}

/**
 * Creates 8 POI markers positioned at all corners of the cube
 * Each marker displays a sequential number and tracks its 3D position
 * @function createPOIs
 */
function createPOIs() {
    const container = document.querySelector('.template-viewer');
    if (!container) return console.error('Viewer container not found');

    let counter = 0;
    for (let x = -0.5; x <= 0.5; x += 1) {
        for (let y = -0.5; y <= 0.5; y += 1) {
            for (let z = -0.5; z <= 0.5; z += 1) {
                const poi = document.createElement('span');
                poi.className = 'poi';
                poi.textContent = counter++;

                const position = [x, y, z];
                worldToScreen(poi, position);
                container.appendChild(poi);
                pois.push([poi, position]);
            }
        }
    }
}

/**
 * Projects 3D world coordinates to 2D screen coordinates and positions DOM element
 * @function worldToScreen
 * @param {HTMLElement} element - The DOM element to position
 * @param {Array<number>} coordinates - Destructured array of [x, y, z] coordinates
 */
function worldToScreen(element, [x, y, z]) {
    const screenPos = [];
    // WEBVIS_API: Project 3D world coordinates to 2D screen coordinates
    viewer.projectPointToCanvas([x, y, z, 1], screenPos);

    element.style.left = screenPos[0] - 12.5 + 'px';
    element.style.top = screenPos[1] - 12.5 + 'px';
}

/**
 * Register WebVis event listeners for view changes
 * @function registerListeners
 * @param {Object} context - WebVis context object
 */
function registerListeners(context) {
    // WEBVIS_API: Register listener for view changes to update POI positions
    context.registerListener([webvis.EventType.VIEW_CHANGED], updatePOIs);
}

/**
 * Initialize controls and event handlers for the Add Markers button
 * @function initControls
 */
function initControls() {
    const addBtn = document.getElementById('addMarkersBtn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
        clearPOIs();
        createPOIs();
        logActivity('success', `Created ${pois.length} POI markers`);
    });
}

/**
 * Removes all POI markers from the DOM and clears the POI array
 * @function clearPOIs
 */
function clearPOIs() {
    pois.forEach(([element]) => element.remove());
    pois.length = 0;
}

/**
 * Utility function for logging activity messages to the activity panel
 * @function logActivity
 * @param {string} type - The type of log entry (e.g., 'info', 'success', 'error')
 * @param {string} message - The message to log
 */
function logActivity(type, message) {
    const log = document.getElementById('activityLog');
    if (log) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString()}</span><span class="log-message">${message}</span>`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', initializeWebVisExample);
