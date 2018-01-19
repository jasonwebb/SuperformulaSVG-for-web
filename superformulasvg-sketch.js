var gui;

var paramLimits = {
    a: {
        min: .01,
        max: 8.0
    },
    b: {
        min: .01,
        max: 8.0
    },
    m: {
        min: .01,
        max: 20.0
    },
    n1: {
        min: .01,
        max: 40.0
    },
    n2: {
        min: .01,
        max: 40.0
    },
    n3: {
        min: .01,
        max: 40.0
    },
    iterations: {
        min: 1,
        max: 10
    },
    decay: {
        min: .05,
        max: .2
    }
}

var parameters = {
    a: {
        min: paramLimits.a.min,
        max: paramLimits.a.max
    },
    b: {
        min: paramLimits.b.min,
        max: paramLimits.b.max
    },
    m: {
        min: paramLimits.m.min,
        max: paramLimits.m.max
    },
    n1: {
        min: paramLimits.n1.min,
        max: paramLimits.n1.max
    },
    n2: {
        min: paramLimits.n2.min,
        max: paramLimits.n2.max
    },
    n3: {
        min: paramLimits.n3.min,
        max: paramLimits.n3.max
    },
    iterations: {
        min: paramLimits.iterations.min,
        max: paramLimits.iterations.max
    },
    decay: {
        min: paramLimits.decay.min,
        max: paramLimits.decay.max
    },
    invert: false,
    closePaths: false,
    rows: 1,
    columns: 1,
    resolution: 360
}

var controlFunctions = {
    generate: function() { generateForms(); },
    svg: function() { exportSVG(); },
    image: function() { exportImage(); }
};

//========================================================================================
// Main program
//========================================================================================
window.onload = function() {
    // Set up PaperJS
    var canvas = document.getElementById('superformula-canvas');
    paper.setup(canvas);

    // Present choice between 'tuning' and 'range' mode
    setupGUI();
    generateForms();   
}
//========================================================================================

function drawBackground() {
    paper.project.clear();

    var background = new paper.Path.Rectangle({
        point: [0, 0],
        size: [innerWidth, window.innerHeight]
    });
    background.sendToBack();

    if(parameters.invert) {
        background.fillColor = new paper.Color(0, 0, 0, .90);
    } else {
        background.fillColor = new paper.Color(0, 0, 0, .05);
    }
}

function setupGUI() {
    console.log('Setting up GUI');

    gui = new dat.GUI();
    gui.width = 300;
    
    var aFolder = gui.addFolder('a');
    var bFolder = gui.addFolder('b');
    var mFolder = gui.addFolder('m');
    var n1Folder = gui.addFolder('n1');
    var n2Folder = gui.addFolder('n2');
    var n3Folder = gui.addFolder('n3');
    var iterationsFolder = gui.addFolder('iterations');
    var decayFolder = gui.addFolder('decay');

    aFolder.add(parameters.a, 'min', paramLimits.a.min, paramLimits.a.max);
    aFolder.add(parameters.a, 'max', paramLimits.a.min, paramLimits.a.max);

    bFolder.add(parameters.b, 'min', paramLimits.b.min, paramLimits.b.max);
    bFolder.add(parameters.b, 'max', paramLimits.b.min, paramLimits.b.max);

    mFolder.add(parameters.m, 'min', paramLimits.m.min, paramLimits.m.max);
    mFolder.add(parameters.m, 'max', paramLimits.m.min, paramLimits.m.max);

    n1Folder.add(parameters.n1, 'min', paramLimits.n1.min, paramLimits.n1.max);
    n1Folder.add(parameters.n1, 'max', paramLimits.n1.min, paramLimits.n1.max);

    n2Folder.add(parameters.n2, 'min', paramLimits.n2.min, paramLimits.n2.max);
    n2Folder.add(parameters.n2, 'max', paramLimits.n2.min, paramLimits.n2.max);

    n3Folder.add(parameters.n3, 'min', paramLimits.n3.min, paramLimits.n3.max);
    n3Folder.add(parameters.n3, 'max', paramLimits.n3.min, paramLimits.n3.max);

    iterationsFolder.add(parameters.iterations, 'min', paramLimits.iterations.min, paramLimits.iterations.max).step(1);
    iterationsFolder.add(parameters.iterations, 'max', paramLimits.iterations.min, paramLimits.iterations.max).step(1);

    decayFolder.add(parameters.decay, 'min', paramLimits.decay.min, paramLimits.decay.max);
    decayFolder.add(parameters.decay, 'max', paramLimits.decay.min, paramLimits.decay.max);

    gui.add(parameters, 'invert', false).name('Invert colors').onChange(invertColors);
    gui.add(parameters, 'closePaths', false).name('Only show closed paths');

    gui.add(parameters, 'rows', 1, 5).name('Rows').step(1);
    gui.add(parameters, 'columns', 1, 8).name('Columns').step(1);

    gui.add(parameters, 'resolution', 360, 1080).name('Resolution').step(1);

    gui.add(controlFunctions, 'generate').name('Generate new forms');
    gui.add(controlFunctions, 'svg').name('Export SVG');
    gui.add(controlFunctions, 'image').name('Export image');
}

