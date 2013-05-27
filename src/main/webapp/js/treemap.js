/*
 * function
 * parameters : URI, callback function
 * description : sends a GET http request, receives
 * a json structure and executes a callback function.
 */

  initialize(root);
  accumulate(root);
  layout(root);
  display(root);
  currentRoot= root;
  
 
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
  // 
  function layout(d) {

    d.color = "#109D00";
    if(d.parent) {
        d.id = "" + d.parent.id + "." + d.name;
        d.depth = d.id.split(".").length -1;
    }
    if (d.children) {
      treemap.nodes({children: d.children});
      
      d.children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        
        layout(c);
      });
    }
  }
  


 
 /*
  * function
  * parameters : node
  * description : returns the depth of node given in parameters
  */
function treeDepth(d) {
    return d.name === "g5k"? 0: d.id.split(".").length -1;
}
  
  //Returns true if a string is an occurence of one of the array strings
  function isIn(array, str) {
      for(var i = 0; i< array.length; i++) {
          if(str.indexOf(array[i]) !== -1 && array[i].length !== 0)
              return true;
      }
      return false;
  }
  
  
  //Returns the nodes that matches the node_names search
function getNodes(node_names, d) {
    var nodes = Array();
    if (isIn(node_names, d.name) || isIn(node_names, d.id)) {
        nodes = nodes.concat(d);
        //console.log(d.id);
    }
    if (!d.children)
        return null;
    for (var i = 0; i < d.children.length; i++) {
        var res = getNodes(node_names, d.children[i]);
        if (res !== null)
            nodes = nodes.concat(res);
    }
    return nodes;
}
  
  //Return Lowest Common Ancestor (LCA)
  function common_ancestor(keywords) {
      var nodes = getNodes(keywords.replace(/\s/g, "").split(","), inaltered_Root);
      
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
      if(path_divergence === 0) {
          //return nodes[0].parent? nodes[0].parent : nodes[0];
          return nodes[0];
      }

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
  
 /*
  d3.selectAll("input").on("click", function change() {
    var value = this.value === "count"
        ? treemap.value(function(d) { return 2000 })
        : treemap.value(function(d) { return d.ressource });
       
       accumulate(currentRoot);
          layout(currentRoot);
          gOld.transition().duration(300).remove().each("end", function() {
                svg.style("shape-rendering", null);
                transitioning = false;
            });
        display(currentRoot);
        
  });
*/
document.getElementById("count").checked = true;
var radios = document.search_form.mode;
for (i in radios) {
    radios[i].onclick = function() {

        this.value === "count"? treemap.value(function(d) { return 2000; })
        : treemap.value(function(d) { return d.ressource; });
        
        accumulate(currentRoot);
        layout(currentRoot);
        gOld.transition().duration(300).remove().each("end", function() {
            svg.style("shape-rendering", null);
            transitioning = false;
        });
        display(currentRoot);
    };
}

document.search_form.search_button.onclick = function() {
    launch_search = true;
    display(currentRoot);
};

document.search_form.search_field.onkeypress = function() {
    if(window.event.keyCode === 13) {
        launch_search = true;
        display(currentRoot);
    }
};

 
 /*
  * function
  * parameters : node 
  * description : displays a node with its components
  */
  function display(d) {
    //console.log(d.depth);
    // create attribute depth
    var g1 = svg.insert("g", ".grandparent")
        .datum(d.children)
        .attr("class", "depth");
 
    // sets parameters for "g" tag
    var g = g1.selectAll("g")
        .data(d.children)
        .enter().append("g")
        .classed("children", true)
        .attr("name", function(d) { console.log(d.name); return d.name ;})
        .attr("id", function(d){return getId(d);})
        .on("click", function(d){d.children? transition(d): null;})
        .on("contextmenu", function(d) {d.parent.parent? mouseDown(d) : null; })

        ;


    // sets parameters for parent "rect" tag
    g.append("rect")
        .attr("class", "parent")
        .attr("stroke-width", "12")
        .call(rect)
        .append("title")
        .text(function(d) { return d.name; })

;


    var g2 =  g.selectAll("g")
        .data(function(d) { return d.children || [d]; })
        .enter().append("g")
        .classed("grandChild", true)
        .attr("name", function(d) { return d.name ;})
        .attr("id", function(d){return getId(d);})
        .call(rect)
        .on("mouseover", function(d) {onHover(this.parentNode);})
        
;

    g2.append("rect").attr("class", "grandChildren")
        .attr("stroke-width", "5")
        .call(rect)
;
        

    g2.selectAll("g")
        .data(function(d) { return d.children || [d]; })
        .enter()
        .append("rect")
        .attr("class",  "grandChild")
        .attr("stroke-width", "1")
        .call(rect)
        .on("mouseout", function(d) {remove();})
        .on("mouseover", function(d) {contextualMenu(d);})
;

 
    // prints a text on a node
    g.append("text")
        .attr("dy", "1.75em")
        .attr("class", "textChildren")
        .text(function(d) { return d.name; })
        .call(text);
    
    // prints text on children nodes
    g.selectAll(".textChild")
        .data(function(d) { return d.children || [d]; })
        .enter().append("text")
        .attr("class", "textChild")
        //.text(function(d) { return x(d.dx)>30? d.name: ""; })
        .text(function(d) { return d.name;})
        .attr("dy", ".75em")
        .attr("lengthAdjust", "spacingAndGlyphs")
        .call(textChild);

        gOld= g1;
 
    /*
     * function
     * parameters : node
     * description : change root by given parameter, used for zoomin/zoomout
     */

  
    function transition(d) {
        currentRoot = d;
        remove();
        unHighLight(undefined);
        if (transitioning || !d)
            return;
        transitioning = true;
            
        var g2 = display(d),
            t1 = g1.transition().duration(300),
            t2 = g2.transition().duration(300);

            // Update the domain only after entering new elements.
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

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
            t1.selectAll("text").call(text).style("fill-opacity", 0);
            t2.selectAll(".textChildren").call(text).style("fill-opacity", 1);
            t2.selectAll(".textChild").call(textChild).style("fill-opacity", function(d) {
                if(d.parent.parent.children.length>15) return 0;
                return d.parent.children.length<20? 1: 0;
            
            });
            t1.selectAll("rect").call(rect);
            t2.selectAll("rect").call(rect);

            // Remove the old node when the transition is finished.
            t1.remove().each("end", function() {
                svg.style("shape-rendering", null);
                transitioning = false;
            });
            
            currentRoot= d;

            

        }
        
        //search function
        var search_field = document.search_form.search_field;
        if(launch_search && search_field.value.length !== 0) {
            var new_node = common_ancestor(search_field.value);
            search_field.value = "";
            if(new_node !== null && new_node !== d) {
                d = new_node;
                currentRoot = d;
                transition(d);
            }
        }
        launch_search = false;
        
       
        
        /*
         * function
         * parameters : event
         * description : on mouse on diferents browsers
         */
        function mouseDown(e) {
            if (navigator.appName === 'Opera' && window.event.which === 3) {
                transition(d.parent.parent);
            }
            else if (navigator.appName === 'Microsoft Internet Explorer'
                    && event.button === 2) {
                transition(d.parent);
            }
            else if (navigator.appName === 'Netscape' && e.which === 3) {
                transition(d.parent);
            }
        }
        
        
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
        //.style("fill", "#109D00" );
        .style("fill", function(d) { return d.color; });
        //.style("fill", function(d) { return color(d.name); });
  }
  
  document.oncontextmenu=RightMouseDown;
  function RightMouseDown() { return false; } 
  

