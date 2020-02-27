let scene, camera, renderer, stars, starGeo, rain, rainGeo, currentFrequency;
let mouse = new THREE.Vector2();
let playing = false;
var fftSize = 128;

////////////
// create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();

// create an Audio source
var sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load('assets/sounds/kudasai.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
});

// create an AudioAnalyser, passing in the sound and desired fftSize
var analyser = new THREE.AudioAnalyser(sound, 32);

// get the average frequency of the sound
var data = analyser.getFrequencyData();
document.getElementById("button").addEventListener("click", play);

function play() {
  sound.play();
  playing = true;
}
function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  starGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 6000; i++) {
    star = new THREE.Vector3(
      Math.random() * 8 - 10,
      Math.random() * 8 - 10,
      Math.random() * 8 - 10
    );
    star.velocity = 0.9;
    star.acceleration = 0.02;
    starGeo.vertices.push(star);
  }
  let sprite = new THREE.TextureLoader().load('assets/textures/star.png');
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    map: sprite
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  animate();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  // console.log(analyser.getAverageFrequency());
//   console.log(analyser.getFrequencyData());
  currentFrequency = analyser.getFrequencyData();
  stars.rotation.x = data[1];
//   stars.position.y = data;
  starGeo.verticesNeedUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
function mousemove() {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}
init();