build:
	docker build . -t bluedoc/mathjax-service:latest
push:
	docker push bluedoc/mathjax-service:latest