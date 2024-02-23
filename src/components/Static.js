import * as THREE from 'three';

const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
planeGeometry.rotateX( - Math.PI / 2 );
const planeMaterial = new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.2 } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;

const grid = new THREE.GridHelper( 2000, 20, 0xffffff, 0xffffff );
grid.material.opacity = 0.2;
grid.material.transparent = true;

export { plane, grid }