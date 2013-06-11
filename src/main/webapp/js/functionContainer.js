	function creatContainerInfo(id, title, content, x, y){
	if($("#"+id).length ===0){
	var container = document.createElement("div")
	var titleTag = document.createElement("H2");
	container.innerHTML=content;
	titleTag.innerHTML=title;
	container.appendChild(titleTag);
	container.setAttribute("id", id);
	container.style.top=x;
	container.style.left=y;
	container.setAttribute("data-skin", "white");
	container.setAttribute("data-drag", "true");
	container.setAttribute("data-resize", "true");
	container.setAttribute("data-collapsable", "true");
	container.setAttribute("data-remenberme", "true");
	container.setAttribute("data-containment", "document");
	container.setAttribute("data-dock", "dock");
	container.setAttribute("data-buttons", "dock,fullscreen,close");
	
	document.getElementById("body").appendChild(container);
	
	
	

	$(container).containerize({ //$(el).css({opacity:.7})
            onClose: function(o) { 
            if(!o.isIconized){
	            document.getElementById("body").removeChild(document.getElementById(o.getAttribute("id"))) }           
            
            }


            });
      
      var childN= $("#"+id)[0].childNodes;
      
      for (var i = 0; i<childN.length; i++){
      	if(childN[i].getAttribute("class")=== "mbc_content"){
	      	var span =childN[i].getElementsByTagName("span")[0];
	      	var ul= childN[i].getElementsByTagName("ul")[0];
		    displayChildren(currentRoot.children, ul);
		    ul.style.display="none";
		    ul.style.listStyle= "inside";
		   ul.style.textIndent="20px";
		   span.setAttribute("class", "nodeNumb");
		      	
		    span.onclick= function(){
			if(ul.style.display=="none"){
				      	ul.style.display="block";
			      	}
			 else{
				      	ul.style.display="none";

			      	}
		      	}
	      	}
	      	
      	}
      	
     //.onclick = function(){displayChildren(currentRoot.children)};     
	
	}
	else{
		console.log($("#"+id)[0].childNodes[1].style);
		
	}
	}
	
	function containerConstraints(id,x, y){
	
		if($("#"+id).length ===0){
			var container = document.createElement("div")
			var titleTag = document.createElement("H2");
			container.innerHTML=constraintsToString();
			titleTag.innerHTML="Constraints";
			container.appendChild(titleTag);
			container.setAttribute("id", id);
			container.setAttribute("data-skin", "white");
			container.setAttribute("data-drag", "true");
			container.setAttribute("data-resize", "true");
			container.setAttribute("data-collapsable", "true");
			container.setAttribute("data-remenberme", "true");
			container.setAttribute("data-containment", "document");
			container.setAttribute("data-dock", "dock");
			container.setAttribute("data-buttons", "fullscreen,close");
			container.style.top=x;
			container.style.left=y;
			document.getElementById("body").appendChild(container);
			$(container).containerize()
		}
	}
/*
*sample of popup functionality
*
*
*/


    //$(function(){


        /*
         * Example of custom method added to the component
         *
         * */

        /*$.containerize.addMethod("showdata",function(){
            var el = this;
            var txt = "container properties:<br><br>";
            var data = el.$.data();
            for (var i in data){
                txt += i+"= "+ data[i]+"<br>";
            }
            txt += "<hr><br>"
            el.content.prepend(txt);
        });
*/

        /*
         * Example of how to add a new button for the button bar:
         *
         * */

        /*var newBtns = {
            changecontent: {
                idx:"changecontent",
                label:"&#xe044;",
                className:"",
                action: function(container,btn){$(container).containerize("changecontent","/newContent.php",{id:01, temp:'simple'})}
            }
        }
        $.extend($.containerize.defaultButtons, newBtns);*/


        /***********************************************/

       /* $(".container").containerize({
            onLoad: function(el){}, //$(el).css({opacity:.7})
            onClose: function(o) { console.log("toto"); }
        });*/

        /*
         * Example of custom Buttons for the toolbar
         *
         * */
       /* var changeSkinBtn = {
            idx: "changeSkinBtn",
            label: "change skin",
            className:"",
            action: function(el, btn){
                if(!$(el).hasClass('black'))
                    $(el).containerize('skin','black');
                else
                    $(el).containerize('skin');
            }
        }

        var iconizeBtn = {
            idx: "iconizeBtn",
            label: "iconize",
            className:"",
            action: function(el, btn){
                $(el).containerize("iconize");
            }
        }

        var dockBtn = {
            idx: "dockBtn",
            label: "dock",
            className:"",
            action: function(el, btn){
                $(el).containerize("iconize","dock");
            }
        }

        var closeBtn = {
            idx: "closeBtn",
            label: "close",
            className:"",
            action: function(el, btn){
                $(el).containerize("close");
            }
        }

        $("#cont1").containerize("addtotoolbar", [closeBtn]);
        $("#cont2").containerize("addtotoolbar", changeSkinBtn);
        $("#cont3").containerize("addtotoolbar", [iconizeBtn,changeSkinBtn,dockBtn]);

    })*/