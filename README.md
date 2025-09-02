# WebVis Basic Examples

<!-- TOC -->
1. [Overview](#overview)
2. [Structure](#structure)
3. [Usage](#usage)
4. [Resources](#resources)
5. [Your Own Industrial 3D App in Three Steps](#your-own-industrial-3d-app-in-three-steps)
6. [Technical details](#technical-details)
7. [License](#license)
8. [How to report an issue](#how-to-report-an-issue)
<!-- /TOC -->

## Overview

**WebVis Basic Examples** is the central hub for code examples, demos, and static resources showcasing the WebVis API and its features. This collection helps developers and users explore, learn, and prototype with the WebVis platform across a wide range of real-world scenarios. Each subdirectory demonstrates a specific feature, integration, or workflow—ranging from basic viewer setup to advanced 3D visualization, markup, measurement, and XR capabilities.

This repository serves as a comprehensive resource for both new and experienced users, providing practical examples that can be easily adapted for various applications. The examples are structured for quick understanding and implementation, making it easier to leverage the full potential of WebVis in your projects.

## Structure

- [**getting-started/**](getting-started/): Introductory examples to help new users quickly set up and use WebVis viewers.
- [**core-resources/**](core-resources/): Foundational examples and resources for working with WebVis, including context management, events, and rendering.
- [**inspection/**](inspection/): Examples related to inspecting and analyzing 3D models and scenes.
- [**markup/**](markup/): Demonstrations of annotation, drawing, and markup capabilities, including 2D and 3D markers.
- [**measuring/**](measuring/): Examples for measuring distances, areas, and other properties within the viewer.
- [**moving-scaling-and-rotating/**](moving-scaling-and-rotating/): Interactions for transforming objects in the scene.
- [**navigation/**](navigation/): Camera and scene navigation examples.
- [**rendering-3d-visualization/**](rendering-3d-visualization/): Advanced rendering and visualization techniques.
- [**searching-and-filtering/**](searching-and-filtering/): Examples for searching and filtering scene content.
- [**selection-and-highlighting/**](selection-and-highlighting/): Techniques for selecting and highlighting objects.
- [**setup/**](setup/): Integration and setup examples, including iframe integration.
- [**sharing/**](sharing/): Examples for sharing scenes or data.
- [**storing-saving/**](storing-saving/): Saving and session management examples.
- [**xr/**](xr/): Extended reality (XR) examples, including AR/VR features.

Each subfolder typically contains:
- `index.html`: The main example page.
- `index.js`: The JavaScript logic for the example.
- `README.md`: Documentation for the specific example.
- `thumb.png` or `thumb.jpg`: Thumbnail image for the example.
- `assets/`: Additional resources (images, data files, etc.) used by the example.

## Usage
To use the examples, follow these steps:
### Prerequisites

- **Development Server**: VS Code Live Server extension (recommended)
- **Browser**: Modern web browser with WebGL support
- **Network**: Internet connection for WebVis library and 3D models
- **instant3Dhub**: Access to a running instance

### Setup Development Environment
   ```bash
   # Install Live Server extension in VS Code
   # Or use any local web server
   ```

### Launch the Example
   - Open this folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Navigate to the opened URL (typically `http://127.0.0.1:5500`)


## Resources

- [Company Website](https://threedy.io)
- [Documentation Portal](https://docs.threedy.io)
- [Demo Instance](https://demo.threedy.io)
- [WebVis API Reference](https://docs.threedy.io/latest/tutorials/dev_tutorials/tutorials/webvis.html)

## Your Own Industrial 3D App in Three Steps

### Step 1: Get a License via Threedy

To start **instant3Dhub**, you will need to enter a serial key.  
Please reach out and we will get you sorted out.

➡️ [Get a Serial Key](https://www.threedy.io/who-we-are/contact-us)

---

### Step 2: Download via Threedy Repository

You can get the latest **instant3Dhub** release from our public repository as a Helm package.

➡️ [Public Repository](https://repo.threedy.io/)  
📚 [Code Examples, Guides & Tutorials](./)

---

### Step 3: Install via Helm on Kubernetes

**instant3Dhub** is a containerized software that can be deployed on top of a container orchestration layer.  
The primary target is the **Kubernetes** platform, which is also highly recommended for productive environments.

📦 [Installation Guide](https://docs.threedy.io/latest/doc/integration/README.html)

## Technical details

- All the examples are based on the version of instant3Dhub that is hosted on our [demo instance](https://demo.threedy.io). For further information about other versions, please check out our [documentation portal](https://docs.threedy.io).
- You can change these examples to use our own instant3dhub installation. To do that, You need to change the link of webvis.js?next in the index.html file:  
  `<script src="YOUR_HUB_INSTANCE/repo/webvis/webvis.js?next"></script>`

## Code Structure for Developers

This example includes clear markers to help developers identify WebVis-specific code:

### Finding WebVis API Calls

All WebVis API interactions are marked with `WEBVIS_API:` comments in the code. Search for this keyword to quickly locate:

- Context creation and management
- Model loading and manipulation
- Property settings and configurations
- All direct WebVis library calls

## Primitive and Placeholder Objects

instant3Dhub provides a small set of basic 3D models for testing and development. These primitives can be used as placeholders or for prototyping applications. Each model is referenced by a URN:

- `urn:x-i3d:shape:box`
- `urn:x-i3d:shape:cube`
- `urn:x-i3d:shape:cone`
- `urn:x-i3d:shape:cylinder`
- `urn:x-i3d:shape:sphere`
- `urn:x-i3d:shape:torus`
- `urn:x-i3d:shape:monkey`
- `urn:x-i3d:shape:key`
- `urn:x-i3d:shape:switch`
- `urn:x-i3d:shape:cap`
- `urn:x-i3d:shape:418` (teapot)

# License

All the examples are licensed under the terms of the [MIT License](./LICENSE). Please see the LICENSE file for full details.

# How to report an issue

For any issues please [contact us](mailto:github-threedy@threedy.io).
