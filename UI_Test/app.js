import * as THREE from 'https://cdn.skypack.dev/three@0.132.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.0/examples/jsm/controls/OrbitControls.js';

// Wait for the page to load
window.addEventListener('DOMContentLoaded', () => {
  // Create a scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add orbit controls to the camera
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Create a cube and add it to the scene
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Position the camera
  camera.position.z = 5;

  // Handle MIDI input
  navigator.requestMIDIAccess().then((access) => {
    const inputs = access.inputs;
    const outputs = access.outputs;

    // Print available MIDI devices
    console.log('MIDI Inputs:', inputs);
    console.log('MIDI Outputs:', outputs);

    // Listen for MIDI messages
    for (const input of inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
    }
  });

  // Handle MIDI messages
  function handleMIDIMessage(event) {
    const [command, note, velocity] = event.data;

    // Print MIDI data to console
    console.log('Command:', command);
    console.log('Note:', note);
    console.log('Velocity:', velocity);

    // Update cube scale based on MIDI velocity
    cube.scale.set(1, 1, velocity / 127);
  }

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
