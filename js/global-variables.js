//========================================================================================
//  GLOBAL VARIABLES
//========================================================================================

// Global 'mode' used to funnel GUI and interactions
var mode;
var TUNING = 0;
var RANGE = 1;

// dat.gui elements
var gui;
var aSlider, bSlider, mSlider, n1Slider, n2Slider, n3Slider, iterationsSlider, decaySlider;
var aMinSlider, bMinSlider, mMinSlider, n1MinSlider, n2MinSlider, n3MinSlider, iterationsMinSlider, decayMinSlider;
var aMaxSlider, bMaxSlider, mMaxSlider, n1MaxSlider, n2MaxSlider, n3MaxSlider, iterationsMaxSlider, decayMaxSlider;
var invertButton, closePathsButton, drawParamstButton;

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
        drawParams: true,
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
        drawParams: true,
        invert: false,
        closePaths: true,
        rows: 2,
        columns: 3
    }
];

// Functions that get called by dat.gui buttons
var controlFunctions = {
    randomize: function() { randomize(); },
    generate:  function() { generate(); },
    svg:       function() { exportSVG(); },
    image:     function() { exportImage(); }
};

// Colors
var backgroundColor, invertedBackgroundColor,
    gridColor, invertedGridColor,
    lineColor, invertedLineColor,
    textColor, invertedTextColor;

// Choice screen
var choiceContainer;
var choicesSetup = false;
var tuneBlock, rangeBlock, helpLink, backLink, iconLinks;

// Help modal window
var modal, modalContent;

// Drawing elements
var superformulaPaths, params;
var alreadyScaled = false;