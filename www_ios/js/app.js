/**
    Con éste script disparamos los eventos necesarios cuando la aplicación
    es lanzada para determinar cuando está lista para ser manejada.

    Como funciona?

    Primero verifica que el dispositivo esté listo para ser accedido por la api
    luego verifica la conexión a internet. Si no tiene acceso agrega la clase
    al body "no-internet". De lo contrario no usa ésta clase y deja el body limpio.

    Se pueden hacer selectores para que aparezca un mensaje en alguna opción que
    necesite acceso a internet para funcionar correctamente.
*/
$("input[type='checkbox']").prop( "checked", false );

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onChangeConnection, false);
        document.addEventListener('online', this.onChangeConnection, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        //document.addEventListener('backbutton', backButtonEvent, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
    //
    onChangeConnection: function () {
        if (app.checkConnection()) {
            $("body").removeClass("no-internet")
            app.with_internet = true
            var seFueInternet = localStorage.getItem("seFueInternet");
            if (seFueInternet == "si") {
                localStorage.setItem("seFueInternet", "no");
                window.location.href = "index.html";
            } 
        } else {
            $("body").addClass("no-internet")
            app.with_internet = false
            localStorage.setItem("seFueInternet", "si");
        }
    },
    // Devuelve si hay o no conexión a internet
    checkConnection: function () {
        //navigator.notification.alert("Comprobando internet", function () { }, "Verifica internet", "Aceptar");
        var networkState = navigator.connection.type;
        if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
            navigator.notification.alert("El uso de la aplicación requiere internet. Por favor verifique su conexión.", function () { }, "Sin internet", "Aceptar");
            $("body").addClass("no-internet")
            return false;
        } else {
            console.log("checkConnection: Si hay internet!");
            $("body").removeClass("no-internet")
            return true;
        }
    }
};

function openLinkInBrowser(url){
    if (navigator!=undefined && navigator.app!=undefined && navigator.app.loadUrl !=undefined) {
        console.log("LoadURL")
        navigator.app.loadUrl( url,  { openExternal: true });
    } else {
        console.log("Blank URL")
        window.open(url, '_blank', 'location=yes');
        //window.open(url, "_system");
    }
}

function mostrarCargando(){
    console.log("mostrarCargando");
    $("body").addClass("esta-cargando")
}

function ocultarCargando(){
    console.log("ocultarCargando");
    $("body").removeClass("esta-cargando")
}

/*function backButtonEvent(){
    console.log("Back button")
    if(window.location.href=="index.html"){
        navigator.app.exitApp();
    }else if(window.location.href!="__historiaDetalle.html" && window.location.href!="__pryDetalle.html"){
        window.location.href="index.html"
    }else{
        history.back();
    }
}

document.addEventListener('backbutton', backButtonEvent, false);*/
