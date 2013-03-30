var db;
var data2Save = new Array();
var deviceIsOnLine = false;
var updateChecked = false;

document.addEventListener( "deviceready", function() {
	document.addEventListener( "online", function() {
		deviceIsOnLine = true;
	}, false );

	document.addEventListener( "offline", function() {
		deviceIsOnLine = false;
	}, false );
	
	if( !updateChecked && useUpdateFunctions ) {
		checkUpdates();
		updateChecked = true;
	}
} );

function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$(document).on("mobileinit", function() {
	//apply overrides here
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});

function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

function enviaContacto() {
	if( deviceIsOnLine ) {
		if ($('#txtCName').val() == '') {
	        alert("Nombre requerido");
	        return false;
	    }
	    if ($('#txtCMail').val() == '') {
	        alert("Correo requerido");
	        return false;
	    } else {
	        if (IsEmail($('#txtCMail').val()) === false) {
	            alert("Correo Formato invalido");
	            return false;
	        }

	    }
	    if ($('#txtCMsg').val() == '') {
	        alert("Comentario requerido");
	        return false;
	    }
	    $.ajax({
	        type: "POST",
	        url: "http://www.partedelcodigo.com/allb/send_contact.php",
	        dataType: 'json',
	        data: $('#form_contact').serialize()
	    }).done(function(msg) {
	        //alert(msg);
	        if (msg.has_sent == 'ok') {
	            alert("Mensaje Enviado");
	        }
	        else {
	            alert("Mensaje No Enviado, intente mas tarde");
	        }

	    });
	    return false;
	}
	else {
		navigator.notification.alert("Necesita tener conecci\u00f3n a Internet para realizar el envio del fomulario.", function() {}, "Formulario de Contactos", "Aceptar");
	}
}