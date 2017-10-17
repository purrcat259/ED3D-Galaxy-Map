import { MeshBasicMaterial, MeshPhongMaterial } from 'three';

export default class Material {
    static trd() {
        return new THREE.MeshBasicMaterial({ color: 0xffffff });
    }

    static line() {
        return new THREE.LineBasicMaterial({ color: 0xcccccc });
    }

    static white() {
        return new THREE.MeshBasicMaterial({ color: 0xffffff });
    }

    static orange() {
        return new THREE.MeshBasicMaterial({ color: 0xFF9D00 });
    }

    static black() {
        return new THREE.MeshBasicMaterial({ color: 0x010101 });
    }

    static lightblue() {
        return new THREE.MeshBasicMaterial({ color: 0x0E7F88 });
    }

    static darkblue() {
        return new THREE.MeshBasicMaterial({ color: 0x16292B });
    }

    static selected() {
        return new THREE.MeshPhongMaterial({ color: 0x0DFFFF });
    }

    static grey() {
        return new THREE.MeshPhongMaterial({ color: 0x7EA0A0 });
    }

    static transparent() {
        return new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0
        });
    }

    static particle() {
        return new THREE.PointsMaterial({
            color: 0xeeeeee,
            size: 2
        });
    }
}
