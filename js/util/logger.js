export default class Logger {
    constructor(level) {
        this.level = level || 1;
    }

    log(message) {
        switch(this.level) {
            case 1:
                console.log(message);
                break;
        }
    }
}
