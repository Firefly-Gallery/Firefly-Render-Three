import * as THREE from 'three';

let lightPos = new THREE.Vector3(0,0,0);
let lightColor = new THREE.Color();
let lightColorVector = new THREE.Vector3(1, 1, 1)
let light;

function Init() {
    light = new THREE.DirectionalLight( 0xFFF5F1, 5 );
    light.position.set( -100, 100, -180 );
    light.castShadow = true;
    light.shadow.camera.top = 150;
    light.shadow.camera.bottom = -50;
    light.shadow.camera.left = - 50;
    light.shadow.camera.right = 100;
    light.shadow.camera.near = 0;
    light.shadow.camera.far = 300;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.color.getRGB(lightColor);
    lightColorVector.set(lightColor.r, lightColor.g, lightColor.b);
}

function Update() {
    if ( light ) {
        light.getWorldPosition(lightPos)
        light.color.getRGB(lightColor)
        lightColorVector.set(lightColor.r, lightColor.g, lightColor.b)
    }
}

export {light, lightPos, lightColorVector, Init, Update}