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

    let selected = null
    function select(object) {
        if (selected) {
            selected.body.style.filter = ""
        }
        if (selected == object) {
            selected.body.style.filter = ""
            selected = null
        } else {
            selected = object
            selected.body.style.filter = "brightness(1.3)"
        }
        console.log("Selected is now:", selected)
    }

    const cam = {body: document.getElementById("canvas"), children: [], ready: true}

    const world = new sprite({
        size: {
            x: 1000,
            y: 1000
        },
        offset: {
            x: 0,
            y: 0
        },
        rot: {
            x: 0,
            y: 0,
            z: 0,
            p: 0
        },
        texture: "background.png",
        onClick: function(pos) {
            makePlatform(pos.x, pos.y)
        }
    })
    const child = new sprite({
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
        onClick: function(event) {
            console.log("Bot clicked!")
            child.setDebug(!child.debug)
        },
        offset: {
            x: 0,
            y: 0
        },
        texture: "botWalk.gif"
    })

    world.setParent(cam)
    world.append(child)

    const orbit = new sprite({
        texture: "placeholder.png",
        scale: 0.25,
        offset: {
            x: 0,
            y: -128
        }
    })
    child.append(orbit)

    const planet = new sprite({
        texture: "canvas",
        pos: {
            x: 0,
            y: 50
        },
        size: {
            x: 32,
            y: 32
        },
        onClick: function(event) {
            console.log(planet)
            planet.render()
        }
    })
    child.append(planet)
    const ctx = planet.body.getContext("2d")
    ctx.fillStyle = "rgb(200 0 0 / 25%)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = "rgb(0 0 200)";
    ctx.fillRect(15, 15, 2, 2)

    function makePlatform(x, y) {
        const platform = new sprite({
            type: "platform",
            parent: world,
            texture: "platform.png",
            pos: {
                x: x,
                y: y
            },
            onClick: function(event) {
                select(platform)
            }
        })
        world.append(platform)
    }

    const canvas = document.getElementById("canvas")
    canvas.style.width = window.innerWidth +"px"
    canvas.style.height = window.innerHeight +"px"

    let camZoom = 1
    world.setScale(Math.pow(camZoom+1, 2))
    canvas.onwheel = function(e) {
        camZoom += e.deltaY/-1000
        camZoom = clamp(camZoom, -0.29, 4)
        camZoom = Math.floor(camZoom*100)/100 // Removes any imprecision errors
        world.setScale(Math.pow(camZoom+1, 2))
    }

    const debugInfo = this.document.getElementById("debugInfo")

    let lastTime = Date.now()

    const camPos = {x:0, y:0}
    function render() {
        let delta = Date.now() - lastTime // delta = time last frame took
        lastTime = Date.now()

        let camSpeed = 6
        if (heldKeys["ShiftLeft"]) {camSpeed *= 2}
        if (heldKeys["KeyW"]) {camPos.y += camSpeed / world.scale}
        if (heldKeys["KeyS"]) {camPos.y -= camSpeed / world.scale}
        if (heldKeys["KeyA"]) {camPos.x -= camSpeed / world.scale}
        if (heldKeys["KeyD"]) {camPos.x += camSpeed / world.scale}
        camPos.x = clamp(camPos.x, world.size.x/-2, world.size.x/2)
        camPos.y = clamp(camPos.y, world.size.y/-2, world.size.y/2)
        world.setOffset({
            x: world.offset.x + (-world.offset.x-camPos.x)/(5 * 16/delta), // range 0-20 +1
            y: world.offset.y + (-world.offset.y+camPos.y)/(5 * 16/delta)
        })
        canvas.style.width = window.innerWidth +"px"
        canvas.style.height = window.innerHeight +"px"
        world.render()
        
        tick(delta/16) // 16 milliseconds =~ 60fps
        
        debugInfo.innerText = ""
        debugInfo.innerText += "Cam X Y: "+ camPos.x.toFixed(2) +" "+ camPos.y.toFixed(2) +"\n"
        debugInfo.innerText += "Cam zoom: "+ camZoom +" ("+ world.scale.toFixed(2) +")\n"
        debugInfo.innerText += "Render: "+ delta +" ms"

        requestAnimationFrame(render)
    }

    let oog = Date.now()
    function tick(d) {
        child.setPos({x: child.pos.x - 0.2*d, y: 0})
        if (child.pos.x < -50) {
            child.setPos({x: 0, y: 0})
            //console.log("Took me "+ (Date.now() - oog))
            //console.log(child)
            oog = Date.now()
        }
        orbit.setRot({x: 0, y:0, z: orbit.rot.z + 2})
    }

    requestAnimationFrame(render)
}

