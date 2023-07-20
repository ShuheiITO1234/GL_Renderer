class Shader{

    constructor(gl, vsSource, fsSource){
        const vert = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const frag = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        this.id = gl.createProgram();
        gl.attachShader(this.id, vert);
        gl.attachShader(this.id, frag);

        gl.linkProgram(this.id);

        if(!gl.getProgramParameter(this.id, gl.LINK_STATUS)){
            alert(`failed initialize shader program ${gl.getProgramInfoLog(this.id)}`);
            return null;
        }

        gl.deleteShader(vert);
        gl.deleteShader(frag);
    }

    use(gl){
        gl.useProgram(this.id);
    }

    setBool(gl, name, value){
        gl.uniform1i(gl.getUniformLocation(this.id, name), Math.floor(value));
    }

    setInt(gl, name, value){
        gl.uniform1i(gl.getUniformLocation(this.id, name), value);
    }

    setVec2(gl, name, x, y) {
        gl.uniform2f(gl.getUniformLocation(this.id, name), x, y);
    }

    setVec3(gl, name, x, y, z) {
        gl.uniform3f(gl.getUniformLocation(this.id, name), x, y, z);
    }

    setMat4(gl, name, mat){
        gl.uniformMatrix4fv(gl.getUniformLocation(this.id, name), false, mat);
    }
    
}


function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(`failed compile shader: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export {Shader}