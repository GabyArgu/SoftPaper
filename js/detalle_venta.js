$("input[type='number']").inputSpinner();

let añadirClaseSpinnerInputBtn = () => {
    var elemento1 = document.getElementsByClassName("btn-decrement");
    for (var i = 0; i < elemento1.length; i++)
        elemento1[i].className += " btn-second";

    var elemento = document.getElementsByClassName("btn-increment");
    for (var i = 0; i < elemento.length; i++)
        elemento[i].className += " btn-second";
}

añadirClaseSpinnerInputBtn();