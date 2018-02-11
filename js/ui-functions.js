//========================================================================================
//  CHOICES SCREEN
//========================================================================================

function setupChoices() {
    // Capture references to interactive DOM elements
    choiceContainer = document.querySelector('.container');
    choiceContent = document.querySelectorAll('.container .row');
    tuneBlock = document.querySelector('.tune-block');
    rangeBlock = document.querySelector('.range-block');
    backLink = document.querySelector('.back-link');

    // Add event listeners
    backLink.addEventListener('click', reloadApp);

    tuneBlock.addEventListener('click', function() {
        launchApp(TUNING);
    });

    rangeBlock.addEventListener('click', function() {
        launchApp(RANGE);
    });

    choicesSetup = true;
}

function showChoices() {
    if(!choicesSetup) {
        setupChoices();
    }

    choiceContainer.className = choiceContainer.className.replace(/\hide\b/g, "").trim();
    
    for(var i=0; i<choiceContent.length; i++) {
        choiceContent[i].className += ' animated fadeIn';
    }
}

function hideChoices() {
    choiceContainer.className += ' hide';

    for(var i=0; i<choiceContent.length; i++) {
        choiceContent[i].className = choiceContent[i].className.replace(/\animated fadeIn\b/g, "").trim();
    }
}


//========================================================================================
//  GUI
//========================================================================================
function launchApp(mode) {
    setMode(mode);

    hideChoices();

    showIconLinks();
    setupGUI();

    generate();    
}

// Reload app by hiding, clearing and destroying any elements that shouldn't be on 'choices' screen
function reloadApp() {
    if(paper != null && paper.project != null) {
        paper.project.clear();
    }

    hideIconLinks();
    gui.destroy();
    showChoices();
}

function showIconLinks() {
    if(typeof iconLinks == 'undefined') {
        iconLinks = document.querySelectorAll('.icon-link');
    }
    
    for(var i=0; i<iconLinks.length; i++) {
        iconLinks[i].className = iconLinks[i].className.replace(/\hide\b/g, "").trim();
    }
}

function hideIconLinks() {
    if(typeof iconLinks == 'undefined') {
        iconLinks = document.querySelectorAll('.icon-link');
    }
    
    for(var i=0; i<iconLinks.length; i++) {
        iconLinks[i].className += ' hide';
    }
}

function setMode(newMode) {
    mode = newMode;
}

function setupGUI() {
    gui = new dat.GUI();
    gui.width = 350;

    // Tuning mode UI -----------------------------------------------------------------------
    if(mode == TUNING) {
        aSlider = gui.add(parameters[TUNING], 'a', paramLimits.a.min, paramLimits.a.max).onChange(generate);
        bSlider = gui.add(parameters[TUNING], 'b', paramLimits.b.min, paramLimits.b.max).onChange(generate);
        mSlider = gui.add(parameters[TUNING], 'm', paramLimits.m.min, paramLimits.m.max, 2).onChange(generate);

        if(parameters[TUNING].closePaths) {
            mSlider.step(2);
        }

        n1Slider = gui.add(parameters[TUNING], 'n1', paramLimits.n1.min, paramLimits.n1.max).onChange(generate);
        n2Slider = gui.add(parameters[TUNING], 'n2', paramLimits.n2.min, paramLimits.n2.max).onChange(generate);
        n3Slider = gui.add(parameters[TUNING], 'n3', paramLimits.n3.min, paramLimits.n3.max).onChange(generate);
        iterationsSlider = gui.add(parameters[TUNING], 'iterations', paramLimits.iterations.min, paramLimits.iterations.max, 1).onChange(generate);
        decaySlider = gui.add(parameters[TUNING], 'decay', paramLimits.decay.min, paramLimits.decay.max).onChange(generate);

        drawParamstButton = gui.add(parameters[TUNING], 'drawParams', true).name('Draw parameters').onChange(draw);
        invertButton      = gui.add(parameters[TUNING], 'invert', false).name('Invert colors').onChange(invertColors);
        closePathsButton  = gui.add(parameters[TUNING], 'closePaths', false).name('Only allow closed paths').onChange(closePaths);

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

        drawParamstButton = gui.add(parameters[RANGE], 'drawParams', true).name('Draw parameters').onChange(draw);
        invertButton      = gui.add(parameters[RANGE], 'invert', false).name('Invert colors').onChange(invertColors);
        closePathsButton  = gui.add(parameters[RANGE], 'closePaths', false).name('Only allow closed paths').onChange(closePaths);

        gui.add(parameters[RANGE], 'rows', 1, 5).name('Rows').step(1);
        gui.add(parameters[RANGE], 'columns', 1, 8).name('Columns').step(1);

        gui.add(controlFunctions, 'randomize').name('Randomize');

        gui.add(controlFunctions, 'generate').name('Generate new forms');
        gui.add(controlFunctions, 'svg').name('Export SVG');
        gui.add(controlFunctions, 'image').name('Export image');
    }
}

// Randomize all parameters and generate new form(s)
function randomize() {
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

        decayMinSlider.setValue(parseFloat(random(paramLimits.decay.min, paramLimits.decay.max)));
        decayMaxSlider.setValue(parseFloat(random(decayMinSlider.getValue(), paramLimits.decay.max)));
    }
}

function generate() {
    refresh();
    draw();
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
    paper.view.element.toBlob(
        function(blob) { 
            saveAs(blob, 'superformula.png'); 
        }
    );
}

// Invert colors without regenerating forms
function invertColors() {
    // Manually flip colors of icons
    if(parameters[mode].invert) {
        backLink.className += ' inverted';
        
        for(var i=0; i<iconLinks.length; i++) {
            iconLinks[i].className += ' inverted';
        }
        
    } else {
        backLink.className = backLink.className.replace(/\inverted\b/g, "").trim();

        for(var i=0; i<iconLinks.length; i++) {
            iconLinks[i].className = iconLinks[i].className.replace(/\inverted\b/g, "").trim();
        }
    }

    // Force redraw to flip colors of supreformula paths and param text
    draw();
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

    if(mode == TUNING) {
        mSlider.min(paramLimits.m.min);
        mSlider.step(newStep);

        var mSliderValue = mSlider.getValue();
        mSlider.setValue(2*Math.round(mSliderValue/2));
    } else if(mode == RANGE) {
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
}