/**
 * JeeVan Nature Shader Engine - GLSL Shaders
 *
 * Vertex and fragment shaders for:
 * - Dynamic atmospheric backgrounds
 * - Light shafts / god rays
 * - Foliage displacement
 * - Water ripple distortion
 * - Bioluminescent particles
 */

// ─── Vertex Shader: Atmospheric Background ───
export const atmosphereVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ─── Fragment Shader: Dynamic Atmosphere with Light Shafts ───
export const atmosphereFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  uniform float uTime;
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientColor;
  uniform float uLightIntensity;
  uniform float uFogDensity;
  uniform float uRippleStrength;
  uniform vec2 uMousePosition;
  uniform float uWeatherCondition; // 0=clear, 1=rain, 2=snow, 3=fog, 4=night
  uniform float uDayProgress;     // 0=midnight, 0.5=noon, 1=midnight

  // Noise functions for organic movement
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;

    // ─── Base atmosphere ───
    vec3 skyTop = vec3(0.05, 0.12, 0.22);    // Deep night sky
    vec3 skyHorizon = vec3(0.15, 0.28, 0.42); // Twilight horizon
    vec3 skyDay = vec3(0.35, 0.55, 0.75);     // Clear day

    // Blend sky based on day progress
    float dayFactor = smoothstep(0.0, 0.3, uDayProgress) * (1.0 - smoothstep(0.7, 1.0, uDayProgress));
    vec3 skyColor = mix(skyTop, skyDay, dayFactor);
    skyColor = mix(skyColor, skyHorizon, pow(1.0 - uv.y, 3.0));

    // ─── Golden hour tint ───
    float goldenHour = smoothstep(0.15, 0.25, uDayProgress) * smoothstep(0.35, 0.25, uDayProgress);
    goldenHour += smoothstep(0.75, 0.85, uDayProgress) * smoothstep(0.95, 0.85, uDayProgress);
    vec3 goldenColor = vec3(0.95, 0.65, 0.25);
    skyColor = mix(skyColor, goldenColor, goldenHour * 0.4);

    // ─── Cloud / foliage canopy ───
    float canopy = fbm(uv * 3.0 + uTime * 0.02) * 0.5 + 0.5;
    canopy = smoothstep(0.35, 0.65, canopy);

    vec3 canopyDark = vec3(0.02, 0.08, 0.03);
    vec3 canopyLight = vec3(0.08, 0.25, 0.08);
    vec3 canopyColor = mix(canopyDark, canopyLight, canopy * dayFactor);

    // ─── Light shafts (god rays) through canopy ───
    float lightShaft = 0.0;
    for (int i = 0; i < 3; i++) {
      float angle = float(i) * 1.2 + uTime * 0.01;
      vec2 shaftPos = vec2(0.3 + sin(angle) * 0.2, 0.7 + cos(angle * 0.7) * 0.15);
      float shaft = exp(-length(uv - shaftPos) * 4.0);
      shaft *= smoothstep(0.0, 0.3, canopy) * uLightIntensity * dayFactor;
      lightShaft += shaft * 0.15;
    }

    // ─── Mouse interaction: ripple displacement ───
    float mouseDist = length(uv - uMousePosition);
    float ripple = exp(-mouseDist * 4.0) * sin(mouseDist * 20.0 - uTime * 2.0) * uRippleStrength;
    float fogDisplacement = fbm(uv * 5.0 + ripple * 0.1 + uTime * 0.015);

    // ─── Weather effects ───
    vec3 weatherColor = vec3(0.0);

    // Rain: darken with bluish tint
    float rainFactor = step(0.9, uWeatherCondition) * step(uWeatherCondition, 1.1);
    vec3 rainColor = vec3(0.25, 0.3, 0.4);
    skyColor = mix(skyColor, rainColor, rainFactor * 0.6);

    // Snow: brighten with whitish overlay
    float snowFactor = step(1.9, uWeatherCondition) * step(uWeatherCondition, 2.1);
    vec3 snowColor = vec3(0.85, 0.9, 0.95);
    skyColor = mix(skyColor, snowColor, snowFactor * 0.5);

    // Fog: desaturate and brighten
    float fogFactor = step(2.9, uWeatherCondition) * step(uWeatherCondition, 3.1);
    float fogAmount = fbm(uv * 3.0 + uTime * 0.01) * uFogDensity * (1.0 + fogFactor);
    skyColor = mix(skyColor, vec3(0.6, 0.65, 0.7), fogAmount * 0.7);

    // Night: bioluminescent tint
    float nightFactor = step(3.9, uWeatherCondition) * step(uWeatherCondition, 4.1);
    vec3 bioColor = vec3(0.0, 0.4, 0.2) * 0.3;
    skyColor = mix(skyColor, bioColor, nightFactor * (1.0 - dayFactor));

    // ─── Compose final color ───
    vec3 finalColor = mix(skyColor, canopyColor, canopy * 0.4);
    finalColor += lightShaft * vec3(1.0, 0.95, 0.7) * uLightIntensity;
    finalColor += weatherColor;

    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5) * 1.8);
    finalColor *= mix(0.7, 1.0, vignette);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// ─── Vertex Shader: Particles (fireflies, snow, leaves, butterflies) ───
export const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = aSize * uSize * uPixelRatio * (300.0 / -viewPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 40.0);

    vColor = aColor;
    vAlpha = 0.6 + 0.4 * sin(aPhase + uTime * 2.0);
    vPhase = aPhase;
  }
`

// ─── Fragment Shader: Glowing particles ───
export const particleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  uniform float uTime;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    // Soft glow
    float glow = exp(-dist * 3.0) * 0.8;
    // Bright core
    float core = exp(-dist * 8.0) * 0.5;

    float alpha = (glow + core) * vAlpha;

    if (alpha < 0.02) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── Vertex Shader: Water droplet distortion ───
export const dropletVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ─── Fragment Shader: Droplet with refraction ───
export const dropletFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform sampler2D uBackgroundTexture;

  void main() {
    vec2 uv = vUv;

    // Drop-like distortion
    float drop = sin(uv.x * 15.0 + uTime * 2.0) * cos(uv.y * 15.0 + uTime * 1.5) * 0.02;
    drop += sin((uv.x + uv.y) * 25.0 - uTime * 3.0) * 0.015;

    vec2 distortedUV = uv + drop;

    vec4 bgColor = texture2D(uBackgroundTexture, distortedUV);

    // Droplet highlight
    float highlight = smoothstep(0.0, 0.1, 1.0 - length(uv - vec2(0.3, 0.7)) * 2.0);
    highlight *= 0.15;

    vec3 finalColor = bgColor.rgb * (0.9 + highlight) + vec3(0.5, 0.7, 0.9) * highlight;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`
