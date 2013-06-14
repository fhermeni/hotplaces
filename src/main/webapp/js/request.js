var req = new XMLHttpRequest();
req.open('GET', "http://localhost:8080/webapp/server", false);

req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200) {
        var res = JSON.parse(req.responseText);
        root = res.struct;
        inaltered_Root = root;
        constraints = res.const;


        console.log(constraints);
        console.log(root);
        ressourcesEl = res.resources;

    }
};
req.send(null);

  