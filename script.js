let heldKeys = {}
window.onkeydown = function(e) {
    heldKeys[e.code] = true
    if (e.code == "KeyE") {
        //testObject.changePos({x: 10, y: 10})
        //testObject.setScale(testObject.scale + 1)
        //testObject.setDebug(!testObject.debug)
        //child.setRot(0, child.rot.y+5, 0, 5)
    }
}
window.onkeyup = function(e) {
    heldKeys[e.code] = false
}

function nopx(prop) {
    return Number(prop.substring(0, prop.length-2))
}

const images = {};
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        const img = arguments[i]
        images[img] = new Image();
        images[img].onload = function() {
            console.log("loaded "+ img)
        }
        images[img].src = "assets/textures/"+ img;
    }
}
preload(
    "placeholder.png",
    "placeholder2.png"
)
/**
 * Makes a new game object
 * @param {object} options
 * @constructor
 */
function sprite(options) {
    if (options == null) {options = {}}

    this.parent = options.parent || {body: document.getElementById("canvas")} // Default parent is the canvas
    this.pos = options.pos || {x:0, y:0}
    this.rot = options.rot || {x:0, y:0, z:0}
    this.scale = options.scale || 1
    
    this.texture = images[options.texture] || images["placeholder2.png"]
    this.size = options.size || {
        x: this.texture.width,
        y: this.texture.height
    }

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
    this.setDebug = function(bool) {
        this.debug = bool
        this.render()
    }
    this.setTextureSize = function(s) {
        this.size = s
        this.render()
    }

    this.render = function() {
        // Sets the center of the element to where it's top left corner was
        // Then sets its center to the center of its parent
        this.body.style.position = "absolute"
        this.body.style.left = (this.pos.x/2 - this.size.x/2) + nopx(this.parent.body.style.width)/2 +"px"
        this.body.style.top = (this.pos.y/2 - this.size.y/2) + nopx(this.parent.body.style.height)/2 +"px"

        this.body.style.transform = ""
        this.body.style.transform += "translate("+ this.pos.x/2 +"px, "+ this.pos.y/2 +"px) "
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
        this.body.style.background = "url("+ this.texture.src +")"
        this.body.style.imageRendering = "pixelated"


        this.body.style.border = this.debug ? "1px solid yellow" : "none"
    }
    this.render()
}

window.onload = function() {
    console.log("Everything has been loaded!");

    const camera = new sprite({
        pos: {
            x: 100,
            y: 100
        },
        size: {
            x: 128,
            y: 128
        }
    })
    const child = new sprite({
        parent: camera,
        texture: "placeholder.png",
        pos: {
            x: 0,
            y: 0
        },
    })

    //console.log(child)

    const canvas = document.getElementById("canvas")

    canvas.onwheel = function(e) {

    }

    function render() {
        camera.setRot({x: 75, y: 0, z: camera.rot.z+0.1, p:128})
    }

    setInterval(render, 10)
}

