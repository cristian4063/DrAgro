function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS productos (producto_id, descripcion)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS versiones (version_id, numero)');
    }

    function IngresarVersion(tx) {
        tx.executeSql('INSERT INTO versiones (version_id, numero) VALUES (1, 1)');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Productos", 200000);
    db.transaction(execute, error, exito);
    db.transaction(IngresarVersion, error, exito);

}
