//adatok beszerzése api.randomuser.me-ről
var url = "http://api.randomuser.me/?results=100";

var xhr = new XMLHttpRequest();
xhr.open("GET", url, false);
xhr.send();
var datas = JSON.parse(xhr.responseText).results;

var peoples = document.getElementById("peoples");
var peoplesHeader = document.getElementById("peoplesHeader");
var peoplesSearch = document.getElementById("peoplesSearch");
var peoplesDatas = document.getElementById("peoplesDatas");
var peoplesLength = document.getElementById("peoplesLength");
var peoplesShow = document.getElementById("peoplesShow");
var peoplesPaging = document.getElementById("peoplesPaging");

var currentDatas = datas;
var currentPage = 1;

//emberek kiírása a táblázatba
function peopleDraw(peopleArray, start){
	var peoplesHtml = peoplesHeader.outerHTML + peoplesSearch.outerHTML;
	
	if (peopleArray.length >= parseInt(peoplesLength.value) + start) {
		end = parseInt(peoplesLength.value) + start;
	}
	else {
		end = peopleArray.length;
	}
	for (i=start; i<end; i++) {
		people = peopleArray[i];
		peopleHtml =  peoplesDatas.outerHTML;

		peopleFind = [
			"[[people.picture.thumbnail]]", 
			"[[people.gender]]", 
			"[[people.name.title]] [[people.name.first]] [[people.name.last]]", 
			"[[people.email]]", 
			"[[people.location.postcode]] [[people.location.state]] - [[people.location.city]], [[people.location.street]]"
		];
		peopleReplace = [
			'<img src="'+people.picture.thumbnail+'">', 
			people.gender, 
			people.name.title+" "+people.name.first+" "+people.name.last, 
			people.email, 
			people.location.postcode+" "+people.location.state+" - "+people.location.city+", "+people.location.street
		];
		for (j=0; j<peopleFind.length; j++) {
			peopleHtml = peopleHtml.replace(peopleFind[j], peopleReplace[j]);
		}

		peoplesHtml += peopleHtml;
	}

	peoples.innerHTML = peoplesHtml;
	peoplesShow.innerHTML = (end - start)+" / "+peopleArray.length;
}

//lapozó kiírása
function pagingDraw(peopleArray, current){
	pagingLength = Math.ceil(peopleArray.length / parseInt(peoplesLength.value));
	pagingHtml = '<a page="first">First</a>';
	pagingHtml += '<a page="-1">Previous</a>';
	for (i=1; i<=pagingLength; i++) {
		pagingHtml += '<a page="'+i+'"';
		if (current == i) pagingHtml += ' class="current"';
		pagingHtml += ">"+i+"</a>";
	}
	pagingHtml += '<a page="+1">Next</a>';
	pagingHtml += '<a page="last">Last</a>';
	peoplesPaging.innerHTML = pagingHtml;
}

//init
peopleDraw(currentDatas, 0);
pagingDraw(currentDatas, currentPage);

//lapozó módosítása
document.getElementById("peoplesPaging").addEventListener("click", function(){
	pageData = window.event.toElement.getAttribute("page");
	switch(pageData) {
		case "first":
			currentPage = 1;
		break;
		case "-1":
			if (currentPage > 1) currentPage--;
			else currentPage = 1;
		break;
		case "+1":
			if (currentPage < Math.ceil(currentDatas.length / parseInt(peoplesLength.value))) currentPage++;
			else currentPage = Math.ceil(currentDatas.length / parseInt(peoplesLength.value));
		break;
		case "last":
			currentPage = Math.ceil(currentDatas.length / parseInt(peoplesLength.value));
		break;
		default:
			currentPage = parseInt(pageData);
	}
	
	peopleDraw(currentDatas, parseInt(peoplesLength.value) * (currentPage - 1));
	pagingDraw(currentDatas, currentPage);
});

//gender módosítása
document.getElementById("peoples").addEventListener("change", function(){
	if (window.event.target == document.getElementById("gender")) {
		peopleGender = document.getElementById("gender");
		peopleGender.innerHTML = peopleGender.innerHTML.replace(' selected="selected"', '').replace('value="'+peopleGender.value+'"', 'value="'+peopleGender.value+'" selected="selected"');
		peoplesSearch = document.getElementById("peoplesSearch");

		currentPage = 1;

		if (window.event.target.value == "") {
			currentDatas = datas;
		}
		else {
			currentDatas = [];
			for (i=0; i<datas.length; i++) {
				if (datas[i].gender == window.event.target.value) currentDatas.push(datas[i]);
			}
		}

		peopleDraw(currentDatas, 0);
		pagingDraw(currentDatas, currentPage);
	}
});
