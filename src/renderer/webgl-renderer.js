import {Shader} from "../Shader.js";
import {Renderer} from "../Renderer.js";
import {Camera} from "../Camera.js";
import {initVAO, initTexture} from "../init-buffers.js";

import { Json2Va } from "../json2vertexArray.js";

import {mat3, mat4, vec3} from "gl-matrix";

import vsSource from './shaders/mat1/v.vert?raw';
import fsSource from './shaders/mat1/f.frag?raw';

import skyVsSource from './shaders/skybox_grad/skybox_grad.vert?raw';
import skyFsSource from './shaders/skybox_grad/skybox_grad.frag?raw';

import quadVsSource from './shaders/NDCQuad/NDCQuad.vert?raw';
import quadFsSource from './shaders/NDCQuad/NDCQuad.frag?raw';

import testVsSource from './shaders/test/test.vert?raw';
import testFsSource from './shaders/test/test.frag?raw';

import {
    createVertexArray,
    createBuffer,
    createTexture,
    createFramebuffer
} from '../createGLData.js';


class WebGLRenderer extends Renderer {

    //---------------------------------------
    constructor(){
        // make canvas / define callbacks.
        super();

        // set up gl
        this.gl = this.canvas.getContext("webgl2", { premultipliedAlpha: true });
          
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // setup shaders
        this.shader = new Shader(this.gl, vsSource, fsSource);
        this.skyShader = new Shader(this.gl, skyVsSource, skyFsSource);
        this.quadShader = new Shader(this.gl, quadVsSource, quadFsSource);
        this.testShader = new Shader(this.gl, testVsSource, testFsSource);

        // setup datas
        this.vao = initVAO(this.gl);
        this.texture = initTexture(this.gl, {
            checker_gray : "src\\images\\checker2k.png",
            checker_colored : "src\\images\\checker2kC.png"
        });
        
        // setup camera
        this.camera = new Camera(5, 4, 7, 0, 1, 0, 0, 0, 45);
        this.camera.lookAt(0, 0, 0);
        
        this.parser = new Json2Va(this.gl);


        const ext = this.gl.getExtension('EXT_color_buffer_float');

    }

    //---------------------------------------
    OnResize(width, height){
        this.width = width;
        this.height = height;
    }

    init(){
        let gl = this.gl;
        this.texWidth = 100;
        const tex = createTexture(gl, null, 4, gl.RGBA32F, gl.RGBA, gl.FLOAT, this.texWidth, this.texWidth);
        const fb = createFramebuffer(gl, tex);
        this.info = {fb:fb, tex:tex};

        this.nrPoints = 50;
        function rand(a,b) {return (b-a)*Math.random() + a;}
        let randomNdcPositions = new Float32Array(new Array(this.nrPoints).fill(0).map(_=>[rand(-1,1),rand(-1,1),0.0]).flat());
        // let half = randomNdcPositions.slice(Math.floor(3 * this.nrPoints*0.5), 3 * this.nrPoints);
        // randomNdcPositions.set(half, 0);

        this.pointVa = gl.createVertexArray();
        gl.bindVertexArray(this.pointVa);
            const buf = createBuffer(gl, randomNdcPositions, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

    }

    //---------------------------------------
    // Main loop function.
    OnFrame(timestamp, timeDelta){

        super.OnFrame();

        let gl = this.gl;
        gl.clearColor(0.2,0,0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const view = this.camera.getViewMatrix();
        const proj = mat4.create();
        mat4.perspective(proj, this.camera.fov * Math.PI / 180.0, this.width/this.height, 0.1, 100.0);

        this.shader.use();
        this.shader.setMat4("proj", proj);
        this.shader.setMat4("view", view);
        this.skyShader.use();
        this.skyShader.setMat4("proj", proj);
        let viewTrans = mat4.fromValues(
            view[0], view[1], view[2], 0,
            view[4], view[5], view[6], 0,
            view[8], view[9], view[10], 0,
            0, 0, 0, 1
        );
        this.skyShader.setMat4("view", viewTrans);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.info.fb);
            gl.viewport(0, 0, this.texWidth, this.texWidth);
            gl.clearColor(0.0,0.0,0.0,1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.testShader.use();
            this.testShader.setFloat("flag", 0);
            gl.bindVertexArray(this.pointVa);
            gl.drawArrays(gl.POINTS, 0, this.nrPoints);
            gl.bindVertexArray(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.info.fb);
            this.testShader.use();
            this.testShader.setFloat("flag", 1);
            gl.bindVertexArray(this.pointVa);
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE_MINUS_CONSTANT_ALPHA);
            gl.drawArrays(gl.POINTS, 0, this.nrPoints);
            gl.bindVertexArray(null);
            gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.quadShader.use();
        gl.viewport(0, 0, Math.min(this.width, this.height), Math.min(this.width, this.height));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.info.tex);
        this.renderQuad();
    }

    renderCube(){
        let gl = this.gl;
        gl.bindVertexArray(this.vao.cube);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    renderPlane(){
        let gl = this.gl;
        gl.bindVertexArray(this.vao.plane);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    renderQuad(){
        let gl = this.gl;
        gl.bindVertexArray(this.vao.quad);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    renderCustom(){
        let gl = this.gl;
        gl.bindVertexArray(this.parser.vaList[0]);
        gl.drawArrays(gl.TRIANGLES, 0, this.parser.sizeList[0]);
    }
}

export {WebGLRenderer}