
import { mat4 } from "gl-matrix";
import {vec3} from "gl-matrix";
import { Camera } from "./Camera";

function drawScene(gl, shader, buffers){

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const camera = new Camera(5,5,5, 0,1,0, 0,0);
    camera.front = vec3.fromValues(-camera.pos[0], -camera.pos[1], -camera.pos[2]);
    
    const view = camera.getViewMatrix();

    const proj = mat4.create();
    mat4.perspective(proj, Math.PI/4.0, gl.canvas.clientWidth/gl.canvas.clientHeight, 0.1, 100.0);

    const model = mat4.create();
    mat4.translate(model, model, [0.0, 0.0, 0.0]);
    //mat4.rotate(model, model, Date.now()/1000.0, [Math.sin(Date.now()/2000.0), 0.3, 1]);

    shader.use(gl);
    shader.setMat4(gl, "model", model);
    shader.setMat4(gl, "proj", proj);
    shader.setMat4(gl, "view", view);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, buffers.texture.checker1);
    shader.setInt(gl, "tex", 0);

    gl.enable(gl.CULL_FACE);
    drawCube(gl, buffers);
}

function drawCube(gl, buffers){
    gl.bindVertexArray(buffers.vao.cube);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

export {drawScene};