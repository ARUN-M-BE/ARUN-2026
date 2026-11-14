"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * SplashCursor — WebGL fluid-ink cursor trail (React Bits).
 * https://reactbits.dev — re-licensed under the project's MIT terms; see CREDITS.md.
 *
 * Ported to TypeScript and wired to the Midnight Aurora palette. Heavy WebGL
 * setup lives inside a single effect that is fully disposed on unmount, and the
 * simulation only runs while the pointer is active or the intro stroke plays.
 * Styling lives in `app/globals.css` under the "Splash cursor" section.
 */

type RGB = [number, number, number];
type Quality = "low" | "medium" | "high";
type CursorTheme = "dark" | "light";

interface QualityPreset {
  sim: number;
  dye: number;
  iterations: number;
}

const QUALITY: Record<Quality, QualityPreset> = {
  low: { sim: 64, dye: 512, iterations: 10 },
  medium: { sim: 96, dye: 1024, iterations: 16 },
  high: { sim: 128, dye: 1440, iterations: 20 },
};

const BLOOM_RESOLUTION = 256;
const BLOOM_ITERATIONS = 4;
const BLOOM_THRESHOLD = 0.3;
const BLOOM_KNEE = 0.7;

const ROOT = "splash-cursor";
const CANVAS = "splash-cursor__canvas";

const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`;

const SHADERS: Record<string, string> = {
  copy: `uniform sampler2D uTexture;
void main() {
  outColor = texture(uTexture, vUv);
}`,
  clear: `uniform sampler2D uTexture;
uniform float value;
void main() {
  outColor = value * texture(uTexture, vUv);
}`,
  splat: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform float radius;
void main() {
  vec2 scale = vec2(aspectRatio, 1.0);
  vec2 pa = (vUv - pointA) * scale;
  vec2 ba = (pointB - pointA) * scale;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-9), 0.0, 1.0);
  vec2 d = pa - ba * h;
  vec3 base = texture(uTarget, vUv).xyz;
  outColor = vec4(base + exp(-dot(d, d) / radius) * color, 1.0);
}`,
  burst: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform float strength;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  float distance = length(d);
  vec2 direction = d / max(distance, 0.00001);
  float angle = atan(d.y, d.x);
  float petals = 0.78 + 0.22 * sin(angle * 5.0 + seed) * sin(angle * 3.0 - seed * 1.7);
  vec2 twist = vec2(-direction.y, direction.x) * 0.3 * sin(angle * 4.0 + seed * 2.3);
  float falloff = exp(-dot(d, d) / radius) * distance / sqrt(radius);
  outColor = vec4(texture(uTarget, vUv).xy + (direction * petals + twist) * falloff * strength, 0.0, 1.0);
}`,
  crown: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform vec3 colorA;
uniform vec3 colorB;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  vec3 ink = exp(-dot(d, d) / (radius * 0.45)) * colorA;
  for (int i = 0; i < 7; i++) {
    float index = float(i);
    float angle = seed + index * 0.8975979 + sin(seed * 3.0 + index * 1.9) * 0.35;
    float reach = sqrt(radius) * (0.75 + 0.45 * fract(sin(seed * 7.1 + index * 3.7) * 43.7));
    float drop = radius * (0.08 + 0.12 * fract(sin(seed * 2.9 + index * 5.3) * 31.9));
    vec2 q = d - vec2(cos(angle), sin(angle)) * reach;
    ink += exp(-dot(q, q) / drop) * mix(colorA, colorB, fract(index * 0.37 + 0.2));
  }
  outColor = vec4(texture(uTarget, vUv).xyz + ink, 1.0);
}`,
  advection: `uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  outColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(velocity, 0.0, 1.0);
}`,
  prefilter: `uniform sampler2D uTexture;
uniform vec3 curve;
uniform float threshold;
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  float rq = clamp(br - curve.x, 0.0, curve.y);
  rq = curve.z * rq * rq;
  c *= max(rq, br - threshold) / max(br, 0.0001);
  outColor = vec4(c, 0.0);
}`,
  blur: `uniform sampler2D uTexture;
uniform float intensity;
void main() {
  vec4 sum = texture(uTexture, vL) + texture(uTexture, vR) + texture(uTexture, vT) + texture(uTexture, vB);
  outColor = sum * 0.25 * intensity;
}`,
  display: `uniform sampler2D uTexture;
uniform sampler2D uBloom;
uniform vec2 texelSize;
uniform float shading;
uniform float bloom;
uniform float light;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  if (shading > 0.0) {
    float dx = length(texture(uTexture, vR).rgb) - length(texture(uTexture, vL).rgb);
    float dy = length(texture(uTexture, vT).rgb) - length(texture(uTexture, vB).rgb);
    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    c *= mix(1.0, clamp(n.z + 0.7, 0.7, 1.0), shading);
  }
  if (bloom > 0.0) {
    c += max(texture(uBloom, vUv).rgb, 0.0) * bloom;
  }
  c = max(c, 0.0);
  float peak = max(c.r, max(c.g, c.b));
  float grain = (hash(gl_FragCoord.xy) - 0.5) / 255.0 * smoothstep(0.0, 0.03, peak);
  if (light > 0.5) {
    vec3 transmit = exp(-2.4 * c);
    float low = min(transmit.r, min(transmit.g, transmit.b));
    float alpha = clamp(1.0 - low + grain, 0.0, 1.0);
    outColor = vec4(min(transmit - low, vec3(alpha)), alpha);
  } else {
    c = max(c + grain, 0.0);
    float alpha = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    outColor = vec4(min(c, vec3(alpha)), alpha);
  }
}`,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseColor = (value: string): RGB => {
  let hex = String(value).replace("#", "").trim();
  if (hex.length === 3) hex = [...hex].map((char) => char + char).join("");
  const number = parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(number)) return [1, 1, 1];
  return [
    ((number >> 16) & 255) / 255,
    ((number >> 8) & 255) / 255,
    (number & 255) / 255,
  ];
};

