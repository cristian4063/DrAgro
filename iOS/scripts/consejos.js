var organismos = new Array();
var ruta = "";
var incremento = 0;
var consejos = new Array();

$(document).ready(function() {
    var applaunchCount = window.localStorage.getItem('launchCount');
    
    if(applaunchCount) {
        changeLink();
    }
    else {
        abrirRedirect("Para acceder a esta sección por primera vez es necesario descargar información de internet, una vez tenga conectividad, por favor reinicie la aplicación.");
    }

});

function changeLink(){
    $("#idLink").empty();
    $("#idLink").append('<a href="acerca.html" class="nav-regular">Acerca de Mí</a>');
}

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("TATB_Productos2.json", null, gotFileEntry, fail);
    ruta = fileSystem.root.toURL();
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
}

function gotFile(file){
    cargar_Consejos();
}

function fail(evt) {
    console.log(evt.target.error.code);
}

function cargar_Consejos()
{
    var path = ruta + "TATB_TipsDrAgro.json";     
    
    consejos = new Array();    
    
    var conteo = "";    
    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if (data[i].DrAgroTips_Estado === "1") {  
                consejos.push(data[i].DrAgroTips_Desc);                        
            }
        });
        consejoSiguiente();
    });
}

function consejoSiguiente(){    
    var texto = "";
    
    if(incremento >= consejos.length){
        incremento = 0;
        texto += '<p style="font-size:18px;margin-right:15px;margin-left:15px;margin-top:15px">' + consejos[incremento] + '</p>' + '<p style="font-size:18px;text-align:center">Consejo ' + (incremento +1) + ' de ' + (consejos.length) + '</p>';        
        $("#consejosDrAgro").html(texto); 
        incremento++;   
    }else{                 

        texto += '<p style="font-size:18px;margin-right:15px;margin-left:15px;margin-top:15px">' + consejos[incremento] + '</p>' + '<p style="font-size:18px;text-align:center">Consejo ' + (incremento +1) + ' de ' + (consejos.length) + '</p>';
        $("#consejosDrAgro").html(texto); 
        incremento++;        
    }
}

function consejoAnterior(){    
    var texto = "";
    
    if(incremento >= consejos.length){
        incremento = 0;
        texto += '<p style="font-size:18px;margin-right:15px;margin-left:15px;margin-top:15px">' + consejos[incremento] + '</p>' + '<p style="font-size:18px;text-align:center">Consejo ' + (incremento +1) + ' de ' + (consejos.length) + '</p>';
        $("#consejosDrAgro").html(texto); 
        incremento++;     
    }else if(incremento < consejos.length && incremento >1){   
        incremento--;  
        incremento--; 
        texto += '<p style="font-size:18px;margin-right:15px;margin-left:15px;margin-top:15px">' + consejos[incremento] + '</p>' + '<p style="font-size:18px;text-align:center">Consejo ' + (incremento +1) + ' de ' + (consejos.length) + '</p>';
        $("#consejosDrAgro").html(texto);   
        incremento++;
    }
}

function abrirAlert(contenido)
{
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Aviso',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function abrirRedirect(contenido)
{
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Aviso',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                document.location.href="index.html";
            }
        }
    });
}