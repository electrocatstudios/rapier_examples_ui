FROM rust:1.72.0

WORKDIR /app

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        libclang-dev

RUN git clone https://github.com/electrocatstudios/rapier_examples.git

RUN cd rapier_examples && cargo build --release

FROM python:latest

WORKDIR /app

COPY --from=0 /app/rapier_examples/target/release/rapier_examples /app/rapier_examples

COPY web/requirements.txt /app/

RUN pip3 install -r requirements.txt

COPY web/main.py /app/
COPY web/css /app/css
COPY web/js /app/js
COPY web/*.html /app/

# CMD ["bash"]
CMD ["python3", "main.py"]

