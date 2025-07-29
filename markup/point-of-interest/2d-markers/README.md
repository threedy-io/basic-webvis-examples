# 2D Markers

![2D Markers](./thumb.png)
## Overview

This example demonstrates how to connect 2D custom HTML elements with positions in 3D space, creating interactive markers and Points of Interest (POIs). Learn how to dynamically position HTML elements based on 3D world coordinates and maintain their screen positioning as the camera moves.

## Key Features Demonstrated

- **2D-3D Coordinate Mapping**: Convert 3D world coordinates to 2D screen positions
- **Dynamic HTML Elements**: Programmatically create and position HTML markers
- **View Synchronization**: Automatically update marker positions when the camera moves
- **Point Projection**: Using WebVis projection API for accurate positioning
- **Real-time Updates**: Responsive markers that follow 3D objects during navigation

## Getting Started
**Interact with Markers**:
   - **Rotate** the view to see markers maintain their 3D positioning
   - **Zoom** in/out to observe marker screen positioning
   - **Pan** the camera to see markers follow the cube corners

## API Reference

This example uses the WebVis Context and Viewer APIs.  
See the official documentation for details:  
- [WebVis Context API](https://docs.threedy.io/latest/doc/webvis/interfaces/ContextAPI.html#contextapi)
- [WebVis Viewer API](https://docs.threedy.io/latest/doc/webvis/interfaces/ViewerAPI.html#viewerapi)
---

**Note**: This example uses the WebVis library hosted on our demo instance. For production use, replace the library URL with your own instant3Dhub installation.
