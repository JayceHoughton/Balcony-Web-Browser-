//JavaScript file that pairs with helpWindow.html and helpStyle.css

//function that handles events
function helpBrowser() {
    webCheck = true
    setPanelNumber(7)
    ctx.beginPath()
    ctx.rect(parseInt(canvas.width*0.035), parseInt(canvas.height*0.05), canvas.width*0.93, canvas.height*0.86)
    ctx.stroke()
    ctx.closePath()
    webWidth = parseInt(canvas.width*0.93)
    webHeight = parseInt(canvas.height*0.86)
    buildWebBrowser(parseInt(canvas.width*0.035), parseInt(canvas.height*0.05), webWidth, webHeight)
}

//example from https://www.w3schools.com/howto/howto_js_collapsible.asp
var col1 = document.getElementsByClassName("Q1");
var col2 = document.getElementsByClassName("Q2");
var col3 = document.getElementsByClassName("Q3");
var col4 = document.getElementsByClassName("Q4");
var col5 = document.getElementsByClassName("Q5");
var col6 = document.getElementsByClassName("Q6");
var i, j, k, l, m, n;

for (i = 0; i < col1.length; i++) {
	col1[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var Q1content = this.nextElementSibling;
		if (Q1content.style.display === "block"){
			Q1content.style.display = "none"
		} else {
			Q1content.style.display = "block";
		}
	});
}

for (j = 0; j < col1.length; j++) {
	col2[j].addEventListener("click", function() {
		this.classList.toggle("active");
		var Q2content = this.nextElementSibling;
		if (Q2content.style.display === "block"){
			Q2content.style.display = "none"
		} else {
			Q2content.style.display = "block";
		}
	});
}

for (k = 0; k < col1.length; k++) {
	col3[k].addEventListener("click", function() {
		this.classList.toggle("active");
		var Q3content = this.nextElementSibling;
		if (Q3content.style.display === "block"){
			Q3content.style.display = "none"
		} else {
			Q3content.style.display = "block";
		}
	});
}

for (l = 0; l < col1.length; l++) {
	col4[l].addEventListener("click", function() {
		this.classList.toggle("active");
		var Q4content = this.nextElementSibling;
		if (Q4content.style.display === "block"){
			Q4content.style.display = "none"
		} else {
			Q4content.style.display = "block";
		}
	});
}

for (m = 0; m < col1.length; m++) {
	col5[m].addEventListener("click", function() {
		this.classList.toggle("active");
		var Q5content = this.nextElementSibling;
		if (Q5content.style.display === "block"){
			Q5content.style.display = "none"
		} else {
			Q5content.style.display = "block";
		}
	});
}

for (n = 0; n < col1.length; n++) {
	col6[n].addEventListener("click", function() {
		this.classList.toggle("active");
		var Q6content = this.nextElementSibling;
		if (Q6content.style.display === "block"){
			Q6content.style.display = "none"
		} else {
			Q6content.style.display = "block";
		}
	});
}