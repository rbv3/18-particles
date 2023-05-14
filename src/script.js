import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/2.png');

/*
Particles
*/
//Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
const particlesGeometry = new THREE.BufferGeometry();
const particlesAmount = 20000;

const positions = new Float32Array(particlesAmount * 3);
const colors = new Float32Array(particlesAmount * 3); // *3 cuz RGB

for(let i=0; i<particlesAmount * 3; i++) {
    positions[i] = (Math.random()-0.5)*20;
    colors[i] = Math.random();
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
);

//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
});
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particlesTexture;
// particlesMaterial.alphaTest = 0.01;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending // impacts performance
particlesMaterial.vertexColors = true;

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
console.log(particlesGeometry.attributes)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles (better to use shaders, performance issues doing like below)
    // for(let i=0; i<particlesAmount; i++) {
    //     const i3 = i*3;
    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    // }
    // particlesGeometry.attributes.position.needsUpdate = true; //needs to notify after changing position array

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()