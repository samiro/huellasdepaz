var urlDPS = "http://www.dps.gov.co/portal/default.aspx"

var incluapp = angular.module(
  'incluapp',
  []
);


incluapp.controller('HomeCtrl', ['$scope',
    function ($scope) {
        $scope.projectClick = function(project){
            localStorage.setItem("project", JSON.stringify(project));
            window.location.href = '__pryDetalle.html'
        }

        getProjects(1, function(projects){
            $scope.proyectos = projects
            $scope.$apply()

            $(".rslides").responsiveSlides();
        })
    }]);

incluapp.controller('ProyectoDetalleCtrl', ['$scope',
    function ($scope) {
        $scope.showFormComentarios = false
        try{
            var projectStr = localStorage.getItem("project");    
            var projectJson = JSON.parse(projectStr)
            $scope.proyecto = projectJson
            getLikes(0, $scope.proyecto, function (data, index){
                $scope.proyecto.Likes = data.count
                $scope.$apply()
            })
        }catch(error){
            console.log("Consultado el proyecto")
            console.log(error)
        }

        $scope.shareTwitter = function(proyecto){
            tweetILike(proyecto);
        }

        $scope.toggleFormComentarios = function(){
            $scope.showFormComentarios = $scope.showFormComentarios==false
        }

        $scope.enviarComentario = function(){
            if($scope.comment_message == "" || $scope.comment_message == null){

                navigator.notification.alert("Debes escribir un comentario",
                    function(){
                        $("#comment").focus()
                    }, "Enviar comentario", "Aceptar")

            }else if($scope.comment_name == "" || $scope.comment_name == null){
                
                navigator.notification.alert("Debes escribir tu nombre",
                    function(){
                        $("#name").focus()
                    }, "Enviar comentario", "Aceptar")

            }else{
                url = "http://200.119.110.231/Modulos/Comentario.svc/Comentar?Usuario=" +$scope.comment_name+ "&Comentario="+$scope.comment_message+"&ProyectoId=" + $scope.proyecto.IdProyecto
                $.ajax({
                    url: url,
                    type: "POST",
                    success: function(data) { 
                        $scope.showFormComentarios = false

                        if($scope.proyecto.Comentario ==null || $scope.proyecto.Comentario == ""){
                            $scope.proyecto.Comentario = []
                        }

                        $scope.proyecto.Comentario.push({
                            MyComentario: $scope.comment_message,
                            Usuario: $scope.comment_name
                        })

                        $scope.comment_message = ""
                        $scope.comment_name = ""

                        $scope.$apply()
                        navigator.notification.alert("Gracias por tu comentario",
                            null, "¡Gracias!", "Aceptar")

                    },
                    error: function() {
                        navigator.notification.alert("Ha ocurrido un error",
                            null, "Falló el envio del comentario. Intentalo más tarde.", "Aceptar")
                    }
                });
            }
        }


        $scope.estadistica = null
        $scope.mostrar_estadistica = false

        $scope.toggleEstadistica = function(){
            $scope.mostrar_estadistica = !$scope.mostrar_estadistica
            if($scope.mostrar_estadistica){
                $scope.consultarEstadistica();
            }
        }

        $scope.porcentaje = function(valor){
            return valor * 100 / $scope.estadistica.maximo;
        }

        $scope.consultarEstadistica = function(){
            $scope.loading = true
            url = "http://200.119.110.231/Modulos/Estadisticas.svc/ConsultarEstadisticas?ProjectId=" + $scope.proyecto.IdProyecto
            $.ajax({
                    url: url,
                    type: "GET",
                    success: function(data) { 
                        $scope.loading = false
                        if(data.length > 0){
                            $scope.estadistica = data[0]
                            $scope.estadistica.maximo = 0
                            for (var i = 0; i < $scope.estadistica.Valores.length; i++) {
                                if($scope.estadistica.maximo < $scope.estadistica.Valores[i].ValorIndicador){
                                    $scope.estadistica.maximo = $scope.estadistica.Valores[i].ValorIndicador
                                }
                            }
                        }
                        $scope.$apply()
                    },
                    error: function() {
                        $scope.loading = false
                        navigator.notification.alert("Ha ocurrido un error",
                            null, "Falló consultando las estadísticas de este proyecto. Intentalo más tarde.", "Aceptar") 
                    }
                });
        }

    }])

