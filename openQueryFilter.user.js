// ==UserScript==
// @name        TracHacks
// @namespace   Trac
// @include     *trac*/query*
// @version     1
// @grant       none
// ==/UserScript==

document.onreadystatechange = function(state){
    if(document.readyState === 'complete'){
        var el = document.getElementById('filters');
        el.setAttribute('class','');
    }

}
