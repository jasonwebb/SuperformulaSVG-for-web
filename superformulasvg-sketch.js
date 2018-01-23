// Global 'mode' used to funnel GUI and interactions
var mode;
var TUNING = 0;
var RANGE = 1;

// dat.gui elements
var gui;
var aSlider, bSlider, mSlider, n1Slider, n2Slider, n3Slider, iterationsSlider, decaySlider;
var aMinSlider, bMinSlider, mMinSlider, n1MinSlider, n2MinSlider, n3MinSlider, iterationsMinSlider, decayMinSlider;
var aMaxSlider, bMaxSlider, mMaxSlider, n1MaxSlider, n2MaxSlider, n3MaxSlider, iterationsMaxSlider, decayMaxSlider;
var invertButton, closePathsButton;

// Min/max limits for superformula params, use for randomization and clamping
var paramLimits = {
    a: {
        min: 1.0,
        max: 20.0
    },
    b: {
        min: 1.0,
        max: 20.0
    },
    m: {
        min: 1.0,
        max: 20.0
    },
    n1: {
        min: 2.0,
        max: 80.0
    },
    n2: {
        min: 4.0,
        max: 80.0
    },
    n3: {
        min: 4.0,
        max: 80.0
    },
    iterations: {
        min: 1,
        max: 20
    },
    decay: {
        min: .05,
        max: .2
    }
};

// Active parameters that are connected to dat.gui elements
var parameters = [
    // Tuning mode
    {
        a: parseFloat(random(paramLimits.a.min, paramLimits.a.max)),
        b: parseFloat(random(paramLimits.b.min, paramLimits.b.max)),
        m: 3,
        n1: parseFloat(random(paramLimits.n1.min, paramLimits.n1.max)),
        n2: parseFloat(random(paramLimits.n2.min, paramLimits.n2.max)),
        n3: parseFloat(random(paramLimits.n3.min, paramLimits.n3.max)),
        iterations: parseInt(random(paramLimits.iterations.min, paramLimits.iterations.max)),
        decay: parseFloat(random(paramLimits.decay.min, paramLimits.decay.max)),
        invert: false,
        closePaths: true
    },

    // Range mode
    {
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
        rows: 2,
        columns: 3
    }
];

// Functions that get called by dat.gui buttons
var controlFunctions = {
    randomize: function() { randomizeParameters(); },
    generate: function() { generateForms(); },
    svg: function() { exportSVG(); },
    image: function() { exportImage(); }
};

// Canvas and related Paper.js drawing variables
var canvas;
var backgroundLayer, gridLayer, superformulaLayers;
var darkBackgroundColor, lightBackgroundColor;
var darkStrokeColor, lightStrokeColor;
var darkGridColor, lightGridColor;
var container;

var largestRadius;


//========================================================================================
//  MAIN FUNCTIONALITY
//========================================================================================
window.onload = function() {
    // Set up Paper.js
    canvas = document.getElementById('superformula-canvas');
    paper.setup(canvas);

    // Now that PaperJS scope is set up, we can use it to define global colors
    darkBackgroundColor = new paper.Color(0, 0, 0, .9);
    lightBackgroundColor = new paper.Color(0, 0, 0, .05);

    darkStrokeColor = new paper.Color(1, 1, 1, .80);
    lightStrokeColor = new paper.Color(0, 0, 0, .80);

    darkGridColor = new paper.Color(1, 1, 1, .1);
    lightGridColor = new paper.Color(0, 0, 0, .1);

    // Present 'mode' choice to user
    showChoices();
}


