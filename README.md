# Titus Velpula

My website: https://measuredai.co.nz

The front page is my AI consulting site. My portfolio is in `portfolio/` (https://measuredai.co.nz/portfolio/): the AI projects I've built, my analytics work with live Power BI dashboards, my experience and my CV.

Everything is plain HTML and CSS with a little JavaScript, hosted on GitHub Pages. The slideshow pictures on the front page are illustrations of example workflows, not real client systems. The enquiry form doesn't send or store anything; it opens a draft in the visitor's own email app.

```
├── index.html      consulting site
├── styles.css
├── script.js       slideshow, example tabs and the enquiry form
├── images/         slideshow pictures
├── fonts/          Schibsted Grotesk (SIL Open Font License)
├── favicon.svg
├── portfolio/
│   ├── index.html
│   ├── projects.html
│   ├── styles.css
│   ├── assets/     CV (PDF), images and the attrition walkthrough video
│   └── cv/         the CV source, which I print to PDF
└── CNAME           the custom domain for GitHub Pages
```

The portfolio pages load `styles.css?v=5`. When I change those styles I bump that number in both pages so browsers don't keep showing the old version.

Contact: titusdinkar@gmail.com · [LinkedIn](https://www.linkedin.com/in/titus-dinakar-velpula/)
