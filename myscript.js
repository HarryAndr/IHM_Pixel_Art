const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const square_size = 10;
const rows = 20;
const columns= 40;
let mode = "";
brushcolor = "#000000"

let startX, startY;
let snapshot;

function addTools(){
    const tools = document.getElementById('tools');

    const brush = document.createElement('button')
    brush.innerHTML = "Brush"
    brush.addEventListener('click', () =>{
        brushmode(brush)
    })

    const eraser = document.createElement('button')
    eraser.innerHTML = "Eraser"
    eraser.addEventListener('click', () =>{
        erasermode(eraser)
    })

    const selectColor = document.createElement('input');
    selectColor.type="color";

    selectColor.addEventListener('change', () => {
        brushColor = selectColor.value;
    })


    //
    const rectBtn = document.createElement('button');
    rectBtn.innerHTML = "Rectangle";
    rectBtn.addEventListener('click', () => {
        mode = "rectangle";
        // Désactiver visuellement comme pour les autres boutons
        if (lastButton) { lastButton.disabled = false; lastButton.classList.remove("disabled"); }
        rectBtn.disabled = true; rectBtn.classList.add("disabled");
        lastButton = rectBtn;
    });

    const circBtn = document.createElement('button');
    circBtn.innerHTML = "Cercle";
    circBtn.addEventListener('click', () => {
        mode = "circle";
        if (lastButton) { lastButton.disabled = false; lastButton.classList.remove("disabled"); }
        circBtn.disabled = true; circBtn.classList.add("disabled");
        lastButton = circBtn;
    });

    tools.appendChild(rectBtn);
    tools.appendChild(circBtn);
    //

    tools.appendChild(brush);
    tools.appendChild(eraser);
    tools.appendChild(selectColor);;
}

var lastButton = null

function brushmode(brush) {
    
    if (lastButton !== null) {
        lastButton.classList.remove("disabled");
        lastButton.disabled = false;
    }

    brush.classList.add("disabled");
    brush.disabled = true; 
    
    mode = "brush";
    lastButton = brush;


    updateCanvasCursor("brush");
}
function erasermode(eraser) {
    
    if (lastButton !== null) {
        lastButton.classList.remove("disabled");
        lastButton.disabled = false;
    }

    eraser.classList.add("disabled");
    eraser.disabled = true;

    mode = "eraser";
    console.log("Mode actuel :", mode);
    lastButton = eraser;

    updateCanvasCursor("eraser");
}

function drawCartesianGrid(square_size,rows,cols){
    ctx.beginPath()
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = "#000000";
    for (let i = 0; i <= rows; i++) {
        let y = i * square_size;
        ctx.moveTo(0, y);
        ctx.lineTo(cols*square_size, y);
    }
    for (let j = 0; j <= cols; j++) {
        let x = j * square_size;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rows*square_size);
    }

    ctx.stroke();
}

function toPixelCoordinate(square_size, colonne, ligne){
    return {
        px:square_size*(colonne-1),
        py:square_size*(ligne-1)
    }
}

function toCartesianCoordinate(square_size, x,y){
    console.log("round x", Math.round(x/square_size))
    console.log("pas round",x/square_size )
    if (Math.round(x/square_size) < x/square_size && Math.round(y/square_size) < y/square_size){
        return {
        colonne:Math.round(x/square_size),
        ligne:Math.round(y/square_size),
    }}
    else if (Math.round(x/square_size) < x/square_size && Math.round(y/square_size)>= y/square_size){
        return {
        colonne:Math.round(x/square_size),
        ligne:Math.round(y/square_size)-1,
    }}
    else if (Math.round(x/square_size) >= x/square_size && Math.round(y/square_size )< y/square_size){
        return {
        colonne:Math.round(x/square_size)-1,
        ligne:Math.round(y/square_size),
    }}
    else{
        return {
        colonne:Math.round(x/square_size) -1,
        ligne:Math.round(y/square_size) -1,
    }}
    
}

canvas.addEventListener("click", (event) => {
    let elem = document.querySelector("canvas");
    let rect = elem.getBoundingClientRect();
    console.log("rect.left", rect.left)
    console.log("rect top",rect.top)
    const x = event.clientX-rect.left;
    const y = event.clientY-rect.top;
    handleClick(x, y);
});

function fillSquare(square_size, x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, square_size, square_size)
    console.log("debut x", x)
    console.log("debut  y", y)
    ctx.stroke()
}

function startDrawing(x,y,color){
    console.log("position x souris",x)
    console.log("positiony souris",y)
    colonne = toCartesianCoordinate(10,x,y).colonne *10;
    ligne = toCartesianCoordinate(10,x,y).ligne * 10;

    console.log("ligne", ligne)
    console.log("colonne", colonne)

    fillSquare(10,colonne,ligne,color)
}

function handleClick(x,y){

    if (mode == "brush") startDrawing(x,y,brushColor)
    else if (mode =="eraser") startDrawing(x,y,"#FFFFFF")
}

function handleDrag(x,y){

    if (mode == "brush") startDrawing(x,y,brushColor)
    else if (mode == "eraser") startDrawing(x,y,"#FFFFFF")
    
}

function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    handleDrag(x, y);
}

canvas.addEventListener("mousedown", (event) => {


    //
    const rect = canvas.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", function onMouseUp(){
        canvas.removeEventListener("mousemove", onMouseMove);
    });
});


addTools();
drawCartesianGrid(square_size,rows,columns)
//fillSquare(10,10,10,"#A627F5")
//const coordonnees = toPixelCoordinate(10, 2, 2);
//console.log(coordonnees)
//const cartesien = toCartesianCoordinate(10, 25, 25);
//console.log(cartesien)


/*__________________________________________________________________*/


function updateCanvasCursor(currentMode) {
    const canvasElement = document.getElementById("myCanvas");

    canvasElement.classList.remove("cursor-brush", "cursor-eraser");

    if (currentMode === "brush") {
        canvasElement.classList.add("cursor-brush");
    } else if (currentMode === "eraser") {
        canvasElement.classList.add("cursor-eraser");
    }
}



function handleDrag(x, y) 
{
    if (mode === "brush") startDrawing(x, y, brushColor);
    else if (mode === "eraser") startDrawing(x, y, "#FFFFFF");

    else if (mode === "rectangle" || mode === "circle") {
        ctx.putImageData(snapshot, 0, 0);
        
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = 2;

        if (mode === "rectangle") {
            ctx.strokeRect(startX, startY, x - startX, y - startY);
        } 
        else if (mode === "circle") {
            const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
/*-------------------------------------------------------------------*/