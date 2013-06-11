
/*
 * function
 * parameters : URI, callback function
 * description : sends a GET http request, receives
 * a json structure and executes a callback function.
 */
  currentRoot= root;
  hoverNode = root;
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);
 
  displayInfo(root);
 
  /*
   * function
   * parameters : node to inititialize
   * description : inititialize coordinates of given parameter
   */
  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
    root.id = "g5k";
  }
 
 /*
  * function
  * parameters : node
  * description : Aggregate the values for internal nodes. This is normally done by the
  * treemap layout, but not here because of our custom implementation.
  */

  function accumulate(d) {
    nodes.push(d);
    if(d.children) {
        return d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0);
    } else {
        return 1;
    }
  }
 
 
 /*
  * function
  * parameters : node
  * description : Compute the treemap layout recursively such that each group of siblings
  * uses the same size (1×1) rather than the dimensions of the parent cell.
  * This optimizes the layout for the current zoom state. Note that a wrapper
  * object is created for the parent node for each group of siblings so that
  * the parent’s dimensions are not discarded as we recurse. Since each group
  * of sibling was laid out in 1×1, we must rescale to fit using absolute
  * coordinates. This lets us use a viewport to zoom.
  */
  function layout(d) {

	d.name==='free' ? d.color= colorFree : d.color = colorNoProb ;
	if (d.constraints){
	for(var i = 0; i< d.constraints.length; i ++){
		d.constraints[i].satisfy? d.color= d.color: d.color = colorProb;
		
		
	}
	}
    

    if(d.parent) {
        d.id = "" + d.parent.id + "." + d.name;
        d.depth = d.id.split(".").length -1;
    }
    if (d.children) {
    	var padding= pad-pas*(d.depth+1);
    	padding <0? padding= 0: padding=padding;
      treemap.nodes({children: d.children});
      
      d.children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        });
        
      d.children.forEach(function(c) {

        c.x +=padding;
        c.y +=padding;
        c.dx -=(padding*2);
        c.dy -=(padding*2);
        
        layout(c);
      });
    }
  }
  
  
  //Returns the nodes that matches the node_names search
function getNodes(regexp, d) {
    var nodes = Array();
    if (regexp.test(d.name) || regexp.test(d.id) ) {
        nodes = nodes.concat(d);
    }
    if (!d.children)
        return null;
    for (var i = 0; i < d.children.length; i++) {
        var res = getNodes(regexp, d.children[i]);
        if (res !== null)
            nodes = nodes.concat(res);
    }
    return nodes;
}
  
  //Return Lowest Common Ancestor (LCA)
  function common_ancestor(keywords) {
      //Construct the regexp corresponding to keywords
      keywords = keywords.replace(/^/, "^").replace(/$/, "$")
              .replace(/(\,|\s|;)+/g, "$|^")
              .replace(/\*/g, "(\\S)*")
              .replace(/\?/g, "\\S")
      ;
      //console.log(keywords);
      var regexp = new RegExp(keywords, "i");

      //get the search result
      var nodes = getNodes(regexp, inaltered_Root);
      
      //if no result
      if(nodes.length === 0) return null;
      
      //if only one result
      if(nodes.length === 1) return nodes[0];
      
      var path = nodes[0].id.split(".");
      var path_divergence = 0;
      
      //Compare nodes id to the path and spot where they differ
      for(var i=0; i< path.length; i++) {
          for(var j=1; j< nodes.length; j++) {
              var id = nodes[j].id.split(".");
              if(path[i] !== id[i]) {
                  path_divergence = i;
                  break;
              }
          }
          if(path_divergence !== 0) break;
      }
      
      //if first result is the LCA
      if(path_divergence === 0) return nodes[0];

      //Get to the LCA from the root
      var tmpNode = inaltered_Root;
      for(var i =1; i< path_divergence ; i++) {
          for(var j=0;j<tmpNode.children.length; j++) {
              if(tmpNode.children[j].name === path[i]) {
                  tmpNode = tmpNode.children[j];
                  break;
              }
          }
      }
      
      return tmpNode;
  }
  
function search(searchField) {
    keyWords = searchField;
    launch_search = true;
    removeDisplay();
    display(currentRoot);
}

document.search_form.search_button.onclick = function() {
    search(document.search_form.search_field.value);
};

