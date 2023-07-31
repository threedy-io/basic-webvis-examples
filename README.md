# webvis-code-snippets

Collection of various small examples and code snippets.
<!-- TOC -->

- [webvis-code-snippets](#webvis-code-snippets)
    - [List of examples](#list-of-examples)
        - [[viewer-only](./viewer-only/)](#viewer-onlyviewer-only)
        - [[iframe-example](./iframe-example/)](#iframe-exampleiframe-example)
        - [[annotation-api](./annotation-api/)](#annotation-apiannotation-api)
        - [[2D-marker](./2D-marker/)](#2d-marker2d-marker)
        - [[canvas 1 - context and viewer API](./canvas1-context-and-viewer-API/)](#canvas-1---context-and-viewer-apicanvas1-context-and-viewer-api)
        - [[canvas 2 - multiple viewers](./canvas-2-multiple-viewers/)](#canvas-2---multiple-viewerscanvas-2-multiple-viewers)
        - [[canvas 3 - multiple contexts](./canvas-3-multiple-contexts/)](#canvas-3---multiple-contextscanvas-3-multiple-contexts)
        - [[dynamic-structure](./dynamic-structure/)](#dynamic-structuredynamic-structure)
- [How to use the example](#how-to-use-the-example)
- [Technical details](#technical-details)
- [License](#license)
- [How to report an issue](#how-to-report-an-issue)

<!-- /TOC -->
 
## List of examples

### [viewer-only](./viewer-only/)

How to include the instant3Dhub without any UI elements.

### [iframe-example](./iframe-example/)

Example which illustrates how to include instant3Dhub into an iframe.

### [annotation-api](./annotation-api/)

Includes two examples:
- [Simple example](./annotation-api/index.html) to demonstrate placement of simple text annotations. 
- [Advanced example](./annotation-api/annotation_advance.html) to demonstrate the ability to have html content in the annotations.

### [2D-marker](./2D-marker/)

The example demonstrates how to connect 2D custom HTML elements with positions in 3D space, .e.g., as markers/POIs.

### [canvas 1 - context and viewer API](./canvas1-context-and-viewer-API/)

This example shows how to work with the Context and Viewer API inside of a regular HTML canvas element.

### [canvas 2 - multiple viewers](./canvas-2-multiple-viewers/)

- This example shows how to instantiate multiple viewers inside of a regular HTML canvas element, and the relationship between contexts and viewers.
- Try adding a clip plane to the first context and notice how both viewers get updated, while the second context is unaffected. Selecting the object in a viewer also highlights it in all other viewers attached to the same context.

### [canvas 3 - multiple contexts](./canvas-3-multiple-contexts/)

- This example shows how to instantiate multiple contexts inside of a regular HTML canvas element, and the relationship between contexts and viewers.
- Try adding a clip plane to the first context and notice how both viewers get updated, while the second context is unaffected. Selecting the object in a  viewer also highlights it in all other viewers attached to the same context.

### [dynamic-structure](./dynamic-structure/)

- This example shows how to load dynamics structure to webvis.

# How to use the example

- Setup
  - In order to run the example you will need a web server like LiveServer:
  - Add LiveServer webserver extension to VScode from [here](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

# Technical details

- All the examples are based on the version of instant3Dhub that is hosted on our [demo instance](https://demo.threedy.io). For further information about other versions, please check out our [documentation portal](https://docs.threedy.io).
- You can change these examples to use our own instant3dhub installation. To do that, You need to change the link of webvis.js?next in the index.html file:  
  `<script src="YOUR_HUB_INSTANCE/repo/webvis/webvis.js?next"></script>`

# License

All the examples are licensed under the terms of the [MIT License](./LICENSE). Please see the LICENSE file for full details.

# How to report an issue

For any issues please [contact us](mailto:github-threedy@threedy.io).
