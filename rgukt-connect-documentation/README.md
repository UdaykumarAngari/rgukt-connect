# RGUKT Connect Technical and Product Documentation

This directory contains the LaTeX project for the complete, professional, and externally shareable technical and product documentation for the **RGUKT Connect** platform.

---

## 1. Project Directory Structure

```
rgukt-connect-documentation/
├── main.tex                  # Master LaTeX entry point
├── references.bib            # Bibliography database file
├── README.md                 # Project compilation and setup instructions
├── chapters/                 # Modular LaTeX chapters
│   ├── introduction.tex
│   ├── problem-statement.tex
│   ├── product-overview.tex
│   ├── features.tex
│   ├── user-roles.tex
│   ├── architecture.tex
│   ├── technology-stack.tex
│   ├── application-workflow.tex
│   ├── frontend.tex
│   ├── backend.tex
│   ├── database.tex
│   ├── api.tex
│   ├── authentication.tex
│   ├── security.tex
│   ├── deployment.tex
│   ├── testing.tex
│   ├── performance.tex
│   ├── scalability.tex
│   ├── troubleshooting.tex
│   ├── limitations.tex
│   ├── roadmap.tex
│   ├── contributing.tex
│   ├── faq.tex
│   └── conclusion.tex
└── build/                    # Output compilation files & final PDF
    └── RGUKT-Connect-Documentation.pdf
```

---

## 2. Prerequisites

To compile this LaTeX project locally into a PDF, you must have a LaTeX compiler and bibliography manager installed.

### On Debian/Ubuntu Linux
Install TeX Live and common utilities:
```bash
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended bibtex
```

---

## 3. Compilation Instructions

The document must be compiled multiple times to resolve cross-references, list of figures/tables, and bibliography citations.

Run the following commands in order inside the `rgukt-connect-documentation` directory:

```bash
# 1. Compile the master file to generate auxiliary log and bib files
pdflatex -interaction=nonstopmode -output-directory=build main.tex

# 2. Compile the bibliography references
bibtex build/main

# 3. Compile the master file again to map the citations
pdflatex -interaction=nonstopmode -output-directory=build main.tex

# 4. Compile the master file one final time to resolve page numbers and cross-references
pdflatex -interaction=nonstopmode -output-directory=build main.tex
```

### Clean Up Compilation Files (Optional)
To delete auxiliary files generated during compilation, run:
```bash
rm -f build/*.aux build/*.log build/*.out build/*.toc build/*.lof build/*.lot build/*.bbl build/*.blg
```

---

## 4. Viewing the Final Deliverable

After successful compilation, the final PDF is generated at:
`build/main.pdf`

To rename it to the official delivery name, run:
```bash
mv build/main.pdf build/RGUKT-Connect-Documentation.pdf
```
