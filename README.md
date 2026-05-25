# Rayenna Oil

Corporate website for Rayenna Oil, the oil trading division of Rayenna Energy Pvt. Ltd.

## Local Preview

This website is a pure static HTML, CSS, and JavaScript site with no build tools or backend dependencies.

To preview locally from the repository root:

```bash
python3 -m http.server 8000
```

Then open [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## GitHub Pages Deployment

1. `git clone https://github.com/rayenna/rayennaoil`
2. Add all website files to the repository.
3. In the repository, go to `Settings -> Pages -> Source`, then select `Deploy from branch` and choose `main / root`.
4. The site will be live at `https://rayennaoil.com` once DNS is pointed to the GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
5. Add a `CNAME` file in the repository root containing:

```txt
rayennaoil.com
```
