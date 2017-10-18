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
        // TODO: Needs System class
    }
}
