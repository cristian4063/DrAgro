var producto_id = 0;
var descripcion = "";

var listaImagenes = [];
var listaProductos = [];

/*---------------------------------------------CARGA DE CULTIVOS DESDE ARCHIVOS-----------------------------------------*/
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

var ruta = "";

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
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

    if(ruta != "") {
        window.localStorage.setItem("ruta", ruta);
        cargar_Productos();
    }
}

function cargar_Productos() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Productos", 200000);
    db.transaction(cargar_lista_productos, errorCargar_productos, function () {
        console.log("Consultó los productos")
    });
}

function cargar_lista_productos(tx) {
    tx.executeSql("SELECT * FROM productos", [], crear_lista_productos, function (error) {
        console.log("Error consultado productos: " + error)
    });
}

function crear_lista_productos(tx, results) {
    var len = results.rows.length;
    var path = ruta + "TATB_Productos2.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) { 
        $.each(data, function (i, field) {
            texto += '<h3 style="margin-left:20px;font-family:Verdana;" id="prod_'+ i +'" name="titulo"><input type="checkbox" id="'+data[i].Prod_Id+'" name="producto" value="' + data[i].Prod_Id + '_' + data[i].Prod_Desc + ' "/>'+ data[i].Prod_Desc +'</h3>';
        }); 

        $("#producto").html(texto);
        seleccionarCheckbox(results);

    });
}

function seleccionarCheckbox(results){
    var len = results.rows.length;

    var check=$('[name="producto"]');
    var titulos=$('[name="titulo"]'); 

    for(var i=0;i<check.length;i++){
        var id1=check[i].getAttribute("id")
        for(var j=0;j<len;j++){
            var id2=results.rows.item(j).producto_id;
            if(id1==id2){
                $("#prod_"+ i +"").remove();
            }
        
        }
    }
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function fail(evt) {
    console.log(evt.target.error.code);
}

/*---------------------------------------------DESCARGA DE CULTIVOS SELECCIONADOS-----------------------------------------*/
function guardarListaProductos() {

    var networkState = navigator.connection.type;

    if(networkState === "wifi" || networkState === "2g" || networkState === "3g" || networkState === "4g") {

        $("#loading").text("Descargando...");
        $("#status").fadeIn();
        $("#preloader").fadeIn();

        var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
        db.transaction(GuardarProducto, ErrorOperacion, OperacionEfectuada);

    }
    else {
        abrirAlert("Debe tener conexión a internet");
    }
}

function GuardarProducto(tx) {
    
    $("input:checkbox[name=producto]:checked").each(function () {

        var temp = $(this).val();
        producto_id = temp.substring(0, temp.lastIndexOf('_'));
        descripcion = temp.substring(temp.lastIndexOf('_') + 1);
        
        tx.executeSql('INSERT INTO productos (producto_id, descripcion) VALUES ("' + producto_id + '", "' + descripcion + '")');

        listaProductos.push(producto_id);

        if(listaProductos.length == $("input:checkbox[name=producto]:checked").length)
        {
            BuscarImagenes();
        }

    });
}

function BuscarImagenes() 
{
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_ProductoOrganismoFoto.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            for (var j = 0; j < listaProductos.length; j++) {
                if(field.Prod_Id == listaProductos[j])
                {
                    listaImagenes.push(field.Organismo_Foto);
                }
            };
        });
        downloadImages();
    });
}

function downloadImages() {

    if (listaImagenes.length == 0) {
        $("#status").fadeOut();
        $("#preloader").fadeOut();
        listaProductos = [];
        abrirConfirm("Descarga de informacíon exitosa!!");

        return;
    }
    
    var remoteFile = listaImagenes.pop();

    var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        var dirReader = fileSystem.root.createReader();
        dirReader.readEntries(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if(entries[i].name === "DrAgro")
                {
                    entries[i].getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        var localPath = fileSystem.root.toURL() + "/DrAgro/" + localFileName;
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(remoteFile,
                        localPath, function(entry) {
                            downloadImages();
                        }, fail);
                    }, fail);
                }
            };
        }, fail);
    }, fail);
}

function ErrorOperacion(err) {
    console.log(err);
    alert("Error procesando la operación: " + err);
}

function OperacionEfectuada() {
    console.log("Operación efectuada!");
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