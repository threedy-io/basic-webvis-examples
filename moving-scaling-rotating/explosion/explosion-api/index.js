/**
 * Explosion API Example
 *
 * This example demonstrates how to use the WebVis explosion API directly
 * to create explosion effects. It loads a 3D model and uses the built-in
 * explosion functionality to move parts outward from the center.
 *
 * @author WebVis Examples Team
 */

// Global variables
let context = null;
let viewer = null;
let nodeId = null;
let explosionActive = false;
const factorSliderValue = 1.0;
const model = 'urn:x-i3d:examples:catia:bike'; // Change to desired model URN

// Get the context and add a model
async function initializeExplosionExample() {
    try {
        // WEBVIS_API: Get WebVis context
        const webvisComponent = document.querySelector('webvis-viewer');
        context = await webvisComponent.requestContext();

        if (!context) {
            logActivity('error', 'Failed to initialize WebVis context');
            throw new Error('WebVis context initialization failed');
        }

        // WEBVIS_API: Get viewer
        viewer = context.getViewer();
        logActivity('info', 'Model loading...');

        // WEBVIS_API: Add model to the context
        nodeId = context.add({
            dataURI: model,
            initialProperties: { enabled: true },
        });

        // Set up slider event listener to update display value in real-time
        const factorSlider = document.getElementById('explosionFactor');
        const factorValue = document.getElementById('explosionFactorValue');

        if (factorSlider && factorValue) {
            // Update display value when slider changes
            factorSlider.addEventListener('input', function () {
                factorValue.textContent = this.value;
            });

            // Initialize display value
            factorValue.textContent = factorSlider.value;
        }

        logActivity('success', 'WebVis context initialized successfully');
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

// Function to create and perform explosion using WebVis explosion API
async function explode() {
    try {
        const factorSlider = document.getElementById('explosionFactor');
        const explosionFactor = factorSlider ? parseFloat(factorSlider.value) : factorSliderValue;

        if (!nodeId) {
            logActivity('error', 'No model loaded yet');
            return;
        }

        logActivity('info', `Creating explosion with factor: ${explosionFactor}...`);

        // WEBVIS_API: Create explosion from the center of the node's BoxVolume
        await context.createExplosion(nodeId);
        logActivity('success', 'Explosion created successfully');

        // WEBVIS_API: Perform the explosion - all parts are moved away by the specified factor
        await context.performExplosion(explosionFactor);
        logActivity('success', `Explosion performed with factor ${explosionFactor}`);

        explosionActive = true;

        // WEBVIS_API: Fit view to the exploded model
        await viewer.fitViewToNode(nodeId);
    } catch (error) {
        logActivity('error', `Explosion failed: ${error.message}`);
    }
}

// Function to reset explosion using WebVis explosion API
async function performReset() {
    try {
        if (!nodeId) {
            logActivity('error', 'No model loaded yet');
            return;
        }

        logActivity('info', 'Resetting explosion...');

        if (explosionActive) {
            // WEBVIS_API: End explosion and reset all transformations
            await context.endExplosion();
            logActivity('success', 'Explosion ended and transformations reset');
            explosionActive = false;
        } else {
            logActivity('info', 'No active explosion to reset');
        }

        // WEBVIS_API: Fit view to the original model
        await viewer.fitViewToNode(nodeId);
    } catch (error) {
        logActivity('error', `Reset failed: ${error.message}`);
    }
}

// Utility function for activity logging
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

// Initialize the example
document.addEventListener('DOMContentLoaded', function () {
    initializeExplosionExample();
});
