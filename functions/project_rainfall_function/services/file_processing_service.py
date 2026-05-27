import pandas as pd
import pdfplumber


def process_file_stream(file):

    filename = file.filename.lower()

    if filename.endswith(".csv"):
        df = pd.read_csv(file)
        print("CSV PREVIEW:")
        print(df.head())

        return {
            "type": "csv",
            "rows": len(df),
            "columns": list(df.columns),
            "preview": df.head(5).to_dict(orient="records")
        }


    elif filename.endswith(".xlsx"):
        df = pd.read_excel(file)
        print("CSV PREVIEW:")
        print(df.head())

        return {
            "type": "excel",
            "rows": len(df),
            "columns": list(df.columns),
            "preview": df.head(5).to_dict(orient="records")
        }

    elif filename.endswith(".pdf"):

        # pdfplumber necesita file-like → usamos buffer
        with pdfplumber.open(file.stream) as pdf:
            text = ""

            for page in pdf.pages:
                content = page.extract_text()
                if content:
                    text += content
        print("PDF PREVIEW (primeros 300 chars):")
        print(text[:300])


        return {
            "type": "pdf",
            "chars": len(text),
            "preview": text[:500]
        }

    else:
        raise ValueError("Unsupported file type")