incluapp.controller( 'ProyectosCtrl', ['$scope',
    function ($scope) {
        $scope.nextPage = 1
        $scope.lastPage = false

        $scope.proyectos = []
        $scope.deptos = []
        $scope.tematicas = []

        var depto = getUrlParameter("depto")
        var deptoName = getUrlParameter("deptoName")
        if(depto!="" && deptoName!=""){
            $scope.deptoCode = depto
            $scope.deptoName = deptoName
            $scope.filterDepto = true
        }else{
            $scope.filterDepto = false
            $scope.depto = ""
            $scope.deptoName = ""
        }

        $scope.projectClick = function(project){
            localStorage.setItem("project", JSON.stringify(project));
            window.location.href = '__pryDetalle.html'
        }

        $scope.loadMore = function(){
            if(!$scope.lastPage && !$scope.loading){
                $scope.loading = true

                function successProjects(projects){
                   if(projects.length > 0){
                        $scope.lastPage = false
                        $scope.nextPage++;
                    }else{
                        $scope.lastPage = true
                    }
                    $scope.loading = false
                    $scope.$apply()
                    
                    for(var i=0; i<projects.length; i++){
                        $scope.proyectos.push(projects[i])
                        if($scope.deptos.indexOf(projects[i].Region) < 0){
                            $scope.deptos.push(projects[i].Region)
                        }
                        for(var j=0; j<projects[i].Tematica.length; j++){
                            if($scope.tematicas.indexOf(projects[i].Tematica[j].Descripcion) < 0){
                                $scope.tematicas.push(projects[i].Tematica[j].Descripcion)
                            }
                        }
                        
                        getLikes(i, projects[i], function (data, index){
                            $scope.proyectos[index].Likes = data.count
                            $scope.$apply()
                        })
                    }
                }

                if($scope.filterDepto){
                    getProjectsDepto($scope.deptoCode, $scope.nextPage, successProjects)
                }else{
                    getProjects($scope.nextPage, successProjects);
                }
                
            }
        }

        $scope.shareTwitter = function(proyecto){
            tweetILike(proyecto);
        }

        $scope.shareTwitterTwo = function(text){
            openLinkInBrowser('https://twitter.com/share?text='+text+'&via=DPSColombia&url=' + urlDPS)
        }

        $scope.openlink = function(url){
            openLinkInBrowser(url)
        }

        $scope.mostrar_form = false

        $scope.loadMore();
    }
])

function tweetILike(project){
    openLinkInBrowser('https://twitter.com/share?text='+project.Titulo+'&via=DPSColombia&url='+urlDPS+'?projectId=' + project.Codigo)
}

function getComments(idProject, success){
    $.ajax({
        url: "http://urls.api.twitter.com/1/urls/count.json?url=" + urlDPS + "?projectId=" + project.Codigo,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) { success(data) },
        error: function() { console.log("Fallo consultando likes de " + project.Codigo) }
    });
}

function getLikes(index, project, success){
    $.ajax({
        url: "http://urls.api.twitter.com/1/urls/count.json?url=" + urlDPS + "?projectId=" + project.Codigo,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) { success(data, index) },
        error: function() { console.log("Falló consultando likes de " + project.Codigo) }
    });
}

function getProjects(page, success){
    mostrarCargando();
    $.ajax({
        url: "http://200.119.110.231/Modulos/Proyecto.svc/ConsultarProyectos?pageNumber=" + page,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) { console.log(data);success(data), ocultarCargando(); },
        error: function() { 
            navigator.notification.alert("Ha ocurrido un error",
                null, "Ocurrió algo inesperado. Por favor intenta más tarde.", "Aceptar");
            ocultarCargando();
        }
    });
}

function getProjectsDepto(depto, page, success){
    mostrarCargando();
    $.ajax({
        url: "http://200.119.110.231/Modulos/Proyecto.svc/ConsultarProyectosDepartamento?DeptoCode=" + depto +"&pageNumber=" + page,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) { success(data); ocultarCargando(); },
        error: function() { 
            navigator.notification.alert("Ha ocurrido un error",
                null, "Ocurrió algo inesperado. Por favor intenta más tarde.", "Aceptar");
            ocultarCargando();
        }
    });
}

incluapp.controller( 'HistoriasCtrl', ['$scope',
    function ($scope) {

        $scope.nextPage = 1
        $scope.lastPage = false

        $scope.historias = []
        $scope.regiones = []
        $scope.tematicas = []

        $scope.HistoryClick = function(history){
            localStorage.setItem("history", JSON.stringify(history));
            window.location.href = '__historiaDetalle.html'
        }

        $scope.loadMore = function(){
           
            if(!$scope.lastPage && !$scope.loading){
                $scope.loading = true
                getHistories($scope.nextPage, function(histories){
                    if(histories.length > 0){
                        $scope.lastPage = false
                        $scope.nextPage++;
                    }else{
                        $scope.lastPage = true
                    }
                    $scope.loading = false
                    $scope.$apply()
                    
                    for(var i=0; i<histories.length; i++){
                        $scope.historias.push(histories[i])
                        if($scope.regiones.indexOf(histories[i].Region) < 0){
                             $scope.regiones.push(histories[i].Region)
                        }
                        
                            if($scope.tematicas.indexOf(histories[i].Tematica) < 0){
                                $scope.tematicas.push(histories[i].Tematica)
                            }
                        
                        getLikesHistory(i, histories[i], function (data, index){
                            $scope.historias[index].Likes = data.count
                            $scope.$apply()
                        })
                    }
                })
            }
        }

       
        $scope.shareTwitter = function(historia){
            tweetILikeHistory(historia);
        }

        $scope.shareTwitterTwo = function(text){
            openLinkInBrowser('https://twitter.com/share?text='+text+'&via=DPSColombia&url=' + urlDPS+'?historyId=5')
        }

        $scope.openlink = function(url){
            openLinkInBrowser(url)
        }

        
        $scope.mostrar_form = false

        $scope.loadMore();
    }
])


