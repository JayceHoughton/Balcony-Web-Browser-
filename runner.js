//Main master file for running UI and Program functions
//Call function panelView() to run the panel. Insie the () put a number from 0 to 5. This will
//open one of the panel views from 0 to 5. Do not call panelView more then once without calling
//the function clearView() which will clear the current panel view. If you arn't working with this
//you can just leave it as panelView(0) and the program will function as it has previously
//You can comment out panelView and you will get a blank electron app, which may be useful for you
//working on other UI
backgroundFirst = fs.readFileSync('backgroundImage.json')
let backgroundPic = JSON.parse(backgroundFirst)

document.getElementById('body').style.backgroundImage = "url('" + backgroundPic + "')"
panelView(0)