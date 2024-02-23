import * as THREE from 'three';
import * as Renderer from './Renderer.js';
import * as OrbitCamera from './OrbitCamera.js';
import * as DirLight from './DirLight.js';
import * as Debugger from './Debugger.js';
import * as Model from './Model.js';
import { plane } from './Static.js';

let scene, debug;

const characterName = "Avatar_Firefly_00"

const clock = new THREE.Clock();

async function Init(isDebug) {

    debug = isDebug
    
    Renderer.Init();

    scene = new THREE.Scene();

    scene.add( plane );

    OrbitCamera.Init(Renderer.renderer);
    
    DirLight.Init()
    OrbitCamera.camera.add(DirLight.light);
    
    scene.add(OrbitCamera.camera);
    
    if(debug) Debugger.Init();

    window.addEventListener( 'resize', onWindowResize );


    await Model.Init(characterName, function(object){
        document.querySelector('.loading').classList.add('loading_out')
        scene.add(object)
        animate()
    });
    
}


function onWindowResize() {

    OrbitCamera.OnResize();

    Renderer.OnResize();

}


function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    Model.Update(delta);

    OrbitCamera.Update(delta);
    DirLight.Update();
    Renderer.Render( scene, OrbitCamera.camera );

    if(debug) Debugger.Update();

}

export {scene, Init};