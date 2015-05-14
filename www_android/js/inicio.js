
function verificacionInicio(){
    var inicioVisto = localStorage.getItem("inicio_visto");
    if(inicioVisto != 'true'){
        window.location.href = 'mensajeInicio.html'
    }
}

function VistoHistoriaGuardar(){
    localStorage.setItem("inicio_visto", "true");
    window.location.href = 'index.html'
}