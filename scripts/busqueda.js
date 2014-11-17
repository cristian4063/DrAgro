var remoteFiles = [];
var networkState = "";
var numVersion = 0;

var organismos = new Array();
var relacionesCiclo=new Array();
var relacionesPlanta=new Array();
var Id_Producto_Seleccionado;
var ruta = "";
var id_Producto;
var id_EtapaCiclo;
var listadoIDS=[];
var listadoCaracteristicas=[];


/*---------------------------------------------ACTUALIZACIÓN DE INFORMACIÓN-----------------------------------------*/
$(document).ready(function() {
    var applaunchCount = window.localStorage.getItem('launchCount');
    
    if(applaunchCount) {
        changeLink();
        cargar_version();
    }

});

function downloadUpdate() {

    actualizarVersion();

    networkState = navigator.connection.type;

    if(networkState === "wifi" || networkState === "2g" || networkState === "3g" || networkState === "4g" || networkState === "unknown")
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

        setTimeout(function() {
            downloadFiles();
        }, 300);

    }
    else
    {
        alert("Para descargar la actualización debe tener conexión a internet");
        //abrirAlert("Para descargar la actualización debe tener conexión a internet");
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
        
        alert("Descarga de informacíon exitosa!!");
        //abrirConfirm("Descarga de informacíon exitosa!!");

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

function cargar_version() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "version", 200000);
    db.transaction(cargar_numero_version, errorCargar_version, function () {
        console.log("Consultó la versión")
    });
}

function cargar_numero_version(tx) {
    tx.executeSql("SELECT * FROM versiones", [], lista_productos, function (error) {
        console.log("Error consultado version: " + error)
    });
}

function lista_productos(tx, results) {
    
    var len = results.rows.length;
    var version = "https://dl.dropboxusercontent.com/u/75467020/TATB_DRAgroVer.json";

    $.getJSON("" + version + "", function(data) {   
        $.each(data, function (i, field) {
            if (data[i].VerDrAgro_No > results.rows.item(0).numero) {

                /*var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var ancho=windowWidth-(windowWidth/10);
                $('#content-alert').html('<p>Hay una nueva actualización disponible!!, desea descargarla ?</p>');
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
                            numVersion = data[i].VerDrAgro_No;
                            downloadUpdate();
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                            abrirAlert("La actualización estara disponible mas tarde!!");
                        }
                    }
                });*/
                
                var conf = confirm("Hay una nueva actualización disponible!!, desea descargarla ?");
                if (conf == true) {
                    numVersion = data[i].VerDrAgro_No;
                    downloadUpdate();
                } else {
                    alert("La actualización estara disponible mas tarde!!");
                }

            }
        });
    });
}

function actualizarVersion() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
    db.transaction(VersionActualizada, ErrorOperacion, OperacionEfectuada);
}

function VersionActualizada(tx) {
    tx.executeSql('UPDATE versiones SET numero = "' + numVersion + '" WHERE version_id = 1');
}

// Transaction error callback
function ErrorOperacion(err) {
    console.log(err);
    abrirAlert("Error procesando la operación: " + err);
}

function OperacionEfectuada() {
    console.log("Operación efectuada!");
}

function errorCargar_version(err) {
    console.log(err);
    abrirAlert("Error consultando listado productos" + err);
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

function changeLink(){
    $("#idLink").empty();
    $("#idLink").append('<a href="acerca.html" class="nav-regular">Acerca de Mí</a>');
}

/*---------------------------------------------CARGA DE PRODUCTOS, ETAPAS Y CICLOS DE LA FICHA TÉCNICA-----------------------------------------*/
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
    cargar_Productos();
    cargar_relaciones_EtapasCiclo();
    cargar_relaciones_partesPlanta() 
}