const hsv = (h: number, s: number, v: number): RGB => {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const sector = ((i % 6) + 6) % 6;
  if (sector === 0) return [v, t, p];
  if (sector === 1) return [q, v, p];
  if (sector === 2) return [p, v, t];
  if (sector === 3) return [p, q, v];
  if (sector === 4) return [t, p, v];
  return [v, p, q];
};

interface Pointer {
  x: number;
  y: number;
  px: number;
  py: number;
  ready: boolean;
  moved: boolean;
  offset: number;
}

interface Format {
  internal: number;
  format: number;
}

interface RenderTarget {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelX: number;
  texelY: number;
  attach: (unit: number) => number;
}

interface DoubleTarget {
  read: RenderTarget;
  write: RenderTarget;
  width: number;
  height: number;
  texelX: number;
  texelY: number;
  swap: () => void;
}

interface CompiledProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface Size {
  width: number;
  height: number;
}

export interface SplashCursorProps {
  /** Palette the ink cycles through when `rainbow` is off. */
  colors?: string[];
  /** Cycle through the full spectrum instead of the palette. */
  rainbow?: boolean;
  /** How fast the colors shift while moving. 0 keeps one color per stroke. */
  colorSpeed?: number;
  /** How much ink each movement leaves behind. */
  intensity?: number;
  /** Width of the stroke and the splash. */
  size?: number;
  /** How hard the cursor pushes the fluid. */
  force?: number;
  /** Amount of curling eddies in the flow. */
  swirl?: number;
  /** How long the ink lingers before it fades. */
  trail?: number;
  /** How long the fluid keeps moving after the cursor stops. */
  momentum?: number;
  /** Depth shading on the ripples, from 0 to 1. */
  shading?: number;
  /** Soft bloom around the brightest ink, from 0 to 1. */
  glow?: number;
  /** Simulation detail. Lower settings are lighter on older devices. */
  quality?: Quality;
  /** Burst a splash where the user clicks or taps. */
  clickSplash?: boolean;
  /** Play a short stroke across the screen on mount. */
  intro?: boolean;
  /** Fill the parent element instead of the viewport and only react inside it. */
  contained?: boolean;
  /** Glowing ink for dark backgrounds or absorbing ink for light ones. */
  theme?: CursorTheme;
  /** Stacking order of the effect over the content. */
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
}

