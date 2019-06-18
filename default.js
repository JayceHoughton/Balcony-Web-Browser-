//example from http://mylifeforthecode.com/making-the-electron-shell-as-pretty-as-the-visual-studio-shell/
//it sorta works

(function () {
      
      const remote = require('electron').remote; 
      
      function init() { 
        document.getElementById("min-btn").addEventListener("click", function (e) {
          const window = remote.getCurrentWindow();
          window.minimize(); 
        });
        
        document.getElementById("max-btn").addEventListener("click", function (e) {
          const window = remote.getCurrentWindow();
          if (!window.isMaximized()) {
            window.maximize();
          } else {
            window.unmaximize();
          }	 
        });
        
        document.getElementById("close-btn").addEventListener("click", function (e) {
          const window = remote.getCurrentWindow();
          window.close();
        });
		
	/*	document.getElementById("menu-btn").addEventListener("click", function (e) {
			document.getElementById("menu-btn").classList.toggle("show");
		});
      };*/
	  
	  
      
      document.onreadystatechange = function () {
        if (document.readyState == "complete") {
          init(); 
        }
      };
})();
/*
window.onclick = function(e) {
		if (!event.target.matches('.menu-btn")){
				var dropdown = document.getElementsByClassName("dropdown-content");
				var i;
				for (i = 0; i < dropdowns.length; i++) {
					var openDropdown = dropdowns[i];
					if (openDropdown.classList.contains('show')) {
							openDropdown.classList.remove('show');
					}
				}
		}
}*/