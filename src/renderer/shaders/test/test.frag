#version 300 es
precision mediump float;

in float iflag;

out vec4 FragColor;

void main(){
    FragColor = vec4(iflag,0.5,0.5, 0.5);
}