function creatContainerInfo(id, title, content, x, y){
	if($("#"+id).length ===0){
		var container = document.createElement("div")
		var titleTag = document.createElement("H2");
		container.innerHTML=content;
		titleTag.innerHTML=title;
		container.appendChild(titleTag);
		container.setAttribute("id", id);
		container.setAttribute("data-skin", "white");
		container.setAttribute("data-drag", "true");
		container.setAttribute("data-resize", "true");
		container.setAttribute("data-collapsable", "true");
		container.setAttribute("data-remenberme", "true");
		container.setAttribute("data-containment", "document");
		container.setAttribute("data-dock", "dock");
		container.setAttribute("data-centeronwindow", "true");
		container.setAttribute("data-buttons", "dock,fullscreen,close");
		
		document.getElementById("body").appendChild(container);

		$(container).containerize({ 
	            onClose: function(o) { 
	            if(!o.$.isIconized){
		            document.getElementById("body").removeChild(document.getElementById(o.getAttribute("id"))) }           
	            
	            }
	
	
	            });
	    // $(container).containerize("setSize", 600, 600);	
	      
	    var childN= $("#"+id)[0].childNodes;
	      
	    for (var i = 0; i<childN.length; i++){
      		if(childN[i].getAttribute("class")=== "mbc_content"){
	      		var span =childN[i].getElementsByTagName("span");
      			for(var j = 0; j <span.length; j++){
	      			if(span[j].getAttribute("class")=== "nodeNumb"){
		      			span=span[j];
		      			break;
		      		}
		      	}
		      	var ul= childN[i].getElementsByTagName("ul")[0];
			    displayChildren(hoverNode.children, ul);
			    ul.style.display="none";
			    ul.style.listStyle= "inside";
			    ul.style.textIndent="20px";
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
	    
	    var constraintsList = document.getElementsByClassName('constraintsNode');
	    for(var i=0; i < constraintsList.length; i++){
			constraintsList[i].onclick= function(){
			var searchRes= search_constraint(this.getAttribute("data"));
			var res="";
			for(var j = 0; j < searchRes.length; j ++){
			res+= constraintToString(searchRes[j]);
			}
			this.innerHTML = res;
		}
				

	    }

	}

	else{
		$("#"+hoverNode.UUID).containerize("restorePopup"); 
		
	}
	}
	
function containerConstraints(id,x, y){

	if($("#"+id).length ===0){
		var container = document.createElement("div")
		var titleTag = document.createElement("H2");
		container.innerHTML=constraintsToString(constraints.list);
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
		container.setAttribute("data-centeronwindow", "true");
		container.style.top=x;
		container.style.left=y;
		document.getElementById("body").appendChild(container);
			
		$(container).containerize();
		if(parseInt(($(container).css("width")))> 1000){
			$(container).containerize("setSize", 1000);			}

	}
	
	else{
		if($("#"+id).get(0).isClosed){
		$("#"+id).containerize("open", 100);
		}
				
	}
	var span = document.getElementsByClassName("constraintsList");
			for(var i = 0; i< span.length; i++){
			
			span[i].onclick= function(){search(this.getAttribute("data"))
			
			listofsearch= this.getAttribute("data").split(",");
			for (var l in listofsearch){
						startAnimation(listofsearch[l]);
						}
				
			}}
}

function containerSearch(id, content){
	if($("#"+id).length ===0){
		var container = document.createElement("div")
		var titleTag = document.createElement("H2");
		container.innerHTML=content;
		titleTag.innerHTML="Search result : Constraints";
		container.appendChild(titleTag);
		container.setAttribute("id", id);
		container.setAttribute("data-skin", "white");
		container.setAttribute("data-drag", "true");
		container.setAttribute("data-resize", "true");
		container.setAttribute("data-collapsable", "true");
		container.setAttribute("data-remenberme", "true");
		container.setAttribute("data-containment", "document");
		container.setAttribute("data-dock", "dock");
		container.setAttribute("data-centeronwindow", "true");
		container.setAttribute("data-buttons", "dock,fullscreen,close");
		
		document.getElementById("body").appendChild(container);
		
		$(container).containerize({ //$(el).css({opacity:.7})
        onClose: function(o) { 
        if(!o.$.isIconized){
            document.getElementById("body").removeChild(document.getElementById(o.getAttribute("id"))) }           
        
        }


        });
        
        
		if(parseInt(($(container).css("width")))> window.innerWidth/2){
			$(container).containerize("setSize", window.innerWidth/2);			}
		if(parseInt(($(container).css("height")))> window.innerHeight/2){
			$(container).containerize("setSize", ($(container).css("width")), window.innerHeight/2);			}

	}
        

}

/*
*sample of popup functionality
*
*
*/


    $(function(){


        /*
         * add custom method for restor popup without click
         *
         * */

        $.containerize.addMethod("restorePopup",function(){
            var el = this;
            if(el.$.isIconized){
	            el.$.containerize("restoreView")
	            var tmp= el.$[0].id;
	             var child = document.getElementById("dock").childNodes
	             for( var i =0; i<child.length;i++){
	            	if(child[i].getAttribute("name")=== tmp){
		            	document.getElementById("dock").removeChild(child[i]);
	            	}
	            
	            }
            }
            else{el.$.containerize("close")}
        });
        })


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