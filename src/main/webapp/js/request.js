var req = new XMLHttpRequest();
req.open('GET', "http://localhost:8080/webapp/coucou", false); 

req.onreadystatechange=function()
  {
  if (req.readyState==4 && req.status==200)
    {
    root= JSON.parse(req.responseText);
    inaltered_Root = root

    }
  }
  req.send(null);
  
  