/**
 * Add an event listener to the window to listen for messages from the iframe
 */
window.addEventListener('message', receivedMessage, false);

/**
 * Function to handle messages received from the iframe
 * @param {MessageEvent} event - The message event from the iframe
 */
function receivedMessage(event) {
    // Check if the message is from the expected source
    if (event.data && event.data.source === 'my-iframe') {
        console.log('Message received from iframe:', event.data);

        // Check if the message is of type 'CUSTOM_EVENT'
        if (event.data.type === 'CUSTOM_EVENT') {
            // Update the content of the element with class 'outputText' with the received data
            const textElement = document.querySelector('.outputText');
            textElement.innerHTML = `Object with ID ${event.data.content.targetNodeID} <br/> event: ${event.data.content.property} <br/> value: ${event.data.content.newValue}`;
        }
    }
}
