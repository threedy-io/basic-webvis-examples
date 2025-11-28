/**
 * @fileoverview WebVis Query Semantic PMI Example
 * Demonstrates how to use the queryAPI to search for PMI (Product Manufacturing Information)
 * data in AUX nodes, including filtering by type and searching by label.
 *
 * @author WebVis Examples Team
 */

// Constants
const IGNORED_PMI_TYPES = ['I3DHInternalGrouping'];
const modelURL =
    'https://data-public.threedy.io/testdata/nist/NIST-MTC-Assembly-NX/NIST%20mtc%20crada%20assembly.jt';

// Global variables
let webvisContext = null;
let viewer = null;
let availablePMITypes = [];
let allAuxNodeIds = []; // Cache of all AUX node IDs
let currentlyEnabledPMI = null; // Track the currently enabled PMI

/**
 * Initialize the WebVis example.
 * Sets up the WebVis context and loads a model with PMI data.
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
        viewer = await webvisContext.getViewer(); // Store reference to viewer for later use
        if (!webvisContext) {
            throw new Error('WebVis context initialization failed');
        }
        webvisContext.add({ dataURI: modelURL, initialProperties: { enabled: true } });

        initializeButtonHandlers();

        logActivity('info', 'WebVis context initialized successfully');
        logActivity('info', 'Load a model with PMI data to begin querying');
    } catch (error) {
        console.error('WebVis initialization error:', error);
        logActivity('error', `Initialization failed: ${error.message}`);
    }
}

/**
 * Initialize button event handlers
 * @function initializeButtonHandlers
 */
function initializeButtonHandlers() {
    document.getElementById('loadPMITypesBtn').addEventListener('click', loadPMITypes);
    document.getElementById('searchPMIBtn').addEventListener('click', searchPMIByLabel);
    document.getElementById('queryAllBtn').addEventListener('click', queryAllPMIsOfType);
    document.getElementById('pmiTypeSelect').addEventListener('change', onPMITypeChange);
}

/**
 * Fetches a list of all available PMI types, excluding ignored types.
 * Extracts PMI types from provided statistics.
 * @function requestPMITypes
 * @param {Object} statistic - Statistics object containing auxiliary node data
 * @returns {string[]} A sorted list of PMI types
 */
function requestPMITypes(statistic) {
    const pmiTypes = [];

    if (statistic === undefined || !statistic.auxiliary) {
        return pmiTypes;
    }

    // Extract PMI types from statistics, excluding ignored types
    // Handle both string keys and object structures
    for (let type in statistic.auxiliary) {
        if (
            statistic.auxiliary.hasOwnProperty(type) &&
            IGNORED_PMI_TYPES.includes(type) === false
        ) {
            // Extract the actual type name if it's an object
            const typeName = typeof type === 'string' ? type : String(type);
            pmiTypes.push(typeName);
        }
    }

    // Sort types alphabetically for better UX
    return pmiTypes.sort((a, b) => {
        const labelA = String(a).toLowerCase();
        const labelB = String(b).toLowerCase();
        return labelA.localeCompare(labelB, 'en', { numeric: true });
    });
}

/**
 * Load and display all available PMI types in the dropdown
 * @async
 * @function loadPMITypes
 */
