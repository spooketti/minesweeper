let board = document.getElementById("gameboard")
let firstclick = true
let hasfailed = false
let codeboard = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
]
let boom = new Audio("boom.mp3"); // buffers automatically when created
let rareSound6 = new Audio("sixSound.wav")
const chordPos = [ //written in terms of x,y
    [0,1],
    [1,1],
    [-1,0],
    [1,0],
    [-1,-1],
    [0,-1],
    [-1,1],
    [1,-1]
]

function assignColor(value)
{
    switch(value)
    {
        
        case 1:
        return "#0000FF"
        case 2:
        return "#95bb72"
        case 3:
        return "#FF0000"
        case 4:
        return "#301934"
        case 5:
        return "#FFA500"
        case 6:
        return "#ADD8E6"
        case 7:
        return "#000000"
        case 8:
        return "#4F70A7"
        default: 
        return "#808080"
    }
}

for(let j=0;j<9;j++)
{
for(let i=0;i<9;i++)
{
let box = document.createElement("div")
box.id = j.toString() + i.toString()
board.append(box)
}
}

function legalizeNuclearBombs()
{
for(let j=0;j<9;j++)
{
for(let i=0;i<9;i++)
{
if(codeboard[j][i] == 5)
{
    document.getElementById(j.toString()+i.toString()).style.backgroundColor = "#FF0000"
    boom.play()
}
}
}
}

function genBombs(boms,requirement)
{
    //console.log(requirement)
  //  console.log(boms)
    let randx = Math.round(Math.random() * 8)
    let randy = Math.round(Math.random() * 8)
    if(codeboard[randy][randx] != 0) //generating on a pre exsisting mine
    {
     genBombs(boms,requirement)
     return    
    }
    codeboard[randy][randx] = 5
    boms++
  // document.getElementById(randy.toString()+randx.toString()).style.backgroundColor = "#FF0000"
    if(boms < requirement)
    {
        genBombs(boms,requirement)
    }
}
genBombs(0,20)

let selectedTile = null

//console.log(codeboard[0][-1])

function flagTile()
{
// console.log(selectedTile.tagName)
if(selectedTile.tagName == "IMG")
{
    //console.log("what")
    selectedTile.remove()
}
//console.log(selectedTile.className)
if(selectedTile.getAttribute("revealed") || selectedTile.id.length != 2 || selectedTile.hasChildNodes())
{
    return;
}
let image = document.createElement("img")
image.src = "./flag.jpg"
selectedTile.appendChild(image)
}

function revealTile()
{
    if(selectedTile.hasChildNodes())
        {
            return;
        }
        if(selectedTile.id.length == 2)
        {
           // console.log(codeboard)
           selectedTile.setAttribute("revealed","hey stop looking at the source code")
            let idY = parseInt(selectedTile.id.charAt(0))
            let idX = parseInt(selectedTile.id.charAt(1))
            let bombs = 0
            if(codeboard[idY][idX] == 5)
            {
                if(firstclick == true)
                {
                    genBombs(0,1)
                    codeboard[idY][idX] = 0
                    firstclick = false
                    return;
                }
                legalizeNuclearBombs()
                hasfailed = true;
              //  snd.play();

                return
            }
            firstclick = false
            //console.log(codeboard[idX+chordPos[0][0]])
            for(let i=0;i<8;i++)
            {
             
              if((idY+chordPos[i][1] > 8 || idY+chordPos[i][1] < 0 || idX+chordPos[i][0] < 0 || idX+chordPos[i][0] > 8) == false)
              {
              if(codeboard[idY+chordPos[i][1]][idX+chordPos[i][0]] == 5)
              {
                bombs += 1
              }
            }
              //console.log(codeboard[idY+chordPos[i][1]][idX+chordPos[i][0]])
            }
            selectedTile.style.backgroundColor = "#808080"
            selectedTile.style.color = assignColor(bombs)
            selectedTile.innerText = bombs
            if(bombs == 6)
            {
                rareSound6.play()
            }
        }
}

document.addEventListener('mousemove', e => {
   selectedTile = document.elementFromPoint(e.clientX, e.clientY)
    
  }, {passive: true})


  document.addEventListener("keydown",(e)=> {
    if(hasfailed == true)
    {
        return;
    }
    switch(e.code)
    {
        case "KeyZ":
        revealTile()
        break;
        case "KeyX":
          flagTile()
        break;

    }
    // use e.keyCode
});

window.oncontextmenu = function () {
    flagTile()
  }

  document.addEventListener("click", function() {
    revealTile()
    });

