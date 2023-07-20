
import {initBuffers} from "./init-buffers.js";
import {drawScene} from "./draw-scene.js";
import {Shader} from "./Shader.js";
import {Camera} from "./Camera.js";

import vsSource from './shaders/v.vert?raw';
import fsSource from './shaders/f.frag?raw';

function main(){

    const canvas = document.querySelector("#glCanvas");
    
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    const gl = canvas.getContext("webgl2");

    if(!gl){
        alert("failed initialize webGL");
        return;
    }
    
    //setup shader
    const shader = new Shader(gl, vsSource, fsSource);
    
    const buffers = initBuffers(gl);

    function render(){
        drawScene(gl, shader, buffers);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    
}

window.onload = main;
