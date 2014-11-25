var applaunchCount = window.localStorage.getItem('launchCount');
var remoteFiles = [];
var networkState = "";

if(applaunchCount) {
    document.location.href="busqueda.html";
}
else {
    configurar_db();
    init();
}

function init(){
    document.addEventListener("deviceready", download, true);
}

function download() {

    networkState = navigator.connection.type;

    if(networkState === "wifi" || networkState === "2g" || networkState === "3g" || networkState === "4g")
    {
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_Productos2.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_EtapasCicloFenologico2.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_PartesPlanta2.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_OrganismosProdEtaPla.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_Organismos.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_OrganismosSubSec.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_TipsDrAgro.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_ProductosEtapaPlanta.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_ProductosEtapa.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_Fotos.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_ProductoOrganismoFoto.json");
        remoteFiles.push("http://www.siembra.co/netcorpoica/WebNetAgroNetTec/WebNetAgroNetTec/Pg_GestArchivos/Archivos_DrAgro/TATB_FotosDrGaleria.json");

        setTimeout(function() {

            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var ancho=windowWidth-(windowWidth/10);
            $('#content-alert').html('<p>Para utilizar esta aplicación correctamente primero debe descargar la información, desea descargarla ?</p>');
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
                        downloadFiles();
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                        abrirAlert("La aplicación no funcionará correctamente hasta que descargue la información, para hacerlo dirijase al menu opción Acerca de Mí!!");
                    }
                }
            });

        }, 400);
    }
    else
    {
        abrirAlert("Debe tener conexión a internet para utilizar correctamente la aplicación");
    }
}

function downloadFiles() {
    $("#loading").text("Descargando información...");
    $("#status").fadeIn();
    $("#preloader").fadeIn();

    downloadArchieves();
}

function downloadArchieves() {

    if (remoteFiles.length == 0) {
        $("#status").fadeOut();
        $("#preloader").fadeOut();
        
        window.localStorage.setItem('launchCount', 1);
        
        abrirConfirm("Descarga de informacíon exitosa!!");

        return;
    }
    
    var remoteFile = remoteFiles.pop();

    var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
    //var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1, remoteFile.lastIndexOf('?')) + ".json";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
            var localPath = fileSystem.root.toURL() + localFileName;
            if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                localPath = localPath.substring(7);
            }
            var ft = new FileTransfer();
            ft.download(remoteFile,
                localPath, function(entry) {
                    downloadFiles();
                }, fail);
        }, fail);
    }, fail);
}

function fail(error) {
    console.log(error.code);
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

function abrirConfirm(contenido)
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
                document.location.href="adminCultivo.html";
            }
        }
    });
}