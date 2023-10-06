from flask import Flask,send_file,jsonify,request
import uuid
import subprocess
import json 

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

@app.route("/api/submit", methods=["POST"])
def run_simulation():
	# Turn incoming body into json file

	body = request.data
	body = json.loads(body)
	
    # Trigger rapier_examples to build the output
	filename = str(uuid.uuid4())
	with open(f"/tmp/{filename}.json", 'w+') as f:
		f.write(json.dumps(body))

	with open(f"/tmp/{filename}.json") as f:
		print(f"file content \n{f.read()}\n\n")
	
	p1 = subprocess.Popen([f'/app/rapier_examples', '--file', f'/tmp/{filename}.json',  "-o", f"/tmp/{filename}.mp4", "--max-frames", "2000"], stdout=subprocess.PIPE)
	out, err = p1.communicate()
	# print(f"Done waiting ({p1.returncode}): {out}")
	# print(f"Error: {err}")

	return jsonify({"status": "ok", "filename": f"{filename}"})

# GET rendered file
@app.route("/video/<string:filename>")
def get_video(filename):
	# TODO: use a video player embedded rather than raw mp4
	return send_file(f"/tmp/{filename}.mp4")

# GET raw json used for video
@app.route("/json/<string:filename>")
def get_json(filename):
	return send_file(f"/tmp/{filename}.json")

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000, debug=True)