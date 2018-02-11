//========================================================================================
//  APP ENTRY POINT
//========================================================================================

window.onload = function() {
    // Set up Paper.js
    var canvas = document.getElementById('superformula-canvas');
    paper.setup(canvas);

    // Now that PaperJS scope is set up, we can use it to define global colors
    backgroundColor = new paper.Color(0, 0, 0, .05);
    invertedBackgroundColor = new paper.Color(0, 0, 0, .9);

    lineColor = new paper.Color(0, 0, 0, .6);
    invertedLineColor = new paper.Color(1, 1, 1, .6);

    gridColor = new paper.Color(0, 0, 0, .1);
    invertedGridColor = new paper.Color(1, 1, 1, .1);

    textColor = new paper.Color(0, 0, 0, .3);
    invertedTextColor = new paper.Color(1, 1, 1, .2);

    // Prepare modal window functionality
    setupModal();

    // Present 'mode' choice to user
    showChoices();
}