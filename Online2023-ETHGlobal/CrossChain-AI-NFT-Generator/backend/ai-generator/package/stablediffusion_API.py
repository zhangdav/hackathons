import webuiapi
from PIL import Image
import os
from dotenv import load_dotenv


load_dotenv()
HOST = os.getenv('HOST')
PORT = os.getenv('PORT')


def img2img(path,description):
    description = "Cartoon characters, pop style,"+ description 
    api = webuiapi.WebUIApi(host=HOST, port=PORT, sampler='Euler a', steps=20,use_https=False)
    img = Image.open(path)
    result2 = api.img2img(images=[img], prompt= description , seed=-1, cfg_scale=11, denoising_strength=0.56)
    savepath = path.replace(".png", "_ai.png").replace(".jpg", "_ai.png").replace("userImage", "public//aiImage")
    result2.image.save(savepath)
    savepath = savepath.replace("//","/").replace("\\","/")
    returndata = {
        "aiimagepath":savepath,
    }
    return returndata


