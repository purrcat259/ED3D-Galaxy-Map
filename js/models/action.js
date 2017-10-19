import { Vector3, Raycaster } from 'three';

export default class Action {
    constructor(galaxyMap) {
        this.galaxyMap = galaxyMap;

        this.cursorSel = null;
        this.cursorHover = null;
        this.cursorScale = 1;

        this.cursor = {
            selection: null,
            hover: null
        };

        this.mouseVector = new Vector3();
        this.raycaster = new Raycaster();;
        this.oldSel = null;
        this.objHover = null;
        this.mouseUpDownTimer = null;
        this.mouseHoverTimer = null;
        this.animPosition = null;

        this.prevScale = null;

        this.pointCastRadius = 2;
        this.pointsHighlight = [];
    }

    init() {
        let self = this;
        container.addEventListener('mousedown', (e) => {
            self.onMouseDown(e, obj);
        }, false);
        container.addEventListener('mouseup', (e) => {
            self.onMouseUp(e, obj);
        }, false);
        container.addEventListener('mousemove', (e) => {
            self.onMouseHover(e, obj);
        }, false);

        // Stop scrolling
        container.addEventListener('mousewheel', this.stopWinScroll, false );
        container.addEventListener('DOMMouseScroll', this.stopWinScroll, false ); // FF
    }

    /**
     * Stop window scroll when mouse on scene
     */
    stopWinScroll(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Update point click radius: increase radius with distance
    updatePointClickRadius(radius) {
        radius = Math.round(radius);
        radius = radius < 2 ? 2 : radius;
        if (this.pointCastRadius !== radius) {
            this.pointCastRadius = radius;
        }
    }

    // Update particle size on zooming
    updateSizeOnScroll(scale) {
        let system = this.galaxyMap.system;
        let systemParticle = system.particle;

        if (!systemParticle || scale <= 0) {
            return;
        }

        // TODO: Move to object
        let minScale = this.galaxyMap.effectScaleSystem[0];
        let maxScale = this.galaxyMap.effectScaleSystem[1];
        let newScale = scale * 20;

        if (this.prevScale === newScale) {
            return;
        }
        this.prevScale = newScale;
        newScale = newScale > maxScale ? maxScale : newScale;
        newScale = newScale < minScale ? minScale : newScale;

        system.particle.material.size = newScale;
        system.scaleSize = newScale;
    }

    // Highlight selection around camera target
    highlightAroundCamera(obj) {
        let newSelection = [];
        let limit = 50;
        let count = 0;

        let camera = this.galaxyMap.camera;
        let scene = this.galaxyMap.scene;

        let raycaster = new Raycaster(camera.position, camera.position);
        raycaster.params.Points.threshold = 100;

        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects && intersects.length) {
            // Highlight new selection
            for (let i = 0; i < intersects.length; i++) {
                if (count > limit) {
                    return;
                }
                let intersection = intersects[i];
                if (intersection.object.clickable) {
                    let indexPoint = intersection.index;
                    let selPoint = intersection.object.geometry.vertices[indexPoint];

                    if (selPoint.visible) {
                        let textAdd = selPoint.name;
                        let textId = `highlight_${indexPoint}`;
                        if (obj.pointsHighlight.indexOf(textId) === -1) {
                            // HUD.addText(textId,  textAdd, 0, 4, 0, 1, selPoint, true);
                            obj.pointsHighlight.push(textId);
                        }
                        newSel[textId] = textId;
                    }
                    count++;
                }
            }
        }

        let system = this.galaxyMap.system;

        // Remove old selection
        for (let key in obj.pointsHighlight) {
            if (obj.pointsHighlight.hasOwnProperty(key)) {
                item = obj.pointsHighlight[key];
                if (newSel[item]) {
                    let object = this.galaxyMap.textSel[item];
                    if (object) {
                        scene.remove(object);
                        this.galaxyMap.textSel.splice(item, 1);
                        obj.pointsHighlight.splice(key, 1);
                    }
                }
            }
        }
    }

    onMouseHover(e, obj) {
        e.preventDefault();
        
    }
}