function generateForms() {
    console.log('Generating new forms');

    drawBackground();

    var cellWidth = window.innerWidth / parameters.columns;
    var cellHeight = window.innerHeight / parameters.rows;

    for(var i=1; i<=parameters.rows; i++) {
        for(var j=1; j<=parameters.columns; j++) {
            var params = {};
            params.a = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.b = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.m = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.n1 = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.n2 = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.n3 = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.iterations = parseInt(random(parameters.iterations.min, parameters.iterations.max));
            params.decay = parseFloat(random(parameters.decay.min, parameters.decay.max)).toFixed(2);

            var paths = [];

            for(k=params.iterations; k>0; k--) {
                paths.push(
                    getSuperformulaPath(
                        params.a - k*params.decay,
                        params.b - k*params.decay,
                        params.m, 
                        params.n1 - k*params.decay, 
                        params.n2 - k*params.decay, 
                        params.n3 - k*params.decay,
                        (cellWidth/2) * j,
                        (cellHeight/2) * i
                    )
                );
            }

            // Group, position, and scale all paths
            var group = new paper.Group(paths);

            // Scale to fit cell
            var bounds = group.strokeBounds;
            var scaleFactor;
            
            if(cellWidth < cellHeight) {
                scaleFactor = cellWidth/bounds.width;
            } else {
                scaleFactor = cellHeight/bounds.height;
            }
            
            group.scale(scaleFactor);
        }
    }
}

function getSuperformulaPath(a, b, m, n1, n2, n3, xOffset, yOffset) {
    var phi = (Math.PI*2) / parameters.resolution;

    var path = new paper.Path();

    if(parameters.invert) {
        path.strokeColor = new paper.Color(1, 1, 1, .80);
    } else {
        path.strokeColor = new paper.Color(0, 0, 0, .95);
    }
    

    for(var i=0; i<parameters.resolution; i++) {
        path.add(getSuperformulaPoint(phi*i, a, b, m, n1, n2, n3, xOffset, yOffset));
    }

    return path;
}

function getSuperformulaPoint(phi, a, b, m, n1, n2, n3, xOffset, yOffset) {
    var point = {};

    var r;
    var t1,t2;
    var radius;
  
    t1 = Math.cos(m * phi / 4) / a;
    t1 = Math.abs(t1);
    t1 = Math.pow(t1,n2);
  
    t2 = Math.sin(m * phi / 4) / b;
    t2 = Math.abs(t2);
    t2 = Math.pow(t2,n3);
  
    r = Math.pow(t1 + t2, 1/ n1);
    
    if(Math.abs(r) == 0) {
        point.x = 0;
        point.y = 0;
    } else {
        r = 1 / r;
        point.x = r * Math.cos(phi);
        point.y = r * Math.sin(phi);
    }

    point.x += xOffset;
    point.y += yOffset;

    return point;
}

function exportSVG() {
    console.log('exporting SVG');
    var svg = paper.project.exportSVG({asString: true});
    var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
    saveAs(blob, 'superformula.svg');
}

function exportImage() {
    console.log('exporting image');
}

// Small utility function to generate random within range, a la Processing
function random(min, max) {
    return Math.random() * (max-min) + min
}

function invertColors() {
    console.log('inverting colors');
}