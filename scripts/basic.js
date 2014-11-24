/*
 * SimpleModal Basic Modal Dialog
 * http://simplemodal.com
 *
 * Copyright (c) 2013 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var myScroll;

function abrirModal(element)
{
    var src=$(element).attr( "src" )
    $('#rect').attr('src',src)
    $('#rect').css('width','100%')
    $('#rect').css('height','auto')
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    var alto=windowHeight-(windowHeight*0.25);
	$("#basic-modal-content").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        minWidth:ancho,
        minHeight:alto,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "cerrar": function() {
                $(this).dialog("close");
            }
        }
    }).position({
       my: "center",
       at: "center",
       of: window
    });
    zoom();   
}

function abrirModalCiclo(src)
{
    $('#rect').attr('src',src)
    $('#rect').css('width','100%')
    $('#rect').css('height','auto')
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    var alto=windowHeight-(windowHeight*0.25);
    $("#basic-modal-content").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        minWidth:ancho,
        minHeight:alto,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "cerrar": function() {
                $(this).dialog("close");
            }
        }
    }).position({
       my: "center",
       at: "center",
       of: window
    });
    zoom();   
}

function zoom()
{
    myScroll = new IScroll('#pinchzoom', {
        zoom: true,
        scrollX: true,
        scrollY: true,
        mouseWheel: true,
        wheelAction: 'zoom'
    });
}