	function creatContainer(id, title, content, width, height){
	var container = document.createElement("div")
	container.setAttribute("id", id);
	container.setAttribute("data-skin", "black");
	container.setAttribute("data-drag", "true");
	container.setAttribute("data-resize", "true");
	container.setAttribute("data-collapsable", "true");
	container.setAttribute("data-remenberme", "true");
	container.setAttribute("data-containment", "document");
	container.setAttribute("data-dock", "dock");
	container.setAttribute("data-buttons", "dock,fullscreen,close");
	var title = document.createElement("h2");
	title.innerHTML=title;
	container.appendChild(title);
	document.getElementById("body").appendChild(container);
	container.innerHTML=content;
	$(container).containerize({onLoad: function(el){}, //$(el).css({opacity:.7})
            onClose: function(o) { 
            if(!o.isIconized){
	            document.getElementById("body").removeChild(document.getElementById(o.getAttribute("id"))) }           
            
            },
            onIconize: function(o){
            	},
            
            onCollapse: function(o){},
 
            onRestore:function(o){}

            });
            
	
	}
	
	
    $(function(){



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
        $("#cont3").containerize("addtotoolbar", [iconizeBtn,changeSkinBtn,dockBtn]);*/

    })