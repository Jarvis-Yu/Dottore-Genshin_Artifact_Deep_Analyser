from flask import Flask, jsonify, request

from python_backend.artifact.artifact import Artifact
from python_backend.artifact.artifact_attrs import ArtifactAttrs
from python_backend.artifact.rarity import rarity_in_domain_runs
from python_backend.artifact.weighted_attrs import WeightedAttrs
from python_backend.consts.terminology.artifact_consts import ArtifactEnum
from python_backend.consts.terminology.attribute_consts import AttributeEnum

app = Flask(__name__)


# f = open("react_native_api_log.txt", "a")

# def log(s: str):
#     f.write(s)


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
    return jsonify({"val1": a + 1, "val2": b + 1})


@app.route("/artifact/type-to-mainattrs", methods=["POST"])
def get_artifact_mainattrs():
    artifact_type: str = request.json["type"]
    artifact: ArtifactEnum
    artifact = ArtifactEnum.find_with_short_name(artifact_type)
    retval = []
    if artifact_type is not None:
        for mainattr in artifact.mainattr_weights_readonly().keys():
            retval.append({"title": mainattr.short_name()})
    return jsonify(retval)


@app.route("/artifact/mainattr-to-subattrs", methods=["POST"])
def get_artifact_subattrs():
    artifact_mainattr: str = request.json["mainattr"]
    artifact_level: int = request.json["level"]
    max_scale = (artifact_level // 4 + 1) * 10
    min_scale = 7
    artifact_subattrs: dict[AttributeEnum, float] = ArtifactEnum.FLOWER.subattr_weights_readonly()
    retval = {}
    for attr in artifact_subattrs:
        if attr.short_name() != artifact_mainattr:
            step = attr.subattr_step()
            retval[attr.short_name()] = {
                "key": attr.short_name(),
                "min_val": min_scale * step,
                "max_val": max_scale * step,
                "step": step,
            }
    return jsonify(retval)


@app.route("/artifact/get_all_info", methods=["POST"])
def get_all_info():
    artifact_kind = ArtifactEnum.find_with_short_name(request.json["kind"])
    artifact_level = request.json["level"]
    artifact_mainattr = AttributeEnum.find_with_short_name(request.json["mainattr"])
    artifact_subattrs = ArtifactAttrs()
    for attr in request.json["subattrs"]:
        key: AttributeEnum = AttributeEnum.find_with_short_name(attr)
        value = request.json["subattrs"][attr] / key.subattr_max_val()
        artifact_subattrs.add(key, value)
    art = Artifact.rating_only_plan(artifact_level, artifact_kind, artifact_mainattr,
                                    artifact_subattrs, WeightedAttrs.crit_atk_er_em_plan())
    art_expect = art.expected_rating(crit_based=True)
    art_curr = art.current_rating(crit_based=True)
    art_extreme = art.extreme_rating(crit_based=True)
    art_relative = art.relative_p()
    art_runs = rarity_in_domain_runs(art_relative * 0.1)
    retval = {
        "art_expect": art_expect,
        "art_extreme": art_extreme,
        "art_curr": art_curr,
        "art_relative": art_relative,
        "art_runs": art_runs,
    }
    return jsonify(retval)


@app.route("/artifact/relative_p", methods=["POST"])
def get_artifact_relative_p():
    return jsonify({})


if __name__ == '__main__':
    # os.system("export FLASK_APP=react_native_api.py && " +
    #           "export FLASK_ENV=development && " +
    #           "flask run")
    app.debug = True
    # ip: 127.0.0.0 - 127.255.255.255
    app.run(port=41372)