function fail(evt) {
    console.log(evt.target.error.code);
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
    var texto = "";
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="radio" name="producto" value="'+ results.rows.item(i).producto_id + '" onchange="cambioCheck(this)" />'+ results.rows.item(i).descripcion +'</h3>';
    }
    $("#producto").html(texto);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function cargar_relaciones_EtapasCiclo() 
{
    var relacionesTemp=new Array();
    var path = ruta + "TATB_ProductosEtapa.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            relacionesCiclo.push(field.Prod_Id+","+field.EtapaFen_Id);
        });      
    });
}

function cargar_relaciones_partesPlanta() 
{
    var relacionesTemp=new Array();
    var path = ruta + "TATB_ProductosEtapaPlanta.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            relacionesPlanta.push(field.Prod_Id+","+field.PartePlanta_Id+","+field.EtapaFen_Id);
        });
    });
}

function cambioCheck(element){
    if(element.checked){
        var id=element.getAttribute("value")
        Id_Producto_Seleccionado=id;
        cargar_EtapasCiclo(id)
        id_Producto=id;
    }
}

function cargar_EtapasCiclo(idproducto) 
{
    
    var path = ruta + "TATB_EtapasCicloFenologico2.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
        for(var j=0;j<relacionesCiclo.length-1;j++){
                var temp=relacionesCiclo[j].split(",")
                if(temp[1]==data[i].EtapaFen_Id&&temp[0]==idproducto)
                texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="radio" onchange="cambioCheckEtapa(this)" name="ciclo" value="' + data[i].EtapaFen_Id + '" />' + data[i].EtapaFen_Desc + '</h3>';
        }     
        }); 
        $("#ciclo").html(texto);
        $("#cicloFenImagenAyuda").css("display","inline-table");
    });
}

function cambioCheckEtapa(element){
    if(element.checked){
        var id=element.getAttribute("value")
        id_EtapaCiclo=id;
        cargar_PartesPlanta(id);
    }
}

function cargar_PartesPlanta(id) 
{
    var path = ruta + "TATB_PartesPlanta2.json";
    var texto = "";

    cont = 0;
    numeropp = 1;

    $.getJSON("" + path + "", function(data) {   
        for(var j=0;j<relacionesPlanta.length-1;j++){
        $.each(data, function (i, field) {
            var temp=relacionesPlanta[j].split(",")
                if(temp[1]==data[i].PartePlanta_Id&&temp[0]==id_Producto&&temp[2]==id_EtapaCiclo)
            texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="radio" name="parte"  value="' + data[i].PartePlanta_Id + '" />' + data[i].PartePlanta_Desc + '</h3>';
        });      
    }
        $("#parte").html(texto);
    });
}

/*----------------------------------CARGA DEL LISTADO DE ORGANISMOS SEGUN LOS FILTROS SELECCIONADOS------------------------------------*/
function Lista_Organismos() 
{
    var path = ruta + "TATB_OrganismosProdEtaPla.json";
    var texto = "";

    var Prod_Id = 0;
    var EtapaFen_Id = 0;
    var PartePlanta_Id = 0;


    $("input:radio[name=producto]:checked").each(function () {
        Prod_Id = $(this).val();
    });

    $("input:radio[name=ciclo]:checked").each(function () {
        EtapaFen_Id = $(this).val();
    });

    $("input:radio[name=parte]:checked").each(function () {
        PartePlanta_Id = $(this).val();
    });

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if (data[i].Prod_Id == Prod_Id && data[i].EtapaFen_Id == EtapaFen_Id && data[i].PartePlanta_Id == PartePlanta_Id) {
                organismos.push(data[i].Organismo_Id);
            }
        });      
        if (organismos !== null) {
            cargar_caracteristicas_ppales(organismos);
            organismos = new Array();
        }
    });
}

