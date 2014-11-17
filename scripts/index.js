var applaunchCount = window.localStorage.getItem('launchCount');
var remoteFiles = [];
var networkState = "";

if(applaunchCount) {
    //document.location.href="busqueda.html";
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
        remoteFiles.push("https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_Productos2.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_EtapasCicloFenologico2.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_PartesPlanta2.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/jkx6w5xslzf9y4y/TATB_OrganismosProdEtaPla.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/ie1l7f1u7onma9h/TATB_Organismos.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/j23hllzu1fqwsos/TATB_OrganismosSubSec.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/7ywy8hjq6hrd78e/TATB_TipsDrAgro.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/m3v9dgv4u9tk3hz/TATB_ProductosEtapaPlanta.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/ieenjtoopot4vhj/TATB_ProductosEtapa.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/hukv30jx4p0nyxh/TATB_Fotos.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/s/ipci8cuofvlylk7/TATB_ProductoOrganismoFoto.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/u/75467020/TATB_OrganismosProdEtapa2.json");
        remoteFiles.push("https://dl.dropboxusercontent.com/u/75467020/TATB_FotosDrGaleria.json");

        setTimeout(function() {

            /*var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var ancho=windowWidth-(windowWidth/10);
            $('#content-alert').html('<p>Para utilizar esta aplicación correctamente primero debe descargar la información, desea descargarla ?</p>');
            $("#div-confirm").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                title: 'Advertencia',
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
            });*/

            var conf = confirm("Para utilizar esta aplicación correctamente primero debe descargar la información, desea descargarla ?");
            if (conf == true) {
                downloadFiles();
            } else {
                alert("La aplicación no funcionará correctamente hasta que descargue la información, para hacerlo dirijase al menu opción Acerca de Mí!!");
            }

        }, 400);
    }
    else
    {
        //abrirAlert("Debe tener conexión a internet para utilizar correctamente la aplicación");
        alert("Debe tener conexión a internet para utilizar correctamente la aplicación");
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
        
        //abrirConfirm("Descarga de informacíon exitosa!!");
        alert("Descarga de informacíon exitosa!!");

        return;
    }
    
    var remoteFile = remoteFiles.pop();

    var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);

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

/*function abrirAlert(contenido){

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

function abrirConfirm(contenido){

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
}*/