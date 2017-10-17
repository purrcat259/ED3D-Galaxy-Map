export default class Loader {
    constructor() {
        this.animCount = null;
        this.svgAnim = '<div id="loadInfos"></div><div id="loadTimer">.</div><svg width="100" height="100" viewbox="0 0 40 40"><path d="m5,8l5,8l5,-8z"   class="l1 d1" /><path d="m5,8l5,-8l5,8z"   class="l1 d2" /><path d="m10,0l5,8l5,-8z"  class="l1 d3" /><path d="m15,8l5,-8l5,8z"  class="l1 d4" /><path d="m20,0l5,8l5,-8z"  class="l1 d5" /><path d="m25,8l5,-8l5,8z"  class="l1 d6" /><path d="m25,8l5,8l5,-8z"  class="l1 d7" /><path d="m30,16l5,-8l5,8z" class="l1 d8" /><path d="m30,16l5,8l5,-8z" class="l1 d9" /><path d="m25,24l5,-8l5,8z" class="l1 d10" /><path d="m25,24l5,8l5,-8z" class="l1 d11" /><path d="m20,32l5,-8l5,8z" class="l1 d13" /><path d="m15,24l5,8l5,-8z" class="l1 d14" /><path d="m10,32l5,-8l5,8z" class="l1 d15" /><path d="m5,24l5,8l5,-8z"  class="l1 d16" /><path d="m5,24l5,-8l5,8z"  class="l1 d17" /><path d="m0,16l5,8l5,-8z"  class="l1 d18" /><path d="m0,16l5,-8l5,8z"  class="l1 d19" /><path d="m10,16l5,-8l5,8z" class="l2 d0" /><path d="m15,8l5,8l5,-8z"  class="l2 d3" /><path d="m20,16l5,-8l5,8z" class="l2 d6"  /><path d="m20,16l5,8l5,-8z" class="l2 d9" /><path d="m15,24l5,-8l5,8z" class="l2 d12" /><path d="m10,16l5,8l5,-8z" class="l2 d15" /></svg>';
    }

    // Start the loader
    start() {
        let existingLoaderElement = document.getElementById('loader');
        if (existingLoaderElement) {
            loaderElement.parent.removeChild(loaderElement);
        }
        let newLoaderElement = this.createLoaderElement();
        documet.getElementById('ed3dmap').appendChild(newLoaderElement);
        clearInterval(this.animCount);
        this.animCount = setInterval(() => {
            let animationProgressElement = document.getElementById('loadTimer');
            animationProgressElement.innerText += '.';
            if (animationProgressElement.innerText !== undefined && animationProgressElement.innerText.length > 10) {
                animationProgressElement.innerText = '.';
            }
        }, 1000);
    }

    // Create the element for a loader
    // TODO: Move loader CSS to a CSS class
    createLoaderElement() {
        let loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = this.svgAnim;
        loader.style.color = 'rgb(200, 110, 37)';
        loader.style.fontSize = '1.5rem';
        loader.style.fontFamily = 'Helvetica';
        loader.style.fontVariant = 'small-caps';
        return loader;
    }

    // Update the information show on the loader
    update(info) {
        let loaderInfoElement = document.getElementById('loadInfos');
        loaderInfoElement.innerText = info;
    }

    // Stop the loader and remove it from the DOM
    stop() {
        let existingLoaderElement = document.getElementById('loader');
        if (existingLoaderElement) {
            loaderElement.parent.removeChild(loaderElement);
        }
        clearInterval(this.animCount);
    }
}
