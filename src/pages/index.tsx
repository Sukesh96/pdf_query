import Head from "next/head";
import { useState, useRef } from "react";

import FileQandAArea from "../components/FileQandAArea";
import { FileLite } from "../types/file";
import FileUploadArea from "../components/FileUploadArea";
import PDFImage from "../images/pdf.png";

export default function FileQandA() {
    const childRef = useRef(null);

    const [files, setFiles] = useState<FileLite[]>([]);

    // const callChildFunction = () => {
    //     // Call the function in the child component
    //     childRef.current.handleFileChange();
    // }


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
                    {/* <button className="pdfQuery__navbar--btn">
                        <svg color="#fff" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3 8c-.28 0-.53-.11-.71-.29L9 6.41V12c0 .55-.45 1-1 1s-1-.45-1-1V6.41l-1.29 1.3a1.003 1.003 0 01-1.42-1.42l3-3C7.47 3.11 7.72 3 8 3s.53.11.71.29l3 3A1.003 1.003 0 0111 8z"></path>
                        </svg>
                        Upload
                    </button> */}
                </div>

                <div className="pdfQuery__grid">
                    <FileUploadArea
                        handleSetFiles={setFiles}
                        maxNumFiles={5}
                        maxFileSizeMB={2}
                        // ref={childRef}
                    />

                    <FileQandAArea files={files} />
                </div>

            </div>
        </div>
    );
}
