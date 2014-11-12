var organismos = new Array();
var ruta = "";
var incremento = 0;
var consejos = new Array();
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    //fileSystem.root.getFile("TATB_Productos2.json", null, gotFileEntry, fail);

    var dirReader = fileSystem.root.createReader();
    dirReader.readEntries(success, fail);
}

function success (entries) {
    for (var i = 0; i < entries.length; i++) {
        if(entries[i].name === "DrAgro")
        {
            entries[i].getFile("TATB_Productos2.json", null, gotFileEntry, fail);
        }
    };
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
}

function gotFile(file){

    var path = file.fullPath;
    ruta = path.substring(0, path.lastIndexOf('/') + 1);

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
            //document.location.href="consejos.html";           
        }else{            
            //conteo = consejos.indexOf(data[incremento].DrAgroTips_Desc);       

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
            //document.location.href="consejos.html";           
        }else if(incremento < consejos.length && incremento >1){   
        incremento--;  
        incremento--; 
              
            //conteo = consejos.indexOf(data[incremento].DrAgroTips_Desc);       

            texto += '<p style="font-size:18px;margin-right:15px;margin-left:15px;margin-top:15px">' + consejos[incremento] + '</p>' + '<p style="font-size:18px;text-align:center">Consejo ' + (incremento +1) + ' de ' + (consejos.length) + '</p>';        

            $("#consejosDrAgro").html(texto); 
                    
            incremento++;
        }
}

function abrirAlert(contenido){

var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
    modal: true,
    draggable: false,
    resizable: false,
    title: 'Advertencia',
    minWidth:ancho,
    //position: ['center', 'top'],
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