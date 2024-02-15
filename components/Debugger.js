import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import * as Renderer from '/components/Renderer.js';
import * as DirLight from '/components/DirLight.js';
import * as Scene from '/components/Scene.js';

let stats

function Init() {
    // stats
    stats = new Stats();
    Renderer.container.appendChild( stats.dom );
    Scene.scene.add( new THREE.CameraHelper( DirLight.light.shadow.camera ) );
}

function Update() {
    stats.update();
}

export {Init, Update}