// 改写自https://github.com/stalomeow/StarRailNPRShader（GPL-3.0）
const HSRBaseVert = `
#include <skinning_pars_vertex>
varying vec2 UV1;
varying vec2 UV2;
varying vec4 vColor;
varying vec3 positionWS;
varying vec3 normalWS;
varying vec3 viewPosWS;
attribute vec2 uv1;
attribute vec2 uv2;

void main()
{
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    UV1 = uv;
    UV2 = uv1;
    positionWS = position; 
    normalWS = normal;
    vColor = color;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    viewPosWS = (modelMatrix * vec4(position, 1.)).xyz;
}
`;

const HSRBaseFrag = `
precision highp float;

varying vec3 positionWS;
varying vec3 normalWS;
varying vec3 viewPosWS;
varying vec2 UV1;
varying vec2 UV2;
varying vec4 vColor;

uniform bool _isHair;

uniform vec3 _lightDir;
uniform vec3 _lightColor;

uniform sampler2D _CoolRampTex;
uniform sampler2D _WarmRampTex;
uniform float _WarmCoolShadowFac;

uniform vec4 _SpecularColor[8];

uniform float _SpecularMetallic[8];
uniform float _SpecularShininess[8];
uniform float _SpecularIntensity[8];
uniform float _SpecularEdgeSoftness[8];

uniform float _RimWidth[8];
uniform vec4 _RimColor[8];
uniform float _RimDark[8];

uniform bool _useEmission;
uniform float _emissionThreshold;
uniform vec3 _emissionTint;
uniform float _emissionStrength;

uniform float _BloomIntensity[8];
uniform float _OutlineColor[8];

uniform sampler2D _MainTex;
uniform sampler2D _ILMTex;

const float matThres[7] = float[7](0.87, 0.75, 0.62, 0.50, 0.37, 0.25, 0.12);

vec2 GetRampUV(float NoL, vec4 vertexColor, vec4 lightMap, bool isSingleMaterial)
{
    // 头发 Ramp 上一共 2 条颜色，对应一个材质
    // 身体 Ramp 上一共 16 条颜色，每两条对应一个材质，共 8 种材质

    float ao = lightMap.g;
    float material = lightMap.a;

    if(isSingleMaterial) {
        material = 0.;
    }

    ao *= vColor.r;

    float NoL01 = NoL * 0.5 + 0.5;
    float threshold = (NoL01 + ao) * 0.5;
    float shadowStrength = (0.5 - threshold) / 0.5;
    float shadow = 1. - clamp(shadowStrength / 0.5, 0., 1.);

    // Ramp 图从左到右的变化规律：暗 -> 亮 -> 暗 -> 亮
    // 左边一部分应该是混合 Shadow Map 的
    shadow = mix(0.20, 1., shadow); // 这里只用右边一半
    shadow = mix(0., shadow, step(0.05, ao)); // AO < 0.05 的区域（自阴影区域）永远不受光
    shadow = mix(1., shadow, step(ao, 0.95)); // AO > 0.95 的区域永远受最强光

    return vec2(shadow, material + 0.05);
}

vec3 GetRampDiffuse(float NoL, vec3 baseColor, vec4 ilm, vec3 lightColor, bool isHair) {
    vec2 rampUV = GetRampUV(NoL, vColor, ilm, isHair);
    vec3 rampCool = texture2D(_CoolRampTex, rampUV).rgb;
    vec3 rampWarm = texture2D(_WarmRampTex, rampUV).rgb;
    vec3 rampColor = mix(rampCool, rampWarm, _WarmCoolShadowFac);
    return rampColor * baseColor * lightColor;
}

void main() {
    vec4 baseColor = texture2D(_MainTex, UV1);
    vec4 backColor = texture2D(_MainTex, UV2);

    baseColor = mix(backColor, baseColor, float(gl_FrontFacing));
    vec4 ilm = texture2D(_ILMTex, UV1).rgba;
    
    int ind = 7;
    for(int i=0;i<7;++i)
    {
        if(ilm.a < matThres[i]) ind-=1;
    }
    vec4  specularColor        = _SpecularColor[ind];
    float specularMetallic     = _SpecularMetallic[ind];
    float specularShininess    = _SpecularShininess[ind];
    float specularIntensity    = _SpecularIntensity[ind];
    float specularEdgeSoftness = _SpecularEdgeSoftness[ind];
    float rimWidth             = _RimWidth[ind];
    vec4  rimColor             = _RimColor[ind];
    float rimDark              = _RimDark[ind];
    float bloomIntensity       = _BloomIntensity[ind];

    vec3 lightDirection = normalize(vec3(-_lightDir.x, _lightDir.y, -_lightDir.z));

    float NoL = dot(normalWS, lightDirection);
    vec3 diffuse = GetRampDiffuse(NoL, baseColor.rgb, ilm, _lightColor, _isHair);

    if(_useEmission) {
        diffuse = mix(diffuse, baseColor.rgb * _emissionTint.rgb * _emissionStrength, step(_emissionThreshold, baseColor.a));
    }

    gl_FragColor = vec4(diffuse, 1.0);

}
`

export {HSRBaseFrag, HSRBaseVert}
