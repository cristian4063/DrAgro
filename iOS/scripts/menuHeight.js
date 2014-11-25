$(document).ready(function () {
    var height = window.innerHeight;
    height_fin = height + "px";
    $('#contentMenu').css('min-height', height_fin);
    $('#content').css('min-height', height_fin);
    setInterval("Tamanio()", 500);

});

function Tamanio() {
    var height = window.innerHeight;
    height_fin = height + "px";
    $('#contentMenu').css('min-height', height_fin);
    $('#content').css('min-height', height_fin);
}
