#version 300 es
layout(location = 0) in highp vec4 aPos;
layout(location = 1) in highp vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out highp vec2 TexCoord;

void main()
{
    gl_Position = aPos;
    TexCoord = vec2(aTexCoord.x, aTexCoord.y);
}