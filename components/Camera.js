import * as THREE from 'three';

let camera;
let position = new THREE.Vector3(0,0,0);

function Init(x, y, z) {
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( x, y, z );
    return camera;

}

function Update() {
    camera.getWorldPosition(position);
    return position;
}

function OnResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

export {camera, position, Init, Update, OnResize}