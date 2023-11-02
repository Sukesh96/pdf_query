import Head from "next/head";
import { useState, useRef } from "react";

import FileQandAArea from "../components/FileQandAArea";
import { FileLite } from "../types/file";
import FileUploadArea from "../components/FileUploadArea";
import PDFImage from "../images/pdf.png";

export default function FileQandA() {
    const childRef = useRef(null);

    const [files, setFiles] = useState<FileLite[]>([]);

    return (
        <div className="pdfQuery">
            <Head>
                <title>PDF Query</title>
            </Head>
            <div className="pdfQuery__container">
                <div className="pdfQuery__navbar">
                    <h2 className="pdfQuery__navbar--title">
                        <img src={PDFImage.src} alt="PDF Query Logo" className="logo" />
                        PDF QUERY
                    </h2>
                </div>

                <div className="pdfQuery__grid">
                    <FileUploadArea
                        handleSetFiles={setFiles}
                        maxNumFiles={1}
                        maxFileSizeMB={2}
                    />

                    <FileQandAArea files={files} />
                </div>

            </div>
        </div>
    );
}
