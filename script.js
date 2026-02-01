let heldKeys = {}
window.onkeydown = function(e) {
    heldKeys[e.code] = true
    if (e.code == "KeyE") {

    }
}
window.onkeyup = function(e) {
    heldKeys[e.code] = false
}

function nopx(prop) {
    return Number(prop.substring(0, prop.length-2))
}
function clamp(value, min, max) {
    return Math.min(Math.max(value,min),max)
}

/**
 * Makes a new game object
 * @param {object} options
 * @constructor
 */
function sprite(options) {
    if (options == null) {options = {}}
    const sprite = this

    this.parent = options.parent || {body: document.getElementById("canvas")} // Default parent is the canvas
    this.pos = options.pos || {x:0, y:0}
    this.offset = options.offset || {x:0, y:0}
    this.rot = options.rot || {x:0, y:0, z:0}
    this.scale = options.scale || 1

    this.texture
    this.size = options.size

    this.setTexture = function(url) {
        if (url) {
            sprite.texture = new Image();
            sprite.texture.onload = function() {
                if (sprite.size == null) {
                    sprite.size = {
                        x: sprite.texture.width,
                        y: sprite.texture.height
                    }
                }
                sprite.render()
            }
            sprite.texture.src = "assets/textures/"+ url;
        } else {
            sprite.texture = null
            if (sprite.size == null) {sprite.size = {x:0, y:0}}
        }
    }

    this.setTexture(options.texture)

    this.debug = options.debug || false

    this.body = document.createElement("div")
    this.parent.body.appendChild(this.body)

    this.setPos = function(pos) {
        this.pos = pos
        this.render()
    }
    this.changePos = function(change) {
        this.pos.x += change.x
        this.pos.y += change.y
        this.render()
    }
    this.setRot = function(rot) {
        if (typeof rot == "number") {
            this.rot.z = rot
        } else {
            this.rot = rot
        }
        this.render()
    }
    this.setScale = function(scale) {
        this.scale = scale
        this.render()
    }
    this.setOffset = function(offset) {
        this.offset = offset
        this.render()
    }
    this.setDebug = function(bool) {
        this.debug = bool
        this.render()
    }
    this.setSize = function(s) {
        this.size = s
        this.render()
    }

    this.render = function() {
        // Sets the center of the element to where it's top left corner was
        // Then sets its center to the center of its parent
        this.body.style.position = "absolute"
        this.body.style.left = (this.pos.x - this.size.x/2) + nopx(this.parent.body.style.width)/2 +"px"
        this.body.style.top = (-this.pos.y - this.size.y/2) + nopx(this.parent.body.style.height)/2 +"px"

        this.body.style.transform = ""
        if (this.rot.p) {
            this.body.style.transformStyle = "preserve-3d"
            this.body.style.transform += "perspective("+ this.rot.p +"px) "
        }
        this.body.style.transform += "rotateX("+ this.rot.x +"deg) "
        this.body.style.transform += "rotateY("+ this.rot.y +"deg) "
        this.body.style.transform += "rotateZ("+ this.rot.z +"deg) "
        this.body.style.transformStyle = ""
        this.body.style.transform += "scale("+ this.scale +") "
        //this.body.style.transformOrigin = "bottom"

        this.body.style.width = this.size.x +"px"
        this.body.style.height = this.size.y +"px"
        if (this.texture != null) {
            this.body.style.background = "url("+ this.texture.src +")"
        }
        
        this.body.style.transform += "translate("+ this.offset.x +"px, "+ this.offset.y +"px) "
        this.body.style.transformOrigin = (-this.offset.x+this.body.style.width/2) +"px "+ (-this.offset.y+this.body.style.height/2) +"px"
        this.body.style.imageRendering = "pixelated"

        //this.body.style.filter = "drop-shadow(5px 5px 5px #222)"
        console.log(this.body.style)

        this.body.style.border = this.debug ? "1px solid yellow" : "none"
    }
    //this.render()
}

window.onload = function() {
    console.log("Everything has been loaded!");

    const world = new sprite({
        size: {
            x: 100,
            y: 100
        },
        offset: {
            x: 0,
            y: 0
        },
        rot: {
            x: 0,
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
            x: -15,
            y: 0,
            z: 0,
            p: 0
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
    }

    setInterval(render, 10)
}

