/**
 * Listens for messages from the iframe containing WebVis viewer
 */
window.addEventListener('message', receivedMessage, false);

/**
 * Handles messages received from the iframe
 * @param {MessageEvent} event - The message event from the iframe
 */
function receivedMessage(event) {
    if (event.data && event.data.source === 'my-iframe') {
        if (event.data.type === 'CUSTOM_EVENT') {
            const textElement = document.querySelector('.outputText');
            textElement.innerHTML = `Object with ID ${event.data.content.targetNodeID} <br/> event: ${event.data.content.property} <br/> value: ${event.data.content.newValue}`;
            logActivity(
                'info',
                `Object with ID ${event.data.content.targetNodeID} changed ${event.data.content.property} to ${event.data.content.newValue}`
            );
        }
    }
}

/**
 * Logs activity messages to the activity log panel
 * @param {string} type - The type of log entry (e.g., 'info', 'warning', 'error')
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
