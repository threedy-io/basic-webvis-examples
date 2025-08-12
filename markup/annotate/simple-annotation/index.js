/**
 * @fileoverview WebVis Simple Annotation Example
 * Demonstrates basic annotation creation and removal on model corners.
 */

const PRIMITIVE_MODEL_URI = 'urn:x-i3d:shape:cube';

let webvisContext = null;
let modelNodeId = null;

/**
 * Initialize the WebVis example by setting up context, loading model, and configuring handlers
 * @async
 * @function initializeWebVisExample
 * @returns {Promise<void>}
 * @throws {Error} When WebVis context initialization fails
 */
async function initializeWebVisExample() {
    try {
        const webvisComponent = document.querySelector('webvis-viewer');

        // WEBVIS_API: Get the webvis component and request context
        webvisContext = await webvisComponent.requestContext();

        if (!webvisContext) {
            throw new Error('WebVis context initialization failed');
        }

        // WEBVIS_API: Add a simple box model to the scene
        modelNodeId = webvisContext.add({ dataURI: PRIMITIVE_MODEL_URI });
        await webvisContext.setProperty(modelNodeId, webvis.Property.ENABLED, true);

        // Initialize button handlers
        initializeButtonHandlers();

        console.log('WebVis example initialized successfully');
        logActivity('info', 'WebVis example initialized successfully');
    } catch (error) {
        console.error('WebVis initialization error:', error);
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Initialize button event handlers for annotation controls
 * @function initializeButtonHandlers
 */
function initializeButtonHandlers() {
    document.getElementById('addAnnotationBtn').addEventListener('click', addAnnotations);
    document.getElementById('removeAnnotationBtn').addEventListener('click', removeAnnotations);
}

/**
 * Add annotations to all 8 corners of the cube model
 * Creates numbered annotations with anchor and content offset positions
 * @async
 * @function addAnnotations
 * @returns {Promise<void>}
 */
async function addAnnotations() {
    if (!webvisContext || !modelNodeId) return;

    let cornerNumber = 0;

    // Create annotations at all 8 corners of the cube
    for (let xPosition = -0.5; xPosition <= 0.5; xPosition++) {
        for (let yPosition = -0.5; yPosition <= 0.5; yPosition++) {
            for (let zPosition = -0.5; zPosition <= 0.5; zPosition++) {
                // WEBVIS_API: Create an annotation at the specified position
                await webvisContext.createAnnotation(
                    modelNodeId,
                    `Corner ${cornerNumber}`,
                    true,
                    [xPosition, yPosition, zPosition],
                    [xPosition * 0.2, yPosition * 0.2, zPosition * 0.2]
                );
                cornerNumber++;
            }
        }
    }

    logActivity('success', 'Annotations created successfully');
}

/**
 * Remove all annotations from the scene
 * Retrieves all annotation IDs and removes them individually
 * @function removeAnnotations
 */
function removeAnnotations() {
    if (!webvisContext) return;

    // WEBVIS_API: Get all annotation IDs
    const annotationIds = webvisContext.getAnnotations();

    // WEBVIS_API: Remove each annotation by ID
    annotationIds.forEach((id) => webvisContext.removeAnnotation(id));
    logActivity('success', 'Annotations removed successfully');
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