//========================================================================================
//  CHOICES SCREEN
//========================================================================================
function showChoices() {
    // Choice has already been presented due to presence of .container
    if(typeof container != 'undefined') {
        container.classList = 'container';
    } else {
        container = document.createElement('div');
        container.className = 'container';

        // Tune / Range choice row
        var row = document.createElement('div');
        row.className = 'row';

            var tuneLink = document.createElement('a');
            tuneLink.className = 'block';
            tuneLink.innerHTML = 'Tune <div>Dial in a <strong>specific</strong> shape</div>';
            tuneLink.addEventListener('click', function() {
                launchApp(TUNING);
            });
            row.appendChild(tuneLink);

            var rangeLink = document.createElement('a');
            rangeLink.className = 'block'
            rangeLink.innerHTML = 'Discover <div>Create <strong>randomized</strong> shapes</div>';
            rangeLink.addEventListener('click', function() {
                launchApp(RANGE);
            });
            row.appendChild(rangeLink);

        container.appendChild(row);

        // Help link row
        row = document.createElement('div');
        row.classList = 'row';
        row.innerHTML = '<a href="javascript:void(0)" class="help">What is this?</a>';
        container.appendChild(row);

        // Github repo link row
        row = document.createElement('div');
        row.classList = 'row';
        row.innerHTML += '<a href="https://github.com/jasonwebb/SuperformulaSVG-for-web" class="github-link" target="_blank" alt="Link to Github repo" title="See the source code on Github"><i class="fab fa-github"></i></a>';
        container.appendChild(row);

        // Add container to body
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(container);
    }
}

function hideChoices() {
    container.classList = "container hide";
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

    if(typeof parameters[mode].invert) {
        if(parameters[mode].invert) {
            background.fillColor = darkBackgroundColor;
        } else {
            background.fillColor = lightBackgroundColor;
        }
    }

    backgroundLayer = new paper.Layer(background);
}

