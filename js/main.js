window.onload = () => {
    let $navToggle = document.querySelector('#main-nav-toggle');
    $navToggle ? collapseMenu($navToggle) : '';

    let $faqLists = document.querySelectorAll('.questions-list');
    ($faqLists) ? $faqLists.forEach((list) => toggleActive(list)) : "";

    let $filtersList = document.querySelector('#gallery-filters');
    $filtersList ? toggleActive($filtersList) : '';
	
    let $floorList = document.querySelectorAll('.floors-list .icon');
    $floorList ? buildPlanTable($floorList) : '';
};

let loadedFloors = {};

let toggleActive = (list) =>{
    list.querySelectorAll('li').forEach((listItem)=>{
        listItem.addEventListener('click', (e) => onElementClick(e.currentTarget));
    });

    function onElementClick(e) {
    	if (e.parentNode.classList.contains('questions-list')) {
    		document.querySelectorAll('.questions-list').forEach((list) => unToggle(list));
    	}else {
    		unToggle(e.parentNode);
    	}

    	function unToggle(list){
	    	list.querySelectorAll('li').forEach((listItemInner) => {
	            if (listItemInner.classList.contains('active')) {
	                listItemInner.classList.toggle('active');
	            }
	        });
    	}
        e.classList.toggle('active');
    }
}

let collapseMenu = ($navToggle) => {
    $navToggle.addEventListener('click', ()=>{
        document.querySelector('.collapse').classList.toggle('open');
        document.querySelector('#main-nav-toggle').classList.toggle('open');
    });
}

let buildPlanTable = $floorList =>{
    findActiveFloor();
    setPlanTables();
    loadFloor(5);

    $floorList.forEach(function (floorBtn) {
        floorBtn.addEventListener('click', (e) =>{
            $activeFloor = document.querySelector('.floors-list .icon.active');
            $activeFloor.classList.toggle('active');

            //set new active floor
            e.currentTarget.classList.toggle('active');
            loadFloor(e.currentTarget.innerText);
            setPlanTables();
        });
    });


    function findActiveFloor() {
        return document.querySelector('.floors-list .icon.active').innerText;
    }

    function setPlanTables(){

        $.ajax({
            dataType: "json",
            url: "js/flatSquare.json"
        }).done(function(flatsInfo) {
            buildTables(flatsInfo);
        });


        let buildTables = (flatsInfo) => {

            let flatsQuantityCalc = currentFloor =>{
                var size = 0, key;
                for (key in currentFloor) {
                    if (currentFloor.hasOwnProperty(key)) size++;
                }
                return size;
            }

            let activeFloor = findActiveFloor(),
                currentFloor = flatsInfo['floor' + activeFloor],
                flatsQuantity = flatsQuantityCalc(currentFloor),
                flatsTables = document.querySelectorAll('.flats');


            flatsTables.forEach( table => {
                $tableTitle = table.querySelector('.title');
                table.innerHTML = '';
                table.appendChild($tableTitle);
            });

            let flatsAdded = 0;
            for(let flatNumber in flatsInfo['floor' + activeFloor]){

                if(flatsAdded < flatsQuantity/2){
                    addFlat(flatsTables[0], flatNumber, flatsInfo['floor' + activeFloor][flatNumber]);
                }
                else {
                    addFlat(flatsTables[1], flatNumber, flatsInfo['floor' + activeFloor][flatNumber]);
                }
                flatsAdded++;
            }
        }
    }

    function addFlat (table, flatNumber, flatInfo){
        let row = document.createElement('tr'),
            planIcon = "<a href='#'><img class='plan-icon' src='img/floorplan/plan-download.png' alt='download plan'/></a>",
            flatProperties = [flatNumber, flatInfo[1], flatInfo[0], planIcon];
        flatProperties.forEach(propertie =>{
            let td = document.createElement('td');
            td.className = "flat";
            td.innerHTML = propertie;
            row.id = "flat" + flatNumber;
            row.appendChild(td);
        });

        table.appendChild(row);
    }
}