async function loadPMITypes() {
    try {
        logActivity('info', 'Loading available PMI types...');

        // WEBVIS_API: Get statistics for auxiliary nodes which contain PMI data (single call)
        const statistic = await webvisContext.getStatistics(webvis.NodeType.AUX);
        availablePMITypes = requestPMITypes(statistic);

        if (availablePMITypes.length === 0) {
            logActivity('warning', 'No PMI types found. Ensure a model with PMI data is loaded.');
            return;
        }

        // Populate the dropdown with PMI types
        const select = document.getElementById('pmiTypeSelect');
        select.innerHTML = '<option value="">Select a PMI type...</option>';

        let totalPMICount = 0;

        availablePMITypes.forEach((type) => {
            const option = document.createElement('option');
            // Ensure type is a string
            const typeString = String(type);
            option.value = typeString;

            // Get count - handle both numeric and object structures
            let count = 0;
            if (statistic && statistic.auxiliary) {
                const auxData = statistic.auxiliary[typeString];
                count = typeof auxData === 'number' ? auxData : auxData?.count || 0;
            }

            totalPMICount += count;
            option.textContent = `${typeString} (${count})`;
            select.appendChild(option);
        });

        // Update statistics display
        document.getElementById('totalTypes').textContent = availablePMITypes.length;
        document.getElementById('totalPMIs').textContent = totalPMICount;

        // Cache all AUX node IDs for faster access later
        logActivity('info', 'Caching AUX node IDs...');
        const allAuxQuery = await webvisContext.query({
            select: ['nodeId'],
            conditions: [{ nodeType: 'aux' }],
            linkDepth: 10,
        });

        if (allAuxQuery && allAuxQuery.data) {
            allAuxNodeIds = allAuxQuery.data.map((item) => (Array.isArray(item) ? item[0] : item));
            console.log(`Cached ${allAuxNodeIds.length} AUX node IDs`);
        }

        // Enable controls
        select.disabled = false;

        logActivity(
            'success',
            `Found ${availablePMITypes.length} PMI types with ${totalPMICount} total PMIs`
        );
    } catch (error) {
        console.error('Error loading PMI types:', error);
        logActivity('error', `Failed to load PMI types: ${error.message}`);
    }
}

/**
 * Handle PMI type selection change
 * @function onPMITypeChange
 */
function onPMITypeChange() {
    const selectedType = document.getElementById('pmiTypeSelect').value;
    const searchEnabled = selectedType !== '';

    document.getElementById('searchInput').disabled = !searchEnabled;
    document.getElementById('searchPMIBtn').disabled = !searchEnabled;
    document.getElementById('queryAllBtn').disabled = !searchEnabled;
}

/**
 * Search for a specific PMI by label using the queryAPI
 * Demonstrates how to query with multiple conditions including text search
 * @async
 * @function searchPMIByLabel
 */
async function searchPMIByLabel() {
    try {
        const selectedType = document.getElementById('pmiTypeSelect').value;
        const searchText = document.getElementById('searchInput').value.trim();

        if (!selectedType) {
            logActivity('warning', 'Please select a PMI type first');
            return;
        }

        if (!searchText) {
            logActivity('warning', 'Please enter a search term');
            return;
        }

        logActivity('info', `Searching for PMI with label containing "${searchText}"...`);

        // WEBVIS_API: Query for PMIs with specific type and label
        // This demonstrates using the query API with multiple conditions
        const queryResult = await webvisContext.query({
            select: ['nodeId', 'metadata.auxProperties.label', 'metadata.auxProperties.pmiType'],
            conditions: [
                { nodeType: 'aux' }, // Only search auxiliary nodes
                { metadata: 'auxProperties.pmiType', equals: selectedType }, // Filter by PMI type
                { metadata: 'auxProperties.label', contains: searchText }, // Search for label containing text
            ],
            linkDepth: 10,
        });

        displayQueryResults(queryResult, `Search results for "${searchText}" in ${selectedType}`);
    } catch (error) {
        console.error('Error searching PMI:', error);
        logActivity('error', `Search failed: ${error.message}`);
    }
}

/**
 * Query all PMIs of the selected type
 * Demonstrates basic queryAPI usage to retrieve all nodes of a specific PMI type
 * @async
 * @function queryAllPMIsOfType
 */
async function queryAllPMIsOfType() {
    try {
        const selectedType = document.getElementById('pmiTypeSelect').value;

        if (!selectedType) {
            logActivity('warning', 'Please select a PMI type first');
            return;
        }

        logActivity('info', `Querying all PMIs of type "${selectedType}"...`);

        // WEBVIS_API: Query for all PMIs of a specific type
        // This is a basic query example with nodeType and metadata filters
        const queryResult = await webvisContext.query({
            select: ['nodeId', 'metadata.auxProperties.label', 'metadata.auxProperties.pmiType'],
            conditions: [
                { nodeType: 'aux' }, // Only auxiliary nodes
                { metadata: 'auxProperties.pmiType', equals: selectedType }, // Specific PMI type
            ],
            linkDepth: 10,
        });

        displayQueryResults(queryResult, `All ${selectedType} PMIs`);
    } catch (error) {
        console.error('Error querying PMIs:', error);
        logActivity('error', `Query failed: ${error.message}`);
    }
}

