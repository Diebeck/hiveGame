import { sprite } from "./engine.js"

let heldKeys = {}
window.onkeydown = function(e) {
    heldKeys[e.code] = true
    if (e.code == "KeyE") {

    }
}
window.onkeyup = function(e) {
    heldKeys[e.code] = false
}

function clamp(value, min, max) {
    return Math.min(Math.max(value,min),max)
}

window.onload = function() {
    console.log("Everything has been loaded!");

    const world = new sprite({
        size: {
            x: 10000,
            y: 10000
        },
        offset: {
            x: 0,
            y: 0
        },
        rot: {
            x: 15,
            y: 0,
            z: 0,
            p: 500
        },
        texture: "background.png"
    })
    const child = new sprite({
        parent: world,
        texture: "botWalk.gif",
        pos: {
            x: 0,
            y: 0
        },
        rot: {
            x: 0,
            y: 0,
            z: 0,
            p: 0
        },
        offset: {
            x: 0,
            y: 0
        }
    })

    const canvas = document.getElementById("canvas")
    canvas.style.width = window.innerWidth +"px"
    canvas.style.height = window.innerHeight +"px"

    let camZoom = 1
    world.setScale(Math.pow(camZoom+1, 2))
    canvas.onwheel = function(e) {
        camZoom += e.deltaY/-1000
        camZoom = clamp(camZoom, -0.29, 3)
        camZoom = Math.floor(camZoom*100)/100 // Removes any imprecision errors
        world.setScale(Math.pow(camZoom+1, 2))
    }

    const debugInfo = this.document.getElementById("debugInfo")

    let lastTime

    const camPos = {x:0, y:0}
    function render() {
        let camSpeed = 12
        if (heldKeys["ShiftLeft"]) {camSpeed *= 2}
        if (heldKeys["KeyW"]) {camPos.y += camSpeed / world.scale}
        if (heldKeys["KeyS"]) {camPos.y -= camSpeed / world.scale}
        if (heldKeys["KeyA"]) {camPos.x -= camSpeed / world.scale}
        if (heldKeys["KeyD"]) {camPos.x += camSpeed / world.scale}
        camPos.x = clamp(camPos.x, world.size.x/-2, world.size.x/2)
        camPos.y = clamp(camPos.y, world.size.y/-2, world.size.y/2)
        world.setOffset({
            x: world.offset.x + (-world.offset.x-camPos.x)/5, // range 0-20 +1
            y: world.offset.y + (-world.offset.y+camPos.y)/5
        })
        canvas.style.width = window.innerWidth +"px"
        canvas.style.height = window.innerHeight +"px"
        world.render()

        debugInfo.innerText = ""
        debugInfo.innerText += "Cam X Y: "+ camPos.x.toFixed(2) +" "+ camPos.y.toFixed(2) +"\n"
        debugInfo.innerText += "Cam zoom: "+ camZoom +" ("+ world.scale.toFixed(2) +")\n"
        debugInfo.innerText += "Render: "+ (Date.now() - lastTime) +" ms"
        lastTime = Date.now()

        child.setPos({x: child.pos.x % 50 - 0.2, y: 0})
        
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

