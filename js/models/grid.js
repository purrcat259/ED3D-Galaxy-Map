import { GridHelper, Geometry, Vector3, LineSegments, FontUtils, ShapeGeometry } from 'three';

export default class Grid {
    constructor(galaxyMap) {
        this.galaxyMap = galaxyMap;
        this.scene = galaxyMap.scene;

        this.obj = null;
        this.size = null;

        this.textShapes = null;
        this.textGeo = null;

        this.coordText = null;

        this.minDistView = null;

        this.visible = true;
        this.fixed = false;
    }

    init(size, colour, minDistView) {
        this.size = size;

        this.obj = new GridHelper(1000000, size);
        this.obj.setColors(colour, colour);
        this.obj.minDistView = minDistView;
        this.obj.customUpdateCallback = this.addCoords;

        this.scene.add(this.obj);

        return this;
    }

    infos(step, colour, minDistView) {
        let size = 50000;
        step = step || 10000;
        this.fixed = true;

        // Add global grid

        let geometry = new Geometry();
        let material = this.galaxyMap.material.grid();

        for (let i = -size; i <= size; i += step) {
            geometry.vertices.push(new Vector3(-size, 0, i));
            geometry.vertices.push(new Vector3(size, 0, i));

            geometry.vertices.push(new Vector3(i, 0, -size));
            geometry.vertices.push(new Vector3(i, 0, size));
        }

        this.obj = new LineSegments(geometry, material);
        this.obj.position.set(0, 0, -20000);

        // Add quadrant
        let quadrant = new Geometry();
        material = this.galaxyMap.material.quadrant();

        quadrant.vertices.push(new Vector3(-size, 0, 20000));
        quadrant.vertices.push(new Vector3(size, 0, 20000));

        quadrant.vertices.push(new Vector3(0, 0, -size));
        quadrant.vertices.push(new Vector3(0, 0, size));

        let quadrantL = new LineSegments(quadrant, material);
        this.obj.add(quadrantL);

        // Add grid to scene
        this.scene.add(this.obj);

        return this;
    }

    addCoords() {
        let textShow = '0 : 0 : 0';
        let options = {
            font: 'helvetiker',
            weight: 'normal',
            style: 'normal',
            size: this.size / 20,
            curveSegments: 10
        };

        if (this.coordGrid) {
            if (Math.abs(camera.position.y - this.obj.position.y) > this.size * 10 ||
                Math.abs(camera.position.y - this.obj.position.y) < this.obj.minDistView) {
                this.coordGrid.visible = false;
                return;
            }
            this.coordGrid.visible = true;

            let posX = Math.ceil(controls.target.x / this.size) * this.size;
            let posY = this.obj.position.y;
            let posZ = Math.ceil(controls.target.z / this.size) * this.size;

            let textCoords = `${posX} : ${posY} : ${-posZ}`;

            //-- If same coords as previously, return.
            if (this.coordText === textCoords) {
                return;
            }
            this.coordText = textCoords;

            // Generate a new text shape

            this.textShapes = FontUtils.generateShapes(this.coordText, options);
            this.textGeo.dispose();
            this.textGeo = new ShapeGeometry(this.textShapes);

            let center = this.textGeo.center();
            this.coordGrid.position.set(
                center.x + posX - (this.size / 100),
                this.obj.position.y,
                center.z + posZ + (this.size / 30)
            );

            this.coordGrid.geometry = this.textGeo;
            this.coordGrid.geometry.needsUpdate = true;
        } else {
            this.textShapes = FontUtils.generateShapes(textShow, options);
            this.textGeo = new ShapeGeometry(this.textShapes);
            this.coordGrid = new Mesh(this.textGeo, this.galaxyMap.material.darkblue);
            this.coordGrid.position.set(this.obj.position.x, this.obj.position.y, this.obj.position.z);
            this.coordGrid.rotation.x = -Math.PI / 2;

            this.scene.add(this.coordGrid);
        }
    }

    toggleGrid() {
        this.visible = !this.visible;
        this.obj.visible = this.visible;
    }

    show() {
        if (!this.visible) {
            return;
        }
        this.obj.visible = true;
    }

    hide() {
        this.obj.visible = false;
    }
}
