import { useState, useCallback, memo } from "react";
import { Transition } from "@headlessui/react";
import {
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

import { FileLite } from "../types/file";

type FileProps = {
    file: FileLite;
    showScore?: boolean;
};

function File(props: FileProps) {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = useCallback(() => {
        setExpanded((prev) => !prev);
    }, []);

    return (

        <iframe
            src={props.file.url}
            className="iframeViewer"
            title={props.file.name}
        ></iframe>
    );
}

export default memo(File);