function cargar_caracteristicas_ppales(organismos){
    listadoCaracteristicas=[];
    var path = ruta + "TATB_OrganismosProdEtaPla.json";  
    var Prod_Id = 0;
    var EtapaFen_Id = 0;
    var PartePlanta_Id = 0;

    $("input:radio[name=producto]:checked").each(function () {
        Prod_Id = $(this).val();
    });

    $("input:radio[name=ciclo]:checked").each(function () {
        EtapaFen_Id = $(this).val();
    });

    $("input:radio[name=parte]:checked").each(function () {
        PartePlanta_Id = $(this).val();
    }); 
    $.getJSON("" + path + "", function(data) 
    {  
        $.each(data, function (i, field) {
            if (data[i].Prod_Id == Prod_Id && data[i].EtapaFen_Id == EtapaFen_Id && data[i].PartePlanta_Id == PartePlanta_Id) {
            listadoCaracteristicas.push(field);
        }
        })
        Cargar_ListaEnfermedades(organismos);
    })
}

function Cargar_ListaEnfermedades(organismos) 
{
    var path = ruta + "TATB_Organismos.json";
    var texto = "";

    var lista = $("#listadoEnfermedades");
    lista.empty();
    var caracteristicaPPal="";
    $.getJSON("" + path + "", function(data) {  
        texto += '<h1 style="font-weight:bold;font-style:Verdana">Listado Organismos:</h1>'; 
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] === data[i].Organismo_Id) 
                {
                    caracteristicaPPal=sacar_caracteristica_ppal(organismos[j])
                    texto += '<div class="decoration"></div>'+'<div style="padding-bottom:25px !important;">' +
                                '<h3 style="font-weight:bold;font-style:Verdana;text-align:center">' + data[i].Organismo_Desc + '</h3>' +                                
                                '<h3 style="font-weight:bold;font-style:Verdana;text-align:left">' + caracteristicaPPal + '</h3>' +
                                '<a onclick="Detalle_Organismo('+data[i].Organismo_Id+')" class="confirm"><div>' +
                                    '<img src="'+ruta+data[i].Organismo_Id+"_Organismo_0.jpg"+'" alt="img" style="border-radius:55%;width:150px;margin-left:auto;margin-right:auto">' +
                                    '<h4 style="font-weight:bold;font-style:Verdana;text-align:center">Leer más</h4>' +
                                '</div></a>' + '<div class="decoration"></div>' +
                            '</div>';
                }
            };
        });        
        $("#listadoEnfermedades").html(texto);        
        Mostrar_Listado();    
    });
}

function sacar_caracteristica_ppal(id_org){
        var Prod_Id = 0;
    var EtapaFen_Id = 0;
    var PartePlanta_Id = 0;
    var band=false;
    var cont=0;

    $("input:radio[name=producto]:checked").each(function () {
        Prod_Id = $(this).val();
    });

    $("input:radio[name=ciclo]:checked").each(function () {
        EtapaFen_Id = $(this).val();
    });

    $("input:radio[name=parte]:checked").each(function () {
        PartePlanta_Id = $(this).val();
    }); 
    var salida="";
    while(!band&&cont<listadoCaracteristicas.length){
        if (listadoCaracteristicas[cont].Prod_Id == Prod_Id && listadoCaracteristicas[cont].EtapaFen_Id == EtapaFen_Id && listadoCaracteristicas[cont].PartePlanta_Id == PartePlanta_Id&&listadoCaracteristicas[cont].Organismo_Id==id_org) 
        {
            salida=listadoCaracteristicas[cont].OrgProEtaPla_Caract;
            band=true;
        }else{
            cont++;
        }
    }
    return salida;
}

