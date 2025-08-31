
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

const RAY_Y_POSITION_1 = -0.4;
const RAY_Y_POSITION_2 = -0.5;

export default function Rays(props) {
    const { raysColor } = props;
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const meshRef = useRef(null);
    const frameIdRef = useRef();
    const darkMode = useDarkMode();
    const [isMounted, setIsMounted] = useState(false);
    const animationRef = useRef(props.animation);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);
    useEffect(() => {
        animationRef.current = props.animation;
    }, [props.animation]);

    const [randomColor1RGB, randomColor2RGB] = useMemo(() => {
        if (raysColor.mode === "random") {
            const h = Math.random() * 360;
            const s = 60 + Math.random() * 40;
            return [hslToRgb(h, s, 50), hslToRgb(h, s, 65)];
        } else {
            return [[1, 1, 1], [1, 1, 1]];
        }
    }, [raysColor]);

    const [color1RGB, color2RGB, raysOpacity] = useMemo(() => {
        if (raysColor.mode === "random") {
            return [randomColor1RGB, randomColor2RGB, 1];
        } else {
            let color1 = "", color2 = "";
            switch (raysColor.mode) {
                case "single":
                    color1 = raysColor.color;
                    color2 = raysColor.color;
                    break;
                case "multi":
                    color1 = raysColor.color1;
                    color2 = raysColor.color2;
                    break;
            }
            const [r1, g1, b1, a1] = colorToRGBA(getColorValue(color1, containerRef));
            const [r2, g2, b2, a2] = colorToRGBA(getColorValue(color2, containerRef));
            return [[r1, g1, b1], [r2, g2, b2], Math.max(a1, a2)];
        }
    }, [raysColor, darkMode, containerRef]);

    useEffect(() => {
        setIsMounted(true);
        const container = containerRef.current;
        if (!container) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            premultipliedAlpha: true,
            alpha: true,
            antialias: true,
            precision: "highp",
            powerPreference: "high-performance"
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(1);
        container.appendChild(renderer.domElement);
        const geometry = new THREE.PlaneGeometry(1024, 1024);
        const material = new THREE.ShaderMaterial({
            fragmentShader: FRAGMENT_SHADER,
            vertexShader: VERTEX_SHADER,
            uniforms: {
                u_colors: { value: [new THREE.Vector4(color1RGB[0], color1RGB[1], color1RGB[2], 1), new THREE.Vector4(color2RGB[0], color2RGB[1], color2RGB[2], 1)] },
                u_intensity: { value: mapRange(props.intensity, 0, 100, 0, 0.5) },
                u_rays: { value: mapRange(props.rays, 0, 100, 0, 0.3) },
                u_reach: { value: mapRange(props.reach, 0, 100, 0, 0.5) },
                u_time: { value: Math.random() * 1e4 },
                u_mouse: { value: [0, 0] },
                u_resolution: { value: [container.clientWidth, container.clientHeight] },
                u_rayPos1: { value: [props.position / 100 * container.clientWidth, RAY_Y_POSITION_1 * container.clientHeight] },
                u_rayPos2: { value: [(props.position / 100 + 0.02) * container.clientWidth, RAY_Y_POSITION_2 * container.clientHeight] }
            },
            wireframe: false,
            wireframeLinewidth: 0,
            dithering: false,
            flatShading: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        meshRef.current = mesh;
        let lastTime = 0;
        const animate = time => {
            const animation = animationRef.current;
            if (!animation.animate) {
                lastTime = time;
            }
            const delta = time - lastTime;
            lastTime = time;
            if (mesh.material instanceof THREE.ShaderMaterial) {
                if (animation.animate) {
                    mesh.material.uniforms.u_time.value += delta * animation.speed / 1e3 / 10;
                }
            }
            renderer.render(scene, camera);
            frameIdRef.current = requestAnimationFrame(animate);
        };
        frameIdRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [isMounted]);

    useEffect(() => {
        if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
            const material = meshRef.current.material;
            const container = containerRef.current;
            if (!container) return;
            material.uniforms.u_colors.value = [
                new THREE.Vector4(color1RGB[0], color1RGB[1], color1RGB[2], 1),
                new THREE.Vector4(color2RGB[0], color2RGB[1], color2RGB[2], 1)
            ];
            material.uniforms.u_intensity.value = mapRange(props.intensity, 0, 100, 0, 0.5);
            material.uniforms.u_rays.value = mapRange(props.rays, 0, 100, 0, 0.3);
            material.uniforms.u_reach.value = mapRange(props.reach, 0, 100, 0, 0.5);
            material.uniforms.u_rayPos1.value = [props.position / 100 * container.clientWidth, RAY_Y_POSITION_1 * container.clientHeight];
            material.uniforms.u_rayPos2.value = [(props.position / 100 + 0.02) * container.clientWidth, RAY_Y_POSITION_2 * container.clientHeight];
        }
    }, [props.intensity, props.rays, props.reach, props.position, color1RGB, color2RGB]);

    return /*#__PURE__*/_jsx("div", {
        ref: containerRef,
        style: {
            borderRadius: props.radius,
            overflow: "hidden",
            backgroundColor: props.backgroundColor,
            ...props.style
        }
    });
}

Rays.displayName = "Light Rays";

// --- Utility functions ---

function getColorValue(color, elementRef) {
    if (color.startsWith("var(")) {
        const { variableName, defaultValue } = extractCSSVariableInfo(color);
        const defaultReturnValue = defaultValue || "";
        if (variableName && typeof document !== "undefined") {
            const computedStyle = getComputedStyle(elementRef?.current || document.body);
            if (computedStyle) {
                const computedValue = computedStyle.getPropertyValue(variableName).trim();
                return computedValue || defaultReturnValue;
            }
            return defaultReturnValue;
        }
        return defaultReturnValue;
    } else {
        return color;
    }
}

function extractCSSVariableInfo(cssString) {
    const regex = /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:"[^"]*"|'[^']*'|[^)]+)))?\s*\)/;
    const match = regex.exec(cssString);
    if (match) {
        const variableName = match[1];
        let defaultValue = match[2] || null;
        if (defaultValue) {
            defaultValue = defaultValue.replace(/^["']|["']$/g, "");
            defaultValue = defaultValue.trim();
        }
        return { variableName, defaultValue };
    }
    return { variableName: "", defaultValue: "" };
}

const colorToRGBA = color => {
    let r = 1, g = 1, b = 1, a = 1;
    if (color && typeof color === "string") {
        if (color.startsWith("rgba(")) {
            const parts = color.slice(5, -1).split(",");
            r = parseInt(parts[0]) / 255;
            g = parseInt(parts[1]) / 255;
            b = parseInt(parts[2]) / 255;
            a = parseFloat(parts[3]);
        } else if (color.startsWith("rgb(")) {
            const parts = color.slice(4, -1).split(",");
            r = parseInt(parts[0]) / 255;
            g = parseInt(parts[1]) / 255;
            b = parseInt(parts[2]) / 255;
        } else if (color.startsWith("#")) {
            const hex = color.slice(1);
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16) / 255;
                g = parseInt(hex[1] + hex[1], 16) / 255;
                b = parseInt(hex[2] + hex[2], 16) / 255;
            } else if (hex.length === 6) {
                r = parseInt(hex.slice(0, 2), 16) / 255;
                g = parseInt(hex.slice(2, 4), 16) / 255;
                b = parseInt(hex.slice(4, 6), 16) / 255;
            } else if (hex.length === 8) {
                r = parseInt(hex.slice(0, 2), 16) / 255;
                g = parseInt(hex.slice(2, 4), 16) / 255;
                b = parseInt(hex.slice(4, 6), 16) / 255;
                a = parseInt(hex.slice(6, 8), 16) / 255;
            }
        }
    }
    return [r, g, b, a];
};

