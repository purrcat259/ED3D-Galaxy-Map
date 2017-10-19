import { MeshBasicMaterial, MeshPhongMaterial, LineBasicMaterial, AdditiveBlending, PointsMaterial } from 'three';

export default class Material {
    static trd() {
        return new MeshBasicMaterial({ color: 0xffffff });
    }

    static line() {
        return new LineBasicMaterial({ color: 0xcccccc });
    }

    static white() {
        return new MeshBasicMaterial({ color: 0xffffff });
    }

    static orange() {
        return new MeshBasicMaterial({ color: 0xFF9D00 });
    }

    static black() {
        return new MeshBasicMaterial({ color: 0x010101 });
    }

    static lightblue() {
        return new MeshBasicMaterial({ color: 0x0E7F88 });
    }

    static darkblue() {
        return new MeshBasicMaterial({ color: 0x16292B });
    }

    static selected() {
        return new MeshPhongMaterial({ color: 0x0DFFFF });
    }

    static grey() {
        return new MeshPhongMaterial({ color: 0x7EA0A0 });
    }

    static transparent() {
        return new MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0
        });
    }

    static particle() {
        return new PointsMaterial({
            color: 0xeeeeee,
            size: 2
        });
    }

    static grid() {
        return new LineBasicMaterial({
            color: 0x555555,
            transparent: true,
            opacity: 0.2,
            blending: AdditiveBlending,
            depthWrite: false
        });
    }

    static quadrant() {
        return new LineBasicMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.5,
            blending: AdditiveBlending,
            depthWrite: false
        });
    }
}
