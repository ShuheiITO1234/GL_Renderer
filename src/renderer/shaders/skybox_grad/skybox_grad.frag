#version 300 es
precision mediump float;

in vec3 iTex;

out vec4 FragColor;

void main() {
    FragColor = vec4(normalize(iTex), 1);
}