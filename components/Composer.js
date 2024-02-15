import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import * as Renderer from '/components/Renderer.js';

let composer, renderScene, bloomPass, outputPass

const params = {
    threshold: 0.9,
    strength: 1,
    radius: 0,
    exposure: 1
};

function Init(scene, camera) {
    renderScene = new RenderPass( scene, camera );
    
    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;
    
    outputPass = new OutputPass();
    
    composer = new EffectComposer( Renderer.renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );
}

function OnResize() {
    composer.setSize( window.innerWidth, window.innerHeight );
}
function Render() {
    composer.render();
}

export {Init, Render, OnResize, composer, renderScene, bloomPass, outputPass}