/*----------------------------------CARGA DE CARACTERÍSTICAS PRINCIPALES DEL PRODUCTO, CICLO Y ETAPA SELECCIONADO------------------------------------*/
function Detalle_Organismo(id_organismo)
{
    /*var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>La información contenida en este aplicativo es una guía que no reemplaza el acompañamiento del asistente técnico, dado que su aplicación depende de las condiciones específicas de cada área geográfica y por tanto su uso está bajo su responsabilidad</p>');
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
                $(".filtrosBusqueda").css("display", "none");
                $("#listadoEnfermedades").css("display", "none");
                cargarSecciones(id_organismo);
                $("#detalle").css("display", "block");
                $(this).dialog("close");
                GoToTopOfSection();
            },
            "Cerrar": function() {
                $(this).dialog("close");
                Mostrar_Listado();  
                GoToTopOfSection();
            }
        }
    });*/

    var conf = confirm("La información contenida en este aplicativo es una guía que no reemplaza el acompañamiento del asistente técnico, dado que su aplicación depende de las condiciones específicas de cada área geográfica y por tanto su uso está bajo su responsabilidad");
    if (conf == true) {
        $(".filtrosBusqueda").css("display", "none");
        $("#listadoEnfermedades").css("display", "none");
        cargarSecciones(id_organismo);
        $("#detalle").css("display", "block");
        GoToTopOfSection();
    } else {
        //Mostrar_Listado();
        //GoToTopOfSection();
    }
}

function GoToTopOfSection(){
    $('body,html').animate({
        scrollTop:0
    }, 800, 'easeOutExpo');
}

