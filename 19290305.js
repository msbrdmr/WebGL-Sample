let ctx;
let program;

let thetaLoc;
let theta;

let canvas;
let increment = 0.0;
let bgcolor = [0, 0, 0, 1];
let textcolor = [0, 1, 0];

let stopRotBtn;
let rotateslider;
let resetPosBtn;

let bgcolorpicker;
let textcolorpicker;
let grpcolorpicker;

let M_vertex_count;

window.onload = function main() {
    /** @type {HTMLCanvasElement} */
    canvas = document.getElementById("canvas1");
    /** @type {HTMLButtonElement} */
    stopRotBtn = document.getElementById("stoprt")
    stopRotBtn.addEventListener("click", stopRotation);

    /** @type {HTMLInputElement} */
    rotateslider = document.getElementById("rotateslider");
    rotateslider.addEventListener("mousemove", setRotation);

    /** @type {HTMLButtonElement} */
    resetPosBtn = document.getElementById("resetpos")
    resetPosBtn.addEventListener("click", resetPosition)

    document.addEventListener('keyup', event => {
        if (event.code === 'Space') {
            stopRotation();
        }
    })
    /** @type {HTMLInputElement} */
    bgcolorpicker = document.getElementById("bgcolorpicker")

    textcolorpicker = document.getElementById("textcolorpicker")
    // Initialize the ctx context
    ctx = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!ctx) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    program = initShaders(ctx, "vertex-shader", "fragment-shader");
    ctx.viewport(0, 0, canvas.width, canvas.height);
    ctx.useProgram(program);

    let a = [-0.85, -0.4, 0];
    let b = [-0.8, -0.4, 0]
    let c = [-0.85, 0.5, 0];
    let d = [-0.8, 0.5, 0]
    let e = [-0.53, 0.2, 0];
    let f = [-0.47, 0.2, 0];
    let g = [-0.2, 0.5, 0]
    let h = [-0.15, 0.5, 0]
    let j = [-0.15, -0.4, 0];
    let k = [-0.2, -0.4, 0]
    let l = [-0.5, 0.17, 0]

    let r1 = [0.25, 0.5, 0]
    let r2 = [0.3, 0.5, 0]
    let r3 = [0.75, 0.5, 0]
    let r4 = [0.3, 0.45, 0]
    let r5 = [0.7, 0.45, 0]
    let r6 = [0.75, 0.45, 0]
    let r7 = [0.3, 0.2, 0]
    let r8 = [0.7, 0.2, 0]
    let r9 = [0.3, 0.15, 0]
    let r10 = [0.7, 0.15, 0]
    let r11 = [0.75, 0.15, 0]
    let r12 = [0.25, -0.4, 0]
    let r13 = [0.3, -0.4, 0]
    let r14 = [0.7, -0.4, 0]
    let r15 = [0.75, -0.4, 0]
    let r16 = [0.35, 0.15, 0]

    let vertexdata = [];

    let order = [
        a, b, c, d, b, c, d, c, f,
        c, e, f, g, h, f, f, g, e,
        g, k, h, k, h, j, l, e, f,
        r1, r2, r13, r12, r13, r1,
        r2, r3, r4, r4, r3, r6, r5,
        r6, r11, r10, r11, r5, r9, r7,
        r8, r9, r10, r8, r9, r14, r15,
        r9, r16, r15
    ];
    M_vertex_count = order.length * 2;
    order.forEach(element => {
        for (let i = 0; i < 2; i++) {
            vertexdata.push(element[i])
        }
    });
    let positionArray = new Float32Array(2 * order.length)
    positionArray.set(vertexdata)


    let positionBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, positionArray, ctx.STATIC_DRAW);

    let vertexPosition = ctx.getAttribLocation(program, "vPosition");
    ctx.enableVertexAttribArray(vertexPosition);
    ctx.vertexAttribPointer(vertexPosition, 2, ctx.FLOAT, false, 0, 0);



    thetaLoc = ctx.getUniformLocation(program, "theta")
    theta = 0;
    ctx.uniform1f(thetaLoc, theta);

    colorLoc = ctx.getUniformLocation(program, "u_color")
    textcolor = vec4(1, 1, 0, 1)
    ctx.uniform4fv(colorLoc, textcolor)

    setInterval(animRender, 1)
}


function animRender() {
    ctx.clearColor(...bgcolor);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    theta += increment;

    ctx.uniform1f(thetaLoc, theta);

    bgcolor = vec4(...getColorfromHEX(bgcolorpicker.value))
    textcolor = vec4(...getColorfromHEX(textcolorpicker.value))
    ctx.uniform4fv(colorLoc, textcolor)
    ctx.drawArrays(ctx.TRIANGLES, 0, M_vertex_count);
}

function stopRotation() {
    if (increment != 0) increment = 0;
    rotateslider.value = 0;
}

function setRotation() {
    increment = rotateslider.value / 1000
}

function resetPosition() {
    theta = 0;
    increment = 0;
    rotateslider.value = 0;

}

function getColorfromHEX(params) {
    params = params.slice(1)
    let aRgbHex = params.match(/.{1,2}/g);
    let aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return [aRgb[0] / 255, aRgb[1] / 255, aRgb[2] / 255];
}