function getHistories(page, success){
    mostrarCargando();
    $.ajax({
        url: "http://200.119.110.231/Modulos/HistoriaPaz.svc/ConsultarHistoriasPaz?pageNumber=" + page,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) { success(data); ocultarCargando(); },
        error: function() { 
            navigator.notification.alert("Ha ocurrido un error",
                null, "No es posible cargar las historias. Intenta más tarde.", "Aceptar");
            ocultarCargando();
        }
    });
}

function getLikesHistory(index, history, success){
    $.ajax({
        url: "http://urls.api.twitter.com/1/urls/count.json?url=" + urlDPS + "?historyId=" + history.IdHistoria,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) { success(data, index) },
        error: function() { console.log("Falló consultando likes de " + history.IdHistoria) }
    });
}

function tweetILikeHistory(history){
    openLinkInBrowser('https://twitter.com/share?text='+history.Titulo+'&via=DPSColombia&url='+urlDPS+'?historyId=' + history.IdHistoria)
}

incluapp.controller('HistoriaDetalleCtrl', ['$scope',
    function ($scope) {
        $scope.showFormComentarios = false
        try{
            var historyStr = localStorage.getItem("history");    
            var historyJson = JSON.parse(historyStr)
            $scope.historia = historyJson
            getLikesHistory(0, $scope.historia, function (data, index){
                $scope.historia.Likes = data.count
                $scope.$apply()
            })
        }catch(error){
            console.log("Consultando historia")
            console.log(error)
        }

        $scope.shareTwitter = function(historia){
            tweetILikeHistory(historia);
        }

        $scope.toggleFormComentarios = function(){
            $scope.showFormComentarios = $scope.showFormComentarios==false
        }

        $scope.enviarComentario = function(){
            if($scope.comment_message == "" || $scope.comment_message == null){
                navigator.notification.alert("Debes escribir un comentario",
                    function(){
                        $("#comment").focus()
                    }, "Enviar comentario", "Aceptar")
            }else if($scope.comment_name == "" || $scope.comment_name == null){
                navigator.notification.alert("Debes escribir tu nombre",
                    function(){
                        $("#name").focus()
                    }, "Enviar comentario", "Aceptar")
            }else{
                url = "http://200.119.110.231/Modulos/HistoriaPaz.svc/ComentarHistoria?Usuario=" +$scope.comment_name+ "&Comentario="+$scope.comment_message+"&HistoriaId=" + $scope.historia.IdHistoria
                console.log(url)
                $.ajax({
                    url: url,
                    type: "POST",
                    success: function(data) { 
                        $scope.showFormComentarios = false

                        if($scope.historia.Comentario ==null || $scope.historia.Comentario == ""){
                            $scope.historia.Comentario = []
                        }

                        $scope.historia.Comentario.push({
                            Comentario: $scope.comment_message,
                            Usuario: $scope.comment_name
                        })

                        $scope.comment_message = ""
                        $scope.comment_name = ""

                        $scope.$apply() 

                        if(data.ComentarHistoriaResult.indexOf("exito") != -1){
                            navigator.notification.alert("Gracias por tu comentario",
                                null, "¡Gracias!", "Aceptar")
                        }else{
                            navigator.notification.alert("Ha ocurrido un error",
                                null, "Es posible que el comentario no haya sido enviado", "Aceptar")
                        }
                        
                    },
                    error: function() { 
                        navigator.notification.alert("Ha ocurrido un error",
                                null, "Falló el envio del comentario. Intentalo más tarde.", "Aceptar")
                    }
                });
            }
        }
    }])



function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }

    return "";
}

function thumbnail_youtube(youtube_url) {
    var video_id = "";
    var thumbnail_url = "";
    try {
        video_id = youtube_url.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        thumbnail_url = "http://img.youtube.com/vi/" + video_id + "/0.jpg";
        return thumbnail_url;
    } catch (err) {
        console.log(err);
        return "";
    }

}

function video_click(url_youtube) {
    console.log("click", url_youtube)
    openLinkInBrowser(url_youtube);
}