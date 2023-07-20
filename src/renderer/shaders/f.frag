#version 300 es
precision mediump float;

in vec3 iNormal;
in vec2 iTex;

uniform sampler2D tex;

out vec4 FragColor;

void main() {
    //FragColor = vec4(iNormal*0.5+0.5, 1);
    FragColor = texture(tex, iTex);
    //FragColor = vec4(iTex, 0, 1);
}