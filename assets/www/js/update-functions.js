var data2SaveCat = new Array;

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

			/*for( var i = 0; i < empObjectLen; i++ ) {
                data2Save[i] = empObject[i];
            }*/
			data2Save = empObject;

			db = window.openDatabase( "all-brands", "1.0", "all-brands", 700000 );		
			db.transaction( populateDB, errorCB, successCB );
			db.transaction( queryDB, errorCB );
        },
		error: function( data ) {
            //navigator.notification.alert("hubo un error");
			console.log("There is no Internet conecction");
        }
    });
}

function errorCB( err ) {
	alert("error procesing SQL " + err.code);
}

function successCB() {
	console.log("Success!");
	db.transaction( queryDB, errorCB );
}

function queryDB( tx ) {
	tx.executeSql( "SELECT * FROM products", [], querySuccess, errorCB );
}

function querySuccess( tx, result ) {
	var len = result.rows.length;
	
	/*for( var i = 0; i < len; i++ ) {
		//console.log( "Names: " + result.rows.item(i).title );
		//console.log( "Names: " + result.rows.item(i).price );
		//console.log( "Names: " + result.rows.item(i).status );
	}*/
}

/* Create database and populate it */
function populateDB( tx ) {
	var desc, query;
	var createTable = "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description BLOB NULL,	price REAL NULL,brand TEXT NULL,category TEXT NULL,status TEXT NULL)";
	
	tx.executeSql( createTable );
	
	for( var i = 0; i < data2Save.length; i++ ) {
		desc = data2Save[i].description;
		desc = addslashes( desc );
		//--console.log("desc: " + desc);
		//--desc = '';
		query = "INSERT INTO products(title, description, price, brand, category, status) VALUES('" + data2Save[i].title + "', '" + desc + "','" + data2Save[i].price + "','" + data2Save[i].brand + "','" + data2Save[i].category + "','" + data2Save[i].status + "')";
		//--console.log( query );
		tx.executeSql( query );
	}
	
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
var bus={
    category:'Laptops',
    brand:'Apple',
    filterBrand:function(category){
        var sql_c;
        if(category=='')
            sql_c="SELECT brand FROM products GROUP BY brand"
        else
            sql_c="SELECT brand FROM products WHERE category='"+category+"' GROUP BY brand"
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
                           // console.log("--->limpiar");
                            dBhtml='';
                        }
                        $('#div_brand').html(dBhtml);
                    }
            );
        });
        
    }
};
