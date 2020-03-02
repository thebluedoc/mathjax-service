# mathjax-service
MathJax servie for BookLab

## Run

```bash
docker run --detach \
    --name bluedoc-mathjax-service \
    --restart always -p 4010:4010 bluedoc/mathjax-service:latest

```