/**
 * @fileoverview WebVis Advanced Annotation Example
 * Demonstrates different types of annotations (text, PDF, media, image) with interactive controls.
 */

const CUBE_SIZE = 1;
const CUBE_HALF_SIZE = CUBE_SIZE / 2;
const ANNOTATION_OFFSET_MULTIPLIER = 1.2;

/**
 * @constant {Object} HTML content templates for different annotation types
 * @property {string} text - HTML template for text annotation
 * @property {string} pdf - HTML template for PDF iframe annotation
 * @property {string} image - HTML template for image annotation
 * @property {string} video - HTML template for video iframe annotation
 */
const ANNOTATION_CONTENT_TEMPLATES = {
    text: `<div style="padding: 10px;"><h3>Text Annotation</h3><p>Example text annotation with rich formatting.</p></div>`,
    pdf: `<iframe src="assets/i3dhub-logo.pdf" width="400" height="400" title="PDF Document"></iframe>`,
    image: `<div style="text-align: center; padding: 10px;"><img src="assets/cube.jpg" alt="3D Cube" width="150" height="180"><br><small>Example 3D Cube</small></div>`,
    video: `<iframe width="400" height="225" src="https://www.youtube.com/embed/mGM1zRz9eW8" title="WebVis Demo Video" frameborder="0" allowfullscreen></iframe>`,
};

/**
 * @constant {Array<Object>} Predefined positions on the front face of the cube
 * @property {number} x - X coordinate position
 * @property {number} y - Y coordinate position
 * @property {number} z - Z coordinate position
 */
const ANNOTATION_POSITIONS = [
    { x: -CUBE_HALF_SIZE, y: -CUBE_HALF_SIZE, z: -CUBE_HALF_SIZE }, // bottom-left
    { x: CUBE_HALF_SIZE, y: -CUBE_HALF_SIZE, z: -CUBE_HALF_SIZE }, // bottom-right
    { x: -CUBE_HALF_SIZE, y: CUBE_HALF_SIZE, z: -CUBE_HALF_SIZE }, // top-left
    { x: CUBE_HALF_SIZE, y: CUBE_HALF_SIZE, z: -CUBE_HALF_SIZE }, // top-right
];

/**
 * @constant {Object} Button configuration mapping annotation types to UI controls
 * @property {Object} text - Text annotation button config
 * @property {Object} pdf - PDF annotation button config
 * @property {Object} video - Video annotation button config
 * @property {Object} image - Image annotation button config
 */
const BUTTON_CONFIG = {
    text: { id: 'addTextBtn', position: 0 },
    pdf: { id: 'addPdfBtn', position: 1 },
    video: { id: 'addMediaBtn', position: 2 },
    image: { id: 'addImageBtn', position: 3 },
};

let webvisContext = null;
let cubeNodeId = null;

/**
 * Initialize WebVis context, create cube model, and setup event handlers
 * @async
 * @function initializeWebVisExample
 * @returns {Promise<void>}
 * @throws {Error} When WebVis viewer component is not found
 */
async function initializeWebVisExample() {
    try {
        const webvisComponent = document.querySelector('webvis-viewer');
        if (!webvisComponent) throw new Error('WebVis viewer not found');

        // WEBVIS_API: Request WebVis context from the viewer component
        webvisContext = await webvisComponent.requestContext();
        logActivity('info', 'WebVis context requested');

        // WEBVIS_API: Add a cube model to the scene
        cubeNodeId = webvisContext.add({ dataURI: 'urn:x-i3d:shape:box' });
        logActivity('info', 'Cube created');

        // WEBVIS_API: Enable the cube model for rendering
        await webvisContext.setProperty(cubeNodeId, 'enabled', true);
        setupEventHandlers();
    } catch (error) {
        console.error('Failed to initialize WebVis:', error);
    }
}

/**
 * Setup button event handlers for annotation controls
 * @function setupEventHandlers
 */
function setupEventHandlers() {
    Object.entries(BUTTON_CONFIG).forEach(([type, config]) => {
        const button = document.getElementById(config.id);
        if (button) button.addEventListener('click', () => createAnnotationByType(type));
    });

    const clearBtn = document.getElementById('clearAnnotationsBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAllAnnotations);
}

/**
 * Create annotation of specified type at predefined position
 * @function createAnnotationByType
 * @param {string} type - Annotation type ('text', 'pdf', 'video', 'image')
 */
function createAnnotationByType(type) {
    try {
        const config = BUTTON_CONFIG[type];
        const { x, y, z } = ANNOTATION_POSITIONS[config.position];
        const contentOffset = [
            x * ANNOTATION_OFFSET_MULTIPLIER,
            y * ANNOTATION_OFFSET_MULTIPLIER,
            z * ANNOTATION_OFFSET_MULTIPLIER,
        ];

        createAnnotation(
            cubeNodeId,
            contentOffset,
            [x, y, z],
            ANNOTATION_CONTENT_TEMPLATES[type],
            `${type} Annotation`
        );
        logActivity(
            'success',
            `📍 ${type.charAt(0).toUpperCase() + type.slice(1)} annotation created`
        );
    } catch (error) {
        console.error(`Failed to create ${type} annotation:`, error);
    }
}

/**
 * Create annotation with WebVis API using provided properties
 * @function createAnnotation
 * @param {number} nodeId - Connected node ID for the annotation
 * @param {Array<number>} offset - Content offset position [x, y, z]
 * @param {Array<number>} anchor - Anchor position [x, y, z]
 * @param {string} content - HTML content for the annotation
 * @param {string} name - Display name for the annotation
 */
function createAnnotation(nodeId, offset, anchor, content, name) {
    const annotationProperties = {
        connectedNodeId: nodeId,
        contentOffset: offset,
        anchorPosition: anchor,
        content: content,
        name: name,
    };

    // WEBVIS_API: Create an annotation with specified properties
    webvisContext.createAnnotation(annotationProperties);
}

/**
 * Clear all annotations from the scene
 * Retrieves all annotation IDs and removes them individually
 * @function clearAllAnnotations
 */
function clearAllAnnotations() {
    if (!webvisContext) return;

    try {
        // WEBVIS_API: Get all annotation IDs from the context
        const annotationIds = webvisContext.getAnnotations();
        for (const id of annotationIds) {
            // WEBVIS_API: Remove each annotation by ID
            webvisContext.removeAnnotation(id);
        }

        logActivity('success', '🗑️ All annotations cleared');
    } catch (error) {
        console.error('Failed to clear annotations:', error);
    }
}

/**
 * Log activity message to the activity panel with timestamp
 * Maintains a maximum of 10 log entries, removing older entries
 * @function logActivity
 * @param {string} type - The type of log entry (e.g., 'info', 'success', 'error')
 * @param {string} message - Activity message to log
 */
function logActivity(type, message) {
    const log = document.getElementById('activityLog');
    if (!log) return;

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span><span class="log-message"> ${message}</span>`;
    log.insertBefore(entry, log.firstChild);

    // Keep only 10 entries
    while (log.children.length > 10) {
        log.removeChild(log.lastChild);
    }
}

document.addEventListener('DOMContentLoaded', initializeWebVisExample);
