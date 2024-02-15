import * as THREE from 'three';
import { UnlitFrag, UnlitVert } from '/shaders/Unlit.js';
import { HSRBaseVert, HSRBaseFrag } from '/shaders/HSR_Base.js';
import { HSRFaceFrag, HSRFaceVert } from '/shaders/HSR_Face.js';
import * as OrbitCamera from '/components/OrbitCamera.js';
import * as DirLight from '/components/DirLight.js';

const texLoader = new THREE.TextureLoader();

let characterName;

function Init(charName) {
    characterName = charName;
}

async function loadTexture(path, colorSpace=THREE.NoColorSpace, enableMip=true, flipY=false) {
    let tex = await texLoader.load('./textures/' + path);
    tex.flipY = flipY
    if(!enableMip) {
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
    }
    tex.colorSpace = colorSpace;
    return tex;
}

async function LoadBaseMap(name)
{
    let file = characterName + "_" + name + "_" + "Color.png"
    return await loadTexture(file);
}
async function LoadLightMap(name)
{
    let file = characterName + "_" + name + "_" + "LightMap.png"
    return await loadTexture(file);
}
async function LoadRampMap(name)
{
    let cool = characterName + "_" + name + "_" + "Cool_Ramp.png";
    let warm = characterName + "_" + name + "_" + "Warm_Ramp.png";
    return [
        await loadTexture(cool, THREE.LinearSRGBColorSpace, false, true), 
        await loadTexture(warm, THREE.LinearSRGBColorSpace, false, true)
    ];
}
async function LoadFaceMap(baseName)
{
    let FaceMap = baseName + "_FaceMap_00.png";
    let ExpressionMap = baseName + "_Face_ExpressionMap_00.png";
    return [
        await loadTexture(FaceMap), 
        await loadTexture(ExpressionMap)
    ];
}

async function CreateUnlitMaterial(name)
{
    let MainTex = await LoadBaseMap(name);
    let mat = new THREE.ShaderMaterial({
        fragmentShader: UnlitFrag,
        vertexShader: UnlitVert,
        uniforms: {
            "_MainTex": { type: 't', value: MainTex},
        },
    });
    mat.side = THREE.DoubleSide;
    return mat;
}
async function CreateHSRBaseMaterial(name, isHair)
{
    let Ramp = await LoadRampMap(name);
    let mat = new THREE.ShaderMaterial({
        fragmentShader: HSRBaseFrag,
        vertexShader: HSRBaseVert,
        uniforms: {
            _isHair: {value: isHair},
            _MainTex: { type: 't', value: await LoadBaseMap(name)},
            _ILMTex: { type: 't', value: await LoadLightMap(name)},

            _CoolRampTex: { type: 't', value: Ramp[0]},
            _WarmRampTex: { type: 't', value: Ramp[1]},
            _WarmCoolShadowFac: { value: 1 },

            _useEmission: { value: !isHair },
            _emissionThreshold: { value: 0.1 },
            _emissionTint: { value: new THREE.Vector3(1,1,1) },
            _emissionStrength: { value: 1.6 },

            _lightDir: { value: DirLight.lightPos },
            _lightColor: { value: DirLight.lightColorVector },
        },
        vertexColors: true,
    });
    mat.side = THREE.DoubleSide;
    return mat;
}
async function CreateHSRFaceMaterial(name, FaceBaseName)
{
    let FaceMaps = await LoadFaceMap(FaceBaseName);
    let mat = new THREE.ShaderMaterial({
        fragmentShader: HSRFaceFrag,
        vertexShader: HSRFaceVert,
        uniforms: {
            _MainTex: { type: 't', value: await LoadBaseMap(name)},
            _FaceMap: { type: 't', value: FaceMaps[0]},
            _ExpressionTex: { type: 't', value: FaceMaps[1]},
            
            _DarkColor: { value: new THREE.Vector3(0.95294124, 0.8862746, 0.8862746) },
            _EyeShadowColor: {value: new THREE.Vector3(0.8881128, 0.8666667, 0.9137255)},

            _NoseLinePower: {value: 1},
            _NoseLineColor: {value: new THREE.Vector3(0.6431373, 0.3490196, 0.3490196)},

            _useEmission: { value: true },
            _emissionThreshold: { value: 0.1 },
            _emissionTint: { value: new THREE.Vector3(1,1,1) },
            _emissionStrength: { value: 1.6 },

            _lightDir: { value: DirLight.lightPos },
            _lightColor: { value: DirLight.lightColorVector },
            _cameraPos: {value: OrbitCamera.position}
        },
        vertexColors: true,
    });
    mat.side = THREE.DoubleSide;
    return mat;
}

export {Init, CreateHSRBaseMaterial, CreateHSRFaceMaterial, CreateUnlitMaterial}