/**
 * Display query results in the results container
 * @function displayQueryResults
 * @param {Object} queryResult - The query result object from WebVis
 * @param {string} title - Title for the results display
 */
function displayQueryResults(queryResult, title) {
    const container = document.getElementById('resultsContainer');

    // WebVis query returns {data: Array, errors: Array}
    if (!queryResult || !queryResult.data || queryResult.data.length === 0) {
        container.innerHTML = '<p class="text-secondary">No results found.</p>';
        logActivity('info', 'Query completed: 0 results');
        return;
    }

    let html = `<div style="margin-bottom: 12px;"><strong>${title}</strong></div>`;
    queryResult.data.forEach((item, index) => {
        const nodeId = Array.isArray(item) ? item[0] : item.nodeId || 'N/A';
        const label = Array.isArray(item)
            ? item[1] || 'No label'
            : item.metadata?.auxProperties?.label || 'No label';
        const pmiType = Array.isArray(item)
            ? item[2] || 'Unknown'
            : item.metadata?.auxProperties?.pmiType || 'Unknown';

        html += `
            <div class="pmi-result" data-node-id="${nodeId}" style="cursor: pointer;" onclick="enablePMI(${nodeId})">
                <div class="pmi-result-label">${index + 1}. ${label}</div>
                <div class="pmi-result-id">Type: ${pmiType}</div>
                <div class="pmi-result-id">NodeId: ${nodeId}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    logActivity('success', `Query completed: ${queryResult.data.length} results found`);
}

/**
 * Enable a PMI element by setting its AUX_ENABLED property to true
 * Disables all other PMIs to ensure only one is enabled at a time
 * @async
 * @function enablePMI
 * @param {number} nodeId - The node ID of the PMI to enable
 */
async function enablePMI(nodeId) {
    try {
        if (!webvisContext) {
            logActivity('error', 'WebVis context not initialized');
            return;
        }

        // Disable the previously enabled PMI and enable the new one in parallel
        const promises = [];
        if (currentlyEnabledPMI !== null && currentlyEnabledPMI !== nodeId) {
            promises.push(
                webvisContext.setProperty(currentlyEnabledPMI, webvis.Property.AUX_ENABLED, false)
            );
        }
        promises.push(webvisContext.setProperty(nodeId, webvis.Property.AUX_ENABLED, true));
        await Promise.all(promises);

        // Update the currently enabled PMI tracker
        currentlyEnabledPMI = nodeId;

        // Fit the view to the auxiliary node (non-blocking for better UI responsiveness)
        viewer.fitViewToAuxNode(nodeId);
        logActivity('success', `PMI node ${nodeId} enabled and focused`);

        // Update visual highlighting
        const allResults = document.querySelectorAll('.pmi-result');
        allResults.forEach((result) => {
            if (result.dataset.nodeId === String(nodeId)) {
                result.style.backgroundColor = 'var(--primary-color)';
                result.style.color = 'white';
            } else {
                // Reset other results to default style
                result.style.backgroundColor = '';
                result.style.color = '';
            }
        });
    } catch (error) {
        console.error('Error enabling PMI:', error);
        logActivity('error', `Failed to enable PMI ${nodeId}: ${error.message}`);
    }
}

/**
 * Utility function for activity logging
 * @function logActivity
 * @param {string} type - Log type: 'info', 'success', 'warning', 'error'
 * @param {string} message - Log message to display
 */
function logActivity(type, message) {
    const log = document.getElementById('activityLog');
    if (log) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `
            <span class="log-time">${new Date().toLocaleTimeString()}</span>
            <span class="log-message">${message}</span>
        `;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Initialize the WebVis example when DOM is ready
document.addEventListener('DOMContentLoaded', initializeWebVisExample);
