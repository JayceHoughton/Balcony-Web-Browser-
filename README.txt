README for Balcony (Panel Based Web Browser):

Thing you will need:
1. You will need to have nodejs installed: https://nodejs.org/en/
2. In the console in the directory of the project you may need to install the following packages:
npm install electron@beta
npm install electron-prompt

You may be able to just run npm install and it will install both of the above, but in case that doens't work properly, I would suggest running the two above commands just to be safe. Yes, we are using the electron beta version not 5.0. This is due to the fact that the ability to have multple BrowserViews was not implemented in 5.0, despite the ability to have multiple BrowserViews having been avaiable in the beta since December 2018.

The Start the Program:
In the terminal in the directory of the project where the main.js file is located, run:
npm start

How to use the program:
1. When you first launch the program you will be taken to a login screen with three buttons. You have the option of continuing as a guest, or obtaining a registration code and then registering as a premium user. I suggest you first continue as a Guest user, as once you register as a premium user, the application is permanantly registered as premium, so if you would like to see the differences in user level, you should first run the program as a guest user. As a guest users you will:
	- Have access to only 1 Panel View and the Web Browser view. The tabs on the bottom that say PREMIUM will not be clickable.
	- You will be limited to a maximum of 6 panels. If you attempt to draw more then 6 panels the panel will simply not be drawn.
	- If you are a guest user the login screen where you can obtain a registration code will pop up every time you relaunch the program.

2. Once you are past the login screen you will see a blue bar at the bottom of the screen with tabs. Each of the first 6 tabs will take you to a different panel view, assuming that you have premium acesss. If you click on the 7th tab you will be taken to the full featured web browser.

3. In a panel view, to create a panel, first click and hold your mouse on the screen. Your mouse cursor will change to a crosshair. While holding the mouse, drag your mouse down and to the right, and you will see an outline of a box. You can continue to drag and make this box any size that you like. If you attempt to drag up and to the left past your origin point, the box will not be drawn.

4. Release the mouse and a panel will be created inside of the outline that you drew. After you have made a panel you can click and hold over the top left corner of the panel. Your cursor will change to a compass like cursor. While holding the mouse, you can move your mouse to move the panel around anywhere on the screen, and then release to place the panel where you want to move it. You can also click and hold over the bottom right corner to resize the panel, and release to change the panel to your new defined size.

5. Inside, there will be a text box that takes input and a button that says: "Lets Go". You can enter any web address into this text box and you will be taken to that website. If you enter something that our program does not recogize as a web address you will instead be taken to a google search.

6. To DELETE a panel, simply click the top right corner of a panel, and it will be deleted. Panels can deleted, moved, and resized at any time after creation, no matter how many panels you have created.

7. The state of your panel view will always be saved. If you change tabs at the bottom to a different panel view, and then tab back to your original one, your panels will be in the places you left them, in the position that you left them in. Even if you close the program these panels will be persistent. They will only go away if you manually delete them. As such, in all 6 panel views you can have any layout of panels, and swap between them at any time.

8. The final tab on the right will be your full featued web browser. Using this works nearly identical to using something like Google Chrome. In the top input feild, you can enter a website address or any search term, and you will either be taken to that website or a google search will be done. You can press the go button or just press enter to navigate to the address that is in the input feild. Whenever you navigate to a new page, the inside of the top input feild will be modified to contain that website's full address. This will allow you to browse the web, and then copy the contents of the input feild to your clipboard, and then go to a panel view and paste the address inside of a new panel.

9. The web browser has forward and back buttons. You can use these to go forward and back in your history. If you use the back button, and then from the page you moved back to, go to a new address, that new address will become the front of your history, and what was previously at the front will be erased.

10. There is a help button, which will answer some commonly asked questions about the program

11. If you click on the history button to the right of the input feild you will be taken to a history page which will display inside of the web browser. This history page will contain a persistent list of all of your browsing history, even if you close the program this list will stay. Each address on the history list can be clicked, and you will then be navigated to that address. If you click the delete history button your history will be deleted. It will not immediatly be shown on the page unless you navigate away or click the history button away. This does not clear your forward and back history until after you close the program.

12. There is a star button next to the history button. Clicking this button will add whatever page is currently displayed to your favorites list. If you click the favorites button you will be taken to a favorites page similar to the history page where you can click on favorites and also delete your favorites.

13. You will also see a Style button. Clicking this will open a prompt where you can paste a link to any image, and this image will be come your background image for the program. This is also stored persistently.

BUGS THAT MAY OCCRUR (But hopefully won't):
1. Unexpected End of JSON input. This should only happen if you for some reason go into the json files and modify their contents. Please do not do this. Previously this error would sometimes happen when closing the program due to us not syscronously saving to files, but that should be fixed now. There is even a try catch to catch that bug, and I havn't seen it since. BUT IN CASE IT DOES HAPPEN, heres how to fix it:
	- Go into the savedViewData.json, savedWebPages.json, and saveData.json files, and make sure they at least have [[],[],[],[],[],[],[]] inside of them. If any of them do not, please paste [[],[],[],[],[],[],[]] in each of them. That should be the only thing in the JSON file. If for some reason it happens to the history json it should simply have [] inside of it, same with favorites.
Again, this SHOULDN'T happen, i'm fairly sure I fixed any bug that would cause the program to mess up these files, but IF IT DOES, this is how you can fix it. If you go in and for some reason manually mess up the files, well, then you will get that error. But, if you do that and want to un-mess up the files, above it how you do that.

2. The buttons on the login screen arn't working! The only thing that will cause this to happen is if you did not properly do npm install electron-prompt in the console in the project directory. If you have this bug, you will also likely have a blue background. Please remember to do npm install electron-prompt.

3. Audio is still playing from closed BrowserViews! We have no idea why this happens, best we can come up with is that it is a bug with the electron feature. If this happens, and is bothering you, simply relaunch the program and it will go away.

4. Resizing a panel view does not resize the panels and they over lap with the bottom bar! Yes, this does happen, its not really a bug, we just didn't have time to account for it. If you simply resize your application you will be able to see the bottom bar again. Also, if you resize your application such that panels you made are not shown, they arn't gone, you just can't see them. Don't worry, in the web browser view,  if you resize your application, the web browser will also resize, we just didn't have time to get this working in the panel views. For ideal performance, just maximize the program.