function cargarSecciones(id_organismo){
    var nombre_cient="";
    var path = ruta + "TATB_Organismos.json";
    var img = "";
    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if(field.Organismo_Id==id_organismo){
                $('#img_ppal').attr('src',ruta+field.Organismo_Id+"_Organismo_0.jpg")
                var ficha_tecnica='<table cellspacing="0" class="table">';

                if(field.Organismo_Genero.toUpperCase()!='NULL')
                    nombre_cient="<em>"+field.Organismo_Genero

                if(field.Organismo_Especie.toUpperCase()!='NULL')
                    nombre_cient+=" "+field.Organismo_Especie+"</em>"

                if(field.Organismo_Descriptor.toUpperCase()!='NULL')
                    nombre_cient+=' '+field.Organismo_Descriptor
                if(nombre_cient!="")
                ficha_tecnica+='<tr><td class="table-sub-title"> Nombre cientifico:</td><td>'+ nombre_cient +'</td></tr>'

                if(field.Organismo_Clase.toUpperCase()!='NULL'){
                    ficha_tecnica+='<tr><td class="table-sub-title"> Clase:</td><td>'+ field.Organismo_Clase+'</td></tr>'   
                }

                if(field.Organismo_Orden.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Orden:</td><td>'+field.Organismo_Orden+'</td></tr>'

                if(field.Organismo_Familia.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Familia:</td><td>'+ field.Organismo_Familia+'</td></tr>'

                if(field.Organismi_SubFamilia.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Subfamilia:</td><td>'+ field.Organismi_SubFamilia+'</td></tr>'
 
                if(field.Organismo_Tribu.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Tribu:</td><td>'+ field.Organismo_Tribu+'</td></tr>'

                if(field.Organismo_Genero.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Genéro:</td><td><p style="font-style: italic;">'+field.Organismo_Genero+'</p></td></tr>'

                if(field.Organismo_Especie.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Especie:</td><td> <p style="font-style: italic;">'+field.Organismo_Especie+'</p></td></tr></table>'

                if(field.Organismo_Comun.toUpperCase()!='NULL')
                    var nombre_comun='<h2>Nombre Común</h2><p>'+ field.Organismo_Comun+'</p>'
                document.getElementById('div_nombre_ppal').innerHTML='<h2>'+ field.Organismo_Comun+'</h2>';

                if(field.Organismo_Comun.toUpperCase()!='NULL')
                    var nombre_Cientifico='<h2>Nombre Científico</h2><p>'+ nombre_cient +'</p>'
                
                document.getElementById('div_nombre_Cientifico').innerHTML=nombre_Cientifico;
                cargarSubSecciones(field.Organismo_Id);
            }
        });
    });
}

function cargarSubSecciones(id_Organismo){
    var path = ruta + "TATB_OrganismosSubSec.json";
    var carac_grales="";
    var intro="";
    var geo="";
    var biologia_habitat="";
    var Hospederos="";
    var como_alimenta="";
    var diseminacion="";
    var ciclo_vida="";
    var comportamiento="";
    var distribucion_espacial="";
    var identificacion_prevencion="";
    var param_identificacion="";
    var man_poblaciones=""
    var estrategias_manejo="";
    var medidas_prevencion="";
    var metodos_control="";
    var referencias_bibliograficas="";
    var listado_registros="";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if(field.Organismo_Id==id_Organismo){

                switch(field.SubSecAgro_Id){
                    case 21:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            intro='<p>'+field.OrgSub_Desc+'</p><br />'
                        }
                        break;
                    }
                    case 22:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            geo='<p>'+field.OrgSub_Desc+'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_22.jpg" alt="" OnError="Error_Cargar()"></div>';
                        }
                        break;
                    }
                    case 31:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            Hospederos='<p>'+field.OrgSub_Desc+'</p><br />'
                            $('#img_hospederos').attr('src',ruta+id_Organismo+"_Organismo_31.jpg")
                            $('#img_hospederos').attr('OnError','Error_Cargar()')
                        }
                        break;
                    }
                    case 32:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            como_alimenta='<p>'+field.OrgSub_Desc+'</p><br />'     
                            $('#img_dano').attr('src',ruta+id_Organismo+"_Organismo_32.jpg")
                            $('#img_dano').attr('OnError','Error_Cargar()')
                        }
                        break;  
                    }
                    case 33:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            diseminacion='<p>'+field.OrgSub_Desc+'</p><br />' 
                            $('#img_diseminacion').attr('src',ruta+id_Organismo+"_Organismo_33.jpg")
                            $('#img_diseminacion').attr('OnError','Error_Cargar()')
                        }
                        break;  
                    }
                    case 34:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            ciclo_vida='<p>'+field.OrgSub_Desc+'</p><br />'
                            $('#img_ciclo').attr('src',ruta+id_Organismo+"_Organismo_34.jpg")
                            $('#img_ciclo').attr('OnError','Error_Cargar()')
                        }
                        break;
                    }
                    case 35:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            comportamiento='<p>'+field.OrgSub_Desc+'</p><br />'
                            $('#img_comportamiento').attr('src',ruta+id_Organismo+"_Organismo_35.jpg")
                            $('#img_comportamiento').attr('OnError','Error_Cargar()')
                        }
                        break;      
                    }
                    case 36:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            distribucion_espacial='<p>'+field.OrgSub_Desc+'</p><br />'
                            $('#img_distribucion').attr('src',ruta+id_Organismo+"_Organismo_31.jpg")
                            $('#img_distribucion').attr('OnError','Error_Cargar()')
                        }
                        break;      
                    }
                    case 10: {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            identificacion_prevencion=field.OrgSub_Desc+'<br />'
                            $('#img_parametros').attr('src',ruta+id_Organismo+"_Organismo_10.jpg")
                            $('#img_parametros').attr('OnError','Error_Cargar()')
                        }
                        break;
                    }
                    case 41:
                    {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            medidas_prevencion='<p>'+field.OrgSub_Desc+'</p><br />'
                            $('#img_prevencion').attr('src',ruta+id_Organismo+"_Organismo_41.jpg")
                            $('#img_prevencion').attr('OnError','Error_Cargar()')
                        }
                    }
                    case 42:
                    {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            metodos_control='<p>'+field.OrgSub_Desc+'</p><br />'
                            $('#img_control').attr('src',ruta+id_Organismo+"_Organismo_42.jpg")
                            $('#img_control').attr('OnError','Error_Cargar()')
                        }
                    }
                    case 50:
                    {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            listado_registros='<p>'+field.OrgSub_Desc +'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_50.jpg" alt="" OnError="Error_Cargar()"></div></div>'
                        }
                    }
                    case 60:
                    {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            referencias_bibliograficas='<p>'+field.OrgSub_Desc +'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_60.jpg" alt="" OnError="Error_Cargar()"></div></div>'
                        }
                    }
                }
            }
        });
        if(intro!="" && geo!=""){
            document.getElementById('Descripcion_H').innerHTML=intro;
            document.getElementById('Dist_Geo_H').innerHTML=geo;
        }
        else if(intro!=""){
            document.getElementById('Descripcion_H').innerHTML=intro;
            document.getElementById('Dist_Geo_p').innerHTML="";
        }else if(geo!=""){
            document.getElementById('Dist_Geo_p').innerHTML=geo;
            document.getElementById('Descripcion_H').innerHTML="";
        }else{
            document.getElementById('div_caracteristicas_grales').innerHTML="";
        }
        if(Hospederos!=""||como_alimenta!=""||diseminacion!=""||ciclo_vida!=""||comportamiento!=""||distribucion_espacial!=""||identificacion_prevencion!=""){
            
            if(Hospederos!=""){
                document.getElementById('Hospederos_H').innerHTML=Hospederos;
            }else{
                document.getElementById('Hospederos_P').innerHTML="";
            }
            if(como_alimenta!=""){
                document.getElementById('como_alimenta_H').innerHTML=como_alimenta;
            }else{
                document.getElementById('como_alimenta_P').innerHTML="";
            }
            if(diseminacion!=""){
                document.getElementById('diseminacion_H').innerHTML=diseminacion;
            }else{
                document.getElementById('diseminacion_P').innerHTML="";
            }
            if(ciclo_vida!=""){
                document.getElementById('ciclo_vida_H').innerHTML=ciclo_vida;
            }else{
                document.getElementById('ciclo_vida_P').innerHTML="";
            }
            if(comportamiento!=""){
                document.getElementById('comportamiento_H').innerHTML=comportamiento;
            }else{
                document.getElementById('comportamiento_P').innerHTML=comportamiento;
            }
            if(distribucion_espacial!=""){
                document.getElementById('distribucion_espacial_H').innerHTML=distribucion_espacial;
            }else{
                document.getElementById('distribucion_espacial_P').innerHTML="";
            }       
        }else{
            document.getElementById('Biologia_Habitat_ppal').innerHTML="";
        }
        if(metodos_control!="" && medidas_prevencion!=""){
            document.getElementById('Prevencion_H').innerHTML=medidas_prevencion;
            document.getElementById('control_H').innerHTML=metodos_control;
        }else if(metodos_control!=""){
            document.getElementById('Prevencion_P').innerHTML="";
            document.getElementById('control_H').innerHTML=metodos_control;
        }else if(medidas_prevencion!=""){
            document.getElementById('Prevencion_P').innerHTML=medidas_prevencion;
            document.getElementById('control_H').innerHTML="";
        }else{
            document.getElementById('Estrategias_Manejo_ppal').innerHTML="";
        }    

        if(referencias_bibliograficas!=""){
            document.getElementById('bibliografia_H').innerHTML='<p>'+referencias_bibliograficas +'</p>';
        }else{
            document.getElementById('bibliografia_P').innerHTML=""; 
        }

        if(listado_registros!=""){
            document.getElementById('registros_H').innerHTML='<h2>Listado de registros nacionales químicos de uso agrícola</h2>'+listado_registros+''; 
        }else{
            document.getElementById('registros_P').innerHTML=""; 
        }
        
        if(identificacion_prevencion!=""){
            document.getElementById('parametros_H').innerHTML=identificacion_prevencion;
        }else{
            document.getElementById('parametros_P').innerHTML="";
        }      
    });
}

function Mostrar_Listado()
{
    $("#detalle").css("display", "none");
    $("#listadoEnfermedades").css("display", "block");
    $(".filtrosBusqueda").css("display", "block");
}