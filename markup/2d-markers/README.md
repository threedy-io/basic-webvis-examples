# 2D Markers

## Overview

This example demonstrates how to connect 2D custom HTML elements with positions in 3D space, creating interactive markers and Points of Interest (POIs). Learn how to dynamically position HTML elements based on 3D world coordinates and maintain their screen positioning as the camera moves.

## Key Features Demonstrated

- **2D-3D Coordinate Mapping**: Convert 3D world coordinates to 2D screen positions
- **Dynamic HTML Elements**: Programmatically create and position HTML markers
- **View Synchronization**: Automatically update marker positions when the camera moves
- **Custom Styling**: CSS-styled markers with custom appearance
- **Viewer Integration**: Seamless integration with WebVis viewer lifecycle
- **Point Projection**: Using WebVis projection API for accurate positioning
- **Real-time Updates**: Responsive markers that follow 3D objects during navigation

## Quick Start

### Prerequisites

- **Development Server**: VS Code Live Server extension (recommended)
- **Browser**: Modern web browser with WebGL support
- **Network**: Internet connection for WebVis library and 3D models
- **instant3Dhub**: Access to a running instance

### Running the Example

1. **Setup Development Environment**:
   ```bash
   # Install Live Server extension in VS Code
   # Or use any local web server
   ```

2. **Launch the Example**:
   - Open this folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Navigate to the opened URL (typically `http://127.0.0.1:5500`)

3. **Interact with Markers**:
   - **Rotate** the view to see markers maintain their 3D positioning
   - **Zoom** in/out to observe marker screen positioning
   - **Pan** the camera to see markers follow the cube corners


---

**Note**: This example uses the WebVis library hosted on our demo instance. For production use, replace the library URL with your own instant3Dhub installation.
