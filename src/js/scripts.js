import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import gsap from "gsap";

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-8.8, 6, 7);

camera.lookAt(0, 0, 0);

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector(".progress-bar-container");

loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
};
// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const gltfLoader = new GLTFLoader(loadingManager);

const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

let position = 0;
rgbeLoader.load("./assets/MR_INT-005_WhiteNeons_NAD.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gltfLoader.load("./assets/scene.gltf", function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    window.addEventListener("mouseup", function () {
      switch (position) {
        case 0:
          moveCamera(2, 6, 7);
          position = 1;
          break;
        case 1:
          moveCamera(-9.5, 6, 7);
          position = 0;
          break;
      }
    });

    function moveCamera(x, y, z) {
      gsap.to(camera.position, {
        x,
        y,
        z,
        duration: 3,
        onUpdate: () => {
          camera.lookAt(0, 0.9, 0);
        },
      });
    }
  });
});
//const clock = new THREE.Clock();
function animate() {
  renderer.render(scene, camera);
  //controls.update(clock.getDelta());
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
