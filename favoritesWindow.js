var fs = require('fs')

faveFirst = fs.readFileSync('favorites.json')
let savedFavorites = []
savedFavorites = JSON.parse(faveFirst)

//Identical to the history window but instead uses the favorites array
buttonPos = 30
for (let i = 0; i < savedFavorites.length; i++) {
    newHist = document.createElement('button')
    newHist.className = "historyButton"
    newHist.style.position = "absolute"
    newHist.style.width = "1000px"
    newHist.style.top = buttonPos + "px"
    newHist.style.height = "30px"
    newHist.style.overflow = "hidden"
    newHist.innerHTML = savedFavorites[i]
    newHist.value = savedFavorites[i]
    newHist.onclick = function() {
        window.location.href = this.value
    }
    document.getElementById("history").appendChild(newHist)
    buttonPos += 30
}

//Deletes favorites
deleteButton = document.createElement('button')
deleteButton.className = "historyButton"
deleteButton.style.position = "absolute"
deleteButton.style.width = "110px"
deleteButton.style.top = buttonPos + "px"
deleteButton.style.height = "30px"
deleteButton.innerHTML = "Delete Favorites"
deleteButton.onclick = function() {
    savedFavorites.length = 0
    fs.writeFile('favorites.json', JSON.stringify(savedFavorites), 'utf-8', () => {})
}
document.getElementById("history").appendChild(deleteButton)