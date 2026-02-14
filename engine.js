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

    this.children = []
    this.parent = options.parent
    this.ready = false

    this.pos = options.pos || {x:0, y:0}
    this.offset = options.offset || {x:0, y:0}
    this.rot = options.rot || {x:0, y:0, z:0}
    this.scale = options.scale || 1
    this.onClick = options.onClick
    this.debug = options.debug || false

    this.texture
    this.size = options.size

    this.render = function() {
        if (!sprite.parent) {
            console.log(sprite.texture +" tried rendering but couldnt")
            return
        } // Stop if theres no parent
        if (!sprite.ready || !sprite.parent.ready) {return} // Stop if texture or parent's texture isnt ready
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
        this.body.style.transform += "rotateX("+ this.rot.x +"deg) " // Rotation X
        this.body.style.transform += "rotateY("+ this.rot.y +"deg) " // Rotation Y
        this.body.style.transform += "rotateZ("+ this.rot.z +"deg) " // Rotation Z (2D)
        this.body.style.transformStyle = ""
        this.body.style.transform += "scale("+ this.scale +") " // Scale
        //this.body.style.transformOrigin = "bottom"

        this.body.style.width = this.size.x +"px" // Width
        this.body.style.height = this.size.y +"px" // Height
        if (this.texture != null) {
            this.body.style.background = "url("+ this.texture.src +")"
        }
        
        this.body.style.transform += "translate("+ this.offset.x +"px, "+ this.offset.y +"px) " // Offset
        //this.body.style.transform += "translateZ(0) "
        this.body.style.transformOrigin = (-this.offset.x+this.body.style.width/2) +"px "+ (-this.offset.y+this.body.style.height/2) +"px"
        this.body.style.imageRendering = "pixelated"

        this.body.style.outline = this.debug ? "1px solid yellow" : "none"
    }

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
                sprite.imReady()
            }
            sprite.texture.src = "assets/textures/"+ url;
        } else {
            sprite.texture = null
            if (sprite.size == null) {sprite.size = {x:0, y:0}}
            sprite.imReady()
        }
    }

    this.append = function(child) {
        sprite.children.push(child)
        child.setParent(sprite)
        child.render()
    }
    this.setParent = function(parent) {
        if (sprite.parent) {
            sprite.parent.children = sprite.parent.children.filter(element => element != sprite)
        }
        sprite.parent = parent
        parent.body.appendChild(this.body)
        sprite.render()
    }
    this.imReady = function() {
        sprite.ready = true
        sprite.render()
        console.log(options.texture +" ready, rendering children:")
        for (const child of sprite.children) {
            child.render()
            console.log("- "+ child.texture)
        }
    }

    if (options.texture != "canvas") { // Normal behaviour
        this.setTexture(options.texture)
        this.body = document.createElement("div")
    } else { // Special canvas behaviour
        this.body = document.createElement("canvas")
        this.body.width = this.size.x
        this.body.height = this.size.y
        sprite.imReady()
    }

    this.body.addEventListener("click", (event) => {
        event.stopPropagation()
        if (sprite.onClick) {
            sprite.onClick(event)
        }
    })
    this.setPos = function(pos) {
        this.pos = pos
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

    //this.render()
}