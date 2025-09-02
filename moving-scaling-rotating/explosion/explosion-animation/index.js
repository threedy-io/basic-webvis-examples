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
const factorSliderValue = 1.0;
const explosionDuration = 2000;
const baseMultiplier = 500; // Amplify the explosion for better visibility
const model = 'urn:x-i3d:examples:x3d:v8'; // Change to desired model URN

/**
 * Initialize the explosion example by setting up the WebVis context and loading a 3D model.
 */
async function initializeExplosionExample() {
    try {
        // WEBVIS_API: Get the webvis context
        const webvisComponent = document.querySelector('webvis-viewer');
        context = await webvisComponent.requestContext();

        if (!context) {
            logActivity('error', 'Failed to initialize WebVis context');
            throw new Error('WebVis context initialization failed');
        }
        // WEBVIS_API: Get viewer
        viewer = context.getViewer();
        logActivity('info', 'Model loading...');
        // WEBVIS_API: Load the 3D model
        nodeId = context.add({
            dataURI: model,
            initialProperties: { enabled: true },
        });

        // Set up slider event listener to update display value in real-time
        const factorSlider = document.getElementById('explosionFactor');
        const factorValue = document.getElementById('explosionFactorValue');
        const durationSlider = document.getElementById('animationDuration');
        const durationValue = document.getElementById('animationDurationValue');

        if (factorSlider && factorValue) {
            // Update display value when slider changes
            factorSlider.addEventListener('input', function () {
                factorValue.textContent = this.value;
            });

            // Initialize display value
            factorValue.textContent = factorSlider.value;
        }

        if (durationSlider && durationValue) {
            // Update display value when slider changes
            durationSlider.addEventListener('input', function () {
                durationValue.textContent = this.value;
            });

            // Initialize display value
            durationValue.textContent = durationSlider.value;
        }
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Perform explosion effect on a 3D model
 */
async function performExplosion() {
    try {
        const factorSlider = document.getElementById('explosionFactor');
        const durationSlider = document.getElementById('animationDuration');

        const explosionFactor = factorSlider ? parseFloat(factorSlider.value) : factorSliderValue;

        const animationDuration = durationSlider
            ? parseInt(durationSlider.value)
            : explosionDuration;

        logActivity(
            'info',
            `Starting explosion with factor: ${explosionFactor}, duration: ${animationDuration}ms...`
        );

        // First reset all transforms to ensure consistent starting point
        await performReset();

        // Get all descendant nodes recursively
        const allNodes = await getAllDescendantNodes(nodeId);

        if (allNodes.length === 0) {
            logActivity('warning', 'No child nodes found for explosion');
            return;
        }

        // WEBVIS_API: Get the center position from the root volume
        const centerVolume = await context.getProperty(nodeId, webvis.Property.GLOBAL_VOLUME);
        const centerPoint = centerVolume.getCenter();

        logActivity('success', `Exploding ${allNodes.length} parts`);

        for (const childId of allNodes) {
            try {
                // Check if this node is a leaf node (has no children)
                if (!(await isLeafNode(childId))) {
                    logActivity('info', `Node ${childId} has children, skipping animation`);
                    continue;
                }

                //WEBVIS_API: Get the current local transform
                const localTransformation = await context.getProperty(
                    childId,
                    webvis.Property.LOCAL_TRANSFORM
                );

                // Get the child node's center position (refresh after reset)
                let childCenter;
                try {
                    // WEBVIS_API: Get the global volume of the child node
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

                // Calculate simple direction vector from model center to part center
                const directionVector = [
                    childCenter[0] - centerPoint[0],
                    Math.abs(childCenter[1] - centerPoint[1]), // Force Y to be positive (upward only)
                    0, // Zero out Z-axis to eliminate forward/back movement
                ];

                // Validate direction vector and check for zero-length (parts at model center)
                if (directionVector.some((coord) => !isFinite(coord))) {
                    logActivity(
                        'warning',
                        `Node ${childId} has invalid direction vector, skipping`
                    );
                    continue;
                }

                // Calculate target position: current position + (direction * factor)
                const targetPosition = [
                    currentTranslation[0] + directionVector[0] * explosionFactor * baseMultiplier,
                    currentTranslation[1] + directionVector[1] * explosionFactor * baseMultiplier,
                    currentTranslation[2] + directionVector[2] * explosionFactor * baseMultiplier,
                ];

                await setupAnimationFrames(currentTranslation, targetPosition, childId);

                //WEBVIS_API: Apply the animation sequence to the node with duration from UI
                context.setProperty(childId, webvis.Property.ANIMATION, {
                    name: `${childId}_translation`,
                    duration: animationDuration,
                });
            } catch (error) {
                logActivity('warning', `Failed to explode node ${childId}: ${error.message}`);
            }
        }
        //WEBVIS_API: Fit the view to the root node
        await viewer.fitViewToNode(nodeId);
        logActivity('success', 'Explosion effect completed!');
    } catch (error) {
        logActivity('error', `Explosion failed: ${error.message}`);
    }
}

/**
 * Get all descendant nodes of a given node
 * @param {*} nodeId
 * @returns
 */
async function getAllDescendantNodes(nodeId) {
    const descendants = [];

    async function collectNodes(currentNodeId) {
        try {
            // WEBVIS_API: Get children of the current node
            const children = await context.getProperty(currentNodeId, webvis.Property.CHILDREN);

            for (const childId of children) {
                descendants.push(childId);
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

/**
 * Function to reset explosion
 */
async function performReset() {
    try {
        logActivity('info', 'Resetting explosion...');
        const allNodes = await getAllDescendantNodes(nodeId);

        for (const childId of allNodes) {
            try {
                //WEBVIS_API: Reset local transform
                await context.resetProperty(childId, webvis.Property.LOCAL_TRANSFORM);
                await context.resetProperty(childId, webvis.Property.ANIMATION);
            } catch (error) {
                logActivity('warning', `Failed to reset node ${childId}: ${error.message}`);
            }
        }

        //WEBVIS_API: Fit the view again
        await viewer.fitView();
        logActivity('success', 'Explosion reset complete');
    } catch (error) {
        logActivity('error', `Reset failed: ${error.message}`);
    }
}

/**
 * Prepare the animation frames for the node using only translation
 * @param {*} currentTranslation
 * @param {*} targetPosition - The final absolute position
 * @param {*} nodeId
 */
async function setupAnimationFrames(currentTranslation, targetPosition, nodeId) {
    if (nodeId) {
        // WEBVIS_API: Create animation frames for the node
        context.createAnimationFrames(`${nodeId}_translation`, [
            {
                translation: currentTranslation,
            },
            {
                translation: targetPosition,
            },
        ]);
    }
}

/**
 * Check if a node is a leaf node (has no children)
 * @param {*} nodeId - The ID of the node to check
 * @returns {Promise<boolean>} - True if the node is a leaf node, false otherwise
 */
async function isLeafNode(nodeId) {
    try {
        // WEBVIS_API: Get the children of the current node
        const children = await context.getProperty(nodeId, webvis.Property.CHILDREN);
        return !children || children.length === 0;
    } catch (error) {
        // If getting children fails, assume it's a leaf node
        return true;
    }
}

/**
 * Log activity messages to the activity log
 * @param {*} type
 * @param {*} message
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

/**
 * Initialize the explosion example.
 */
document.addEventListener('DOMContentLoaded', function () {
    initializeExplosionExample();
});
