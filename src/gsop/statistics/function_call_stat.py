from typing import Dict

function_call_times: Dict = {}


def func_called(name: str):
    function_call_times[name] = function_call_times.setdefault(name, 0) + 1
    return
