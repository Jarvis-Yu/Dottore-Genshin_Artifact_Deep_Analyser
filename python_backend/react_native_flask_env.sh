export PYTHONPATH="${PYTHONPATH}:`pwd`"
echo "${PYTHONPATH}:`pwd`"
export FLASK_APP=react_native_api.py
export FLASK_ENV=development
flask run -h localhost -p 41372
# python ./react_native_api.py
