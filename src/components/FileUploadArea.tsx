import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useState,
    memo,
    useRef,
} from "react";
import axios from "axios";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { compact } from "lodash";

import LoadingText from "./LoadingText";
import { FileLite } from "../types/file";
import FileViewerList from "./FileViewerList";

type FileUploadAreaProps = {
    handleSetFiles: Dispatch<SetStateAction<FileLite[]>>;
    maxNumFiles: number;
    maxFileSizeMB: number;
};

function FileUploadArea(props: FileUploadAreaProps) {
    const handleSetFiles = props.handleSetFiles;

    const [files, setFiles] = useState<FileLite[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const dropzoneRef = useRef<HTMLLabelElement>(null);

    const handleFileChange = useCallback(
        async (selectedFiles: FileList | null) => {
            if (selectedFiles && selectedFiles.length > 0) {
                setError("");

                if (files.length + selectedFiles.length > props.maxNumFiles) {
                    setError(`You can only upload up to ${props.maxNumFiles} file.`);
                    if (dropzoneRef.current) {
                        (dropzoneRef.current as any).value = "";
                    }
                    return;
                }

                setLoading(true);

                const uploadedFiles = await Promise.all(
                    Array.from(selectedFiles).map(async (file) => {
                        
                        if (
                            file.type.match(
                                /(text\/plain|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(markdown|x-markdown))/
                            ) &&
                            file.size < props.maxFileSizeMB * 1024 * 1024
                        ) {
                            if (files.find((f) => f.name === file.name)) {
                                return null;
                            }

                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("filename", file.name);

                            try {
                                const processFileResponse = await axios.post(
                                    "/api/process-file",
                                    formData,
                                    {
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                        },
                                    }
                                );

                                if (processFileResponse.status === 200) {
                                    const text = processFileResponse.data.text;
                                    const meanEmbedding = processFileResponse.data.meanEmbedding;
                                    const chunks = processFileResponse.data.chunks;

                                    const fileObject: FileLite = {
                                        name: file.name,
                                        url: URL.createObjectURL(file),
                                        type: file.type,
                                        size: file.size,
                                        expanded: false,
                                        embedding: meanEmbedding,
                                        chunks,
                                        extractedText: text,
                                    };
                                    console.log(fileObject);

                                    return fileObject;
                                } else {
                                    console.log("Error creating file embedding");
                                    return null;
                                }
                            } catch (err: any) {
                                console.log(`Error creating file embedding: ${err}`);
                                return null;
                            }
                        } else {
                            alert(
                                `Invalid file type or size. Only TXT, PDF, DOCX or MD are allowed, up to ${props.maxFileSizeMB}MB.`
                            );
                            return null;
                        }
                    })
                );

                const validFiles = compact(uploadedFiles);

                setFiles((prevFiles) => [...prevFiles, ...validFiles]);
                handleSetFiles((prevFiles) => [...prevFiles, ...validFiles]);

                setLoading(false);
            }
        },
        [files, handleSetFiles, props.maxFileSizeMB, props.maxNumFiles]
    );

    const handleDragEnter = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            setDragOver(false);
            const droppedFiles = event.dataTransfer.files;
            handleFileChange(droppedFiles);
        },
        [handleFileChange]
    );

    return (
        <div className="fileUA w-full overflow-y-auto h-full block">

            {files.length == 0 && <div className="fileUA__container">
                <label
                    htmlFor="dropzone-file"
                    className={`w-full cursor-pointer relative ${dragOver ? "border-blue-500 bg-blue-50" : ""
                        }`}
                    ref={dropzoneRef}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="fileUA__text flex flex-col items-center justify-center pt-5 pb-6">
                        {loading ? (
                            <LoadingText text="Uploading..." />
                        ) : (
                            <div className="text-gray-500 flex flex-col items-center text-center">
                                <ArrowUpTrayIcon className="w-7 h-7 mb-4" />
                                <p className="mb-2 text-sm">
                                    <span className="font-semibold">Click to upload</span> or drag
                                    and drop
                                </p>
                                <p className="text-xs">
                                    PDF (max {props.maxFileSizeMB}MB per file)
                                </p>
                                <p className="text-xs mt-1">
                                    {/* You can upload up to {props.maxNumFiles - files.length} {" "}
                                    {props.maxNumFiles - files.length === 1 ? "file" : "files"} */}

                                    Please upload a PDF file.
                                </p>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    // multiple
                                    onChange={(event) => handleFileChange(event.target.files)}
                                />
                            </div>
                        )}
                    </div>
                    {error && (
                        <div className="flex items-center justify-center w-full">
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}
                </label>
            </div>
            }

            <FileViewerList files={files} title="Uploaded Files" />
        </div>
    );
}

export default memo(FileUploadArea);
