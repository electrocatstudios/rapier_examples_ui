from flask import Flask,send_file,jsonify

app = Flask(__name__)

@app.route('/')
def hello():
	return send_file("rapier_examples.html")

@app.route("/js/<path:filename>")
def get_js(filename):
	return send_file(f"js/{filename}")

@app.route("/css/<path:filename>")
def get_css(filename):
	return send_file(f"css/{filename}")

@app.route("/api/submit")
def run_simulation():
	# Turn incoming body into json file
    # Trigger rapier_examples to build the output
    # return the name of the output file 
	return jsonify({"status": "ok"})

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)