export function SplashCursor({
  colors = ["#4f8cff", "#2dd4bf", "#ffd166"],
  rainbow = true,
  colorSpeed = 1,
  intensity = 1,
  size = 1,
  force = 1,
  swirl = 3,
  trail = 1,
  momentum = 1,
  shading = 1,
  glow = 0,
  quality = "high",
  clickSplash = true,
  intro = true,
  contained = false,
  theme = "dark",
  zIndex = 50,
  className = "",
  style,
}: SplashCursorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const releaseRef = useRef<number>(0);
  const [generation, setGeneration] = useState(0);

  const settings = {
    palette: (Array.isArray(colors) && colors.length ? colors : ["#ffffff"]).map(parseColor),
    rainbow,
    colorSpeed: Math.max(0, colorSpeed),
    intensity: Math.max(0, intensity),
    size: Math.max(0.05, size),
    force: Math.max(0, force),
    swirl: Math.max(0, swirl),
    trail: Math.max(0.05, trail),
    momentum: Math.max(0.05, momentum),
    shading: clamp(shading, 0, 1),
    glow: clamp(glow, 0, 1),
    quality: (QUALITY[quality] ? quality : "high") as Quality,
    clickSplash,
    contained,
    light: theme === "light",
  };
  const settingsRef = useRef(settings);
  // Synced after commit: the render body stays pure, and every shader reads
  // the latest props from the animation loop.
  useEffect(() => {
    settingsRef.current = settings;
  });
  const introRef = useRef(intro);

  useEffect(() => {
    const parent = rootRef.current?.parentElement;
    if (!contained || !parent || getComputedStyle(parent).position !== "static") {
      return undefined;
    }
    const previous = parent.style.position;
    parent.style.position = "relative";
    return () => {
      parent.style.position = previous;
    };
  }, [contained]);

  useEffect(() => {
    window.clearTimeout(releaseRef.current);
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return undefined;
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("EXT_color_buffer_half_float");
    const parallel = gl.getExtension("KHR_parallel_shader_compile");

    const renderable = (internal: number, format: number) => {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      return complete;
    };
    const rgba: Format = { internal: gl.RGBA16F, format: gl.RGBA };
    if (!renderable(rgba.internal, rgba.format)) return undefined;
    const rg: Format = renderable(gl.RG16F, gl.RG)
      ? { internal: gl.RG16F, format: gl.RG }
      : rgba;
    const r: Format = renderable(gl.R16F, gl.RED)
      ? { internal: gl.R16F, format: gl.RED }
      : rg;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const programs: Record<string, CompiledProgram> = {};
    Object.entries(SHADERS).forEach(([name, body]) => {
      const fragment = compile(gl.FRAGMENT_SHADER, HEADER + body);
      const program = gl.createProgram()!;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, "aPosition");
      gl.linkProgram(program);
      gl.deleteShader(fragment);
      programs[name] = { program, uniforms: {} };
    });
    gl.deleteShader(vertex);

    let ready = false;
    let broken = false;

    const complete = () =>
      !parallel ||
      Object.values(programs).every((item) =>
        gl.getProgramParameter(item.program, parallel.COMPLETION_STATUS_KHR)
      );

    const finish = () => {
      if (!complete()) return false;
      Object.values(programs).forEach((item) => {
        if (!gl.getProgramParameter(item.program, gl.LINK_STATUS)) broken = true;
        const count = gl.getProgramParameter(item.program, gl.ACTIVE_UNIFORMS) as number;
        for (let i = 0; i < count; i++) {
          const info = gl.getActiveUniform(item.program, i);
          if (info) item.uniforms[info.name] = gl.getUniformLocation(item.program, info.name);
        }
      });
      ready = true;
      return true;
    };

    const buffer = gl.createBuffer()!;
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const targets = new Set<RenderTarget>();
    let disposed = false;
    let lost = false;

    const retire = () => {
      if (gl.isContextLost()) return;
      if (!ready && !complete()) {
        requestAnimationFrame(retire);
        return;
      }
      Object.values(programs).forEach((item) => gl.deleteProgram(item.program));
    };

    const release = () => {
      if (gl.isContextLost()) return;
      targets.forEach((target) => {
        gl.deleteFramebuffer(target.fbo);
        gl.deleteTexture(target.texture);
      });
      targets.clear();
      retire();
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
    };

    if (!parallel) finish();
    if (broken) {
      release();
      return undefined;
    }

    const uniformsOf = (name: string) => {
      const item = programs[name];
      gl.useProgram(item.program);
      return item.uniforms;
    };

    const blit = (target: RenderTarget | null) => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const createTarget = (
      width: number,
      height: number,
      format: Format,
      filter: number
    ): RenderTarget => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        format.internal,
        width,
        height,
        0,
        format.format,
        gl.HALF_FLOAT,
        null
      );
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const target: RenderTarget = {
        texture,
        fbo,
        width,
        height,
        texelX: 1 / width,
        texelY: 1 / height,
        attach: (unit: number) => {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        },
      };
      targets.add(target);
      return target;
    };

    const destroyTarget = (target: RenderTarget | null) => {
      if (!target) return;
      gl.deleteFramebuffer(target.fbo);
      gl.deleteTexture(target.texture);
      targets.delete(target);
    };

    const reshape = (
      target: RenderTarget,
      width: number,
      height: number,
      format: Format
    ) => {
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        format.internal,
        width,
        height,
        0,
        format.format,
        gl.HALF_FLOAT,
        null
      );
      target.width = width;
      target.height = height;
      target.texelX = 1 / width;
      target.texelY = 1 / height;
    };

    const createDouble = (
      width: number,
      height: number,
      format: Format,
      filter: number
    ): DoubleTarget => {
      const pair: DoubleTarget = {
        read: createTarget(width, height, format, filter),
        write: createTarget(width, height, format, filter),
        width,
        height,
        texelX: 1 / width,
        texelY: 1 / height,
        swap: () => {
          const current = pair.read;
          pair.read = pair.write;
          pair.write = current;
        },
      };
      return pair;
    };

    const resizeDouble = (
      pair: DoubleTarget,
      width: number,
      height: number,
      format: Format,
      filter: number,
      keep: boolean
    ) => {
      if (keep) {
        const next = createTarget(width, height, format, filter);
        const uniforms = uniformsOf("copy");
        gl.uniform1i(uniforms.uTexture, pair.read.attach(0));
        blit(next);
        destroyTarget(pair.read);
        pair.read = next;
      } else {
        reshape(pair.read, width, height, format);
      }
      reshape(pair.write, width, height, format);
      pair.width = width;
      pair.height = height;
      pair.texelX = 1 / width;
      pair.texelY = 1 / height;
    };

    const resolution = (base: number): Size => {
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      const aspect = Math.max(width, height) / Math.max(1, Math.min(width, height));
      const short = Math.round(base);
      const long = Math.round(base * aspect);
      return width > height ? { width: long, height: short } : { width: short, height: long };
    };

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
    };

    const sizes = () => {
      const preset = QUALITY[settingsRef.current.quality];
      const shortSide = Math.min(gl.drawingBufferWidth, gl.drawingBufferHeight);
      return {
        sim: resolution(preset.sim),
        ink: resolution(Math.max(preset.sim, Math.min(preset.dye, shortSide))),
      };
    };

    fit();
    const initial = sizes();
    const dye = createDouble(initial.ink.width, initial.ink.height, rgba, gl.LINEAR);
    const velocity = createDouble(initial.sim.width, initial.sim.height, rg, gl.LINEAR);
    const pressure = createDouble(initial.sim.width, initial.sim.height, r, gl.NEAREST);
    const divergence = createTarget(initial.sim.width, initial.sim.height, r, gl.NEAREST);
    const curl = createTarget(initial.sim.width, initial.sim.height, r, gl.NEAREST);
    let bloom: RenderTarget | null = null;
    let bloomChain: RenderTarget[] = [];

    const dropBloom = () => {
      destroyTarget(bloom);
      bloomChain.forEach(destroyTarget);
      bloom = null;
      bloomChain = [];
    };

    const ensureBloom = () => {
      if (bloom) return bloom;
      const bloomSize = resolution(BLOOM_RESOLUTION);
      const created = createTarget(bloomSize.width, bloomSize.height, rgba, gl.LINEAR);
      for (let i = 0; i < BLOOM_ITERATIONS; i++) {
        const width = bloomSize.width >> (i + 1);
        const height = bloomSize.height >> (i + 1);
        if (width < 2 || height < 2) break;
        bloomChain.push(createTarget(width, height, rgba, gl.LINEAR));
      }
      bloom = created;
      return created;
    };

    const resize = () => {
      fit();
      const next = sizes();
      if (dye.width !== next.ink.width || dye.height !== next.ink.height) {
        resizeDouble(dye, next.ink.width, next.ink.height, rgba, gl.LINEAR, true);
      }
      if (velocity.width !== next.sim.width || velocity.height !== next.sim.height) {
        resizeDouble(velocity, next.sim.width, next.sim.height, rg, gl.LINEAR, true);
        resizeDouble(pressure, next.sim.width, next.sim.height, r, gl.NEAREST, false);
        reshape(divergence, next.sim.width, next.sim.height, r);
        reshape(curl, next.sim.width, next.sim.height, r);
      }
      const glowSize = resolution(BLOOM_RESOLUTION);
      if (bloom && (bloom.width !== glowSize.width || bloom.height !== glowSize.height)) {
        dropBloom();
      }
    };

    const radiusFor = (scale: number) => {
      const aspect = canvas.width / canvas.height;
      return ((0.2 * settingsRef.current.size * scale) / 100) * (aspect > 1 ? aspect : 1);
    };

    const splat = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      vx: number,
      vy: number,
      color: RGB,
      radius: number
    ) => {
      const uniforms = uniformsOf("splat");
      gl.uniform1i(uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(uniforms.pointA, ax, ay);
      gl.uniform2f(uniforms.pointB, bx, by);
      gl.uniform3f(uniforms.color, vx, vy, 0);
      gl.uniform1f(uniforms.radius, radius);
      blit(velocity.write);
      velocity.swap();
      gl.uniform1i(uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    };

    const colorAt = (offset: number, now: number): RGB => {
      const current = settingsRef.current;
      const phase = (((offset + (now / 1000) * current.colorSpeed * 0.6) % 1) + 1) % 1;
      if (current.rainbow) return hsv(phase, 1, 1);
      const palette = current.palette;
      if (palette.length === 1) return palette[0];
      const position = phase * palette.length;
      const from = palette[Math.floor(position) % palette.length];
      const to = palette[(Math.floor(position) + 1) % palette.length];
      const t = position - Math.floor(position);
      const blend = t * t * (3 - 2 * t);
      return [
        from[0] + (to[0] - from[0]) * blend,
        from[1] + (to[1] - from[1]) * blend,
        from[2] + (to[2] - from[2]) * blend,
      ];
    };

    const inkFor = (color: RGB, amount: number): RGB => {
      const invert = settingsRef.current.light ? 1 : 0;
      return [
        (invert ? 1 - color[0] : color[0]) * amount,
        (invert ? 1 - color[1] : color[1]) * amount,
        (invert ? 1 - color[2] : color[2]) * amount,
      ];
    };

    const flush = (pointer: Pointer, dt: number, now: number) => {
      const current = settingsRef.current;
      const aspect = canvas.width / canvas.height;
      const length = Math.hypot((pointer.x - pointer.px) * aspect, pointer.y - pointer.py);
      if (length > 0.35) {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
        return;
      }
      let dx = pointer.x - pointer.px;
      let dy = pointer.y - pointer.py;
      if (aspect < 1) dx *= aspect;
      else dy /= aspect;
      const radius = radiusFor(1);
      const spread = 1 + length / (1.77 * Math.sqrt(radius));
      const push = (6000 * current.force) / Math.sqrt(spread);
      const amount = (0.15 * current.intensity * Math.min(dt * 60, 1)) / Math.sqrt(spread);
      const color = inkFor(colorAt(pointer.offset, now), amount);
      splat(pointer.px, pointer.py, pointer.x, pointer.y, dx * push, dy * push, color, radius);
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    };

    const burst = (x: number, y: number, now: number) => {
      const current = settingsRef.current;
      const seed = Math.random() * Math.PI * 2;
      const aspect = canvas.width / canvas.height;
      let uniforms = uniformsOf("burst");
      gl.uniform1i(uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(uniforms.aspectRatio, aspect);
      gl.uniform2f(uniforms.point, x, y);
      gl.uniform1f(uniforms.radius, radiusFor(3));
      gl.uniform1f(uniforms.strength, 1100 * current.force);
      gl.uniform1f(uniforms.seed, seed);
      blit(velocity.write);
      velocity.swap();
      const offset = Math.random();
      const amount = 1.6 * current.intensity;
      const first = inkFor(colorAt(offset, now), amount);
      const second = inkFor(colorAt(offset + 0.3, now), amount);
      uniforms = uniformsOf("crown");
      gl.uniform1i(uniforms.uTarget, dye.read.attach(0));
      gl.uniform1f(uniforms.aspectRatio, aspect);
      gl.uniform2f(uniforms.point, x, y);
      gl.uniform1f(uniforms.radius, radiusFor(1.6));
      gl.uniform3f(uniforms.colorA, first[0], first[1], first[2]);
      gl.uniform3f(uniforms.colorB, second[0], second[1], second[2]);
      gl.uniform1f(uniforms.seed, seed);
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      const current = settingsRef.current;
      const iterations = QUALITY[current.quality].iterations;
      gl.disable(gl.BLEND);

      let uniforms = uniformsOf("curl");
      gl.uniform2f(uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      uniforms = uniformsOf("vorticity");
      gl.uniform2f(uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(uniforms.uCurl, curl.attach(1));
      gl.uniform1f(uniforms.curl, current.swirl);
      gl.uniform1f(uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      uniforms = uniformsOf("divergence");
      gl.uniform2f(uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      uniforms = uniformsOf("clear");
      gl.uniform1i(uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(uniforms.value, 0.1);
      blit(pressure.write);
      pressure.swap();

      uniforms = uniformsOf("pressure");
      gl.uniform2f(uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < iterations; i++) {
        gl.uniform1i(uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      uniforms = uniformsOf("gradient");
      gl.uniform2f(uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      uniforms = uniformsOf("advection");
      gl.uniform2f(uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(uniforms.dt, dt);
      gl.uniform1f(uniforms.dissipation, 2 / current.momentum);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(uniforms.dissipation, 3.5 / current.trail);
      blit(dye.write);
      dye.swap();
    };

    const applyBloom = (amount: number) => {
      const base = ensureBloom();
      if (!bloomChain.length) return;
      gl.disable(gl.BLEND);
      let uniforms = uniformsOf("prefilter");
      const knee = BLOOM_THRESHOLD * BLOOM_KNEE + 0.0001;
      gl.uniform3f(uniforms.curve, BLOOM_THRESHOLD - knee, knee * 2, 0.25 / knee);
      gl.uniform1f(uniforms.threshold, BLOOM_THRESHOLD);
      gl.uniform1i(uniforms.uTexture, dye.read.attach(0));
      blit(base);
      uniforms = uniformsOf("blur");
      gl.uniform1f(uniforms.intensity, 1);
      let last: RenderTarget = base;
      bloomChain.forEach((target) => {
        gl.uniform2f(uniforms.texelSize, last.texelX, last.texelY);
        gl.uniform1i(uniforms.uTexture, last.attach(0));
        blit(target);
        last = target;
      });
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.enable(gl.BLEND);
      for (let i = bloomChain.length - 2; i >= 0; i--) {
        const target = bloomChain[i];
        gl.uniform2f(uniforms.texelSize, last.texelX, last.texelY);
        gl.uniform1i(uniforms.uTexture, last.attach(0));
        blit(target);
        last = target;
      }
      gl.disable(gl.BLEND);
      gl.uniform1f(uniforms.intensity, amount);
      gl.uniform2f(uniforms.texelSize, last.texelX, last.texelY);
      gl.uniform1i(uniforms.uTexture, last.attach(0));
      blit(base);
    };

    const render = () => {
      const current = settingsRef.current;
      if (current.glow > 0) applyBloom(2 * current.glow);
      gl.disable(gl.BLEND);
      const uniforms = uniformsOf("display");
      gl.uniform2f(uniforms.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      gl.uniform1i(uniforms.uTexture, dye.read.attach(0));
      gl.uniform1i(uniforms.uBloom, (bloom ?? dye.read).attach(1));
      gl.uniform1f(uniforms.shading, current.shading);
      gl.uniform1f(uniforms.bloom, current.glow > 0 ? 1 : 0);
      gl.uniform1f(uniforms.light, current.light ? 1 : 0);
      blit(null);
    };

    const clearScreen = () => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const pointers = new Map<string, Pointer>();
    const bursts: Array<{ x: number; y: number }> = [];
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const introPointer: Pointer = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      ready: false,
      moved: false,
      offset: Math.random(),
    };
    let introStart = introRef.current && !reduced ? performance.now() + 150 : -1;
    let raf = 0;
    let last = 0;
    let lastActivity = performance.now();

    const advanceIntro = (now: number) => {
      if (introStart < 0) return;
      const progress = (now - introStart) / 1100;
      if (progress < 0) return;
      const t = Math.min(progress, 1);
      const eased = t * t * (3 - 2 * t);
      const x = 0.2 + 0.6 * eased;
      const y = 0.5 + 0.12 * Math.sin(eased * Math.PI * 2);
      if (!introPointer.ready) {
        introPointer.x = introPointer.px = x;
        introPointer.y = introPointer.py = y;
        introPointer.ready = true;
      } else {
        introPointer.x = x;
        introPointer.y = y;
        introPointer.moved = true;
      }
      if (t >= 1) introStart = -1;
      lastActivity = now;
    };

    const hold = () => {
      const now = performance.now();
      if (introStart >= 0) introStart = now + 150;
      last = now;
      lastActivity = now;
      pointers.forEach((pointer) => {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
        pointer.moved = false;
      });
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || lost) return;
      if (!ready) {
        if (gl.isContextLost()) return;
        if (!finish()) {
          hold();
          raf = requestAnimationFrame(frame);
          return;
        }
        if (broken) {
          dispose();
          return;
        }
      }
      const current = settingsRef.current;
      const dt = clamp((now - last) / 1000, 0, 1 / 60);
      last = now;
      resize();
      advanceIntro(now);
      if (introPointer.moved) {
        introPointer.moved = false;
        flush(introPointer, dt, now);
      }
      pointers.forEach((pointer) => {
        if (!pointer.moved) return;
        pointer.moved = false;
        flush(pointer, dt, now);
      });
      bursts.splice(0).forEach((point) => burst(point.x, point.y, now));
      step(dt);
      render();
      const quiet = (2.2 * current.trail + 0.4) * 1000;
      if (introStart >= 0 || now - lastActivity < quiet) raf = requestAnimationFrame(frame);
      else clearScreen();
    };

    const wake = () => {
      lastActivity = performance.now();
      if (raf || disposed || lost) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const locate = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (settingsRef.current.contained && (x < 0 || x > 1 || y < 0 || y > 1)) return null;
      return { x, y };
    };

    const track = (id: string, clientX: number, clientY: number) => {
      const point = locate(clientX, clientY);
      let pointer = pointers.get(id);
      if (!point) {
        if (pointer) pointer.ready = false;
        return;
      }
      if (!pointer) {
        pointer = {
          x: 0,
          y: 0,
          px: 0,
          py: 0,
          ready: false,
          moved: false,
          offset: Math.random(),
        };
        pointers.set(id, pointer);
      }
      if (!pointer.ready) {
        pointer.x = pointer.px = point.x;
        pointer.y = pointer.py = point.y;
        pointer.ready = true;
        return;
      }
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.moved = true;
      wake();
    };

    const press = (clientX: number, clientY: number) => {
      if (!settingsRef.current.clickSplash) return;
      const point = locate(clientX, clientY);
      if (!point) return;
      bursts.push(point);
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        track(`p${event.pointerId}`, event.clientX, event.clientY);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") press(event.clientX, event.clientY);
    };
    const onTouchStart = (event: TouchEvent) => {
      Array.from(event.changedTouches).forEach((touch) => {
        pointers.delete(`t${touch.identifier}`);
        track(`t${touch.identifier}`, touch.clientX, touch.clientY);
        press(touch.clientX, touch.clientY);
      });
    };
    const onTouchMove = (event: TouchEvent) => {
      Array.from(event.changedTouches).forEach((touch) =>
        track(`t${touch.identifier}`, touch.clientX, touch.clientY)
      );
    };
    const onTouchEnd = (event: TouchEvent) => {
      Array.from(event.changedTouches).forEach((touch) =>
        pointers.delete(`t${touch.identifier}`)
      );
    };
    const onLeave = () => {
      pointers.forEach((pointer) => {
        pointer.ready = false;
      });
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onRestored = () => setGeneration((value) => value + 1);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      release();
    };

    if (ready) resize();
    if (introStart >= 0) wake();

    return () => {
      dispose();
      releaseRef.current = window.setTimeout(() => {
        if (!canvas.isConnected && !gl.isContextLost()) {
          gl.getExtension("WEBGL_lose_context")?.loseContext();
        }
      }, 0);
    };
  }, [generation]);

  return (
    <div
      ref={rootRef}
      className={[ROOT, className].filter(Boolean).join(" ")}
      style={{ zIndex, ...style }}
      data-contained={contained ? "" : undefined}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={CANVAS} />
    </div>
  );
}

export default SplashCursor;
