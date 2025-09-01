/**
 * Explosion Sub-Part Transformation Example
 *
 * This example demonstrates how to create explosion effects with sub-part transformations
 * using WebVis. It loads a 3D model and automatically explodes it by moving each part
 * outward from the center.
 *
 * @author WebVis Examples Team
 */

// Global variables
let context = null;
let viewer = null;
let nodeId = null;
const model = 'urn:x-i3d:examples:x3d:v8'; // Change to desired model URN
const factorSliderValue = 1.0;

// Get the context and add a model
async function initializeExplosionExample() {
    try {
        const webvisComponent = document.querySelector('webvis-viewer');
        context = await webvisComponent.requestContext();

        if (!context) {
            logActivity('error', 'Failed to initialize WebVis context');
            throw new Error('WebVis context initialization failed');
        }
        // Get viewer
        viewer = context.getViewer();
        logActivity('info', 'Model loading...');
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
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

// Function to create explosion effect from the root node center
async function performExplosion() {
    try {
        const factorSlider = document.getElementById('explosionFactor');
        const explosionFactor = factorSlider ? parseFloat(factorSlider.value) : factorSliderValue;

        logActivity('info', `Starting explosion with factor: ${explosionFactor}...`);

        // First reset all transforms to ensure consistent starting point
        await performReset();

        // Get all descendant nodes recursively
        const allNodes = await getAllDescendantNodes(nodeId);

        if (allNodes.length === 0) {
            logActivity('warning', 'No child nodes found for explosion');
            return;
        }

        // Get the center position from the root volume
        const centerVolume = await context.getProperty(nodeId, webvis.Property.GLOBAL_VOLUME);
        const centerPoint = centerVolume.getCenter();

        logActivity('success', `Exploding ${allNodes.length} parts`);

        for (const childId of allNodes) {
            try {
                // Get the current local transform
                const localTransformation = await context.getProperty(
                    childId,
                    webvis.Property.LOCAL_TRANSFORM
                );

                // Get the child node's center position (refresh after reset)
                let childCenter;
                try {
                    const childVolume = await context.getProperty(
                        childId,
                        webvis.Property.GLOBAL_VOLUME
                    );
                    childCenter = childVolume.getCenter();

                    // Check for invalid positions (NaN or undefined)
                    if (!childCenter || childCenter.some((coord) => !isFinite(coord))) {
                        logActivity('warning', `Node ${childId} has invalid position, skipping`);
                        continue;
                    }
                } catch (error) {
                    logActivity('warning', `Could not get volume for node ${childId}, skipping`);
                    continue;
                }

                // Extract current translation from the transformation matrix
                // Translation components are always at indices 12, 13, 14 in a 4x4 matrix
                const currentTranslation = [
                    localTransformation[12],
                    localTransformation[13],
                    localTransformation[14],
                ];

                // Calculate explosion direction vector from root center to part center
                const explosionVector = [
                    childCenter[0] - centerPoint[0] + currentTranslation[0],
                    childCenter[1] - centerPoint[1] + currentTranslation[1],
                    childCenter[2] - centerPoint[2] + currentTranslation[2],
                ];

                // Validate explosion vector
                if (explosionVector.some((coord) => !isFinite(coord))) {
                    logActivity(
                        'warning',
                        `Node ${childId} has invalid explosion vector, skipping`
                    );
                    continue;
                }

                if (explosionFactor > 0) {
                    localTransformation[12] += explosionVector[0] * explosionFactor;
                    localTransformation[13] += explosionVector[1] * explosionFactor;
                    localTransformation[14] += explosionVector[2] * explosionFactor;
                }

                await context.setProperty(
                    childId,
                    webvis.Property.LOCAL_TRANSFORM,
                    localTransformation
                );
            } catch (error) {
                logActivity('warning', `Failed to explode node ${childId}: ${error.message}`);
            }
        }

        logActivity('success', 'Explosion effect completed!');
    } catch (error) {
        logActivity('error', `Explosion failed: ${error.message}`);
    }
    // Fit the view again to the model only for user-initiated resets
    await viewer.fitViewToNode(nodeId);
}

// Helper function to get all descendant nodes recursively
async function getAllDescendantNodes(nodeId) {
    const descendants = [];

    async function collectNodes(currentNodeId) {
        try {
            const children = await context.getProperty(currentNodeId, webvis.Property.CHILDREN);

            for (const childId of children) {
                // Validate that the child node has valid properties before adding it
                try {
                    const isEnabled = await context.getProperty(childId, webvis.Property.ENABLED);
                    if (isEnabled) {
                        descendants.push(childId);
                    }
                } catch (error) {
                    logActivity('warning', `Node ${childId} has invalid properties, skipping`);
                    continue;
                }

                // Recursively get children of children
                await collectNodes(childId);
            }
        } catch (error) {
            // Node might not have children property
            logActivity('info', `Node ${currentNodeId} has no children property`);
        }
    }

    await collectNodes(nodeId);
    return descendants;
}

// Function to reset explosion
async function performReset() {
    try {
        logActivity('info', 'Resetting explosion...');
        const allNodes = await getAllDescendantNodes(nodeId);

        for (const childId of allNodes) {
            try {
                // Reset local transform
                await context.resetProperty(childId, webvis.Property.LOCAL_TRANSFORM);
            } catch (error) {
                logActivity('warning', `Failed to reset node ${childId}: ${error.message}`);
            }
        }

        // Fit the view again to the model only for user-initiated resets
        await viewer.fitViewToNode(nodeId);
        logActivity('success', 'Explosion reset complete');
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
