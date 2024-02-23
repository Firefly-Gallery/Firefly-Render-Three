// 改写自https://github.com/stalomeow/StarRailNPRShader（GPL-3.0）

const HSRFaceVert = `
#include <skinning_pars_vertex>
varying vec2 UV0;
varying vec4 vColor;
varying vec3 positionWS;
varying vec3 normalWS;
varying vec3 viewPosWS;

void main()
{
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    UV0 = uv;
    positionWS = position; 
    normalWS = normal;
    vColor = color;
    viewPosWS = vec3(modelViewMatrix * vec4(position, 1.0));
}
`;

const HSRFaceFrag = `
precision highp float;

varying vec3 positionWS;
varying vec3 normalWS;
varying vec3 viewPosWS;
varying vec2 UV0;
varying vec4 vColor;

uniform sampler2D _MainTex;
uniform sampler2D _FaceMap;
uniform sampler2D _ExpressionTex;

uniform vec3 _lightDir;
uniform vec3 _lightColor;

uniform vec3 _cameraPos;

uniform vec3 _DarkColor;
uniform vec3 _EyeShadowColor;

uniform float _NoseLinePower;
uniform vec3 _NoseLineColor;

// +Y 是 Forward
// -Z 是 Right
// -X 是 Up
const vec3 _headForward = vec3(0.0, 0.0, -1.0);
const vec3 _headRight = vec3(1.0, 0.0, 0.0);
const vec3 _headUp = vec3(0.0, 1.0, 0.0);

const float _ShadowOffset = 0.;

uniform float _RimWidth;
uniform vec4 _RimColor;
uniform float _RimDark;

uniform bool _useEmission;
uniform float _emissionThreshold;
uniform vec3 _emissionTint;
uniform float _emissionStrength;

uniform float _BloomIntensity;
uniform float _OutlineColor;

vec3 GetWorldSpaceViewDir(vec3 positionWS)
{
    // Perspective
    return cameraPosition - positionWS;
}

vec3 GetFaceDiffuse(vec3 lightDirection, vec3 baseColor, vec4 faceMap, vec3 lightColor)
{
    vec3 lightDir = lightDirection;
    vec3 headF = normalize(_headForward);
    vec3 headU = normalize(_headUp);
    vec3 headR = normalize(_headRight);
    
    // 做一次投影
    vec3 lightDirProj = normalize(lightDir - dot(lightDir, headU) * headU);

    vec2 sdfUV = vec2(0.);

    if (dot(lightDirProj, _headRight) > 0.) {
        sdfUV = vec2(1. - UV0.x, UV0.y);
    } else {
        sdfUV = UV0.xy;
    }

    float threshold = texture2D(_FaceMap, sdfUV).a;

    float FoL01 = dot(headF, lightDirProj) * 0.5 + 0.5;
    // Face SDF Shadow
    vec3 faceShadow = mix(_DarkColor.rgb, vec3(1.), step(1. - threshold, FoL01));
    // Eye Shadow
    vec3 eyeShadow = mix(_EyeShadowColor.rgb, vec3(1.), smoothstep(0.3, 0.5, FoL01));

    vec3 shadow = mix(faceShadow, eyeShadow, faceMap.r);

    return shadow * baseColor * lightColor;
}

void main() {
    vec4 baseColor = texture2D(_MainTex, UV0);
    vec4 faceMap = texture2D(_FaceMap, UV0).rgba;

    // Nose Line
    vec3 v = normalize(GetWorldSpaceViewDir(positionWS));
    vec3 FdotV = vec3(pow(abs(dot(_headForward, v)), _NoseLinePower));
    vec3 diffuse = mix(baseColor.rgb, baseColor.rgb * _NoseLineColor.rgb, step(1.03 - faceMap.b, FdotV));

    
    vec3 lightDirection = normalize(vec3(-_lightDir.x, _lightDir.y, -_lightDir.z));

    diffuse = GetFaceDiffuse(lightDirection, baseColor.rgb, faceMap, _lightColor);
    
    if(_useEmission) {
        diffuse = mix(diffuse, baseColor.rgb * _emissionTint.rgb * _emissionStrength, step(_emissionThreshold, baseColor.a));
    }

    gl_FragColor = vec4(diffuse, 1.0);
}
`

export {HSRFaceFrag, HSRFaceVert}