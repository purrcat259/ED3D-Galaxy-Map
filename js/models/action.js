import { Vector3, Raycaster, Object3D, Mest, TorusGeometry, CylinderGeometry } from 'three';
import TWEEN from '@tweenjs/tween.js';


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
        let renderer = this.galaxyMap.renderer;
        let scene = this.galaxyMap.scene;
        let camera = this.galaxyMap.camera;
        let mapEl = this.galaxyMap.mapElement;
        let action = this.galaxyMap.action;

        e.preventDefault();
        let position = {
            top: mapEl.offsetTop,
            left: mapEl.offsetLeft
        };
        let scrollPos = document.scrollTop;
        position.top = -= scrollPos;

        obj.mouseVector = new Vector3(
            ( ( e.clientX - position.left ) / renderer.domElement.width ) * 2 - 1,
            - ( ( e.clientY - position.top ) / renderer.domElement.height ) * 2 + 1,
            1);

        obj.mouseVector.unproject(camera);
        obj.raycaster = new Raycaster(
            camera.position,
            obj.mouseVector.sub(camera.position).normalize()
        );
        obj.raycaster.params.Points.threshold = obj.pointCastRadius;

        // create an array containing all objects in the scene with which the ray intersects

        let intersects = obj.raycaster.intersectObjects(scene.children);
        if (intersects && intersects.length) {
            for (let i = 0; i < intersects.length; i++) {
                let intersection = intersects[i];
                if (intersection.object.clickable) {
                    let indexPoint = intersection.index;
                    let selPoint = intersection.object.geometry.vertices[indexPoint];

                    if (selPoint.visible) {
                        action.hoverOnObj(indexPoint);
                        return;
                    }
                }
            }
        } else {
            action.outOnObj();
        }
    }

    hoverOnObj(indexPoint) {
        let system = this.galaxyMap.system;
        if (this.objHover === indexPoint) {
            return;
        }
        this.outOnObj();
        this.objHover = indexPoint;

        let sel = system.particleGeo.vertices[indexPoint];
        this.addCursorOnHover(sel);
    }

    outOnObj() {
        let system = this.galaxyMap.system;
        if (!this.objHover && !system.particleGeo.vertices[this.objHover]) {
            return;
        }
        this.objHover = null;
        this.cursor.hover.visible = false;
    }

    onMouseDown(e, obj) {
        obj.mouseUpDownTimer = Date.now();
    }

    onMouseUp(e, obj) {
        e.preventDefault();

        // If long clicking, don't do anything
        // let difference = (Date.now() - obj.mouseUpDownTimer) / 1000;
        // if (difference > 0.2) {
        //     obj.mouseUpDownTimer = null;
        //     return;
        // }
        obj.mouseUpDownTimer = null;

        // Raycast object
        let mapEl = this.galaxyMap.mapElement;
        let camera = this.galaxyMap.camera;
        let position = {
            top: mapEl.offsetTop,
            left: mapEl.offsetLeft
        };
        let scrollPos = document.scrollTop;
        position.top = -= scrollPos;

        obj.mouseVector = new Vector3(
            ( ( e.clientX - position.left ) / renderer.domElement.width ) * 2 - 1,
            - ( ( e.clientY - position.top ) / renderer.domElement.height ) * 2 + 1,
        1);

        obj.mouseVector.unproject(camera);
        obj.raycaster = new Raycaster(
            camera.position,
            obj.mouseVector.sub(camera.position).normalize()
        );
        obj.raycaster.params.Points.threshold = obj.pointCastRadius;

        // create an array containing all objects in the scene with which the ray intersects
        let intersects = obj.raycaster.intersectObjects(scene.children);
        if (intersects && intersects,length) {
            for (let i = 0; i < intersects.length; i++) {
                let intersection = intersects[i];
                if (intersection.object.clickable) {
                    let indexPoint = intersection.index;
                    let selPoint = intersection.object.geometry.vertices[indexPoint];

                    if (selPoint.visible) {
                        console.log(selPoint.name);
                        let isMove = obj.moveToObj(indexPoint, selPoint);
                        let opt = [selPoint.name];
                        let optInfos = selPoint.infos || null;
                        let optUrl   = selPoint.url || null;

                        let event = document.createEvent('systemClick');
                        event.initCustomEvent('click', true, true, [selPoint.name, optInfos, optUrl]);
                        document.dispatchEvent(event);
                        if (isMove) {
                            return;
                        }
                    }
                }

                if (intersection.object.showCoord) {
                    console.log(Math.round(intersection.point.x)+' , '+Math.round(-intersection.point.z));
                }
            }
        }
        obj.disableSelection();
    }

    disableSelection() {
        if (!this.cursor.selection) {
            return;
        }
        this.oldSel = null;
        this.cursor.selection.visible = false;
    }

    moveInitalPositionNoAnim(timer) {
        let camera = this.galaxyMap.camera;
        let controls = this.galaxyMap.controls;

        let cam = [
            this.galaxyMap.playerPos[0],
            this.galaxyMap.playerPos[1] + 500,
            -this.galaxyMap.playerPos[2] + 500,
        ];
        if (this.galaxyMap.cameraPos) {
            cam = [
                this.galaxyMap.cameraPos[0],
                this.galaxyMap.cameraPos[1],
                -this.galaxyMap.cameraPos[2]
            ];
        }

        let moveTo = {
            x: cam[0],
            y: cam[1],
            z: cam[2],
            mx: this.galaxyMap.playerPos[0],
            my: this.galaxyMap.playerPos[1],
            mz: -this.galaxyMap.playerPos[2]
        };

        camera.position.set(moveTo.x, moveTo.y, moveTo.z);
        controls.target.set(moveTo.mx, moveTo.my, moveTo.mz);
    }

    moveInitalPosition(timer) {
        let camera = this.galaxyMap.camera;
        let controls = this.galaxyMap.controls;

        timer = timer || 800;

        this.disableSelection();

        // Move to inital position
        let moveFrom = {
            x: camera.position.x,
            y: camera.position.y ,
            z: camera.position.z,
            mx: controls.target.x,
            my: controls.target.y ,
            mz: controls.target.z
        };

        // Move to player position if defined, else move to Sol
        let cam = [
            this.galaxyMap.playerPos[0],
            this.galaxyMap.playerPos[1] + 500,
            -this.galaxyMap.playerPos[2] + 500,
        ];
        if (this.galaxyMap.cameraPos) {
            cam = [
                this.galaxyMap.cameraPos[0],
                this.galaxyMap.cameraPos[1],
                -this.galaxyMap.cameraPos[2]
            ];
        }

        let moveTo = {
            x: cam[0],
            y: cam[1],
            z: cam[2],
            mx: this.galaxyMap.playerPos[0],
            my: this.galaxyMap.playerPos[1],
            mz: -this.galaxyMap.playerPos[2]
        };

        controls.enabled = false;
        // Remove previous anim
        TWEEN.removeAll();

        // Launch anim
        let tween = new TWEEN.Tween(moveFrom, {override:true}).to(moveTo, timer)
            .start()
            .onUpdate(() => {
                camera.position.set(moveFrom.x, moveFrom.y, moveFrom.z);
                controls.target.set(moveFrom.mx, moveFrom.my, moveFrom.mz);
            })
            .onComplete(() => {
                controls.enabled = true;
                controls.update();
            });
    }

    moveToObj(index, obj) {
        let camera = this.galaxyMap.camera;
        let controls = this.galaxyMap.controls;

        if (this.oldSel && this.oldSel === index) {
            return false;
        }

        controls.enabled = false;

        // HUD.setInfoPanel(index, obj);
        //
        // if(obj.infos != undefined) HUD.openHudDetails();

        this.oldSel = index;
        let goX = obj.x;
        let goY = obj.y;
        let goZ = obj.z;

        this.moveGridTo(goX, goY, goZ);

        let moveFrom = {
            x: camera.position.x,
            y: camera.position.y ,
            z: camera.position.z,
            mx: controls.target.x,
            my: controls.target.y ,
            mz: controls.target.z
        };

        let moveCoords = {
            x: goX,
            y: goY + 15,
            z: goZ + 15,
            mx: goX,
            my: goY,
            mz: goZ
        };

        let tween = new TWEEN.Tween(moveFrom, {override:true}).to(moveCoords, timer)
            .start()
            .onUpdate(() => {
                camera.position.set(moveFrom.x, moveFrom.y, moveFrom.z);
                controls.target.set(moveFrom.mx, moveFrom.my, moveFrom.mz);
            })
            .onComplete(() => {
                controls.update();
            });

        // 3D Cursor on selected object

        obj.material = this.galaxyMap.material.selected();

        this.addCursorOnSelect(goX, goY, goZ);

        // Add text

        let textAdd = obj.name;
        let textAddC = Math.round(goX) + ', ' + Math.round(goY) + ', ' + Math.round(-goZ);

        controls.enabled = true;
        return true;
    }

    // Create a cursor on the selected system
    addCursorOnSelect(x, y, z) {
        let scene = this.galaxyMap.scene;

        if (!this.cursor.selection) {
            this.cursor.selection = new Object3D();
            // Ring around the system
            let geometryL = new TorusGeometry(8, 0.4, 3, 20);
            let selection = new Mesh(geometryL, this.galaxyMap.material.selected());
            selection.rotation.x = Math.PI / 2;

            this.cursor.selection.add(selection);

            // Create a cone on the selection
            let geometryCone = new CylinderGeometry(0, 5, 16, 4, 1, false);
            let cone = new Mesh(geometryCone, this.galaxyMap.material.selected());
            cone.position.set(0, 20, 0);
            cone.rotation.x = Math.PI;
            this.cursor.selection.add(cone);

            // Inner Cone
            let geometryConeInner = new CylinderGeometry(0, 3.6, 16, 4, 1, false);
            let coneInner = new Mesh(geometryConeInner, this.galaxyMap.material.black());
            coneInner.position.set(0, 20.2, 0);
            coneInner.rotation.x = Math.PI;
            this.cursor.selection.add(coneInner);

            scene.add(this.cursor.selection);
        }

        this.cursor.selection.visible = true;
        this.cursor.selection.position.set(x, y, z);
        this.cursor.hover.scale.set(this.cursorScale, this.cursorScale, this.cursorScale);
    }

    addCursorOnHover(obj) {
        if (!this.cursor.hover) {
            this.cursor.hover = new Object3D();

            // Ring around the system
            let geometryL = new TorusGeometry( 6, 0.4, 3, 20 );

            let selection = new Mesh(geometryL, this.galaxyMap.material.grey());
            selection.rotation.x = Math.PI / 2;

            this.cursor.hover.add(selection);

            scene.add(this.cursor.hover);
        }

        this.cursor.hover.position.set(obj.x, obj.y, obj.z);
        this.cursor.hover.visible = true;
        this.cursor.hover.scale.set(this.cursorScale, this.cursorScale, this.cursorScale);
    }

    // Update cursor size with camera distance
    updateCursorSize(scale) {
        let self = this;
        for (let key in this.cursor) {
            if (this.cursor.hasOwnProperty(key)) {
                let item = this.cursor[key];
                if (item) {
                    item.scale.set(scale, scale, scale);
                }
            }
        }

        this.cursorScale = scale;
    }

    moveGridTo(goX, goY, goZ) {
        let posX = Math.floor(goX / 1000) * 1000;
        let posY = Math.floor(goY);
        let posZ = Math.floor(goZ / 1000) * 1000;

        if(!this.galaxyMap.grid1H.fixed) {
            this.galaxyMap.grid1H.obj.position.set(posX, posY, posZ);
        }
        if(!this.galaxyMap.grid1K.fixed) {
            this.galaxyMap.grid1K.obj.position.set(posX, posY, posZ);
        }
        if(!this.galaxyMap.grid1XL.fixed) {
            this.galaxyMap.grid1XL.obj.position.set(posX, posY, posZ);
        }
    }
}
