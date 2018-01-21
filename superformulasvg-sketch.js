var gui;
var mMinSlider, mMaxSlider;

var paramLimits = {
    a: {
        min: 1,
        max: 8.0
    },
    b: {
        min: 1,
        max: 8.0
    },
    m: {
        min: 1,
        max: 20.0
    },
    n1: {
        min: 1.0,
        max: 20.0
    },
    n2: {
        min: 1.0,
        max: 20.0
    },
    n3: {
        min: 1.0,
        max: 20.0
    },
    iterations: {
        min: 1,
        max: 20
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
    closePaths: true,
    rows: 1,
    columns: 1,
    resolution: 360
}

var parametersTuning = {
    tuning: {
        a: parseFloat(random(paramLimits.a.min, paramLimits.a.max)).toFixed(2),
        b: parseFloat(random(paramLimits.b.min, paramLimits.b.max)).toFixed(2),
        m: 3,
        n1: parseFloat(random(paramLimits.n1.min, paramLimits.n1.max)).toFixed(2),
        n2: parseFloat(random(paramLimits.n2.min, paramLimits.n2.max)).toFixed(2),
        n3: parseFloat(random(paramLimits.n3.min, paramLimits.n3.max)).toFixed(2),
        iterations: parseInt(random(paramLimits.iterations.min, paramLimits.iterations.max)),
        decay: parseFloat(random(paramLimits.decay.min, paramLimits.decay.max)).toFixed(2),
        invert: false,
        closePaths: true,
        resolution: 360
    },
    range: {

    }
}

var controlFunctions = {
    generate: function() { generateForms(); },
    svg: function() { exportSVG(); },
    image: function() { exportImage(); }
};

var canvas;
var backgroundLayer, gridLayer, superformulaLayers;
var darkBackgroundColor, lightBackgroundColor;
var darkStrokeColor, lightStrokeColor;
var darkGridColor, lightGridColor;

var largestRadius;

//========================================================================================
//  MAIN FUNCTIONALITY
//========================================================================================
window.onload = function() {
    // Set up PaperJS
    canvas = document.getElementById('superformula-canvas');
    paper.setup(canvas);

    // Present choice between 'tuning' and 'range' mode

    // Now that PaperJS scope is set up, we can use it to define global colors
    darkBackgroundColor = new paper.Color(0, 0, 0, .9);
    lightBackgroundColor = new paper.Color(0, 0, 0, .05);

    darkStrokeColor = new paper.Color(1, 1, 1, .80);
    lightStrokeColor = new paper.Color(0, 0, 0, .80);

    darkGridColor = new paper.Color(1, 1, 1, .1);
    lightGridColor = new paper.Color(0, 0, 0, .1);

    setupGUI();
    generateForms();
}

//========================================================================================
//  BACKGROUND DRAWING FUNCTIONS
//========================================================================================
function drawBackground() {
    var background = new paper.Path.Rectangle({
        point: [0, 0],
        size: [innerWidth, window.innerHeight]
    });
    background.sendToBack();

    if(parameters.invert) {
        background.fillColor = darkBackgroundColor;
    } else {
        background.fillColor = lightBackgroundColor;
    }

    backgroundLayer = new paper.Layer(background);
}

// Draw row and column divider lines
function drawGrid() {
    var gridLines = [];

    for(var i=1; i<parameters.rows; i++) {
        var rowLine = paper.Path.Line(
            new paper.Point(0, i*(window.innerHeight/parameters.rows)),
            new paper.Point(window.innerWidth, i*(window.innerHeight/parameters.rows))
        );

        if(parameters.invert) {
            rowLine.strokeColor = darkGridColor;
        } else {
            rowLine.strokeColor = lightGridColor;
        }

        gridLines.push(rowLine);
    }

    for(var i=1; i<parameters.columns; i++) {
        var columnLine = paper.Path.Line(
            new paper.Point(i*(window.innerWidth/parameters.columns), 0),
            new paper.Point(i*(window.innerWidth/parameters.columns), window.innerHeight)
        );

        if(parameters.invert) {
            columnLine.strokeColor = darkGridColor;
        } else {
            columnLine.strokeColor = lightGridColor;
        }

        gridLines.push(columnLine);
    }

    gridLayer = new paper.Layer(gridLines);
}


//========================================================================================
//  GUI
//========================================================================================
function setupGUI() {
    gui = new dat.GUI();
    gui.width = 350;
    
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

    mMinSlider = mFolder.add(parameters.m, 'min', paramLimits.m.min, paramLimits.m.max);
    mMaxSlider = mFolder.add(parameters.m, 'max', paramLimits.m.min, paramLimits.m.max);

    if(parameters.closePaths) {
        mMinSlider.step(2);
        mMaxSlider.step(2);
    }

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
    gui.add(parameters, 'closePaths', false).name('Only allow closed paths').onChange(closePaths);

    gui.add(parameters, 'rows', 1, 5).name('Rows').step(1);
    gui.add(parameters, 'columns', 1, 8).name('Columns').step(1);

    gui.add(parameters, 'resolution', 360, 1080).name('Resolution').step(1);

    gui.add(controlFunctions, 'generate').name('Generate new forms');
    gui.add(controlFunctions, 'svg').name('Export SVG');
    gui.add(controlFunctions, 'image').name('Export image');
}


//========================================================================================
//  SUPERFORMULA FUNCTIONS
//========================================================================================
function generateForms() {
    paper.project.clear();
    drawBackground();
    drawGrid();

    var cellWidth = window.innerWidth / parameters.columns;
    var cellHeight = window.innerHeight / parameters.rows;
    var smallestDimension;
    var allPaths = [];

    // Find the smallest dimension for scaling later
    if(cellWidth < cellHeight) {
        smallestDimension = cellWidth;
    } else {
        smallestDimension = cellHeight;
    }

    // For each row/column cell ...
    for(var i=0; i<parameters.rows; i++) {
        for(var j=0; j<parameters.columns; j++) {
            var params = {};
            params.a = parseFloat(random(parameters.a.min, parameters.a.max)).toFixed(2);
            params.b = parseFloat(random(parameters.b.min, parameters.b.max)).toFixed(2);

            // To ensure paths are closed, only allow even integers
            if(parameters.closePaths) {
                params.m = parseInt(random(parameters.m.min, parameters.m.max));

                if(params.m % 2 != 0) {
                    if(params.m + 1 >= paramLimits.m.max) {
                        params.m--;
                    } else {
                        params.m++;
                    }
                }
            } else {
                params.m = parseFloat(random(parameters.m.min, parameters.m.max)).toFixed(2);
            }

            params.n1 = parseFloat(random(parameters.n1.min, parameters.n1.max)).toFixed(2);
            params.n2 = parseFloat(random(parameters.n2.min, parameters.n2.max)).toFixed(2);
            params.n3 = parseFloat(random(parameters.n3.min, parameters.n3.max)).toFixed(2);
            params.iterations = parseInt(random(parameters.iterations.min, parameters.iterations.max));
            params.decay = parseFloat(random(parameters.decay.min, parameters.decay.max)).toFixed(2);

            largestRadius = 0;

            // Generate the superformula shape, with any iterations
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
                        j * (window.innerWidth / parameters.columns) + (window.innerWidth / parameters.columns/2),
                        i * (window.innerHeight / parameters.rows) + (window.innerHeight / parameters.rows/2)
                    )
                );
            }

            // Combine all iterations into a Group
            var group = new paper.Group(paths);

            // Scale Group to fit cell
            var bounds = group.strokeBounds;
            var scaleFactor;
            
            if(bounds.width < bounds.height) {
                scaleFactor = (cellHeight * .75) / (largestRadius * 2);
            } else {
                scaleFactor = (cellWidth * .75) / (largestRadius * 2);
            }
            
            group.scale(scaleFactor);

            // Add Group to broader path collection for layer grouping later
            allPaths.push(group);
        }
    }

    // Add all superformula forms to a new layer
    superformulaLayers = new paper.Layer(allPaths);

    paper.view.draw();
}

