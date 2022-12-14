//MAIN FILE OF THE LIBRARY

/**
 * 
 * EXTERNAL DEPENDENCIES:
 * glmatrix/mat4.js
 * 
 * WebGL Library Build 1.0.102
 */


 function print(m){
    console.log(m)
}



class Renderer{
    //The actual rendering code, scene code will follow this.
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @s 
     */
    constructor(canvas){
        //Initialization function
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2")
        if(this.gl===null){
            console.warn("WebGL2 Not supported, falling back to WebGL1");
            this.gl = canvas.getContext("webgl")
            if(this.gl===null){
                console.warn("WebGL Not supported, falling back to experimental WebGL");
                this.gl = canvas.getcontext("experimental-webgl")
                if(this.gl===null){
                    console.error("Experimental WebGL not supported.");
                    return;
                }
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

    createShader(source,type,vertexShaderType){
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
        if(type==this.gl.VERTEX_SHADER){
            const shaderObject = new VertexShader(shader,vertexShaderType)
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

    drawCall(programInfo,buffers,object){
        //Draws the scene
        this.clear(0.0,0.0,0.0,1.0); // Temporary function, will be replaced later.
        this.gl.depthFunc(this.gl.LEQUAL);
        const fov = 45*Math.PI/180; // Tempoary function, will be replaced later.
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = create();
        perspective(projectionMatrix,fov,this.aspect,zNear,zFar);
        const modelViewMatrix = create();
        
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
            this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffers.color)
            this.gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset
            )
            this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
        }
        
        
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
        //MATH LIBRARY UNDER CONSTRUCTION, USING glMatrix/mat4.js as substitute
    }
}

//SCENE

class Scene{
    /**
     * Create a new scene
     * @param {Renderer} renderer 
     * @returns
     */
    constructor(renderer){
        this.renderer = renderer;
        this.gl = renderer.gl;
        this.sceneObjects = [];
    }
    addObjectToScene(object){
        this.sceneObjects.push(object);
    }
    renderObjects
}

//SCENE OBJECTS

class TriangleStripObject{
    /**
     * Basically a strip of traingles
     * @param {Array} points 
     */
    constructor(points){
        this.points = points;
        /**
         * Other data contains:
         * {
         * shaders:[...],
         * program:{...}
         * }
         */
        this.shaders = {
            fragmentShader:null,
            vertexShader:null
        }
        // Will be implemented later
        this.usesTexture = false;
        this.colors = [];
    }
    addShader(shader,type){
        this.shaders[type] = shader;
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    returnBuffers(renderer){
        //Create new buffers list
        const buffers = {
            position:renderer.createBuffer(renderer.gl.ARRAY_BUFFER,this.points,Float32Array,renderer.gl.STATIC_DRAW),
            color:renderer.createBuffer(render.gl.ARRAY_BUFFER,this.colors,Float32Array,renderer.gl.STATIC_DRAW)
        }
        return buffers;
    }
    applyTransformations(){

    }
    returnProgram(renderer,buffers){
        const program = renderer.createShaderProgram(this.shaders.vertexShader,this.shaders.fragmentShader);
        const programInfo = {
            program:program,
            vertexLocations:{
                
            }
        }
    }
}
class TraingleObject{
    
}

class PointCloudObject{

}
class VertexShader{
    constructor(shader,type){
        this.shader=shader;
        this.type = type;
    }
}