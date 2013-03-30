
            /*function onLoad() {
                if (navigator.onLine)
                    onOnline();
                else
                    offOnline();
                window.addEventListener('online', onOnline, false);
                window.addEventListener('offline', offOnline, false);
            }*/

// Handle the online event
//
            /*function onOnline() {
                $.mobile.changePage("#page_contact", "slideup");

            }*/
            /*function offOnline() {
                //alert("Lo sentimos");
                $.mobile.changePage("#page_contact_off", "slideup");

            }*/
function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
            
            /*
            $(document).ready(function() {
            	
            });*/

var db;
var data2Save = new Array();
var data2SaveCat = new Array;
document.addEventListener( "deviceready", function() {
	document.addEventListener( "online", function() {
        //--$.mobile.changePage("#page_contact", "slideup");
	}, false );

	document.addEventListener( "offline", function() {
        //--$.mobile.changePage("#page_contact_off", "slideup");
	}, false );
	
    checkUpdates();
} );
checkUpdates();//gaston
//filterBrand('Laptops');//gaston
var bus={
    category:'Laptops',
    brand:'Apple',
    filterBrand:function(category){
        var sql_c="SELECT brand FROM products WHERE category='"+category+"' GROUP BY brand"
        //console.log("--->" + sql_c);
        db.transaction(function(tx) {
            tx.executeSql(sql_c, [],
                    function(tx, results) {
                        var len = results.rows.length, i,j,dBhtml,c,image;
                        if (len > 1) {
                            //console.log("--->crear listado");
                            dBhtml='';
                            c=1;
                            for (i = 0; i < len; i++) {
                               //console.log("--brand->" + results.rows.item(i).brand);
                                for (j = 0; j < data2SaveCat.length; j++) {
                                    if(data2SaveCat[j]['title']==results.rows.item(i).brand)
                                        image=data2SaveCat[j]['image'];
                                }
                                if (c == 1) {
                                    type = 'a';
                                } else {
                                    if (c == 2) {
                                        type = 'b';
                                    } else {
                                        type = 'c';
                                    }
                                }
                                dBhtml+='<div class="ui-block-'+type+'"><a href="#" onclick="bus.brand=\''+results.rows.item(i).brand+'\'"><img src="images/'+image+'"/></a></div>';
                                c++;
                                if(c==4){
                                    c=1;
                                }
                            }
                        } else {
                            console.log("--->limpiar");
                            dBhtml='';
                        }
                        $('#div_brand').html(dBhtml);
                    }
            );
        });
        
    }
};
function checkUpdates() {
    $.ajax({
		url:'http://www.codigobase.com/all-brands/getData.php',
        dataType: 'json',
		success: function( data ) {
            //--navigator.notification.beep(2);
            //--navigator.notification.alert("hay nuevos datos");

            var empObject = eval('(' + JSON.stringify(data) + ')');
            var empObjectLen = empObject.length;

            console.log("longitud " + empObjectLen);
            //--console.log("valor: " + empObject);

			for( var i = 0; i < empObjectLen; i++ ) {
                data2Save[i] = empObject[i];
            }

			db = window.openDatabase( "all-brands", "1.0", "all-brands", 700000 );		
			db.transaction( populateDB, errorCB, successCB );
			db.transaction( queryDB, errorCB );
        },
		error: function( data ) {
            navigator.notification.alert("hubo un error");
        }
    });
}

function errorCB( err ) {
	alert("error procesing SQL " + err.code);
}

function successCB() {
	alert("Success!");
	db.transaction( queryDB, errorCB );
}

function queryDB( tx ) {
	tx.executeSql( "SELECT * FROM products", [], querySuccess, errorCB );
}

function querySuccess( tx, result ) {
	var len = result.rows.length;
	
	for( var i = 0; i < len; i++ ) {
		//console.log( "Names: " + result.rows.item(i).title );
		//console.log( "Names: " + result.rows.item(i).price );
		//console.log( "Names: " + result.rows.item(i).status );
	}
}

/* Create database and populate it */
function populateDB( tx ) {
	var desc, query;
	var createTable = "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description BLOB NULL,	price REAL NULL,brand TEXT NULL,category TEXT NULL,status TEXT NULL)";
	//tx.executeSql( "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL)" );
	tx.executeSql( createTable );
	
	//tx.executeSql( "INSERT INTO products(title, description, price, brand, category, status) VALUES('P3113', 'Samsung Galaxy Tab 2 P3113 NVIDIA Tegra 2 1.0GHz 7\"(1024x600) 8GB BT GPS 2 Webcams Android 4.0 (Ice-Cream-Sandwich) White','159.00','Samsung','Electronics','Refurbished')" );
	
	for( var i = 0; i < data2Save.length; i++ ) {
		desc = data2Save[i].description;
		desc = addslashes( desc );
		//console.log("desc: " + desc);
		desc = '';
		query = "INSERT INTO products(title, description, price, brand, category, status) VALUES('" + data2Save[i].title + "', '" + desc + "','" + data2Save[i].price + "','" + data2Save[i].brand + "','" + data2Save[i].category + "','" + data2Save[i].status + "')";
		//console.log( query );
		tx.executeSql( query );
		//console.log( "INSERT INTO products(title, description, price, brand, category, status) VALUES('" + data2Save[i].title + "', '" + ; + "','" + data2Save[i].price + "','" + data2Save[i].brand + "','" + data2Save[i].category + "','" + data2Save[i].status + "')" );
	}
	
	//--tx.executeSql( "INSERT INTO products(title, description, price, brand, category, status) VALUES('juan', 'Desarrollador de softwaare','200.54','hp','laptop','refurbished')" );
	//tx.executeSql( "INSERT INTO products(title, description, price) VALUES('juan', 'Desarrollador de softwaare','100')" );
	//--tx.executeSql( "INSERT INTO products(title, description, price, brand, category, status) VALUES('gaston', 'Dise�o de software','247.54','Acer','tablet','new')" );
	//tx.executeSql( "INSERT INTO products(title, description, price) VALUES('gaston', 'Dise�o de software','450')" );

    
        tx.executeSql("DROP TABLE IF EXISTS categories");
        var createTable = "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description BLOB NULL,image TEXT NOT NULL)";
        tx.executeSql( createTable );
        
        data2SaveCat = new Array;
        data2SaveCat.push({title:"Apple",description:"",image:"logo_apple.png"});
        data2SaveCat.push({title:"Asus",description:"",image:"logo_asus.png"});
        data2SaveCat.push({title:"Hp",description:"",image:"logo_hp.png"});
        data2SaveCat.push({title:"Samsung",description:"",image:"logo_samsung.png"});
        data2SaveCat.push({title:"Sony",description:"",image:"logo_sony.png"});
        data2SaveCat.push({title:"Toshiba",description:"",image:"logo_toshiba.png"});
        data2SaveCat.push({title:"Acer",description:"",image:"logo_acer.png"});
        for( var i = 0; i < data2SaveCat.length; i++ ) {
		var cTit = data2SaveCat[i].title;
                var cDes ="1";
		var cImg = data2SaveCat[i].image;
                //console.log("--->" + i);
		query = "INSERT INTO categories(title, description, image) VALUES('" + cTit+ "', '" + cDes + "','images/" + cImg + "')";
		//console.log("-->"+ query );
		tx.executeSql( query );		
	}
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