let viewer = null;
let context = null;
let listEvent = [];
let listener = null;
const context_name = 'new_context';

/**
 * Recursively adds nodes from JSON structure to the WebVis context
 * @param {Object} node - The node object from the JSON structure
 * @param {number|undefined} parent - The parent node ID (undefined for root)
 * @returns {Promise<number>} The ID of the created node
 */
async function addNode(node, parent) {
    const id = context.add(node.url ?? '', parent);

    // Enable the root node
    if (typeof parent !== 'number') {
        await context.setProperty(id, webvis.Property.ENABLED, true);
    }

    // Apply node properties
    if (node.localTransform) {
        await context.setProperty(id, 'localTransform', node.localTransform);
    }

    if (node.label) {
        await context.setProperty(id, 'label', node.label);
    }

    if (node.appearanceURI) {
        await context.setProperty(id, 'appearanceURI', node.appearanceURI);
    }

    // Recursively add children
    if (node.children) {
        await Promise.all(
            node.children?.map(async (jsonId) => {
                if (!c172Json.nodes[`${jsonId}`]) {
                    return;
                }
                await addNode(c172Json.nodes[`${jsonId}`], id);
            })
        );
    }

    return id;
}

/**
 * Loads and processes the dynamic structure from JSON file
 */
async function loadDynamicStructure() {
    try {
        const c172Json = await fetch('./assets/simple_struct.json').then((response) =>
            response.json()
        );

        // Make c172Json available to addNode function
        window.c172Json = c172Json;

        // Start building the structure from the root
        await addNode(c172Json.nodes[c172Json.root]);

        console.log('Dynamic structure loaded successfully');
    } catch (error) {
        console.error('Error loading dynamic structure:', error);
    }
}

/**
 * Initializes the WebVis context and viewer
 */
async function init() {
    try {
        // Wait until the context and viewer objects are created
        const webvisComponent = document.querySelector('webvis-full');

        // Hide UI components for clean viewer experience
        webvisComponent.hideGizmo();
        webvisComponent.hideBottomBar();
        webvisComponent.hideAddButton();
        webvisComponent.hideSearch();
        webvisComponent.hideToolbar();
        webvisComponent.hideGizmo();

        // Get context and viewer
        context = await webvisComponent.requestContext();
        viewer = await webvisComponent.requestViewer();

        console.log('Context and Viewer are ready...');

        // Setup button event listener
        const initBtn = document.querySelector('#initBtn');
        initBtn.addEventListener('click', async () => {
            initBtn.disabled = true;
            initBtn.textContent = 'Loading...';

            await loadDynamicStructure();

            initBtn.textContent = 'Structure Loaded';
        });
    } catch (error) {
        console.error('Error initializing WebVis:', error);
    }
}

// Initialize the application
init();
