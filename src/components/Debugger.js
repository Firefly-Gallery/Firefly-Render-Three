import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import * as Renderer from './/Renderer.js';
import * as DirLight from './/DirLight.js';
import * as Scene from './/Scene.js';
import { grid } from './Static.js';

let stats


function Init() {
    // stats
    stats = new Stats();
    Renderer.container.appendChild( stats.dom );
    Scene.scene.add( new THREE.CameraHelper( DirLight.light.shadow.camera ) );
    Scene.scene.add( grid );

}

const params = {
    threshold: 0,
    strength: 1,
    radius: 0,
    exposure: 1
};

function Update() {
    stats.update();
}

export {Init, Update}