
var addAlert = function(message, type, delay){
    if(typeof delay == "undefined"){
        delay = 1000;
    }

    var alert = $("#alert-template").html();
    alert = alert.replace("{alert-type}", type);
    alert = alert.replace("{alert-message}", message);

    var $alert = $(alert);
    $(".overlay-alert").append($alert);

    if(delay > -1){
        window.setTimeout(function(){
            $alert.fadeOut(1000, function(){$alert.remove()});
        },delay);
    }

};

window.httpErrorHandler = function(d,s,r){
    if(!d && !s && !r) return;
    if(s == 422){
        // validation error.
        var errors = [];
        for(var failed_field in d){
            for(var i = 0; i < d[failed_field].length; i++){
                errors.push(d[failed_field][i]);
            }
        }

        if(errors.length > 0){
            addAlert("There were errors! Your change has not been saved:<br/><br/>" + errors.join("<br/>"), "danger", 5000);
        }
    }
    else{
        addAlert("HTTP error code " + s + " was thrown.", -1);
        debugger;
    }
}