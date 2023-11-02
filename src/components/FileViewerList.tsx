import React, { memo, useCallback, useState } from "react";
import File from "./File";
import { FileLite } from "../types/file";

type FileViewerListProps = {
    files: FileLite[];
    title: string;
    listExpanded?: boolean;
    showScores?: boolean;
};

function FileViewerList(props: FileViewerListProps) {
    const [listExpanded, setListExpanded] = useState(props.listExpanded ?? false);

    const handleListExpand = useCallback(() => {
        setListExpanded((prev) => !prev);
    }, []);

    return (
        <div className="flex items-left justify-center w-full">
            {props.files.length > 0 &&
                <div className="w-full">
                    {props.files.map((file) => (
                        <File
                            key={file.name}
                            file={file}
                            showScore={props.showScores}
                        />
                    ))}
                </div>
            }
        </div>
    );
}

export default memo(FileViewerList);
