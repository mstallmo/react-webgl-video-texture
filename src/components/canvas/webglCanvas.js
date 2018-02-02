import React from 'react';
import {mat4} from 'gl-matrix';
import {initShaderProgram} from "../../webgl/shaderProgram";
import {loadTexture} from "../../webgl/textures";
import {initBuffers} from "../../webgl/buffers";

class WebGLCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.drawScene = this.drawScene.bind(this);
        this.render = this.render.bind(this);
    }

    componentDidMount() {
        //Ask Chris about moving this back to textures.js
        const img = new Image();
        img.src = require('../../../images/nba_min_court.png');
        img.onload = () => {
            this.img = img;
            this.renderCanvas();
        };

        let data = require('../../../data/tracked_1570592_3_1.json');
        let parsedData = new Array();
        for(let i = 0; i < data.tracking.tracklet.length; i++){
            parsedData.push([]);
            parsedData[i].push( new Array(data.tracking.tracklet[i].length));
            for(let j = 0; j < data.tracking.tracklet[i].length; j++) {
                parsedData[i][j] = ({x: data.tracking.tracklet[i][j].court[0], y: data.tracking.tracklet[i][j].court[1]});
            }
        }
    }

    renderCanvas() {
        const gl = this.canvasArea.getContext("webgl2");

        if (!gl) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        const vsSource = require('../../shaders/vertex.glsl');
        const fsSource = require('../../shaders/fragment.glsl');

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        const programInfo = {
            program: shaderProgram,
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                texture1: gl.getUniformLocation(shaderProgram, 'texture1')
            }
        };

        const buffers = initBuffers(gl);
        const texture = loadTexture(gl, this.img);

        this.drawScene(gl, programInfo, buffers, texture);
    }

    drawScene(gl, programInfo, buffers, texture) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 5 * 4;
            const offset = 0;
            gl.vertexAttribPointer(0, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(0);
        }

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 5 * 4;
            const offset = 3 * 4;
            gl.vertexAttribPointer(1, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(1);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniform1i(programInfo.uniformLocations.texture1, 0);

        {
            const offset = 0;
            const vertexCount = 6;
            const type = gl.UNSIGNED_SHORT;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    render() {
        return(
            <div>
                <h1>WebGL Canvas</h1>
                <canvas width="940" height="500" ref={(canvas) => { this.canvasArea = canvas; }} />
            </div>
        );
    }
}

export default WebGLCanvas;