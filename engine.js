function nopx(prop) {
    return Number(prop.substring(0, prop.length-2))
}

/**
 * Makes a new game object
 * @param {object} options
 * @constructor
 */
export function sprite(options) {
    if (options == null) {options = {}}
    const sprite = this

    this.parent = options.parent || {body: document.getElementById("canvas")} // Default parent is the canvas
    this.pos = options.pos || {x:0, y:0}
    this.offset = options.offset || {x:0, y:0}
    this.rot = options.rot || {x:0, y:0, z:0}
    this.scale = options.scale || 1

    this.texture
    this.size = options.size
    this.ready = false

    this.setTexture = function(url) {
        if (url) {
            sprite.ready = false
            sprite.texture = new Image();
            sprite.texture.onload = function() {
                if (sprite.size == null) {
                    sprite.size = {
                        x: sprite.texture.width,
                        y: sprite.texture.height
                    }
                }
                sprite.ready = true
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
        if (!sprite.ready) {return}
        // Sets the center of the element to where it's top left corner was
        // Then sets its center to the center of its parent
        this.body.style.position = "absolute"
        this.body.style.left = -this.size.x/2 + nopx(this.parent.body.style.width)/2 +"px"
        this.body.style.top = -this.size.y/2 + nopx(this.parent.body.style.height)/2 +"px"

        this.body.style.transform = ""
        if (this.rot.p) {
            this.body.style.transformStyle = "preserve-3d"
            this.body.style.transform += "perspective("+ this.rot.p +"px) "
        }
        this.body.style.transform += "translate("+ this.pos.x +"px, "+ this.pos.y +"px) " // X Y
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

        this.body.style.filter = "drop-shadow(5px 5px 5px #222)"
        this.body.style.filter = "none"
        //console.log(this.body.style)

        this.body.style.border = this.debug ? "1px solid yellow" : "none"
    }
    //this.render()
}