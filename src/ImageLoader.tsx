import React, {useRef} from "react";

export function ImageLoader(props: { apply(url: string): void, text: string }) {
    const local = useRef<HTMLInputElement | null>(null);
    const url = useRef<HTMLInputElement | null>(null);

    function loadLocalImage() {
        const files = local.current?.files;
        if (!files) return;
        const file = files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            const result = this.result;
            if (typeof result === "string") {
                loadImage(result);
            }
        })
        reader.readAsDataURL(file);
    }

    function loadImage(url: string) {
        if (!url) return;
        props.apply(url);
    }

    return <ul>
        <li>
            <label>
                <button onClick={loadLocalImage}>{props.text}</button>
                <input ref={local} type={"file"} accept={"image/png,image/jpeg"}/>
            </label>
        </li>
        <li>
            <label>
                <button onClick={() => {
                    const value = url.current?.value;
                    if (!value || value.length === 0) return;
                    loadImage(value)
                }}>{props.text}</button>
                <input ref={url} type={"text"} placeholder={"https://..."}/>
            </label>
        </li>
    </ul>
}