// Generate one complete path comprised of points located using superformula
function getSuperformulaPath(a, b, m, n1, n2, n3, xOffset, yOffset) {
    var phi = (Math.PI*2) / parameters.resolution;

    var path = new paper.Path();

    if(parameters.invert) {
        path.strokeColor = darkStrokeColor;
    } else {
        path.strokeColor = lightStrokeColor;
    }
    
    for(var i=0; i<=parameters.resolution; i++) {
        path.add(getSuperformulaPoint(phi*i, a, b, m, n1, n2, n3, xOffset, yOffset));
    }

    return path;
}

// Calculate the x,y position of a single point for a given angle (phi)
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

    radius = Math.sqrt(point.x * point.x + point.y * point.y);

    if(radius > largestRadius) {
        largestRadius = radius;
    }

    point.x += xOffset;
    point.y += yOffset;

    return point;
}


//========================================================================================
//  INTERFACE FUNCTIONS
//========================================================================================

// Export current canvas to SVG file using FileSaver.js
function exportSVG() {
    var svg = paper.project.exportSVG({asString: true});
    var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
    saveAs(blob, 'superformula.svg');
}

// Export raster image of current canvas
function exportImage() {
    paper.view.element.toBlob(function(blob) { saveAs(blob, 'superformula.png'); });
}

// Invert colors without regenerating forms
function invertColors() {
    if(parameters.invert) {
        backgroundLayer.fillColor = darkBackgroundColor;
        gridLayer.strokeColor = darkGridColor;
        superformulaLayers.strokeColor = darkStrokeColor;
    } else {
        backgroundLayer.fillColor = lightBackgroundColor;
        gridLayer.strokeColor = lightGridColor;
        superformulaLayers.strokeColor = lightStrokeColor;
    }
}

// 'Close paths' checkbox controls constraints on the 'm' sliders
function closePaths() {
    var newMin, newStep;

    if(parameters.closePaths) {
        newMin = 2;
        newStep = 2;
    } else {
        newMin = .01;
        newStep = (paramLimits.m.max - newMin) / 100;
    }

    paramLimits.m.min = newMin;
    mMinSlider.min(paramLimits.m.min);
    mMaxSlider.min(paramLimits.m.min);
    mMinSlider.step(newStep);
    mMaxSlider.step(newStep);

    if(parameters.closePaths) {
        var mMinSliderValue = mMinSlider.getValue();
        var mMaxSliderValue = mMaxSlider.getValue();

        // Round min value to nearest even integer
        mMinSlider.setValue(2*Math.round(mMinSliderValue/2));
        mMaxSlider.setValue(2*Math.round(mMaxSliderValue/2));
    }
}


//========================================================================================
//  UTILITY FUNCITONS
//========================================================================================

// Small utility function to generate random within range, a la Processing
function random(min, max) {
    return Math.random() * (max-min) + min
}


//========================================================================================
//  KEYBOARD CONTROLS
//========================================================================================
document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case ' ':
            generateForms();
            break;
        case 's':
            exportSVG();
            break;
        case 'i':
            // invert colors
            break;
        case 'm':
            exportImage();
            break;
    }
});