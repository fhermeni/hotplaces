package server;

import java.io.*;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.codehaus.jettison.json.JSONObject;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;

import btrplace.model.*;
import btrplace.model.constraint.*;
import btrplace.model.constraint.checker.*;
import java.util.ArrayList;

@Path("/server")
public class Server {
    
   Model model = new DefaultModel();
   Mapping map = model.getMapping();
   
   
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response repondre() throws FileNotFoundException, IOException, JSONException {
        JSONObject data = null;
        JSONObject dataStruct = null;
        JSONObject dataConst = null;
        String chaine = "";
        String path = "./src/main/ressources/g5kMock.json";

        FileInputStream stream = new FileInputStream(new File(path));
        try {
            FileChannel fc = stream.getChannel();
            MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
            chaine = Charset.defaultCharset().decode(bb).toString();
            fc.close();
        } finally {
            stream.close();
        }

        try {
            data = new JSONObject(chaine);
            String keys[] = {"struct"};
            String keys2[] = {"const"};
            dataStruct = new JSONObject(data, keys);
            dataConst = new JSONObject(data, keys2);

        } catch (JSONException JSe) {
            System.out.println("pbs JSON file");
        }

        
        /*
        
        Node node = model.newNode();
        Node node2 = model.newNode();
        VM vm = model.newVM();
        VM vm2 = model.newVM();
        
        map.addOnlineNode(node);
        map.addOnlineNode(node2);
        map.addRunningVM(vm, node);
        map.addRunningVM(vm2, node2);
        
        ArrayList<VM> vms = new ArrayList<VM>();
        vms.add(vm);
        vms.add(vm2);
        
        Gather gather = new Gather(vms);
        
        System.out.println(gather.isSatisfied(model));
        */
        mapBuild(dataStruct.optJSONObject("struct"));
        
        System.out.println(map);
        
        return Response.ok(data.toString()).build();

    }
    
    public boolean isVM(JSONObject jo) {
        if(jo.has("children"))
            return false;
        return true;
    }
    
    //returns true if node is a server
    public boolean isServer(JSONObject jo) {
        if(! isVM(jo)) {
            JSONArray children = jo.optJSONArray("children");
            if(isVM(children.optJSONObject(0)))
                return true;
        }
        return false;
    }
    
    public JSONObject mapBuild(JSONObject jo) {
        JSONArray children = jo.optJSONArray("children");
        if(isServer(jo)) {
            
            Node node = model.newNode();
            map.addOnlineNode(node);
            VM vm;
            for(int i =0; i< children.length(); i++) {
                // UUID --> Integer ?
                vm = model.newVM();
                map.addRunningVM(vm, node);
            }
            
            
        } else {
            if(! isVM(jo)) {
                for(int i =0; i< children.length(); i++) {
                    mapBuild(children.optJSONObject(i));
                }
            }
        }

        return jo;
    }
    
}



