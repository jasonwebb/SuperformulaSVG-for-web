//========================================================================================
//  SUPERFORMULA FUNCTIONS
//========================================================================================

// Generate new parameters
// - In TUNING mode, returns an Object with the current values of parameters[TUNING]
// - In RANGE mode, return an Array of Objects with randomized parameters within the ranges defined in parameters[RANGE]
function getNewParams() {
    var _params;

    if(mode == TUNING) {
        _params = {};

        _params.a = parameters[TUNING].a;
        _params.b = parameters[TUNING].b;
        _params.m = parameters[TUNING].m;

        // Clamp m to a positive, even integer if 'close paths' is enabled
        if(parameters[TUNING].closePaths) {
            if(_params.m % 2 != 0) {
                if(_params.m + 1 >= paramLimits.m.max) {
                    _params.m--;
                } else {
                    _params.m++;
                }
            }
        }

        _params.n1 = parameters[TUNING].n1;
        _params.n2 = parameters[TUNING].n2;
        _params.n3 = parameters[TUNING].n3;
        _params.iterations = parameters[TUNING].iterations;
        _params.decay = parameters[TUNING].decay;

    } else if(mode == RANGE) {
        _params = [];
        var tempParams;

        for(var i=0; i<parameters[RANGE].rows; i++) {
            for(var j=0; j<parameters[RANGE].columns; j++) {
                tempParams = {};

                tempParams.a = Number(parseFloat(random(parameters[RANGE].a.min, parameters[RANGE].a.max)).toFixed(2));
                tempParams.b = Number(parseFloat(random(parameters[RANGE].b.min, parameters[RANGE].b.max)).toFixed(2));

                // To ensure paths are closed, only allow even integers
                if(parameters[RANGE].closePaths) {
                    tempParams.m = parseInt(random(parameters[RANGE].m.min, parameters[RANGE].m.max));

                    if(tempParams.m % 2 != 0) {
                        if(tempParams.m + 1 >= paramLimits.m.max) {
                            tempParams.m--;
                        } else {
                            tempParams.m++;
                        }
                    }
                } else {
                    tempParams.m = Number(parseFloat(random(parameters[RANGE].m.min, parameters[RANGE].m.max)).toFixed(2));
                }

                tempParams.n1 = Number(parseFloat(random(parameters[RANGE].n1.min, parameters[RANGE].n1.max)).toFixed(2));
                tempParams.n2 = Number(parseFloat(random(parameters[RANGE].n2.min, parameters[RANGE].n2.max)).toFixed(2));
                tempParams.n3 = Number(parseFloat(random(parameters[RANGE].n3.min, parameters[RANGE].n3.max)).toFixed(2));
                tempParams.iterations = parseInt(random(parameters[RANGE].iterations.min, parameters[RANGE].iterations.max));
                tempParams.decay = Number(parseFloat(random(parameters[RANGE].decay.min, parameters[RANGE].decay.max)).toFixed(2));            

                _params.push(tempParams);
            }
        }
    }

    return _params;
}

// Generate multiple paths (iterations) for a single set of parameters
// - In TUNING mode, returns Array of at least one superformula path
// - In RANGE mode, returns Array of Arrays containing at least one superformula path each
function getSuperformulaPaths() {
    var paths = [];

    if(mode == TUNING) {
        for(k=params.iterations; k>0; k--) {
            paths.push(
                getSuperformulaPath(
                    params.a - k*params.decay,
                    params.b - k*params.decay,
                    params.m, 
                    params.n1 - k*params.decay, 
                    params.n2 - k*params.decay, 
                    params.n3 - k*params.decay
                )
            );
        }

    } else if(mode == RANGE) {
        var tempPaths;

        for(var i=0; i<parameters[RANGE].rows * parameters[RANGE].columns; i++) {
            tempPaths = [];

            for(k=params[i].iterations; k>0; k--) {
                tempPaths.push(
                    getSuperformulaPath(
                        params[i].a - k*params[i].decay,
                        params[i].b - k*params[i].decay,
                        params[i].m, 
                        params[i].n1 - k*params[i].decay, 
                        params[i].n2 - k*params[i].decay, 
                        params[i].n3 - k*params[i].decay
                    )
                );
            }

            paths.push(tempPaths);
        }
    }

    return paths;
}

// Generate a single path comprised of points located using superformula
function getSuperformulaPath(a, b, m, n1, n2, n3) {
    var resolution = 720;
    var phi = (Math.PI*2) / resolution;

    var path = new paper.Path();

    if(parameters[mode].invert) {
        path.strokeColor = invertedLineColor;
    } else {
        path.strokeColor = lineColor;
    }
    
    for(var i=0; i<=resolution; i++) {
        path.add(getSuperformulaPoint(phi*i, a, b, m, n1, n2, n3));
    }

    return path;
}

// Calculate the [x,y] position of a single point for a given angle (phi)
function getSuperformulaPoint(phi, a, b, m, n1, n2, n3) {
    var point = {};

    var r;
    var t1, t2;
    var radius;
  
    t1 = Math.cos(m * phi / 4) / a;
    t1 = Math.abs(t1);
    t1 = Math.pow(t1, n2);
  
    t2 = Math.sin(m * phi / 4) / b;
    t2 = Math.abs(t2);
    t2 = Math.pow(t2, n3);
  
    r = Math.pow(t1 + t2, 1 / n1);
    
    if(Math.abs(r) == 0) {
        point.x = 0;
        point.y = 0;
    } else {
        r = 1 / r;
        point.x = r * Math.cos(phi);
        point.y = r * Math.sin(phi);
    }

    return point;
}