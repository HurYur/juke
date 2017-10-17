let loadFloor = function (floor){
    if(loadedFloors[floor]){
        $('#floor-plan-container').imageMapPro(loadedFloors[floor]);
    }
    else{
        $.ajax({
            url: "js/floor" + floor + ".json",
        }).done(function(florPlan) {
            loadedFloors[floor] = florPlan;
            $('#floor-plan-container').imageMapPro(florPlan);
            onFlatClick();
        })
    }

    //@todo through the comment
    var myInterval = setInterval(function(){ onFlatClick(); }, 100);

    function onFlatClick () {
        if ($('#floor-plan-container polygon').length > 1){
            clearInterval(myInterval);
            let flats = document.querySelectorAll('#floor-plan-container polygon');

            flats.forEach(function (flat) {
                flat.addEventListener('click', function (e) {
                    //scrollTo
                    $('html, body').animate({
                        scrollTop: $("#table-left").offset().top - 50
                    }, 500);

                    //select flat in table
                    $('tr.active').removeClass('active');
                    let selectRow = e.currentTarget.getAttribute('data-shape-title');
                    $("#flat" + selectRow).toggleClass('active');
                });
            });
        }
    }


}