// Draw row and column divider lines
function drawGrid() {
    var gridLines = [];

    // Row lines
    for(var i=1; i<parameters[mode].rows; i++) {
        var rowLine = paper.Path.Line(
            new paper.Point(0, i*(window.innerHeight/parameters[mode].rows)),
            new paper.Point(window.innerWidth, i*(window.innerHeight/parameters[mode].rows))
        );

        if(parameters[mode].invert) {
            rowLine.strokeColor = darkGridColor;
        } else {
            rowLine.strokeColor = lightGridColor;
        }

        gridLines.push(rowLine);
    }

    // Column lines
    for(var i=1; i<parameters[mode].columns; i++) {
        var columnLine = paper.Path.Line(
            new paper.Point(i*(window.innerWidth/parameters[mode].columns), 0),
            new paper.Point(i*(window.innerWidth/parameters[mode].columns), window.innerHeight)
        );

        if(parameters[mode].invert) {
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
function launchApp(mode) {
    hideChoices();
    showIconLinks();
    setMode(mode);
    setupGUI();
    generateForms();
}

function showIconLinks() {
    var iconLinks = document.querySelectorAll('.icon-link');
    
    iconLinks.forEach(link => {
        link.className = link.className.replace(/\hide\b/g, "");
    });
}

function setMode(newMode) {
    mode = newMode;
}

function setupGUI() {
    gui = new dat.GUI();
    gui.width = 350;

    // Tuning mode UI -----------------------------------------------------------------------
    if(mode == TUNING) {
        aSlider = gui.add(parameters[TUNING], 'a', paramLimits.a.min, paramLimits.a.max).onChange(generateForms);
        bSlider = gui.add(parameters[TUNING], 'b', paramLimits.b.min, paramLimits.b.max).onChange(generateForms);
        mSlider = gui.add(parameters[TUNING], 'm', paramLimits.m.min, paramLimits.m.max, 2).onChange(generateForms);
        n1Slider = gui.add(parameters[TUNING], 'n1', paramLimits.n1.min, paramLimits.n1.max).onChange(generateForms);
        n2Slider = gui.add(parameters[TUNING], 'n2', paramLimits.n2.min, paramLimits.n2.max).onChange(generateForms);
        n3Slider = gui.add(parameters[TUNING], 'n3', paramLimits.n3.min, paramLimits.n3.max).onChange(generateForms);
        iterationsSlider = gui.add(parameters[TUNING], 'iterations', paramLimits.iterations.min, paramLimits.iterations.max, 1).onChange(generateForms);
        decaySlider = gui.add(parameters[TUNING], 'decay', paramLimits.decay.min, paramLimits.decay.max).onChange(generateForms);
        invertButton = gui.add(parameters[TUNING], 'invert', false).name('Invert colors').onChange(invertColors);
        closePaths = gui.add(parameters[TUNING], 'closePaths', false).name('Only allow closed paths').onChange(closePaths);
        gui.add(controlFunctions, 'randomize').name('Randomize');
        gui.add(controlFunctions, 'svg').name('Export SVG');
        gui.add(controlFunctions, 'image').name('Export image');

    // Range mode UI ------------------------------------------------------------------------
    } else if(mode == RANGE) {
        var aFolder = gui.addFolder('a');
        var bFolder = gui.addFolder('b');
        var mFolder = gui.addFolder('m');
        var n1Folder = gui.addFolder('n1');
        var n2Folder = gui.addFolder('n2');
        var n3Folder = gui.addFolder('n3');
        var iterationsFolder = gui.addFolder('iterations');
        var decayFolder = gui.addFolder('decay');

        aMinSlider = aFolder.add(parameters[RANGE].a, 'min', paramLimits.a.min, paramLimits.a.max);
        aMaxSlider = aFolder.add(parameters[RANGE].a, 'max', paramLimits.a.min, paramLimits.a.max);

        bMinSlider = bFolder.add(parameters[RANGE].b, 'min', paramLimits.b.min, paramLimits.b.max);
        bMaxSlider = bFolder.add(parameters[RANGE].b, 'max', paramLimits.b.min, paramLimits.b.max);

        mMinSlider = mFolder.add(parameters[RANGE].m, 'min', paramLimits.m.min, paramLimits.m.max);
        mMaxSlider = mFolder.add(parameters[RANGE].m, 'max', paramLimits.m.min, paramLimits.m.max);

        if(parameters[RANGE].closePaths) {
            mMinSlider.step(2);
            mMaxSlider.step(2);
        }

        n1MinSlider = n1Folder.add(parameters[RANGE].n1, 'min', paramLimits.n1.min, paramLimits.n1.max);
        n1MaxSlider = n1Folder.add(parameters[RANGE].n1, 'max', paramLimits.n1.min, paramLimits.n1.max);

        n2MinSlider = n2Folder.add(parameters[RANGE].n2, 'min', paramLimits.n2.min, paramLimits.n2.max);
        n2MaxSlider = n2Folder.add(parameters[RANGE].n2, 'max', paramLimits.n2.min, paramLimits.n2.max);

        n3MinSlider = n3Folder.add(parameters[RANGE].n3, 'min', paramLimits.n3.min, paramLimits.n3.max);
        n3MaxSlider = n3Folder.add(parameters[RANGE].n3, 'max', paramLimits.n3.min, paramLimits.n3.max);

        iterationsMinSlider = iterationsFolder.add(parameters[RANGE].iterations, 'min', paramLimits.iterations.min, paramLimits.iterations.max).step(1);
        iterationsMaxSlider = iterationsFolder.add(parameters[RANGE].iterations, 'max', paramLimits.iterations.min, paramLimits.iterations.max).step(1);

        decayMinSlider = decayFolder.add(parameters[RANGE].decay, 'min', paramLimits.decay.min, paramLimits.decay.max);
        decayMaxSlider = decayFolder.add(parameters[RANGE].decay, 'max', paramLimits.decay.min, paramLimits.decay.max);

        invertButton  =gui.add(parameters[RANGE], 'invert', false).name('Invert colors').onChange(invertColors);
        closePathsButton = gui.add(parameters[RANGE], 'closePaths', false).name('Only allow closed paths').onChange(closePaths);

        gui.add(parameters[RANGE], 'rows', 1, 5).name('Rows').step(1);
        gui.add(parameters[RANGE], 'columns', 1, 8).name('Columns').step(1);

        gui.add(controlFunctions, 'randomize').name('Randomize');

        gui.add(controlFunctions, 'generate').name('Generate new forms');
        gui.add(controlFunctions, 'svg').name('Export SVG');
        gui.add(controlFunctions, 'image').name('Export image');
    }
}


//========================================================================================
//  SUPERFORMULA FUNCTIONS
//========================================================================================
function generateForms() {
    if(paper.project != null) {
        paper.project.clear();
    }

    drawBackground();

    if(mode == RANGE) {
        drawGrid();
    }

    var cellWidth, cellHeight;
    var smallestDimension;
    var allPaths = [];
    var params;

    // Determine cell size
    if(mode == TUNING) {
        cellWidth = window.innerWidth;
        cellHeight = window.innerHeight;
    } else if(mode == RANGE) {
        cellWidth = window.innerWidth / parameters[mode].columns;
        cellHeight = window.innerHeight / parameters[mode].rows;
    }
    
    // Find the smallest dimension for scaling later
    if(cellWidth < cellHeight) {
        smallestDimension = cellWidth;
    } else {
        smallestDimension = cellHeight;
    }

    // Tuning mode ---------------------------------------------------------------------------
    if(mode == TUNING) {
        params = {};
        params.a = parameters[TUNING].a;
        params.b = parameters[TUNING].b;
        
        if(parameters[TUNING].closePaths) {
            params.m = parseInt(parameters[TUNING].m);

            if(params.m % 2 != 0) {
                if(params.m + 1 >= paramLimits.m.max) {
                    params.m--;
                } else {
                    params.m++;
                }
            }
        } else {
            params.m = parameters[TUNING].m;
        }

        params.n1 = parameters[TUNING].n1;
        params.n2 = parameters[TUNING].n2;
        params.n3 = parameters[TUNING].n3;
        params.iterations = parameters[TUNING].iterations;
        params.decay = parameters[TUNING].decay;

        largestRadius = 0;

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
                    window.innerWidth / 2,
                    window.innerHeight / 2
                )
            );
        }

        // Group and scale to fit cell
        var group = new paper.Group(paths);
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


    // Range mode ----------------------------------------------------------------------------------
    } else if(mode == RANGE) {
        for(var i=0; i<parameters[mode].rows; i++) {
            for(var j=0; j<parameters[mode].columns; j++) {
                params = {};

                params.a = parseFloat(random(parameters[RANGE].a.min, parameters[RANGE].a.max)).toFixed(2);
                params.b = parseFloat(random(parameters[RANGE].b.min, parameters[RANGE].b.max)).toFixed(2);

                // To ensure paths are closed, only allow even integers
                if(parameters[mode].closePaths) {
                    params.m = parseInt(random(parameters[RANGE].m.min, parameters[RANGE].m.max));

                    if(params.m % 2 != 0) {
                        if(params.m + 1 >= paramLimits.m.max) {
                            params.m--;
                        } else {
                            params.m++;
                        }
                    }
                } else {
                    params.m = parseFloat(random(parameters[RANGE].m.min, parameters[RANGE].m.max)).toFixed(2);
                }

                params.n1 = parseFloat(random(parameters[RANGE].n1.min, parameters[RANGE].n1.max)).toFixed(2);
                params.n2 = parseFloat(random(parameters[RANGE].n2.min, parameters[RANGE].n2.max)).toFixed(2);
                params.n3 = parseFloat(random(parameters[RANGE].n3.min, parameters[RANGE].n3.max)).toFixed(2);
                params.iterations = parseInt(random(parameters[RANGE].iterations.min, parameters[RANGE].iterations.max));
                params.decay = parseFloat(random(parameters[RANGE].decay.min, parameters[RANGE].decay.max)).toFixed(2);
    
                largestRadius = 0;
    
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
                            j * (window.innerWidth / parameters[mode].columns) + (window.innerWidth / parameters[mode].columns/2),
                            i * (window.innerHeight / parameters[mode].rows) + (window.innerHeight / parameters[mode].rows/2)
                        )
                    );
                }

                // Group and scale to fit cell
                var group = new paper.Group(paths);
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
    }
    
    // Add all superformula forms to a new layer
    superformulaLayers = new paper.Layer(allPaths);

    paper.view.draw();
}

