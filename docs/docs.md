# Writing documentation

Add or update Markdown files in the `./docs` directory. 

To preview your additions, you'll need to install `Material for MkDocs` locally. We recommend using Docker:

```bash
docker pull squidfunk/mkdocs-material
```

Then, from the root of this project:

```bash
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material
```
