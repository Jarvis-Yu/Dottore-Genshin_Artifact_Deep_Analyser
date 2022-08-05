from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello_world():
    return "<Text>Hello, World!</Text>"


@app.route("/simple_json", methods=["GET"])
def simple_json():
    d = {
        "val1": 3,
        "val2": 2,
    }
    return jsonify(d)


@app.route("/repeat", methods=["POST"])
def repeat():
    a = request.json["val1"]
    b = request.json["val2"]
    return jsonify({"val1": a+1, "val2": b+1})


if __name__ == '__main__':
    # os.system("export FLASK_APP=react_native_api.py && " +
    #           "export FLASK_ENV=development && " +
    #           "flask run")
    app.debug = True
    # ip: 127.0.0.0 - 127.255.255.255
    app.run(port=41372)
