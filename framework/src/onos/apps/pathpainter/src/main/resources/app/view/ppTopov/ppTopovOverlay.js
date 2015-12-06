// path painter topology overlay - client side
//
// This is the glue that binds our business logic (in ppTopovDemo.js)
// to the overlay framework.

(function () {
    'use strict';

    // injected refs
    var $log, tov, pps;

    // internal state should be kept in the service module (not here)
    var selection;

    // our overlay definition
    var overlay = {
        // NOTE: this must match the ID defined in AppUiTopovOverlay
        overlayId: 'pp-overlay',
        glyphId: 'topo',
        tooltip: 'Path Painter Topo Overlay',

        activate: function () {
            $log.debug("Path painter topology overlay ACTIVATED");
        },
        deactivate: function () {
            pps.clear();
            $log.debug("Path painter topology overlay DEACTIVATED");
        },
        // These glyphs get installed using the overlayId as a prefix.
        // e.g. 'src' is installed as 'pp-overlay-src'
        // They can be referenced (from this overlay) as '*src'
        // That is, the '*' prefix stands in for 'pp-overlay-'
        glyphs: {
            src: {
                vb: '0 0 110 110',
                d: 'M28.7,59.3 M14.9,53 M8.7,39 M32.4,92.5H25l-0.2-3.6' +
                'c-0.5-9-5.4-23.9-12.9-33.5c-5.2-6.6-7-12.8-7-16.3c0-13.3,10.7-24,23.8-24c13.1,0,23.8,10.8,23.8,24c0,3.5-1.8,9.7-7,16.3' +
                'C38,65,33.1,80,32.6,88.9L32.4,92.5z M27.9,89.5h1.7l0-0.7c0.5-9.4,5.7-25.2,13.5-35.2c4.7-6,6.4-11.4,6.4-14.5' +
                'c0-11.6-9.3-21-20.8-21C17.3,18,7.9,27.5,7.9,39c0,3,1.7,8.4,6.4,14.5c7.9,10.1,13.1,25.8,13.5,35.2L27.9,89.5z M28.7,83.2' +
                'M28.6,29.8c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5C37.1,33.6,33.3,29.8,28.6,29.8z M89.6,47 M89.6,29.5' +
                'c-0.1,3.1-0.1,12.8,0,17c0.1,4.2,14.1-5.5,13.9-8.5C103.4,35.1,89.6,25.6,89.6,29.5z M51,38.1L89.5,38 M89.5,39.5l0-3L51,36.5l0,3' +
                'L89.5,39.5z'
            },
            dst: {
                vb: '0 0 110 110',
                d: 'M80.3,59.8 M85.8,92.5h-7.2L78.4,89c-0.4-8.8-5.2-23.6-12.3-33' +
                'c-4.9-6.5-6.7-12.5-6.7-16c0-13,10.2-23.7,22.7-23.7c12.5,0,22.7,10.6,22.7,23.7c0,3.5-1.8,9.5-6.7,16C91.2,65.4,86.4,80.1,86,89' +
                'L85.8,92.5z M81.4,89.5H83l0-0.7c0.5-9.3,5.4-24.8,12.9-34.7c4.5-5.9,6.1-11.2,6.1-14.2c0-11.4-8.9-20.7-19.8-20.7' +
                'c-10.9,0-19.8,9.3-19.8,20.7c0,3,1.6,8.3,6.1,14.2C76,64,80.9,79.5,81.4,88.8L81.4,89.5z M82.1,30.8c-4.5,0-8.1,3.7-8.1,8.4' +
                's3.6,8.4,8.1,8.4c4.5,0,8.1-3.7,8.1-8.4S86.6,30.8,82.1,30.8z M47.2,47.5 M45.2,30.8c-0.1,3.1-0.1,12.6,0,16.7' +
                'c0.1,4.1,13.4-5.4,13.3-8.4C58.4,36.2,45.2,26.9,45.2,30.8z M45.2,39.1L6.7,39.2 M45.2,40.6l0-3L6.7,37.7l0,3L45.2,40.6z'
            },
            jp: {
                vb: '0 0 110 110',
                d: 'M84.3,89.3L58.9,64.2l-1.4,1.4L83,90.7L84.3,89.3z M27,7.6H7.4v19.2H27V7.6z' +
                'M59.3,47.1H39.8v19.2h19.5V47.1z M102.1,79.5H82.6v19.2h19.5V79.5z M41.7,47.6L19,25.1l-1.2,1.2l22.7,22.5L41.7,47.6z'
            },
            djp: {
                vb: '0 0 110 110',
                d: 'M25.8,84l-9.2-57 M27.3,83.8l-9.2-57l-3,0.5l9.2,57L27.3,83.8z M83.2,37.7L26.8,15.5 M83.7,36.1L26.6,14' +
                'l-1,3.2l57,22.1L83.7,36.1z M34.1,95l61.4-40.6 M96.4,55.7l-1.9-2.5L33.2,93.8l1.9,2.5L96.4,55.7z M26.6,27.6H6.7V7.7h19.9V27.6z' +
                'M102.1,36H82.2v19.9h19.9V36z M35.3,83.5H15.3v19.9h19.9V83.5z'
            },
            geo: {
                vb: '0 0 110 110',
                d: 'M55.7,94.6c-0.1-0.3,0-1-0.1-1.4'+
                'c-0.7-0.5-1.3-2.2-2.1-2.6c-0.5-0.3-1.4-0.2-2-0.5c-0.3-0.1-0.6-0.3-0.9-0.4c-0.4-0.1-0.8-0.1-1.1-0.3c-1.3-0.7-1.9-3-3.5-2.9'+
                'c-0.7,0-1.3,0.7-1.9,0.7c-0.6,0-1.6-0.5-2.4-0.9c-0.8-0.4-1.6-0.6-2.3-1c-0.5-0.3-0.9-0.9-1.3-1.1C37.8,84,37.2,84,37,83.9'+
                'c-0.4-0.2-0.8-0.7-1.3-1.1c-0.5-0.4-1-0.9-1-1.4c0-0.6,0.5-1,0.5-1.6c0.2-1.7-1-2.9-1.7-3.9c-0.5-0.7-1.1-1.4-1.7-2.1'+
                'c0-0.5,0-0.5,0-1c-0.4-0.4-0.7-1.1-1.1-1.7c-0.4-0.6-1.1-1.2-1.2-1.9c-0.1-0.8,0.3-1.5,0-2.3c-0.5-1.3-2-0.7-1.8,1'+
                'c0.1,0.5,0.6,1.1,0.8,1.6c0.2,0.5,0.1,1.1,0.3,1.6c0.2,0.6,0.7,1,0.8,1.7c0.3,1,0.3,2,0.5,2.7c0.2,0.5,1,1.1,0.6,1.7'+
                'c-0.6,0.1-0.8-0.5-1.2-0.9c-0.2-0.2-1-0.6-1.1-1.1c-0.1-0.4,0.2-1,0.1-1.5c-0.2-1-2-1-2-2.1c0-0.7,0.8-0.7,0.8-1.4'+
                'c0-0.7-0.8-1.3-1-1.9c-0.2-0.5-0.2-1.4-0.3-2.2c-0.1-0.7,0-1.5-0.1-2.1c-0.1-0.5-0.8-1.2-1.2-1.4c-0.6-0.3-1-0.2-1.3-0.7'+
                'c-0.2-0.4-0.4-1.4-0.4-1.9c-0.1-0.9,0-1.8-0.1-2.7c0-0.9-0.1-1.8,0-2.8c0.3-0.7,0.9-1,1.2-1.7c0.2-0.5,0.3-1.1,0.5-1.6'+
                'c0.5-0.9,1.5-1.8,2.2-2.7c0.7-1,1.4-1.9,1.8-3.1c0.2-0.4,0.6-1.3,0.5-1.8c-0.1-0.7-1.2-1.3-1.1-2.1c0.1-0.5,0.7-0.5,0.9-1'+
                'c0.1-0.3,0.2-1,0.2-1.3c0-0.7-0.3-1.4-0.2-2.2c0.1-0.6,0.9-0.9,0.5-1.6c-0.4-0.7-1.2,0.4-1.7-0.1c-0.4-0.4,0.1-0.9,0.1-1.7'+
                'c0-0.3-0.2-0.6-0.1-0.9c0-0.3,0.6-0.9,0.4-1.1c-0.3-0.5-0.7-1.7-1.5-2.2c-0.9-0.5-1.9-0.2-3.2-0.4c-0.8-0.2-1.2-1-1.9-0.9'+
                'c-0.5,0-0.7,0.6-1.3,0.9c-0.6,0.3-1.4,0.2-2,0.4c-0.6,0.2-0.9,0.6-1.5,0.6c-0.5,0-0.5-0.6-1.1-0.6c-0.2,0-0.7,0.2-1.1,0.2'+
                'c-1,0.1-2.8,0.2-3.7-0.1c-0.9-0.2-1.5-0.5-2.5-1.1C7.4,28.2,6,27.7,6.1,27c0-0.4,1.3-0.8,1.8-1c0.8-0.3,1.3-0.7,2-0.8'+
                'c0.2,0,0.6,0.2,0.9,0.1c0.3,0,0.7-0.4,1.1-0.4c0.9-0.1,2.1,0.1,2-0.9c-0.7-0.6-3.4,0.4-3.5-0.9c0-0.8,1-1,1.8-1.2'+
                'c0.7-0.2,1.8-0.5,2.5-0.4c0.7,0,1.7,1,2.1-0.1c0.2-0.7-0.2-1.3-0.4-1.9c0.5-0.8,1.5-0.7,2.3-0.9c0.9-0.1,1.6-0.3,2.4-0.7'+
                'c0.7-0.4,1.5-0.6,2.4-0.7c0.9-0.1,1.7-0.5,2.5-0.6c0.6-0.1,1.2,0,1.8-0.1c0.5-0.1,1.1-0.5,1.7-0.4c0.4,0,0.7,0.4,1.1,0.4'+
                'c0.4,0.1,0.8,0,1.2,0.1c0.3,0.1,0.6,0.3,0.9,0.4c0.5,0.1,1-0.1,1.5,0c0.4,0.1,0.8,0.4,1.2,0.4c1,0.1,2.1-0.1,3.1,0.1'+
                'c0.4,0.1,0.7,0.3,1.1,0.4c0.4,0.1,0.8,0,1.1,0.1c0.5,0.1,0.9,0.7,1.5,0.7c1,0.1,2.1-0.5,3.1-0.6c0.7-0.1,1.5,0,2.3-0.1'+
                'c0.7-0.2,1.4-0.5,2-0.5c0.3,0,0.6,0.1,1,0.1c0.3,0,0.7-0.5,1.1-0.4c0.5,0.1,0.4,0.8,0.9,0.9c0.6-0.3,1.1,0,1.7,0'+
                'c0.6,0,1.1-0.3,1.8-0.2c1.2,0.2,2.8,1.5,3.7,0.8c0.2-0.2,0.2-0.5,0.4-0.9c0.3-0.6,0.8-1.3,0.7-2.2c-1.3,0-2.5,0.7-3.9,0.8'+
                'c-1.5-1,0.4-1.7,1.5-2.2c0.9-0.4,1.6-1.3,2.7-1.4C62,12.5,63,12.9,64,13c0.6,0.1,1.2,0,1.6,0.1c0.6,0.2,0.9,0.9,1.5,1.1'+
                'c0.2,0.1,0.6,0.1,0.9,0.1c0.6,0.1,1.1,0.5,1.7,0c0.4,0.1,0.5,0.6,1,0.7c0.4-0.3,0.7-0.9,1.4-1.1c0.3-0.1,0.6,0.1,0.9,0'+
                'c0.5-0.1,1.2-0.9,1.5-0.1c-0.1,0.5-0.8,0.6-1.2,1c-0.3,0.4-0.9,1.2-0.8,1.6c0.1,0.7,1,0.4,1,1.3c-0.1,0.5-0.7,0.3-1.1,0.5'+
                'c-0.4,0.2-0.5,0.6-1,0.7c-1.2,0.2-2.1-0.3-3.1-0.3c0,0.5,0.5,0.8,0.8,0.9c0.9,0.5,1.6,0.5,2.9,0.4c0.7,0,1.4,0.2,2-0.2'+
                'c0.4-0.3,0.3-0.9,0.6-1.2c0.4-0.4,1.2-0.8,1.7-0.7c0.3,0.1,0.7,0.4,0.7,0.7c0,0.7-0.8,0.4-0.8,1.1c0.5,0.4,2-0.4,2-1'+
                'c0.1-0.4-0.5-0.7-0.4-1.1c0-0.8,0.9-0.7,0.8-1.5c-0.4-0.4-0.9,0.1-1.3,0c-0.6-0.1-1.2-1-1.5-1.5c0.3-0.4,0.9-0.1,1.3-0.1'+
                'c0.5-0.7,1.3-1,2.5-1.1c0.4,0,1-0.2,1.2,0.2c0.1,0.7-0.9,1.1-0.7,1.9c0.9,0.2,1.1-1.1,1.8-1.6c0.3-0.2,0.8-0.4,1.2-0.6'+
                'c0.4-0.2,0.8-0.6,1.1-0.6c0.4,0,0.4,0.3,0.8,0.5c0.3,0.1,0.7-0.1,0.8,0.4c-0.7,1.4-3.5,0.6-4.2,2.1c0.2,1-0.4,1.9,0.1,2.6'+
                'c0.4,0.5,1.1,0.2,1.3,0.6c0.2,0.7-0.8,0.7-0.5,1.4c0.7,0.5,1.5-0.4,2.1-0.8c0.7-0.4,1.5-0.8,1.6-1.7c-0.3-0.7-1.6-0.2-1.8-0.9'+
                'c-0.1-0.4,0.4-1.3,0.5-1.5c0.7-0.8,3-2,4.6-1.9c0.3,0,0.6,0.3,1,0.3c1.1,0.1,2.4-0.5,3.2,0c0.7-0.5,1.5,0.1,2.5-0.1'+
                'c0.7,0.5,0.5,1.5,1.7,2c0.3,0.1,0.7,0,1.1,0.1c0.3,0.1,0.6,0.5,1,0.6c0.5,0.2,0.9,0.2,1,0.6c0.1,0.4-0.3,0.6-0.3,1'+
                'c0.3,0.3,0,0.6,0.2,1c0.3,0.7,1,0.6,1.6,0.9c0.5,0.2,1.5,0.9,1.5,1.4c0,0.4-1,1-1.3,1.1c-0.2,0.1-1.3,0.7-1.7,0.6'+
                'c-0.6-0.1-0.8-1.5-1.7-1.4c-0.4,0-0.7,0.3-0.7,0.8c0,0.9,0.9,1,1,1.8c0,1-0.5,1-1.2,1.6c-0.5-0.2-1-0.6-1.7-0.6'+
                'c-0.4,0.5,0.7,0.7,0.3,1.4c-1,0.2-1.8-0.3-2.7-0.6c-0.3-0.1-0.7-0.1-1-0.2c-0.4-0.2-0.5-0.9-0.8-1.3c-0.3-0.4-1-1-1.6-1'+
                'c-0.8,0-1.9,1.1-2.5,0.1c0.4-1.6,2.5-0.4,3.8-1c0.5-0.2,0.7-0.8,1.1-1.1c0.8-0.5,2.2-0.6,2-1.7c-0.1-0.5-0.7-0.5-1.1-0.8'+
                'c-0.5-0.4-0.9-1.7-1.6-1.7c-0.4,0-0.6,0.3-1,0.4c-0.8,0.1-1.7-0.4-2.5,0c-0.3,0.2-0.1,0.6-0.4,1c-0.2,0.3-0.7,0.4-1,0.8'+
                'c-0.2,0.4-0.2,0.9-0.5,1.2c-0.5,0.5-1.6,0.6-2.3,0.9c-0.3,0.1-0.7,0.5-1,0.5c-0.5,0-0.7-0.8-1.3-0.5c0,0.8,0.7,1.1,1.2,1.4'+
                'c0.5,0.4,1.1,0.8,1.3,1.4c-0.5,1.2-1.3-0.1-2.2-0.1c-0.9,0-2.2,1.9-3,0.4c0.2-0.8,1-1,1.2-1.8c-0.9,0.2-1.7,1-2.7,1.3'+
                'c-0.4,0.1-0.9,0.1-1.3,0.2c-0.8,0.3-1.3,0.9-2.1,1.2c-0.3,0.1-0.7,0.1-1,0.2c-0.8,0.3-1.7,0.8-2.5,1.3c-0.8,0.5-1.7,1-2.2,1.5'+
                'c-0.3,0.3-1,1.2-1,1.5c0,0.4,0.7,0.6,0.8,1c0,0.3-0.4,0.8-0.1,1.2c0.3,0.3,0.8,0.1,1.3,0.1c1,0.1,1.6,1,2.4,1.5'+
                'c0.6,0.4,1.4,0.8,2,0.9c0.9,0.1,1.8-0.3,2,0.5c0.1,0.8-0.8,1-0.9,1.5c0.5,0.7-0.3,1-0.3,1.6c0,0.5,0.5,1.2,1,1.3'+
                'c0.6,0.1,1.6-0.7,1.8-1.4c0.3-0.9,0.2-2,0.8-2.7c3,0.1,5.5-1.5,5.3-4.9c0-0.3-0.2-0.8-0.1-1.2c0.1-0.6,0.9-1,0.8-1.7'+
                'c0.8-0.3,0.8-1.8,1.7-2c0.7-0.2,1.5,0.6,2.5,0.5c0.3,0,0.7-0.3,1-0.3c0.6,0.1,1,1,1.5,1.4c0.4,0.4,0.9,0.2,1,0.7'+
                'c-0.1,0.8-0.6,0.8-0.6,1.6c0,0.7,0.7,1.2,1,1.2c0.5,0.1,1.1-0.2,1.6-0.4c0.8-0.5,1.6-1.8,2.3-1.7c0.6,0.1,1,2.1,1.1,2.9'+
                'c0.1,0.8-0.1,1.4-0.1,2.1c0.1,1.2,1.4,1.1,2.1,1.7c0.2,0.2,0.3,0.7,0.4,0.9c0.3,0.5,0.7,0.5,0.8,1c0.1,1.2-1,1.3-0.9,2.7'+
                'c-0.2,0.5-0.8,0.5-0.8,1.2c0.1,1.1,1.5,0.3,1.9,1.1c0.2,0.5,0,0.8-0.2,1.5c0.5,0.7,0.5,1.7-0.4,1.7c-0.5,0-0.7-0.6-1.2-0.8'+
                'c-0.3-0.1-0.7-0.1-1.1-0.1c-0.3-0.1-0.7-0.2-1-0.2c-0.8-0.1-1.6,0.2-2.1-0.4c0.8-1.1,1.8-2.3,2.7-3.2c0.3-0.3,0.9-0.5,0.8-1.1'+
                'c-0.5-0.5-1.2,0-1.7,0.4c-0.5,0.3-1.2,0.8-1.8,0.9c-1.1,0.2-2.4-0.3-3.3,0.3c-0.1,0.5,1,0.3,0.8,1.1C92.8,43,92.4,43,92,42.7'+
                'c-0.3-0.3-0.1-0.8-0.3-0.9c-0.3-0.3-1.5-0.4-2.1-0.3c-0.7,0.1-1.3,0.6-1.3,1.2c0.8,0.4,2.1-0.4,2.4,0.6c-0.4,0.9-1.5,1.4-1.3,2.6'+
                'c0.1,0.5,0.5,1.1,0.9,1.1c0.3,0.1,0.5-0.3,0.9-0.3c0.4,0,0.3,0.5,0.7,0.4c0.6-0.3,1-1.3,1.7-1.2c0.8,1.2-0.8,1.7-1.7,2.1'+
                'c-1,0.4-2.3,0.6-3.1,1c-0.4,0.2-1.9,1.9-2.2,0.6c-0.2-0.9,0.8-0.7,1-1.4c-1-0.2-1.9,0.5-2.8,0.9c-1.3,0.5-3.4,0.9-3.8,2.5'+
                'c-0.1,0.3,0.1,0.9-0.1,1.1c-0.2,0.2-1.1,0.2-1.5,0.4c-0.6,0.2-1.2,0.7-1.5,0.9C77.7,54,77.2,54,77,54.1c-0.5,0.2-0.7,1-1.3,1.5'+
                'c-0.2,0.2-0.8,0.4-1,0.6c-0.3,0.4-0.4,1.3-1,1.4c-0.4,0-0.7-0.3-1-0.1c0,0.9,0.3,2.2-0.1,3.1c-0.8,0.7-1.6,1.2-2.5,1.8'+
                'c-0.5,0.3-1,0.4-1.7,0.8c-0.5,0.3-0.9,0.9-1.4,1.2c-1.2,0.8-2.7,1.8-2.7,3.8c0,0.4,0.2,0.9,0.3,1.4c0,0.3,0,0.6,0,0.9'+
                'c0.1,0.7,0.6,1.7,0,2.2c-0.9-0.4-1.9-0.5-2.5-1.2c-0.2-0.7,0.3-1.3,0.3-1.9c-0.1-0.5-0.7-1.4-1.1-1.5c-0.4-0.1-0.7,0.4-1.1,0.4'+
                'c-0.5,0-0.9-0.8-1.5-0.9c-0.9-0.1-1.6,0.2-2.5,0.1c-1,0.6-1.2,1.6-2.4,1.5c-0.4,0-0.8-0.4-1.3-0.5c-0.5-0.1-1.3-0.3-1.8-0.3'+
                'c-1.1,0.1-1.9,1-2.8,1.5c-0.8,0.5-2,1.1-2.2,2.1c-0.1,0.5,0,1.3-0.2,1.8c-0.1,0.3-0.4,0.6-0.5,0.9c-0.7,1.5-1.3,3.4-0.8,5.5'+
                'c0.1,0.3,0.8,2.1,1.1,2.4c0.3,0.4,1.3,1,1.8,1c0.5,0,1-0.3,1.5-0.4c0.5-0.1,1.2-0.1,1.7-0.3c1.4-0.5,1.1-2.6,2.5-3.3'+
                'c0.6-0.3,1.3-0.4,2.4-0.4c0.3,0.3,0.5,0.9,0.4,1.4c0,0.4-0.3,0.7-0.5,1.2c-0.1,0.5-0.2,1-0.3,1.4c-0.2,0.5-0.6,0.8-0.8,1.3'+
                'c-0.1,0.3,0,0.7-0.1,0.9c-0.1,0.5-0.7,0.8-0.4,1.3c1.4,0.6,3-0.2,4.2,0.1c0.5,0.1,1.5,0.8,1.5,1.7c0,0.7-0.4,1.1-0.5,1.8'+
                'c-0.1,0.9-0.4,2-0.4,2.7c-0.1,1.2,1.5,3.2,2.7,3.2L55.7,94.6z M39.1,54.2L31.7,54v11.2h10.3v-8.7L39.1,54.2z M52.2,35.7l7.5,0.1'+
                'V24.6H49.5l0,8.9 M39.1,54.2l2.9,2.3l10.3-20.8l-2.7-2.1L39.1,54.2z M47.2,46.4'

            }
        },

        // detail panel button definitions
        buttons: {
            src: {
                gid: '*src',
                tt: 'Set source node',
                cb: function (data) {
                    $log.debug('Set src action invoked with data:', data);
                    pps.setSrc(selection);
                }
            },
            dst: {
                gid: '*dst',
                tt: 'Set destination node',
                cb: function (data) {
                    $log.debug('Set dst action invoked with data:', data);
                    pps.setDst(selection);
                }
            }
        },

        // Key bindings for traffic overlay buttons
        // NOTE: fully qual. button ID is derived from overlay-id and key-name
        // FIXME: use into [ and ] instead of 1 and 2
        // FIXME: find better keys for shortest paths & disjoint paths modes
        keyBindings: {
            1: {
                cb: function () {
                    pps.setSrc(selection);
                },
                tt: 'Set source node',
                gid: '*src'
            },
            2: {
                cb: function () {
                    pps.setDst(selection);
                },
                tt: 'Set destination node',
                gid: '*dst'
            },
            3: {
                cb: function () {
                    pps.swapSrcDst();
                },
                tt: 'Swap source and destination nodes',
                gid: 'refresh'
            },
            4: {
                cb: function () {
                    pps.setMode("shortest");
                },
                tt: 'Set shortest paths mode',
                gid: '*jp'
            },
            5: {
                cb: function () {
                    pps.setMode("disjoint");
                },
                tt: 'Set disjoint paths mode',
                gid: '*djp'
            },
            6: {
                cb: function () {
                    pps.setMode("geodata");
                },
                tt: 'Set geodata path weight mode',
                gid: '*geo'
            },
            leftArrow: {
                cb: function () {
                    pps.prevPath();
                },
                tt: 'Highlight previous path',
                gid: 'prevIntent'
            },
            rightArrow: {
                cb: function () {
                    pps.nextPath();
                },
                tt: 'Highlight next path',
                gid: 'nextIntent'
            },

            _keyOrder: [
                '1', '2', '3', '4', '5', '6', 'leftArrow', 'rightArrow'
            ]
        },

        hooks: {
            // hook for handling escape key
            // Must return true to consume ESC, false otherwise.
            escape: function () {
                selectionCallback();
                pps.setSrc();
                pps.setDst();
            },

            // hooks for when the selection changes...
            empty: function () {
                selectionCallback();
            },
            single: function (data) {
                selectionCallback(data);
            }
        }
    };


    function buttonCallback(x) {
        $log.debug('Toolbar-button callback', x);
    }

    function selectionCallback(d) {
        $log.debug('Selection callback', d);
        selection = d;
    }

    // invoke code to register with the overlay service
    angular.module('ovPpTopov')
        .run(['$log', 'TopoOverlayService', 'PathPainterTopovService',

            function (_$log_, _tov_, _pps_) {
                $log = _$log_;
                tov = _tov_;
                pps = _pps_;
                tov.register(overlay);
            }]);

}());
