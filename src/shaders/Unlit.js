const UnlitFrag = `
precision highp float;

varying vec2 UV0;

uniform sampler2D _MainTex;

void main() {
    vec4 mainTex = texture2D(_MainTex, UV0);
    gl_FragColor = vec4(mainTex.rgb, 1.0);
}
`

const UnlitVert = `
#include <skinning_pars_vertex>
varying vec2 UV0;

void main()
{
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    UV0 = uv;
}
`;

export {UnlitFrag, UnlitVert}
