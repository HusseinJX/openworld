import * as BABYLON from "https://cdn.jsdelivr.net/npm/babylonjs@7.0.0/+esm";
import "https://cdn.jsdelivr.net/npm/babylonjs-loaders@7.0.0/+esm";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// CAMERA
const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 2, -10), scene);
camera.attachControl(canvas, true);
camera.speed = 0.5;
camera.applyGravity = true;
camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
scene.collisionsEnabled = true;
camera.checkCollisions = true;

// CONTROLS
window.addEventListener("click", () => {
  canvas.requestPointerLock();
});
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyW") camera.position.addInPlace(camera.getDirection(BABYLON.Axis.Z).scale(0.3));
  if (e.code === "KeyS") camera.position.subtractInPlace(camera.getDirection(BABYLON.Axis.Z).scale(0.3));
  if (e.code === "KeyA") camera.position.subtractInPlace(camera.getDirection(BABYLON.Axis.X).scale(0.3));
  if (e.code === "KeyD") camera.position.addInPlace(camera.getDirection(BABYLON.Axis.X).scale(0.3));
});

// LIGHTING
const light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
light.position = new BABYLON.Vector3(20, 40, 20);
light.intensity = 1.2;
scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
shadowGenerator.useExponentialShadowMap = true;

// SKYBOX
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 5000 }, scene);
const skyboxMat = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMat.backFaceCulling = false;
skyboxMat.disableLighting = true;
skyboxMat.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skybox.material = skyboxMat;

// LOAD CITY
BABYLON.SceneLoader.ImportMesh("", "assets/", "city.glb", scene, (meshes) => {
  meshes.forEach(m => {
    m.checkCollisions = true;
    shadowGenerator.addShadowCaster(m);
  });
});

// LOAD ARTIFACT
BABYLON.SceneLoader.ImportMesh("", "assets/", "artifact.glb", scene, (meshes) => {
  const artifact = meshes[0];
  artifact.position = new BABYLON.Vector3(0, 0, 5);
  artifact.scaling = new BABYLON.Vector3(2, 2, 2);
  shadowGenerator.addShadowCaster(artifact);
});

// RENDER LOOP
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
