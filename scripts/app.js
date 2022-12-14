//APP
function $(name,parent){
    return parent?{
        tag:parent.getElementsByTagName(name),
        class:parent.getElementsByClassName(name)
    } : {
        id:document.getElementById(name),
        tag:document.getElementsByTagName(name),
        class:document.getElementsByClassName(name)
    }
}
var render;
//Hopefully this code will be less than 100 lines with the library.
function main(){
    localStorage.setItem("build",JSON.parse(localStorage.getItem("build"))?JSON.parse(localStorage.getItem("build"))+1:100)
    $("buildString").id.innerText = `WebGL Library - version 1.0.${JSON.parse(localStorage.getItem("build"))+1}`
    //Things might get out of hand here...
    //This part required
    render = new Renderer($("emotionalDamage").id)
    render.clear(0,0,0,1);

    //Soon writing these shaders will no longer be neccesary
    const vertexShader = render.createShader(`
attribute vec4 vertexPosition;
attribute vec4 vertexColor;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying lowp vec4 Color;

void main(){
    gl_Position = ProjectionMatrix * ModelViewMatrix * VertexPosition;
    vColor = VertexColor;
}
    `,render.gl.VERTEX_SHADER,glDictionary.COLORED_VERTEX_SHADER)
    const fragmentShader = render.createShader(`
    varying lowp vec4 Color;
    void main(){
        gl_FragColor = Color;
    }`,render.gl.FRAGMENT_SHADER);

    //Setup stuff
    const shaderProgram = render.createShaderProgram(vertexShader,fragmentShader);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: render.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexColor:render.gl.getAttribLocation(shaderProgram,"aVertexColor")
        },
        uniformLocations: {
          projectionMatrix: render.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: render.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };
    const buffers = {
        position:render.createBuffer(render.gl.ARRAY_BUFFER,[
            1.0, 1.0,
           -1.0, 1.0,
            1.0,-1.0,
           -1.0,-1.0],Float32Array,render.gl.STATIC_DRAW),
        color:render.createBuffer(render.gl.ARRAY_BUFFER,[
            1.0,
            1.0,
            1.0,
            1.0, // white
            1.0,
            0.0,
            0.0,
            1.0, // red
            0.0,
            1.0,
            0.0,
            1.0, // green
            0.0,
            0.0,
            1.0,
            1.0, // blue
          ],Float32Array,render.gl.STATIC_DRAW)
    };
    let then = 0;
    let rotation = 0;
    function renderScene(now){
        now *= 0.001;
        const deltaTime = now-then;
        rotation+=deltaTime;
        then = now;
        render.drawScene(programInfo,buffers,rotation)
        requestAnimationFrame(renderScene);
    }
    requestAnimationFrame(renderScene);
}
window.onload = main;