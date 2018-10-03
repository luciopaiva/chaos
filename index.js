
const TAU = 2 * Math.PI;

function readCssVar(varName) {
    varName = varName.startsWith("--") ? varName : "--" + varName;
    return window.getComputedStyle(document.documentElement).getPropertyValue(varName);
}

function readCssVarAsNumber(varName) {
    return parseInt(readCssVar(varName), 10);
}

class Tracker {

    constructor (trackerLayer, bases, context, color, size) {
        this.tracker = document.createElement("div");
        this.tracker.classList.add("tracker");
        trackerLayer.appendChild(this.tracker);
        this.bases = bases;
        this.context = context;
        this.color = color;
        this.radius = Math.floor(size / 2);

        [this.trackerX, this.trackerY] = this.bases[Math.floor(Math.random() * this.bases.length)];
        this.setTrackerPosition(this.trackerX, this.trackerY);
    }

    setTrackerPosition(x, y) {
        this.tracker.style.transform = `translate(${x}px, ${y}px)`;
    }

    update() {
        // mark current position
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.trackerX, this.trackerY, this.radius, 0, TAU, false);
        this.context.fill();

        const chosenBase = this.bases[Math.floor(Math.random() * this.bases.length)];
        this.trackerX = Math.floor((chosenBase[0] + this.trackerX) / 2);
        this.trackerY = Math.floor((chosenBase[1] + this.trackerY) / 2);
        this.setTrackerPosition(this.trackerX, this.trackerY);
    }
}

class Chaos {

    constructor () {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = 800;
        this.canvas.height = 600;

        const TRIANGLE = [[400, 10], [10, 590], [790, 590]];
        const SQUARE = [[10, 10], [10, 590], [790, 590], [790, 10]];
        this.bases = TRIANGLE;

        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = readCssVar("background-color");
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = readCssVar("tracker-color");

        this.trackerLayer = document.getElementById("tracker-layer");
        const trackerColor = readCssVar("tracker-color");
        const trackerSize = readCssVarAsNumber("tracker-size");
        this.trackers = Array.from(Array(readCssVarAsNumber("number-of-trackers")),
            () => new Tracker(this.trackerLayer, this.bases, this.context, trackerColor, trackerSize));

        // this.tracker = document.getElementById("tracker");

        // set initial tracker position

        this.updateInterval = readCssVarAsNumber("interval");
        this.update();
    }

    update() {
        setTimeout(() => {
            this.trackers.forEach(tracker => tracker.update());
            this.update();
        }, this.updateInterval);
    }
}

new Chaos();
