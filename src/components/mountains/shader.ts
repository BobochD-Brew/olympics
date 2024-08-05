import { glsl, named } from "@Utils/glsl";
import { noise, noise3D } from "./noise";

const map = named("map").glsl`
    float map(float value, float min1, float max1) {
        return (min(max1, max(min1, value)) - min1) / (max1 - min1);
    }
`

export const vertexShader = glsl`
#define PHONG

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
${noise.glsl}
${noise3D.glsl}
${map.glsl}

varying vec3 vViewPosition;

varying vec2 vUv;
varying float noiseHeight;
varying vec3 pos;
uniform float time;
uniform float speed;
uniform float scale;
uniform float frequency;

void main() {
    #include <begin_vertex>
    // vUv = uv;
    vec2 target2D = transformed.xy + vec2(0.0, time * speed);
    noiseHeight = pow(${map.func}(${noise.func}(target2D * frequency), 0.8, 1.0), 1.0) +
                  ${noise.func}(target2D * frequency * 10.0) * 0.05;
    transformed.z += scale * pow(uv.y, 0.2) * noiseHeight;

    vec3 target3D = vec3(target2D, transformed.z);
    transformed.x += ${noise3D.func}(target3D * frequency * 2.0) * 0.5 +
        ${noise3D.func}(target3D * frequency * 20.0) * 0.1;

    vec3 yOffset = vec3(0.0, 100.0, 0.0);
    transformed.y += ${noise3D.func}(target3D * frequency * 2.0 + yOffset) * 0.5 +
        ${noise3D.func}(target3D * frequency * 20.0 + yOffset) * 0.1;

    pos = transformed;
    #include <beginnormal_vertex>
    #include <project_vertex>
    vViewPosition = -mvPosition.xyz;
    #include <worldpos_vertex>
    #include <defaultnormal_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
}
`;

export const fragmentShader = glsl`
#define PHONG

#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <dithering_pars_fragment>
#include <lights_phong_pars_fragment>
#include <specularmap_pars_fragment>

${noise.glsl}
${map.glsl}

varying vec3 pos;
varying float noiseHeight;
uniform float time;
uniform float opacity;
uniform float speed;
uniform vec3 color;

vec3 getNormalFromDxDy(vec3 pos) {
    vec3 dx = dFdx(pos);
    vec3 dy = dFdy(pos);
    return normalize(cross(dx, dy));
}

void main() {
    vec3 normal = getNormalFromDxDy(pos);

    vec3 noiseColor = color * 0.7098;
    float t = ${map.func}(${noise.func}((pos.xy + vec2(0.0, time * speed)) * 200.0), 1.0 - pow(noiseHeight, 2.0), 1.0);
    vec4 diffuseColor = vec4(mix(color, noiseColor, t), 1.0);

    ReflectedLight reflectedLight = ReflectedLight(vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = vec3(0.0);

    BlinnPhongMaterial material;
    material.diffuseColor = diffuseColor.rgb;
    material.specularColor = vec3(1.0);
    material.specularShininess = 1.0;
    material.specularStrength = 0.0;

	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
    
    vec3 shadowColor = vec3(0.5921, 0.5686, 0.5490);
    outgoingLight = mix(outgoingLight, shadowColor, (1.0 - getShadowMask()) * 0.5);

    gl_FragColor = vec4(mix(color, outgoingLight, pow(noiseHeight, 2.0)), 1.0);//vec4( 1.0);
    #ifdef USE_FOG
        #ifdef FOG_EXP2
            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
        #else
            float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
        #endif
        gl_FragColor = mix(vec4(0.0), gl_FragColor, (1.0 - fogFactor));
    #endif
    gl_FragColor = mix(vec4(0.0), gl_FragColor, opacity);
    #include <dithering_fragment>
}
`;