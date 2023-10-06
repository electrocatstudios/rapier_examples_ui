# rapier_examples_ui
A project to hold a front end to use the Rapier Example, not using Bevy. 
It will allow you to draw a scene and moving objects then submit to an API
which will render an MP4 and return it.

### Local Debug
If you have Python3 installed you can run the local version of the output
by running: 

```bash 
python -m http.server
```

You can then access the page on [localhost:8000/rapier_examples.html](localhost:8000/rapier_examples.html)

### Run with Docker

```bash 
docker build -t rapier_examples .
docker run -ti -p 8000:8000 rapier_examples
```

Then access the page on [localhost:8000](localhost:8000)