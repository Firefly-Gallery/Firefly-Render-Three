import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as DirLight from '/components/DirLight.js';
import * as Camera from '/components/Camera.js';

let control, camera;
let position;

function Init(renderer) {
    camera = Camera.Init(0, 82, 215);

    control = new OrbitControls( camera, renderer.domElement );
    control.target.set( 0, 82, 0 );
    // control.autoRotate = true;
    control.autoRotateSpeed = -1.0;
    control.enableDamping = true;
    control.dampingFactor = 0.05;
    control.enablePan = false
    control.minPolarAngle = Math.PI/2;
    control.maxPolarAngle = Math.PI / 2;
    control.maxDistance = 250;
    control.minDistance = 100;
    control.update();
}

let currentDist = 0;

function Update(delta) {
    if ( control && camera ) {
        let distance = control.getDistance().toFixed(2);
        if (distance!=currentDist) {
            currentDist=distance;
            let scaleFac = 1-(Math.min(200,currentDist)-100) / (200-100).toFixed(2);
            control.target.set(0, 82+65*scaleFac, 0);
            if ( DirLight.light ) {
                DirLight.light.position.set( -100, 100, 35-currentDist )
            }
        }
        position = Camera.Update();
        control.update( delta );
    }
}

function OnResize() {
    Camera.OnResize();
}

export {control, camera, position, Init, Update, OnResize}