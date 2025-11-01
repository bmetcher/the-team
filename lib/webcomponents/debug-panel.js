//panel responsible for displaying debug data for our tad application
class DebugPanel extends HTMLElement {
    #visible = false;
    constructor() {
        this.dom = {};
        this.dom.canvas = new PanelSection();
        this.dom.fps = new PanelSection();
        this.dom.text = new PanelSection();
        this.dom.camera = new PanelSection();
        this.dom.make = new PanelSection();
        this.dom.load = new PanelSection();
        this.dom.groups = new PanelSection();
    }
    get visible() {
        return this.#visible;
    }
    /**
     * @param {boolean} value
     */
    set visible(value) {
        //if the value is setting to true
        //we need to append a class 'tad_debug_visible' to our panel
        //if the value is setting to false
        //we need to remove that class
        this.#visible = value;
    }
    connectedCallback() {}

    /**
     *
     * @param {TeachAndDraw} tad
     */
    updateState(tad) {}

    #updateTad(tad) {
        const pkg = {
            w: tad.w,
            h: tad.h,
            paused: tad.paused,
        };

        //if pkg.w !== this.canvas.w
        //update
        //if pkg.h !== this.canvas.h.innerText
        //update
        //if pkg.paused !== this.canvas.paused.innerText
    }

    #updateFps(tad) {
        const pkg = {
            fps: tad.time.fps,
            target: tad.time.fpsTarget,
        };
        //current fps target
        //current fps reality
    }

    #updateShape(shape) {
        const pkg = {
            x: shape.alignment.x,
            y: shape.alignment.y,
            colour: shape.colour,
            border: shape.border, //this is another colour
            rotation: shape.rotation,
            rounding: shape.rounding,
        };
    }

    #updateText(text) {
        const pkg = {
            font: text.font,
            size: text.size,
            x: text.alignment.x,
            y: text.alignment.y,
        };
    }

    #updateCamera(camera) {
        const pkg = {
            x: camera.x,
            y: camera.y,
            zoom: camera.zoom,
            rotation: camera.rotation,
        };
        //things to display:
        //camera location, only shows once camera has been used once
    }

    #updateMake(make) {
        const pkg = {
            groups: make.groupCount,
            boxColliders: make.boxColliderCount,
            circleColliders: make.circleColliderCount,
        };
        //things to display:
        //how much of each thing has been made
        //only shows once make has been used once
    }

    #updateLoad(load) {
        const pkg = {
            text: textFileCount,
            json: jsonFileCount,
            sound: soundFileCount,
            images: imageFileCount,
            animations: animationFileCount,
        };
    }

    #updateGroups(groups) {
        const pkg = {
            groups:[
                /*each group will have
                    {
                        name:group.name || null,
                        type:group.type || null,
                        size:group.length || 0
                    }
                */
            ]
        }
    }
}

// a section has a title and various properties it displays, if a property is changed to a value that does not match the current value internally then the html rendered needs to update
class PanelSection extends HTMLElement {
    constructor() {}
    connectedCallback() {}
    render() {} //reconstructs the html
}
