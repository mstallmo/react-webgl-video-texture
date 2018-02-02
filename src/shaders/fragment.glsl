#version 300 es
out highp vec4 FragColor;

in highp vec2 TexCoord;

uniform sampler2D texture1;

void main()
{
    FragColor = texture(texture1, TexCoord);
}