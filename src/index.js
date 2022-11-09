const canvas = document.querySelector(".canvas");

//create scene
const scene = new THREE.Scene();

// load the gltf model

let skull = null;
let base = new THREE.Object3D();
scene.add(base);

const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load("../assets/gltf/scene.gltf", (gltf) => {
  base.add(gltf.scene);
});

// sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
camera.position.z = 6;
scene.add(camera);

//lights
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.z = 1.5;
scene.add(pointLight);

// Mouse move

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();

const cursor = document.querySelector(".cursor");
const cursorBorder = document.querySelector(".cursor-border");
const cursorPos = new THREE.Vector2();
const cursorBorderPos = new THREE.Vector2();

function onMouseMove(e) {
  cursorPos.x = e.clientX;
  cursorPos.y = e.clientY;

  mouse.x = (cursorPos.x / sizes.width) * 2 - 1;
  mouse.y = -(cursorPos.y / sizes.height) * 2 + 1;

  pointLight.position.x = mouse.x;
  pointLight.position.y = mouse.y;

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  base.lookAt(pointOfIntersection);

  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  cursor.style.opacity = 1;
  cursor.style.visibility = "visible";

  cursorBorder.style.opacity = 1;
  cursorBorder.style.visibility = "visible";
}

//eventListeners
canvas.addEventListener("mousemove", onMouseMove, false);

// Renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antiAlias: true,
  alpha: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);

  const easing = 8;
  cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easing;
  cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easing;

  cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px)`;
});
