var req = new XMLHttpRequest();
req.open('GET', "http://localhost:8080/webapp/server", false); 

req.onreadystatechange=function()
  {
  if (req.readyState==4 && req.status==200)
    {
    root= JSON.parse(req.responseText);
    console.log(root.struct);
    root = root.struct;
    inaltered_Root = root;

    }
  };
  req.send(null);
  
  