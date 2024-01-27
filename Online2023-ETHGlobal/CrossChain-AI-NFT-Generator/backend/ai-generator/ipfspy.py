import os
from PIL import Image

def ipfsupload(imagepath,description):
    name = os.path.abspath(imagepath)
    name = imagepath.split("/")[-1].split(".")[0]
    img = Image.open(os.path.abspath(imagepath))
    img.save(os.path.abspath("backend/ai-generator/ipfsimage")+"/"+name+".png")
    f=os.popen("node backend/ai-generator/upload.mjs {} {} {}".format(os.path.abspath("backend/ai-generator/ipfsimage")+"/"+name+".png", name ,description))    
    a = f.read()
    a = a.replace("Token","").replace('\n', '').replace('\r', '').replace(" ","").replace("{ipnft:'","").replace("'}", "")
    ipnft = a.split("',url:'")[0]
    url = a.split("',url:'")[-1]

    returndata = {
        "ipnft":ipnft,
        "url":url,
    }    
    print(returndata)

    return returndata