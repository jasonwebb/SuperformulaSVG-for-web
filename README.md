__SuperformulaSVG for web__ is an interacative drawing application that lets you generate shapes using the 2D superformula and export them in both SVG and raster image formats for use with laser cutters, plotters, or anything else you can think of!

The application provides two ways of coming up with forms - a <u>tuning</u> mode to dial in an exact shape to your liking, and a <u>discovery</u> mode to generate sets of randomized shapes within configurable ranges.

This application expands upon a [Processing sketch](https://github.com/jasonwebb/SuperformulaSVG) I put together a while back with similar functionality, ported to web technologies so that anyone can play with it without having to know anything about coding or setting up a development environment.

## Keyboard controls

* `Space` - generate new forms
* `s` - export an SVG of what is currently on the screen
* `m` - export a raster image of what is curretnly on the screen
* `i` - invert the colors (without regenerating the forms)

## About the superformula

The superformula is a mathematical method for generating radial geometry with diverse, often organic-looking features. It is described by the following formula:

![Superformula equation](docs/superformula-equation.png)

Where __&phi;__ (phi) is an angle (between 0-359) and the resulting value `r` being the radius of the geometry at that angle.

Here is how I like to think of the parameters and how they affect the resulting drawing:
* `a` seems to affect lateral stretching
* `b` seems to affect vertical stretching
* `m` affects the degree of rotational symmetry. Large values means more peaks/spikes.
* `n1`, `n2`, `n3` all affect the concavity/convexity of spikes and how far they extend from the center. In tandem the can be used to make the form more 'bloated' or 'pinched'.

Following the example set by the  book [FORM+CODE](http://formandcode.com/code-examples/visualize-superformula), I've also included the ability to run multiple iterations of the superformula with slightly changing (decaying) parameter values. You can control these parameters using the `iterations` and `decay` sliders.

Learn more about the superformula through:
* Daniel Shiffman's [Coding Challenge #23: 2D Supershapes](https://www.youtube.com/watch?v=ksRoh-10lak).
* [Wikipedia entry on supershapes](https://en.wikipedia.org/wiki/Superformula) (also relevant is the [superellipse](https://en.wikipedia.org/wiki/Superellipse) page).
* Paul Bourke's article ["Supershapes (Superformula)"](http://paulbourke.net/geometry/supershape/)

## Technologies used
* [dat.gui](https://github.com/dataarts/dat.gui) for the UI
* [Paper.js](http://paperjs.org/) for SVG graphics