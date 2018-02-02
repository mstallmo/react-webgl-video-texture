import React from 'react';
import {mat4} from 'gl-matrix';
import {initShaderProgram} from "../../webgl/shaderProgram";
import {initTexture, updateTexture} from "../../webgl/textures";
import {initBuffers} from "../../webgl/buffers";
const videoSrc = require('../../../resources/Firefox.mp4');


class WebGLCanvas extends React.Component {
    constructor(props) {
        super(props);

        this.setupVideo = this.setupVideo.bind(this);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.drawScene = this.drawScene.bind(this);
        this.render = this.render.bind(this);
    }

    componentDidMount() {
        this.renderCanvas();
    }

    setupVideo(url) {
        const self = this;

        const video = document.createElement('video');

        let playing = false;
        let timeupdate = false;

        video.autoplay = false;
        video.muted = true;
        video.loop = true;

        video.addEventListener('playing', function() {
            playing = true;
            checkReady();
        }, true);

        video.addEventListener('timeupdate', function() {
            timeupdate = true;
            checkReady();
        }, true);

        video.src = url;
        video.play();

        function checkReady() {
            if (playing && timeupdate) {
                self.copyVideo = true;
            }
        }

        return video;
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
        const texture = initTexture(gl);
        const video = this.setupVideo(videoSrc);

        function render() {
            if (this.copyVideo) {
                updateTexture(gl, texture, video);
            }

            this.drawScene(gl, programInfo, buffers, texture);

            requestAnimationFrame(render.bind(this));
        }

        requestAnimationFrame(render.bind(this));
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