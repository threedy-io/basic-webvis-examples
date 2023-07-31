## Description:

This example shows how to instantiate a webvis viewer inside of a regular HTML canvas element, and the relationship between contexts and viewers.

- Start the [index.html](./index.html) to:
  - Load webvis
  - Initialize 2 contexts with 2 different viewers for each context

Try adding a clip plane to the first context and notice how both viewers get updated, while the second context is unaffected. Selecting the object in a viewer also highlights it in all other viewers attached to the same context.
