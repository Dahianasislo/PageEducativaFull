
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});


$('#returnBtn').click(function() {    
    location.href="../index.html";
});


function getNumRand(min, max) {       
    return Math.round(Math.random()*(max-min)+parseInt(min));
}


function getNumRandUnique(min, max, arrayHistory) {      
    var NumAleatorio =  getNumRand(min, max);

    if(! arrayHistory.includes( NumAleatorio )){  
        arrayHistory.push(NumAleatorio);
        return NumAleatorio;
    }  
    else{
        getNumRandUnique(min, max, arrayHistory)
    }  
}


function soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode;       
    return ((key >= 48 && key <= 57) || (key==8) || (key==45));
}
