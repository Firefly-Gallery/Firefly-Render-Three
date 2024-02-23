import * as THREE from 'three';
import * as Renderer from '/components/Renderer.js';
import * as OrbitCamera from '/components/OrbitCamera.js';
import * as DirLight from '/components/DirLight.js';
import * as Debugger from '/components/Debugger.js';
import * as Composer from '/components/Composer.js';
import * as Model from '/components/Model.js';
import { plane, grid } from './Static.js';

let scene;

const useComposer = false;

const characterName = "Avatar_Firefly_00"

const clock = new THREE.Clock();

async function Init() {

    Renderer.Init();

    scene = new THREE.Scene();

    scene.add( plane );
    scene.add( grid );

    OrbitCamera.Init(Renderer.renderer);
    
    DirLight.Init()
    OrbitCamera.camera.add(DirLight.light);
    
    scene.add(OrbitCamera.camera);
    
    if(useComposer) {Composer.Init(scene, OrbitCamera.camera)}

    window.addEventListener( 'resize', onWindowResize );

    Debugger.Init();

    await Model.Init(characterName, function(object){
        scene.add(object)
        document.querySelector('.loading').classList.add('hidden')
        animate()
    });
    
}


function onWindowResize() {

    OrbitCamera.OnResize();

    Renderer.OnResize();

    Composer.OnResize();

}


function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    Model.Update(delta);

    OrbitCamera.Update(delta);
    DirLight.Update();

    if(useComposer) {Composer.Render();}
    else {Renderer.Render( scene, OrbitCamera.camera )};

    Debugger.Update();

}

export {scene, Init};