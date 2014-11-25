var listaImagenes = [];
var listaProductos = [];

/*---------------------------------------------CARGA DE CULTIVOS DESCARGADOS-----------------------------------------*/
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

/*---------------------------------------------ELIMINACIÓN DE CULTIVOS SELECCIONADOS-----------------------------------------*/

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
    var texto = "";
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="checkbox" name="producto" value="'+ results.rows.item(i).producto_id + '"/>'+ results.rows.item(i).descripcion +'</h3>';
    }
    $("#producto").html(texto);
}

function eliminarProductos() {
    
    $("#loading").text("Eliminando...");
    $("#status").fadeIn();
    $("#preloader").fadeIn();

    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
    db.transaction(EliminarCultivos, ErrorOperacion, OperacionEfectuada);

}

function EliminarCultivos(tx) {

    $("input:checkbox[name=producto]:checked").each(function () {
        
        var id = $(this).val();
        
        tx.executeSql('DELETE FROM productos WHERE producto_id = "' + id + '"');
        
        listaProductos.push(id);

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
        deleteImages();
    });
}

function deleteImages() 
{
    if (listaImagenes.length == 0) {
        $("#status").fadeOut();
        $("#preloader").fadeOut();
        listaProductos = [];
        abrirConfirm("Eliminación de informacíon exitosa!!");

        return;
    }

    var remoteFile = listaImagenes.pop();
    
    var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
        
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

        fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
            fileEntry.remove(function(entry) {
                deleteImages();
            }, fail);
        }, fail);

    }, fail);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function ErrorOperacion(err) {
    console.log(err);
    alert("Error procesando la operación: " + err);
}

function OperacionEfectuada() {
    console.log("Operación efectuada!");
}

//Funcion Fallo
function fail(error) {
    console.log(error.code);
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
                document.location.href="elimCultivo.html";
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