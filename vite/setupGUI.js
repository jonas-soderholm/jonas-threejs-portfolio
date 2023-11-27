import GUI from "lil-gui";

export function setupGUI(camera, material, myModel) {
  const gui = new GUI();

  // Camera position controls
  gui.add(camera.position, "x").min(-100).max(100).step(0.1).name("Camera X");
  gui.add(camera.position, "y").min(-100).max(100).step(0.1).name("Camera Y");
  gui.add(camera.position, "z").min(-100).max(100).step(0.1).name("Camera Z");

  // // Material color control - only add if material is not null
  // if (material) {
  //   gui.addColor(material, "color").name("Material Color");
  // }

  // Model rotation controls - only add if myModel is not null
  if (myModel) {
    gui
      .add(myModel.rotation, "x", -Math.PI, Math.PI)
      .step(0.01)
      .name("Rotate X");
    gui
      .add(myModel.rotation, "y", -Math.PI, Math.PI)
      .step(0.01)
      .name("Rotate Y");
    gui
      .add(myModel.rotation, "z", -Math.PI, Math.PI)
      .step(0.01)
      .name("Rotate Z");
  }
}
