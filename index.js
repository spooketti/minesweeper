//array documentation



/*codebaord docs
0 = blank
5 = bomb
*/

let board = document.getElementById("gameboard")
let activeCount = document.getElementById("bombcount")
let Ws = document.getElementById("W")
let Ls = document.getElementById("L")
let bestime = document.getElementById("timers")//don't ask how i even come up with these ids
let winPercentDOM = document.getElementById("win percent")
let firstclick = true
let hasfailed = false
let hasTimerBegan = false
let activeTime = 0
let area = 81
let solutionCount = area
let destroyedArea = 0
let hasGen = false
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
let activeBoard = 
[
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

//console.log(activeBoard)
let timed = document.getElementById("timer")
function timer()
{
 if(hasTimerBegan == false)
  {
    setInterval(function(){
      activeTime += hasfailed==false ? 1 : 0
      timed.innerText = new Date(activeTime * 1000).toISOString().slice(11, 19); //idk wth this does but i like it https://bobbyhadz.com/blog/javascript-convert-seconds-to-hh-mm-ss
    },1000)
  }
  hasTimerBegan = true
}
let boom = new Audio("boom.mp3"); // buffers automatically when created
let rareSound6 = new Audio("sixSound.wav")
let win = new Audio("win.mp3")
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

function updateLocalStorage(det)
{
  if(hasfailed == true)
  {
    return;
  }
  
  Ws.innerText = "W:Outdated Browser"
  Ls.innerText = "Skill Issues:Outdated Browser"
  //document.getElementById("W").innerText = "why are you playing this on an outdated browser please stop being grandma and use a browser that supports Local Storage please i beg you";
  //console.log(hasfailed)
if (typeof(Storage) !== "undefined") { //don't ask me how this works idk how breh i just found out about localStorage today
  // Store
  if(localStorage.WCount)
  {
    if(det == "W")
  {
      localStorage.WCount = parseInt(localStorage.WCount) + 1
     // console.log(localStorage.WCount)
      Ws.innerText = "W:" + localStorage.WCount.toString()
     // return
  }
  }
  else
  {
    localStorage.WCount = 0
    Ws.innerText = "W:0"
  }
  
  if(localStorage.LCount)
  {
    if(det=="L")
  {
      localStorage.LCount = parseInt(localStorage.LCount) + 1
     // console.log(localStorage.LCount)
      Ls.innerText = "Skill Issues:" + localStorage.LCount.toString()
     // return
  }
  
 // localStorage.LCount = 1
  }
  else
  {
    Ls.innerText = "Skill Issues:0"
    localStorage.LCount = 0
    
  }
  
  if(localStorage.bestTime)
  {
    //console.log("exists")
    if(activeTime < localStorage.bestTime && det == "W")
    {
      //console.log("won path")
      localStorage.bestTime = activeTime
    }
  }
  else
  {
    //console.log("fail :(")
    localStorage.bestTime = 999
  }
  bestime.innerText = "🏆Time: " + new Date(localStorage.bestTime * 1000).toISOString().slice(11, 19);
  winPercentDOM.innerText = "Win Rate:" + Math.round((localStorage.WCount/(localStorage.LCount+localStorage.WCount)) * 100).toString()+ "%"
} 
}

updateLocalStorage(null)

for(let j=0;j<9;j++)
{
for(let i=0;i<9;i++)
{
let box = document.createElement("div")
box.id = j.toString() + i.toString()
board.append(box)
}
}

function legalizeNuclearBombs(status)
{
for(let j=0;j<9;j++)
{
for(let i=0;i<9;i++)
{
if(codeboard[j][i] == 5)// why are we doing this? nvm i know why 
{
  if(status == "w")
  {
    document.getElementById(j.toString()+i.toString()).style.backgroundColor = "#00ff00"
    win.play()
    updateLocalStorage("W")
    hasfailed = true
  }
  else
  {
    document.getElementById(j.toString()+i.toString()).style.backgroundColor = "#FF0000"
    boom.play()
    updateLocalStorage("L")
    hasfailed = true
  }
}
}
}
}

function genBombs(boms,requirement)
{
  if(firstclick == true)
  {
    activeCount.innerText = requirement
    solutionCount = area - requirement
    //firstclick = false
  }
  
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
   // activeBoard[randy][randx] = 6
    boms++
   //document.getElementById(randy.toString()+randx.toString()).style.backgroundColor = "#FF0000"
    if(boms < requirement)
    {
        genBombs(boms,requirement)
    }
}
genBombs(0,20)

let selectedTile = null
let evalboard = null
//console.log(codeboard[0][-1])

function evalulateWin()
{
  if(solutionCount == destroyedArea)
  {
    legalizeNuclearBombs("w")
  }
}

function flagTile()
{
    let idY = parseInt(selectedTile.id.charAt(0))
    let idX = parseInt(selectedTile.id.charAt(1))
// console.log(selectedTile.tagName)
if(selectedTile.tagName == "IMG")
{
    idY = parseInt(selectedTile.parentElement.id.charAt(0))
    idX = parseInt(selectedTile.parentElement.id.charAt(1))
    activeBoard[idY][idX] = 0
    selectedTile.remove()
    activeCount.innerText = parseInt(activeCount.innerText) + 1
  //  console.log(activeBoard)
    return;
    
}
//console.log(selectedTile.className)
if(selectedTile.getAttribute("revealed") || selectedTile.id.length != 2 || selectedTile.hasChildNodes())
{
    return;
}
let image = document.createElement("img")
image.src = "./flag.jpg"
selectedTile.appendChild(image)
activeBoard[idY][idX] = 5
activeCount.innerText = parseInt(activeCount.innerText) - 1
//console.log(activeBoard)
}



function revealTile(element)
{
    if(element.hasChildNodes())//I ACCIDENTALLY JUST SAVED MYSELF SO MUCH TIME THIS IS SUPPOSED TO BE ANTI CHEAT BUT IT'S ALSO CHORD PROTECTION
        {
            return;
        }
        if(element.id.length == 2)
        {
          timer()
          destroyedArea++
          evalulateWin()
           // console.log(codeboard)
           element.setAttribute("revealed","hey stop looking at the source code")
            let idY = parseInt(element.id.charAt(0))
            let idX = parseInt(element.id.charAt(1))
            let bombs = 0
            if(codeboard[idY][idX] == 5)
            {
                if(firstclick == true)
                {
                    firstclick = false
                    genBombs(0,1)
                    codeboard[idY][idX] = 0
                    return;
                }
                legalizeNuclearBombs()
                hasfailed = true;
              //  snd.play();

                return
            }
            firstclick = false
           //s activeBoard[idY][idX] = 0
          //  console.log(activeBoard)
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
            element.style.backgroundColor = "#808080"
            element.style.color = assignColor(bombs)
            element.innerText = bombs
            if(bombs >= 6)
            {
                rareSound6.play()
            }
            if(bombs == 0)//WHO NEEDS FLOOD FILL IF YOU HAVE THIS
            {
              chord(element)
            }
        }
}

function chord(element)
{
if(element.getAttribute("revealed"))
{
    let idY = parseInt(element.id.charAt(0))
    let idX = parseInt(element.id.charAt(1))
    let req = parseInt(element.innerText)
    let bombs = 0;
    for(let i=0;i<8;i++)
    {
     
      if((idY+chordPos[i][1] > 8 || idY+chordPos[i][1] < 0 || idX+chordPos[i][0] < 0 || idX+chordPos[i][0] > 8) == false)
      {
      if(activeBoard[idY+chordPos[i][1]][idX+chordPos[i][0]] == 5)
      {
        bombs += 1
      }
    }
    }
    if(bombs != req)
    {
        return;
    }
    //worlds most optimized code 
    for(let i=0;i<8;i++)
    {
     
      if((idY+chordPos[i][1] > 8 || idY+chordPos[i][1] < 0 || idX+chordPos[i][0] < 0 || idX+chordPos[i][0] > 8) == false)
      {
      revealTile(document.getElementById((idY+chordPos[i][1]).toString()+(idX+chordPos[i][0]).toString()))
    }
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
        revealTile(selectedTile)
        break;
        case "KeyX":
          flagTile()
        break;
        case "KeyC":
            chord(selectedTile)
        break;

    }
    // use e.keyCode
});

/*
window.oncontextmenu = function () {
    flagTile()
  }
*/
  document.addEventListener("mousedown", function(e) {
    switch(e.button)
    {
        case 0:
        revealTile(selectedTile)
            break;
        case 1:
            chord(selectedTile)
            e.preventDefault();
            return false;
        case 2:
            flagTile()
            break;
    }
   // revealTile(selectedTile)
    });

