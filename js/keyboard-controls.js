//========================================================================================
//  KEYBOARD CONTROLS
//========================================================================================

document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case ' ':
            if(mode == RANGE) {
                generate();
            }
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
            randomize();
            generate();
            break;
    }
});