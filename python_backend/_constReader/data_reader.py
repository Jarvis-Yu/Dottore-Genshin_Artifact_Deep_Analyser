import re
from typing import IO
import json
from pathlib import Path

path = Path(__file__).parent


def read_num_until_eof(file: IO) -> str:
    res = None
    line = "foo"
    while not res and line:
        line = file.readline()
        res = re.search(r'\d+(.\d+)?', line)
    if res:
        return res.group()
    else:
        return "eof"


def read_table(fname: str):
    f = (path / fname).open("r")
    k = ""
    table = [[-1, -1, -1]]
    counter = 0
    while k != "eof":
        k = read_num_until_eof(f)
        if k == "eof":
            break
        counter += 1
        if counter == 1:
            table.append([])
        else:
            table[-1].append(float(k))
        if counter == 4:
            counter -= 4
    return table


def render_json():
    level_multiplier = read_table("level_multiplier.html")
    print(len(level_multiplier))
    res = {
        "README": {
            "level_multiplier": "index of array is level (0 is undefined)\n"
                                "the fields are\n"
                                "- Element Level Multiplier(Enemies and Environment)\n"
                                "- Element Level Multiplier(Characters)\n"
                                "- Crystallize Shield Level\n"
                                "- Multiplier(Characters and Enemies)\n"
        },
        "level_multiplier": level_multiplier
    }
    f = (path / "data.json").open("w")
    f.write(json.dumps(res, indent=4))
    f.close()


read_data = {}


def read_json(force: bool = False):
    global read_data
    if force or not read_data:
        f = (path / "data.json").open("r")
        read_data = json.load(f)
    return read_data


if __name__ == '__main__':
    render_json()
    read_json()
    print("done")
