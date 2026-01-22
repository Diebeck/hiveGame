let heldKeys = {}
window.onkeydown = function(e) {
    heldKeys[e.code] = true
}
window.onkeyup = function(e) {
    heldKeys[e.code] = false
}

// Debug info
const debugInfo = document.getElementById("debugInfo")
const debugPos = document.createElement("p"); debugInfo.appendChild(debugPos)
const debugZoom = document.createElement("p"); debugInfo.appendChild(debugZoom)

function setPos(element, x, y) {
    element.style.position = "absolute"
    element.style.left = x +"px"
    element.style.top = y +"px"
}
function getPos(element) {
    const left = element.style.left
    const x = left.substring(0, left.length-2)
    const top = element.style.top
    const y = top.substring(0, top.length-2)
    return {x: Number(x), y: Number(y)}
}

const world = document.getElementById("world")

let zoomLevel = 1
world.onwheel = function(e) {
    console.log(e.offsetX, e.offsetY)
    zoomLevel += e.deltaY / -1000
    zoomLevel = Math.min(Math.max(zoomLevel, 0.1), 4)
    world.style.transformOrigin = e.offsetX +" "+ e.offsetY
    world.style.transform = "scale("+ zoomLevel +")"
}

const thing = document.createElement("div")
thing.style.backgroundColor = "red"
thing.style.width = "100px"
thing.style.height = "100px"
world.appendChild(thing)

setPos(thing, 100, 100)
let pos = getPos(thing)
console.log(pos.x, pos.y)

let cameraSpeed = 5
let cameraVel = {x: 0, y: 0}

function render() {
    cameraSpeed = heldKeys["ShiftLeft"] ? 2 : 1
    if (heldKeys["KeyW"]) {
        cameraVel.y += cameraSpeed
    }
    if (heldKeys["KeyS"]) {
        cameraVel.y += -cameraSpeed
    }
    if (heldKeys["KeyD"]) {
        cameraVel.x += -cameraSpeed
    }
    if (heldKeys["KeyA"]) {
        cameraVel.x += cameraSpeed
    }
    cameraVel.x *= 0.9
    cameraVel.y *= 0.9
    setPos(world, getPos(world).x + cameraVel.x, getPos(world).y + cameraVel.y)

    // Debug
    debugPos.innerText = "pos X Y: "+ getPos(world).x +" "+ getPos(world).y
    debugZoom.innerText = "zoom: "+ zoomLevel
}

setInterval(render, 10)