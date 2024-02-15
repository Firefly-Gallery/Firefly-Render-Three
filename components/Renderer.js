import * as THREE from 'three';

let renderer, container;

function Init() {
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, preserveDrawingBuffer: true, } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.colorManagement = true;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    THREE.ColorManagement.enabled = true;
    
    container.appendChild( renderer.domElement );
}

function OnResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function Render(scene, camera) {
    renderer.render(scene, camera)
}

export {renderer, container, Init, OnResize, Render}