document.search_form.search_field.onkeypress = function() {
    if(window.event.keyCode === 13) {
        search(document.search_form.search_field.value);
    }
};

 
 /*
  * function
  * parameters : node 
  * description : displays a node with its components
  */
  function display(d) {

  	

      
      function singleClick(d) {
        if (!window.clicktimer)
            window.clicktimer = setTimeout(function() {
               d.children? transition(d): null;
                window.clicktimer = undefined;
            }
            ,200);
      }
      
      function doubleClick(d) {
        clearTimeout(clicktimer);
        d.children? transition(d) : transition(d.parent);
        window.clicktimer = undefined;
    }
      

    // create attribute depth
    var g1 = svg.insert("g", ".grandparent")
        .datum(d.children)
        .attr("class", "depth");
        
        
        gOld= g1;
        

 
    // sets parameters for "g" tag
    var g = g1.selectAll("g")
        .data(d.children)
        .enter().append("g")
        .classed("children", true)
        .attr("name", function(d) { return d.name ;})
        .attr("id", function(d){return d.id;})
        .on("click", function(d){
    //d.children? transition(d): null;
    singleClick(d);

})
        .on("contextmenu", function(d) {d.parent.parent? mouseDown(d) : null; })

        ;


    // sets parameters for parent "rect" tag
    g.append("rect")
        .attr("class", "parent")
        //.attr("stroke-width", "1")
        .call(rect)
        .append("title")
        .text(function(d) { return d.depth<4? d.name: null; })


;


    var g2 =  g.selectAll("g")
        .data(function(d) { return d.children || [d]; })
        .enter().append("g")
        .classed("grandChild", true)
        .attr("name", function(d) { return d.name ;})
        .attr("id", function(d){return d.id;})
        .call(rect)
        .on("mouseover", function(d) {onHover(this.parentNode);})
        
        
;

    g2.append("rect").attr("class", "grandChildren")
       // .attr("stroke-width", "5")
        .call(rect)
;

        
     

    g2.selectAll("g")
        .data(function(d) { return d.children || [d]; })
        .enter()
        .append("rect")
        .attr("class",  "grandChild")
        //.attr("stroke-width", "1")
        .call(rect)
        .on("mouseout", function(d) {hoverNode= inaltered_Root;displayInfo(d);})
        .on("mouseover", function(d) {hoverNode=d; displayAllInfos(d);})
        .on("dblclick", function(d) {
            /*console.log(d.name);
            transition(d);
            */
           doubleClick(d);
        })
;

 
    // prints a text on a node
    g.append("text")
        .attr("dy", "1.75em")
        .attr("class", "textChildren")
        .text(function(d) { return d.depth<4? d.name : null; })
        .call(text);
    
    // prints text on children nodes
    g.selectAll(".textChild")
        .data(function(d) { return d.children || [d]; })
        .enter().append("text")
        .attr("class", "textChild")
        .text(function(d) { return d.depth<4? d.name : null;})

        .attr("dy", ".75em")
        .attr("lengthAdjust", "spacingAndGlyphs")
        .call(textChild);

        
 
    /*
     * function
     * parameters : node
     * description : change root by given parameter, used for zoomin/zoomout
     */
    function transition(d) {
        
        unHighLight(undefined);
        if (transitioning || !d)
            return;
        transitioning = true;
        removeDisplay();


        var g2 = display(d),
                t1 = g1.transition().duration(300),
                t2 = g2.transition().duration(300);
                



        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);
        
        /*d.depth > 0 ? (pad = 2, pas = 0.5) : (pad = 3, pas = 1);*/
        //layout(d);

        // Enable anti-aliasing during the transition.
        // Desabled for  more fluent transitions
        svg.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll(".depth").sort(function(a, b) {
            return a.depth - b.depth;
        });

        // Fade-in entering text.
        g2.selectAll("text").style("fill-opacity", 0);

        // Transition to the new view.
        //t1.selectAll("text").call(text).style("fill-opacity", 0);
        t2.selectAll(".textChildren").call(text).style("fill-opacity", 1);
        t2.selectAll(".textChild").call(textChild).style("fill-opacity", function(d) {
            if (d.parent.parent.children.length > 15)
                return 0;
            return d.parent.children.length < 20 ? 1 : 0;

        });
        //t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function() {
            svg.style("shape-rendering", null);
            transitioning = false;
        });
        
        currentRoot = d;
        displayInfo(d);

    }
        
        // function for goback to root button
        if(firstDisplay) {
            document.search_form.rootButton.onclick = function() {
                if(currentRoot.depth !== 0) {
                    removeDisplay();
                    transition(inaltered_Root);
                }
            }
        } 

        
        //search function
        //var search_field = keyWords;
        
        if(launch_search && keyWords.length !== 0) {
            var new_node = common_ancestor(keyWords);
            search_field.value = "";
            if(new_node !== null && new_node !== d) {
                d = new_node;
                transition(d);
            }
        }
        launch_search = false;
        
        
        /*
        *change treemap organisation depending of ressources's type selected
        *call when select item has changed
        */
        var select = document.getElementById("ressources_select");
        select.onchange= function(){
	        var value = select.options[select.selectedIndex].value;
	        value === 'Count'? document.getElementById("displayFreeSpace").setAttribute('disabled') :  document.getElementById("displayFreeSpace").removeAttribute('disabled');
	        treemap.value(function(d){
	        		        return d.name==='free'? somChildrenValue(d)*freeIsDisplaying :somChildrenValue(d);
	        })
	        layout(currentRoot);
	        transition(currentRoot);
	        }
	        
	        
	        
	    var displayFreeSpace = document.getElementById("displayFreeSpace");
	    displayFreeSpace.onclick= function(){
	    	
		    treemap.value(function(d){return d.children? d.value : (d.name=== "free"? (freeIsDisplaying? getGoodRessources(d): 0): d.value) });
		    freeIsDisplaying = !freeIsDisplaying;
		    freeIsDisplaying? displayFreeSpace.value="hidde free ressource": displayFreeSpace.value="display free ressource"
		    layout(currentRoot);
		    transition(currentRoot);
		    	

	    }
	    

	    	

        
        /*
         * function
         * parameters : event
         * description : on mouse on diferents browsers
         */
        function mouseDown(e) {
            if (navigator.appName === 'Opera' && window.event.which === 3) {
                if(d.parent) transition(d.parent);
            }
            else if (navigator.appName === 'Microsoft Internet Explorer'
                    && event.button === 2) {
                if(d.parent) transition(d.parent);
            }
            else if (navigator.appName === 'Netscape' && e.which === 3) {
                if(d.parent) transition(d.parent);
            }
        }
        
        firstDisplay = false;
        document.onmousedown=mouseDown;
        return g;
  }
 
  /*
   * function
   * description : adds attributes to "text" tags
   */
  function text(text) {
    text.attr("x", function(d) { return x(d.x+d.dx/2) ; })
        .attr("y", function(d) { return y(d.y) + 6; })
        .style("font-size",function(d) { return d.parent.children.length<20? "x-large": "medium";})
        
;
  }
  
   /*
    * function
    * description : adds attributes to children
    */
   function textChild(text) {
    text.attr("x", function(d) { return x(d.x) +6  ;})
        .attr("y", function(d) { return y(d.y) + 6; })
        .style("fill-opacity", function(d) {return d.parent.children.length<20? 1: 0;})
;
  }
 
  /*
   * function
   * descripton : adds attributes to the "rect" tags
   */
  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
        .style("fill", function(d){   return this.getAttribute('class')==='grandChild'? d.color : "#FFF" });


  }
  
function somChildrenValue(d) {
    var som = 0;

    d.children ? d.children.forEach(function(c) {
        som = som + somChildrenValue(c)
    }) : som += getGoodRessources(d);
    return som;
}
  
function getGoodRessources(d) {
    var select = document.getElementById("ressources_select");
    var typeOfRessources = select.options[select.selectedIndex].value;
    return typeOfRessources === "Count" ?
            (d.name === 'free' ? 0 : 1)
            : (typeOfRessources === "RAM" ?
            d.RAM
            : (typeOfRessources === "CPU" ?
            d.CPU
            : (typeOfRessources === "Disk" ?
            d.DiskSpace
            : 1)));
}
  
  document.oncontextmenu=RightMouseDown;
  function RightMouseDown() { return false; } 
  

