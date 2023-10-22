import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import logging

numba_logger = logging.getLogger('numba')
numba_logger.setLevel(logging.WARNING)
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

from flask import Flask, jsonify, request, render_template,redirect, url_for,send_from_directory

import json
from flask import Flask, flash, request, redirect, url_for, session
import urllib
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import logging
from audioProcessing import *
from numpyencoder import NumpyEncoder
from itertools import chain
from werkzeug.utils import secure_filename
import base64
from joblib import dump, load

from silenceRem import *
model = tf.keras.models.load_model('gfgModel.h5')


logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')



UPLOAD_FOLDER = os.getcwd()
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','wav'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)
# app.config['UPLOAD_PATH'] = os.getcwd()+'/upload'

	
@app.route('/uploader', methods = ['GET', 'POST'])
@cross_origin()

def upload_file():
    global scaler_path
    scaler_path=os.getcwd()
    print('path------->',scaler_path)
    target=os.path.join(UPLOAD_FOLDER,'upload')
    if not os.path.isdir(target):
        os.mkdir(target)

    # bytesOfAudio = request.get_data()
    # with open("file.wav", "wb") as fh:
    #     fh.write(base64.decodebytes(bytesOfAudio))
    # return "zImage read"
    # def convertBase64ToFile(base64str):
    #     file_bytes = base64.b64decode(base64str)
    #     file = BytesIO(file_bytes)
    #     return file

    # fileData = convertBase64ToFile(bytesOfImage)
    # with open("./file", 'wb') as out:
    #     out.write(fileData.read())
    # encoded = base64.b64encode(bytesOfImage)


    logger.info("welcome to upload`")
    file = request.files['file'] 
    # file = request.get_data()

    filename = secure_filename(file.filename)
    print(filename)
    global destination
    destination="".join([target+'/', filename])
    print(destination)
    file.save(destination)
    session['uploadFilePath']=destination
    response="Whatever you wish too return"
    return json.dumps(response)

    # file_url = request.form.get("file_attachment")
    # save_name = "test.wav"
    # urllib.request.urlretrieve(file_url, "{0}{1}".format(app.config['UPLOAD_FOLDER'],save_name))
    # return json.dumps({"status":True})

    

# @app.route('/hello', methods =["POST"])
# @app.route('/')
# def my_form():
#     return render_template('home.html')

@app.route('/test', methods=['GET','POST'])
@cross_origin()

def hello_world():

    # uploaded_file = request.files['file']
    # filename = secure_filename(uploaded_file.filename)
    # if filename != '':
    #     # file_ext = os.path.splitext(filename)[1]
    #     uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
    #     global myPath
    #     myPath = os.path.join(app.config['UPLOAD_PATH'], filename)
    #     # return redirect(request.url)
    #     print("PATHHHHH ------>"+myPath)        
    
    # directory='C:/Users/shehr/OneDrive/Documents/chalega/model/test_audio'
    print(destination)


    new_path = rem_Silence(destination)
    os.remove(destination)
    # arr=np.array([])
    if os.path.isdir(new_path): 
        arr=[]
        print(new_path)
        for filename in os.listdir(new_path):
            f = os.path.join(new_path, filename)
            print('FILE____>',f)
        # checking if it is a file
            if os.path.isfile(f):
                print('FILE 222 [==============================]>',f)
                print('FILE 333 [==============================]>',f.replace(os.path.sep, '/'))
                res = get_features(f)
                os.remove(f)
                print('FILE REMOVED [==============================]>',f)
                scaler=load('C:/Users/shehr/OneDrive/Desktop/Flask/std_scaler.bin')
                test1 = scaler.transform(res)
                x = np.expand_dims(test1, axis=2)
                pred_test = model.predict(x)
                pred_arr = pred_test.tolist()
                json_str = json.dumps(pred_arr)
                encoder = OneHotEncoder()
                # arr = np.append(arr,pred_arr) #individually append each item
                emotions_arr=[]
                for i in range(len(pred_test)):
                    if pred_test[i][0] > pred_test[0][1]:
                        emotions_arr.append('angry-')
                    else:
                        emotions_arr.append('mix-')
                arr.append(emotions_arr)
        arr=list(chain.from_iterable(arr))
        AOP_1 = json.dumps(arr,cls=NumpyEncoder)
        return AOP_1

    elif os.path.isfile(new_path):
        arr=[]
        res = get_features(new_path)
        print("--WHEN YOU HAVE 1 FILE-->",new_path)
        # scaler = StandardScaler()
        scaler=load('C:/Users/shehr/OneDrive/Desktop/Flask/std_scaler.bin')
        test1 = scaler.transform(res)
        x = np.expand_dims(test1, axis=2)
        pred_test = model.predict(x)
        pred_arr = pred_test.tolist()
        json_str = json.dumps(pred_arr)
        encoder = OneHotEncoder()
        # arr = np.append(arr,pred_arr) #individually append each item
        emotions_arr=[]
        for i in range(len(pred_test)):
            if pred_test[i][0] > pred_test[0][1]:
                emotions_arr.append('angry=-')
            else:
                emotions_arr.append('mix=-')
        arr.append(emotions_arr)
    



        # val = pd.Series(y_pred.flatten()).to_json(orient='values')
        # new_arr = arr.tolist()
        arr=list(chain.from_iterable(arr))
        AOP_1 = json.dumps(arr,cls=NumpyEncoder)
        return AOP_1


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,port=8080)

app = CORS(app, expose_headers='Authorization')

# if __name__ == '__main__':
#     app.run(debug=True,port=8080)



# import os
# import re
# from flask import Flask, flash, request, redirect, url_for, session
# from werkzeug.utils import secure_filename
# from flask_cors import CORS, cross_origin
# import logging

# logging.basicConfig(level=logging.INFO)

# logger = logging.getLogger('HELLO WORLD')



# UPLOAD_FOLDER = os.getcwd()
# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','wav'])

# app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# @app.route('/upload', methods=['POST','GET'])

# def fileUpload():

#     target=os.path.join(UPLOAD_FOLDER,'upload')
#     if not os.path.isdir(target):
#         os.mkdir(target)
#     logger.info("welcome to upload`")
#     file = request.files['file'] 
#     filename = secure_filename(file.filename)
#     print(filename)
#     destination="".join([target+'/', filename])
#     print(destination)
#     file.save(destination)
#     session['uploadFilePath']=destination
#     response="Whatever you wish too return"
#     return response


# if __name__ == "__main__":
#     app.secret_key = os.urandom(24)
#     app.run(debug=True,host="0.0.0.0",use_reloader=False)

# CORS(app, expose_headers='Authorization')