
var fs = require('fs')

saveHistory = fs.readFileSync('savedHistory.json')
let savedHistory = JSON.parse(saveHistory)

buttonPos = 30
for (let i = 0; i < savedHistory.length; i++) {
    newHist = document.createElement('button')
    newHist.className = "historyButton"
    newHist.style.position = "absolute"
    newHist.style.width = "1000px"
    newHist.style.top = buttonPos + "px"
    newHist.style.height = "30px"
    newHist.style.overflow = "hidden"
    newHist.innerHTML = savedHistory[i]
    newHist.value = savedHistory[i]
    newHist.onclick = function() {
        window.location.href = this.value
    }
    document.getElementById("history").appendChild(newHist)
    buttonPos += 30
}

deleteButton = document.createElement('button')
deleteButton.className = "historyButton"
deleteButton.style.position = "absolute"
deleteButton.style.width = "100px"
deleteButton.style.top = buttonPos + "px"
deleteButton.style.height = "30px"
deleteButton.innerHTML = "Delete History"
deleteButton.onclick = function() {
    savedHistory.length = 0
    fs.writeFile('savedHistory.json', JSON.stringify(savedHistory), 'utf-8', () => {})
}
document.getElementById("history").appendChild(deleteButton)
