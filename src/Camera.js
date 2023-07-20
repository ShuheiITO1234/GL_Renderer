import { mat4 } from "gl-matrix";
import { vec3 } from "gl-matrix";

class Camera{
    constructor (x, y, z, ux, uy, uz, yaw, pitch){
        this.pos = vec3.fromValues(x,y,z);
        this.worldUp = vec3.fromValues(ux,uy,uz);
        this.yaw = yaw;
        this.pitch = pitch;

        this.updateCameraVector();
    }

    getViewMatrix(){
        const target = vec3.create();
        vec3.add(target, this.pos, this.front);

        const result = mat4.create();
        mat4.lookAt(result, this.pos, target, this.worldUp);

        return result;
    }

    updateCameraVector() {
        this.front = vec3.create();
        const y = this.yaw * Math.PI / 180.0;
        const p = this.pitch * Math.PI / 180.0;
        this.front[0] = Math.cos(y) * Math.cos(p);
        this.front[1] = Math.sin(p);
        this.front[2] = Math.sin(y) * Math.cos(p);

        this.right = vec3.create();
        vec3.cross(this.right, this.front, this.worldUp)
        vec3.normalize(this.right, this.right);

        this.up = vec3.create();
        vec3.cross(this.up, this.right, this.front)
        vec3.normalize(this.up, this.up);
    }

    lookAt(x, y, z){
        this.front = vec3.fromValues(x-this.pos[0], y-this.pos[1], z-this.pos[2]);
        vec3.normalize(this.front, this.front);

        this.right = vec3.create();
        vec3.cross(this.right, this.front, this.worldUp)
        vec3.normalize(this.right, this.right);

        this.up = vec3.create();
        vec3.cross(this.up, this.right, this.front)
        vec3.normalize(this.up, this.up);
    }

    processMovement(direction, deltatime){
        const d = 5 * deltatime/1000.0;
        if(direction == 0){
            vec3.scaleAndAdd(this.pos, this.pos, this.right, -d);
        }
        if(direction == 1){
            vec3.scaleAndAdd(this.pos, this.pos, this.right, d);
        }
        if(direction == 2){
            vec3.scaleAndAdd(this.pos, this.pos, this.front, d);
        }
        if(direction == 3){
            vec3.scaleAndAdd(this.pos, this.pos, this.front, -d);
        }
    }
}

export {Camera}