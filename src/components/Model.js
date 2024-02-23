import * as THREE from 'three';
import * as Material from './Material.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import model from '@/assets/models/Avatar_Firefly_00_Model_Chara.glb'

let mixer, object;
let mesh = [];

// model
const loader = new GLTFLoader();

async function Init(characterName, callback) {

    Material.Init(characterName)
    let bodyMat = await Material.CreateHSRBaseMaterial("Body", false);
    let faceMat = await Material.CreateHSRFaceMaterial("Face", "W_160_Maid");
    let hairMat = await Material.CreateHSRBaseMaterial("Hair", true);

    await loader.load( model, function ( gltf ) {

        object = gltf.scene;
    
        object.traverse( function ( child ) {
    
            if ( child.isMesh && child.type == 'SkinnedMesh' ) {
                let newMat = new THREE.MeshLambertMaterial();
                switch(child.name) {
                    case "Body": newMat = bodyMat;break;
                    case "Hair": newMat = hairMat;break;
                    case "Face": newMat = faceMat;break;
                    case "FaceMask": newMat = new THREE.MeshBasicMaterial({color:0x000000});break;
                    case "EyeShadow": newMat = new THREE.MeshBasicMaterial({transparent:true, color:0x000000, opacity:0.4});break;
                }
                child.material = newMat;
                child.castShadow = true;
                child.receiveShadow = false;
                console.log(`Applying Material:${child.name}`)
                mesh.push(child)
            }
            object.scale.set(100, 100, 100);
    
        } );
        mixer = new THREE.AnimationMixer( object );
    
        const action = mixer.clipAction( gltf.animations[ 0 ] );
        action.play();

        callback(object)
    } );
}

function Update(delta) {
    mixer.update(delta);
}

export {object, mesh, Init, Update}