// Generate one complete path comprised of points located using superformula
function getSuperformulaPath(a, b, m, n1, n2, n3, xOffset, yOffset) {
    var resolution = 720;
    var phi = (Math.PI*2) / resolution;

    var path = new paper.Path();

    if(parameters[mode].invert) {
        path.strokeColor = darkStrokeColor;
    } else {
        path.strokeColor = lightStrokeColor;
    }
    
    for(var i=0; i<=resolution; i++) {
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

// Randomize all parameters and generate new form(s)
function randomizeParameters() {
    if(mode == TUNING) {
        aSlider.setValue(parseFloat(random(paramLimits.a.min, paramLimits.a.max)));
        bSlider.setValue(parseFloat(random(paramLimits.b.min, paramLimits.b.max)));
        mSlider.setValue(parseFloat(random(paramLimits.m.min, paramLimits.m.max)));
        n1Slider.setValue(parseFloat(random(paramLimits.n1.min, paramLimits.n1.max)));
        n2Slider.setValue(parseFloat(random(paramLimits.n2.min, paramLimits.n2.max)));
        n3Slider.setValue(parseFloat(random(paramLimits.n3.min, paramLimits.n3.max)));
        iterationsSlider.setValue(parseInt(random(paramLimits.iterations.min, paramLimits.iterations.max)));
        decaySlider.setValue(parseFloat(random(paramLimits.decay.min, paramLimits.decay.max)));
    } else if(mode == RANGE) {
        aMinSlider.setValue(parseFloat(random(paramLimits.a.min, paramLimits.a.max)));
        aMaxSlider.setValue(parseFloat(random(aMinSlider.getValue(), paramLimits.a.max)));

        bMinSlider.setValue(parseFloat(random(paramLimits.b.min, paramLimits.b.max)));
        bMaxSlider.setValue(parseFloat(random(bMinSlider.getValue(), paramLimits.b.max)));

        mMinSlider.setValue(parseFloat(random(paramLimits.m.min, paramLimits.m.max)));
        mMaxSlider.setValue(parseFloat(random(mMinSlider.getValue(), paramLimits.m.max)));

        n1MinSlider.setValue(parseFloat(random(paramLimits.n1.min, paramLimits.n1.max)));
        n1MaxSlider.setValue(parseFloat(random(n1MinSlider.getValue(), paramLimits.n1.max)));

        n2MinSlider.setValue(parseFloat(random(paramLimits.n2.min, paramLimits.n2.max)));
        n2MaxSlider.setValue(parseFloat(random(n2MinSlider.getValue(), paramLimits.n2.max)));

        n3MinSlider.setValue(parseFloat(random(paramLimits.n3.min, paramLimits.n3.max)));
        n3MaxSlider.setValue(parseFloat(random(n3MinSlider.getValue(), paramLimits.n3.max)));

        iterationsMinSlider.setValue(parseInt(random(paramLimits.iterations.min, paramLimits.iterations.max)));
        iterationsMaxSlider.setValue(parseInt(random(iterationsMinSlider.getValue(), paramLimits.iterations.max)));

        decayMinSlider.setValue(parseInt(random(paramLimits.decay.min, paramLimits.decay.max)));
        decayMaxSlider.setValue(parseInt(random(decayMinSlider.getValue(), paramLimits.decay.max)));
    }

    generateForms();
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
    if(parameters[mode].invert) {
        backgroundLayer.fillColor = darkBackgroundColor;
        superformulaLayers.strokeColor = darkStrokeColor;

        if(typeof gridLayer != 'undefined') {
            gridLayer.strokeColor = darkGridColor;
        }
    } else {
        backgroundLayer.fillColor = lightBackgroundColor;
        superformulaLayers.strokeColor = lightStrokeColor;

        if(typeof gridLayer != 'undefined') {
            gridLayer.strokeColor = lightGridColor;
        }
    }
}

// 'Close paths' checkbox controls constraints on the 'm' sliders
function closePaths() {
    var newMin, newStep;

    if(parameters[mode].closePaths) {
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

    if(parameters[mode].closePaths) {
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
    console.log(event.key);
    switch(event.key) {
        case ' ':
            generateForms();
            break;
        case 's':
            exportSVG();
            break;
        case 'i':
            parameters[mode].invert = !parameters[mode].invert;
            invertColors();
            break;
        case 'p':
            exportImage();
            break;
        case 'r':
            randomizeParameters();
            break;
        case 'Backspace':
            // return to choices screen
            break;
    }
});