/**
 * Dynamic Structure Example
 * This example demonstrates dynamic scene structure building with WebVis
 */

// =========================
// Variable Declarations
// =========================
let activityLog = [];
let viewer = null;
let context = null;
let listener = null;

const initBtn = document.querySelector('#initBtn');
const addStructureBtn = document.querySelector('#addStructureBtn');

/**
 * Initializes the WebVis context and viewer
 */
async function init() {
    try {
        logActivity('info', 'WebVis Dynamic Structure example initialized');

        // WEBVIS_API: Get the context object from the webvis-viewer element.
        const webvisComponent = document.querySelector('webvis-viewer');
        context = await webvisComponent.requestContext();

        if (!context) {
            throw new Error('Failed to get WebVis context');
        }

        logActivity('success', 'WebVis context created successfully');

        // Enable the add structure button
        addStructureBtn.disabled = false;
        initBtn.disabled = true;
        initBtn.textContent = '✅ Initialized';
        logActivity('success', 'Dynamic Structure example ready!');
    } catch (error) {
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Recursively adds nodes from JSON structure to the WebVis context
 * @param {Object} node - The node object from the JSON structure
 * @param {number|undefined} parent - The parent node ID (undefined for root)
 * @param {number} level - The depth level for visualization
 * @returns {Promise<number>} The ID of the created node
 */
async function addNode(node, parent, simpleStructJson) {
    try {
        // WEBVIS_API: Add a node to the context
        const nodeId = context.add({
            dataURI: node.url,
            parentId: parent,
            initialProperties: {
                enabled: true,
            },
        });

        logActivity('success', `Node created with ID: ${nodeId}`);

        // WEBVIS_API: Apply node properties
        if (node.localTransform) {
            await context.setProperty(nodeId, 'localTransform', node.localTransform);
        }

        if (node.label) {
            await context.setProperty(nodeId, 'label', node.label);
        }

        if (node.appearanceURI) {
            await context.setProperty(nodeId, 'appearanceURI', node.appearanceURI);
        }

        // Recursively add children
        if (node.children && simpleStructJson) {
            await Promise.all(
                node.children?.map(async (jsonId) => {
                    if (!simpleStructJson.nodes[`${jsonId}`]) {
                        return;
                    }
                    await addNode(simpleStructJson.nodes[`${jsonId}`], nodeId, simpleStructJson);
                })
            );
        }
        return nodeId;
    } catch (error) {
        logActivity('error', `Failed to add node: ${error.message}`);
        throw error;
    }
}

/**
 * Loads and processes the dynamic structure from JSON file
 */
async function loadDynamicStructure() {
    try {
        logActivity('info', 'Loading dynamic structure from JSON...');

        const simpleStructJson = await fetch('./assets/simple_struct.json').then((response) =>
            response.json()
        );
        if (!simpleStructJson || !simpleStructJson.nodes || !simpleStructJson.root) {
            logActivity('error', 'Invalid JSON structure');
            return;
        }

        logActivity('success', 'JSON structure loaded successfully');
        logActivity('info', 'Building scene structure...');

        // Start building the structure from the root
        await addNode(simpleStructJson.nodes[simpleStructJson.root], undefined, simpleStructJson);

        logActivity('success', 'Dynamic structure built successfully');
    } catch (error) {
        logActivity('error', `Error loading dynamic structure: ${error.message}`);
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

// Event listeners
initBtn.addEventListener('click', init);

addStructureBtn.addEventListener('click', async () => {
    await loadDynamicStructure();
});

// Initialize the template
logActivity('info', 'WebVis Dynamic Structure example loaded');
