const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
const body = document.body;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const square_size = 10;
const rows = 20;
const columns= 40;
let mode = "";
let brushColor = "#000000";

function addTools(){

    const tools = document.getElementById('tools');
    const brush = document.createElement('button');

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

    const POT2_Peinture = document.createElement('button'); // à copier coller début
    POT2_Peinture.innerHTML = "Pot"
    POT2_Peinture.addEventListener('click', () => { Pot_2_Peinture(POT2_Peinture)});

    tools.appendChild(POT2_Peinture); // à copier coller fin
    tools.appendChild(brush);
    tools.appendChild(eraser);
    tools.appendChild(selectColor);
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


/* Bloc de code de Djag à ajouter 

------------->>> Pot_2_Peinture <<<<< prends comme paramètre l'élément créer POT2_Peinture 
et gère de la même manière que pour le brush et l'eraser. Ligne 38 à 42 à copier coller dcp


------------->>> ColorierTout <<<<< Elle est utilisé par PotSelection pas besoin de l'appeler

------------->>> PotSelection <<<<< Cette fonction qui est appellé plus bas dans le canvas.addEventListener("mousedown")
                                    Elle gère le total de la fonctionnalité de gestion du rectangle de selection en mode pot
                                    Sous la forme de 
                                    Il est nécessaire de maintenir Ctrl lorsque l'on souhaite utiliser le mode selection en mode pot

*/

function Pot_2_Peinture(pot) { // FOnction à copier coller
   
    if (lastButton !== null) {
        lastButton.classList.remove("disabled");
        lastButton.disabled = false;
    }
    pot.classList.add("disabled");
    pot.disabled = true; 
    
    mode = "pot";
    lastButton = pot;
};

function ColorierTout(x1, y1, x2, y2) { // FOnction à copier coller
    ctx.clearRect(x1, y1, x2, y2);
    ctx.fillStyle = brushColor;
    ctx.fillRect(x1, y1, x2, y2);
    drawCartesianGrid(square_size, rows, columns);
}

let potSelectionDebut = null;
let potSelectionEnd = null;
let potSelectionActif = false;
let canvasSnapshot = null;

function PotSelection(event) { // Fonction a copier coller 

    if (!event.ctrlKey) {
        ColorierTout(0, 0, canvas.width, canvas.height);
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;
    
    const startCoord = toCartesianCoordinate(square_size, startX, startY);
    potSelectionDebut = {
        x: startCoord.colonne * square_size,
        y: startCoord.ligne * square_size
    };
    
    potSelectionActif = true;
    canvasSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    function onPotMouseMove(e) {
        if (!potSelectionActif) return;
        
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const endCoord = toCartesianCoordinate(square_size, currentX, currentY);
        potSelectionEnd = {
            x: (endCoord.colonne + 1) * square_size,
            y: (endCoord.ligne + 1) * square_size
        };
        
        ctx.putImageData(canvasSnapshot, 0, 0);
                const selX = Math.min(potSelectionDebut.x, potSelectionEnd.x);
        const selY = Math.min(potSelectionDebut.y, potSelectionEnd.y);
        const selWidth = Math.abs(potSelectionEnd.x - potSelectionDebut.x);
        const selHeight = Math.abs(potSelectionEnd.y - potSelectionDebut.y);
        
        ctx.strokeStyle = "#0066FF";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(selX, selY, selWidth, selHeight);
        ctx.setLineDash([]);
        ctx.lineWidth = 0.1;
            // Paramètrage de la ligne ligne des selecion
    }
    
    function onPotMouseUp(e) {
        if (!potSelectionActif) return;
        
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        
        const endCoord = toCartesianCoordinate(square_size, endX, endY);
        potSelectionEnd = {
            x: (endCoord.colonne + 1) * square_size,
            y: (endCoord.ligne + 1) * square_size
        };
        
        const selX = Math.min(potSelectionDebut.x, potSelectionEnd.x);
        const selY = Math.min(potSelectionDebut.y, potSelectionEnd.y);
        const selWidth = Math.abs(potSelectionEnd.x - potSelectionDebut.x);
        const selHeight = Math.abs(potSelectionEnd.y - potSelectionDebut.y);
        
        ctx.putImageData(canvasSnapshot, 0, 0);
        
        if (selWidth > 0 && selHeight > 0) {
            ColorierTout(selX, selY, selWidth, selHeight);
        }
        
        potSelectionActif = false;
        potSelectionDebut = null;
        potSelectionEnd = null;
        canvasSnapshot = null;
        
        canvas.removeEventListener("mousemove", onPotMouseMove);
        canvas.removeEventListener("mouseup", onPotMouseUp);
    }
    
    canvas.addEventListener("mousemove", onPotMouseMove);
    canvas.addEventListener("mouseup", onPotMouseUp);
}

// Fin de la section Djag à copier coller

function toPixelCoordinate(square_size, colonne, ligne){
    return {
        px:square_size*(colonne-1),
        py:square_size*(ligne-1)
    }
}

function toCartesianCoordinate(square_size, x,y){
    // console.log("round x", Math.round(x/square_size))
    // console.log("pas round",x/square_size )
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

canvas.addEventListener("mousedown", (event) => { // Section à part à ajouter ... pour gérer le mousedown j'ai pas réussi à l'ajouter à HandleClick ça m'as soulé parce que faut récupérer le paramètre event dans le potSelection et je vois pas comment faire sans le mettre au sein de la fonction addEventListener.
    let rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (mode === "pot") {
        PotSelection(event); 
    } else {
        handleClick(x, y);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", function onMouseUp(){
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseup", onMouseUp);
        });    }
});

// Fin de la section à ajouter 

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

    // console.log("ligne", ligne)
    // console.log("colonne", colonne)

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



addTools();
drawCartesianGrid(square_size,rows,columns)



//fillSquare(10,10,10,"#A627F5")
//const coordonnees = toPixelCoordinate(10, 2, 2);
//console.log(coordonnees)
//const cartesien = toCartesianCoordinate(10, 25, 25);
//console.log(cartesien)

//tools();