function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = e => {
            requestAnimationFrame(() => {
                setTimeout(() => { setIsDarkMode(e.matches); }, 80);
            });
        };
        setIsDarkMode(mediaQuery.matches);
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);
    return isDarkMode;
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    return [r + m, g + m, b + m];
}

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

const VERTEX_SHADER = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAGMENT_SHADER = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

#ifndef FNC_MOD289
#define FNC_MOD289
float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
#endif

#ifndef FNC_PERMUTE
#define FNC_PERMUTE
float permute(const in float x) { return mod289(((x * 34.0) + 1.0) * x); }
vec2 permute(const in vec2 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec3 permute(const in vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 permute(const in vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
#endif

#ifndef FNC_TAYLORINVSQRT
#define FNC_TAYLORINVSQRT
float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
#endif

#ifndef FNC_QUINTIC
#define FNC_QUINTIC 
float quintic(const in float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec2  quintic(const in vec2 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec3  quintic(const in vec3 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec4  quintic(const in vec4 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
#endif

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);
    return clamp(
        (0.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    // Set the parameters of the sun rays
    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214 * speed;
    float raySeedB1 = 21.11349 * speed;
    float raySpeed1 = 1.5 * speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910 * speed;
    float raySeedB2 = 18.0234 * speed;
    float raySpeed2 = 1.1 * speed;

    // Calculate ray strengths
    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    // Calculate brightness attenuation
    float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    // Calculate alpha values while preserving color
    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    // Pre-multiply the colors with their alpha values
    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    // Blend the pre-multiplied colors
    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    // Un-premultiply the final color
    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;
