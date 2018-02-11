//========================================================================================
//  DRAWING FUNCTIONS
//========================================================================================

// Draw all the required components to the canvas
function draw() {
    // Clear all previously drawn items
    if(paper.project != null) {
        paper.project.clear();
    }

    // Draw the background
    drawBackground();

    // Draw grid lines (range only)
    if(mode == RANGE) {
        drawGridLines();
    }

    // Draw the superformula paths
    drawAllPaths();

    // Keep track of scale operation to prevent redundant scaling on redraws
    if(!alreadyScaled) {
        alreadyScaled = true;
    }

    // Draw param text (if enabled)
    if(parameters[mode].drawParams) {
        drawAllParamText();
    }
}

// Fetch new parameters and superformula paths
function refresh() {
    alreadyScaled = false;
    params = getNewParams();
    superformulaPaths = getSuperformulaPaths();
}

// Draw the solid background
function drawBackground() {
    var background = new paper.Path.Rectangle({
        point: [0, 0],
        size: [innerWidth, window.innerHeight]
    });
    background.sendToBack();

    if(typeof parameters[mode] != 'undefined' && typeof parameters[mode].invert != 'undefined') {
        if(parameters[mode].invert) {
            background.fillColor = invertedBackgroundColor;
        } else {
            background.fillColor = backgroundColor;
        }
    }
}

// Draw row and column divider lines
function drawGridLines() {
    var gridLines = [];

    // Row lines
    for(var i=1; i<parameters[mode].rows; i++) {
        var rowLine = paper.Path.Line(
            new paper.Point(0, i*(window.innerHeight/parameters[mode].rows)),
            new paper.Point(window.innerWidth, i*(window.innerHeight/parameters[mode].rows))
        );

        if(parameters[mode].invert) {
            rowLine.strokeColor = invertedGridColor;
        } else {
            rowLine.strokeColor = gridColor;
        }
    }

    // Column lines
    for(var i=1; i<parameters[mode].columns; i++) {
        var columnLine = paper.Path.Line(
            new paper.Point(i*(window.innerWidth/parameters[mode].columns), 0),
            new paper.Point(i*(window.innerWidth/parameters[mode].columns), window.innerHeight)
        );

        if(parameters[mode].invert) {
            columnLine.strokeColor = invertedGridColor;
        } else {
            columnLine.strokeColor = gridColor;
        }
    }
}

// Draw all superformula forms
function drawAllPaths() {
    var cellWidth, cellHeight, smallestDimension;

    // Determine cell size
    if(mode == TUNING) {
        cellWidth = window.innerWidth;
        cellHeight = window.innerHeight;
    } else if(mode == RANGE) {
        cellWidth = window.innerWidth / parameters[RANGE].columns;
        cellHeight = window.innerHeight / parameters[RANGE].rows;
    }
    
    // Find the smallest dimension for scaling later
    if(cellWidth < cellHeight) {
        smallestDimension = cellWidth;
    } else {
        smallestDimension = cellHeight;
    }

    if(mode == TUNING) {
        drawPaths(
            superformulaPaths, 
            window.innerWidth / 2, 
            window.innerHeight / 2,
            smallestDimension
        );

    } else if(mode == RANGE) {
        var i = 0;
        for(var column=0; column<parameters[RANGE].columns; column++) {
            for(var row=0; row<parameters[RANGE].rows; row++) {
                drawPaths(
                    superformulaPaths[i],
                    column * (window.innerWidth / parameters[RANGE].columns) + cellWidth/2,
                    row * (window.innerHeight / parameters[RANGE].rows) + cellHeight/2,
                    smallestDimension
                );

                i++;
            }
        }
    }
}

// Draw just one superformula form
function drawPaths(paths, x, y, smallestCellDimension) {
    // Find largest radius of path for scaling
    largestRadius = 0;
    for(var i=0; i<paths.length; i++) {
        for(var j=0; j<paths[i].segments.length; j++) {
            var point = paths[i].segments[j].point;
            var radius = Math.sqrt(point.x * point.x + point.y * point.y);

            if(radius > largestRadius) {
                largestRadius = radius;
            }
        }
    }

    // Group and position paths
    group = new paper.Group(paths);
    group.position.x = x;
    group.position.y = y;

    if(parameters[mode].invert) {
        group.strokeColor = invertedLineColor;
    } else {
        group.strokeColor = lineColor;
    }

    // Scale the paths
    if(!alreadyScaled) {
        scaleFactor = (smallestCellDimension * .9) / (largestRadius * 2);
        group.scale(scaleFactor);
    }
}

// Draw parameters for all superformula shapes on the screen
function drawAllParamText() {
    if(mode == TUNING) {
        drawParamText(params, 20, 70);

    } else if(mode == RANGE) {
        var i = 0;
        for(var column=0; column<parameters[RANGE].columns; column++) {
            for(var row=0; row<parameters[RANGE].rows; row++) {
                drawParamText(
                    params[i], 
                    column * (window.innerWidth / parameters[RANGE].columns) + 10, 
                    row * (window.innerHeight / parameters[RANGE].rows) + 20
                );

                i++;
            }
        }
    }
}

// Draw parameters for a single superformula shape at a specific location
function drawParamText(params, x, y) {
    var text = [];

    text['a'] = new paper.PointText(x, y);
    text['a'].content = 'a: ' + params.a.toFixed(2);

    text['b'] = new paper.PointText(new paper.Point(x, y + 15));
    text['b'].content = 'b: ' + params.b.toFixed(2);

    text['m'] = new paper.PointText(new paper.Point(x, y + 30));

    if(parameters[mode].closePaths) {
        text['m'].content = 'm: ' + params.m;
    } else {
        text['m'].content = 'm: ' + params.m.toFixed(2);
    }

    text['n1'] = new paper.PointText(new paper.Point(x, y + 45));
    text['n1'].content = 'n1: ' + params.n1.toFixed(2);

    text['n2'] = new paper.PointText(new paper.Point(x, y + 60));
    text['n2'].content = 'n2: ' + params.n2.toFixed(2);

    text['n3'] = new paper.PointText(new paper.Point(x, y + 75));
    text['n3'].content = 'n3: ' + params.n3.toFixed(2);

    text['iterations'] = new paper.PointText(new paper.Point(x, y + 90));
    text['iterations'].content = 'iterations: ' + params.iterations;

    text['decay'] = new paper.PointText(new paper.Point(x, y + 105));
    text['decay'].content = 'decay: ' + params.decay.toFixed(2);

    for(var param in text) {
        if(parameters[mode].invert) {
            text[param].fillColor = invertedTextColor;
        } else {
            text[param].fillColor = textColor;
        }            
    }

    return new paper.Group(text);
}