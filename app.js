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
    
    render = new Renderer($("emotionalDamage").id)
    render.clear(0,0,0,1);
    const vertexShader = render.createShader(`
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
    
void main(){
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
    `,render.gl.VERTEX_SHADER)
    const fragmentShader = render.createShader(`
    void main(){
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    }
`,render.gl.FRAGMENT_SHADER);
    const shaderProgram = render.createShaderProgram(vertexShader,fragmentShader);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: render.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
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
    }
    render.drawScene(programInfo,buffers)
}
window.onload = main;