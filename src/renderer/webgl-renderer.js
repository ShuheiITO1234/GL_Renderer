import {Shader} from "../Shader.js";
import {Renderer} from "../Renderer.js";
import {Camera} from "../Camera.js";
import {initVAO, initTexture} from "../init-buffers.js";

import {mat4, vec3} from "gl-matrix";

import vsSource from './shaders/v.vert?raw';
import fsSource from './shaders/f.frag?raw';

class WebGLRenderer extends Renderer {

    constructor(){
        super();
        this.gl = this.canvas.getContext("webgl2");
          
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.shader = new Shader(this.gl, vsSource, fsSource);
        this.vao = initVAO(this.gl);
        this.texture = initTexture(this.gl, {
            checker_gray : "src\\images\\checker2k.png",
            checker_colored : "src\\images\\checker2kC.png"
        });
        
        this.camera = new Camera(5, 4, 7, 0, 1, 0, 0, 0);
        this.camera.lookAt(0, 0, 0);
    }

    OnResize(width, height){
        this.width = width;
        this.height = height;
    }

    // Main loop function.
    OnFrame(timestamp, timeDelta){

        super.OnFrame();

        let gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.drawScene(this.shader);
    }

    drawScene(shader){
        let gl = this.gl;
        let model = mat4.create();
        const view = this.camera.getViewMatrix();
        const proj = mat4.create();
        mat4.perspective(proj, Math.PI/4.0, this.width/this.height, 0.1, 100.0);

        shader.use();
        shader.setMat4("proj", proj);
        shader.setMat4("view", view);

        model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(0, 0, 0));
        mat4.rotate(model, model, 0, vec3.fromValues(0, 1, 0));
        shader.setMat4("model", model);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.checker_gray);
        this.renderCube();

        model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(1.8, -0.6, 0.6));
        mat4.scale(model, model, vec3.fromValues(0.4, 0.4, 0.4));
        shader.setMat4("model", model);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.checker_colored);
        this.renderCube();
    }

    renderCube(){
        let gl = this.gl;
        gl.bindVertexArray(this.vao.cube);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}

export {WebGLRenderer}