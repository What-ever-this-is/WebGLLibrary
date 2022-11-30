//MAIN FILE OF THE LIBRARY

/**
 * 
 * EXTERNAL DEPENDENCIES:
 * glmatrix/mat4.js
 * 
 * WebGL Library Build 1.0.100
 */


class Renderer{
    //The actual rendering code, scene code will follow this.

    constructor(canvas){
        //Initialization function
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl")
        if(this.gl===null){
            console.warn("WebGL Not supported, falling back to experimental WebGL");
            this.gl = canvas.getcontext("experimental-webgl")
            if(this.gl===null){
                console.error("Experimental WebGL not supported.");
                return;
            }
        }
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.aspect = canvas.clientWidth/canvas.clientHeight;
        
    }

    clear(r,g,b,a){
        //Clear rendering surface
        this.gl.clearColor(r,g,b,a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearDepth(1.0);
    }

    createShader(source,type){
        //Create a shader
        const regex = /\n|\r/g;
        source = source.replaceAll(regex,"");
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader,source);
        this.gl.compileShader(shader);
        if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){
            console.error(`An error occured while compiling the shader: ${this.gl.getShaderInfoLog(shader)}`)
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createShaderProgram(vShader,fShader){
        //create a program
        const program = this.gl.createProgram();
        this.gl.attachShader(program,vShader);
        this.gl.attachShader(program,fShader);
        this.gl.linkProgram(program);
        if(!this.gl.getProgramParameter(program,this.gl.LINK_STATUS)){
            console.error(`An error occured while linking the programs: ${this.gl.getProgramInfoLog(program)}`)
            return null;
        }
        return program;
    }

    createBuffer(type,data,dataType,usage){
        //Creates a buffer
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(type,buffer);
        this.gl.bufferData(type,new dataType(data),usage);
        return buffer;
    }

    drawScene(programInfo,buffers){
        //Draws the scene
        this.gl.clear(0.0,0.0,0.0,1.0); // Temporary function, will be replaced later.
        this.gl.depthFunc(this.gl.LEQUAL);
        const fov = 45*Math.PI/180; // Tempoary function, will be replaced later.
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = create();
        perspective(projectionMatrix,fov,this.aspect,zNear,zFar);
        const modelViewMatrix = create();
        translate(modelViewMatrix,modelViewMatrix,[-0.0,0.0,-6.0]);
        {
            const numComponents = 2;
            const type=this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffers.position)
            this.gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            )
        }
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
        this.gl.useProgram(programInfo.program);
        this.gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        )
        this.gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        )
        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP,offset,vertexCount);
        }
        //MATH LIBRARY UNDER CONSTRUCTION, WILL NOT BE AVAILABLE.
    }
}