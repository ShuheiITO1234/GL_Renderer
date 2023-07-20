import {drawScene} from "./draw-scene.js";
import {Camera} from "./Camera.js";
import {WebGLRenderer} from "./renderer/webgl-renderer.js";

function main(){
    const renderer = new WebGLRenderer()
    document.body.appendChild(renderer.canvas);
    renderer.init();
    renderer.start();
}

window.onload = main;
