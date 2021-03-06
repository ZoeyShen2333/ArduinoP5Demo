/*
jshint esversion: 6
*/
let serial;
// Get port name from `p5.serialcontroller.exe`
const portName = 'COM4';
let heartRate;
let launchTime;
let sTime;
let value = 0;
let mode1, mode2;

// Constants
const pink = {
    r: 255,
    g: 192,
    b: 203
};
const violet = {
    r: 161,
    g: 4,
    b: 90
};
const rblue = {
    r: 20,
    g: 26,
    b: 112
};
const sblue = {
    r: 135,
    g: 206,
    b: 235
};
const kgreen = {
    r: 154,
    g: 205,
    b: 50
};
const lgreen = {
    r: 0,
    g: 100,
    b: 0
};
const yellow = {
    r: 255,
    g: 225,
    b: 0
};
const oranger = {
    r: 255,
    g: 69,
    b: 0
};
const orange = {
    r: 255,
    g: 165,
    b: 0
};
const red = {
    r: 255,
    g: 36,
    b: 0
};
const rRed = {
    r: 120,
    g: 0,
    b: 0
};
const dRed = {
    r: 194,
    g: 24,
    b: 7
};
const grey = {
    r: 66,
    g: 13,
    b: 9
};



// Setup only runs once 
function setup() {
    serial = new p5.SerialPort();
    serial.on('list', printList); // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen); // callback for the port opening
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.on('close', portClose);

    serial.list();
    serial.open(portName);

    createCanvas(windowWidth, windowHeight);
    background("#000000"); //ofBackground
    frameRate(30); //ofSetFrameRate

    launchTime = new Date();
    sTime = random(0.1, 3);

    mode1 = {
        x: random(0, 10000),
        y: random(0, 10000),
    };
    mode2 = {
        x: random(0, 10000),
        y: random(0, 10000),
    };
}

function serverConnected() {
    print('connected to server.');
}

function portOpen() {
    print('the serial port opened.')
}

function serialEvent() {
    heartRate = serial.read();
    print(`Read from sensor: ${heartRate}`);
    // TODO
    // value = heartRate * random(1.5, 2.0);
    value = heartRate;
}

function serialError(err) {
    print('Something went wrong with the serial port. ' + err);
}

function portClose() {
    print('The serial port closed.');
}

function printList(portList) {
    for (var i = 0; i < portList.length; i++) {
        print(i + " " + portList[i]);
    }
}

function drawCore(colorA, colorB, R) {
    for (let radius = R; radius >= 0; radius -= 5) {
        console.log(radius);
        const r = map(radius, 0, R, colorA.r, colorB.r); //ofMap
        const g = map(radius, 0, R, colorA.g, colorB.g); //ofMap
        const b = map(radius, 0, R, colorA.b, colorB.b); //ofMap
        strokeWeight(0.1);
        fill(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);

        beginShape(); //ofBeginShape
        for (let angle = 0; angle <= 380; angle += 10) {
            const elapsedTimeInSec = (new Date() - launchTime) / 1000;
            const time = sTime * elapsedTimeInSec * value * 0.02;
            const rad = radians(angle);

            const x = radius * cos(rad);
            const y = radius * sin(rad);

            const nx = x + map(noise(x + mode1.x * 0.05 + time * 0.01 + value, y * 0.2 + mode1.y * 0.03 + time * 0.04 + value, time * 0.9), 0, 1, -20, 20);
            const ny = y + map(noise(x + mode2.x * 0.03 + time * 0.05 + value, y * 0.1 + mode2.y * 0.07 + time * 0.03 + value, time * 0.7), 0, 1, -20, 20);

            curveVertex(nx, ny); //ofCurveVertex
        }
        endShape(); //ofEndShape
    }
}

// Draws in the browser
function draw() {
    // if (value <= 0) return;
    // value: heartRate
    R = value * 1.5;
    print(`pulse ${value}`);

    // Seems this affects the bg color
    fill('rgba(0, 0, 0, 10/256)'); //ofSetColor
    // noStroke();
    /**
     * width: @see http://p5js.org/reference/#/p5/width
     * height: @see http://p5js.org/reference/#/p5/height
     */
    rect(0, 0, width, height); //ofDrawRectangle
    translate(width / 2, height / 2); //ofTranslate

    if (value < 95) {
        // if (value >= 90 && value < 95) {
        drawCore(violet, pink, R);
    }

    if (value >= 95 && value < 100) {
        drawCore(violet, rblue, R);
    }

    if (value >= 100 && value < 105) {
        drawCore(rblue, sblue, R);
    }

    if (value >= 105 && value < 110) {
        drawCore(lgreen, kgreen, R);
    }

    if (value >= 110 && value < 115) {
        drawCore(oranger, yellow, R);
    }

    if (value >= 115 && value < 120) {
        drawCore(red, orange, R);
    }

    if (value >= 120 && value < 125) {
        drawCore(rRed, red, R);
    }

    if (value >= 125) {
        drawCore(grey, dRed, R);
    }
}

function keyPressed() {
    if (keyCode === 'UP_ARROW') {
        value = 92;
    }
    if (keyCode === 'DOWN_ARROW') {
        value = 97;
    }
    if (keyCode === 'LEFT_ARROW') {
        value = 102;
    }
    if (keyCode === 'RIGHT_ARROW') {
        value = 107;
    }
    if (keyCode === 'BACKSPACE') {
        value = 112;
    }
    if (keyCode === 'ENTER') {
        value = 117;
    }
    if (keyCode === 'SHIFT') {
        value = 122;
    }
    if (keyCode === 'CONTROL') {
        value = 127;
    }
}