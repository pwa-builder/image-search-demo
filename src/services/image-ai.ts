import { ImageToTextPipeline, pipeline } from "@huggingface/transformers";

let captioner: ImageToTextPipeline | undefined = undefined;


self.onmessage = async (e) => {
    if (e.data.type === 'caption') {
        return new Promise((resolve) => {
            captionImage(e.data.blob).then((caption: any) => {
                self.postMessage({
                    type: 'caption',
                    caption: caption
                });
                resolve(caption);
            })
        })
    }
    else {
        return Promise.reject('Unknown message type');
    }
}

async function captionImage(blob: Blob) {
    if (!captioner) {
        captioner = await pipeline('image-to-text', 'xenova/vit-gpt2-image-captioning', {
            device: "webgpu"
        });
    }

    const url = URL.createObjectURL(blob);

    const result = await captioner(url);
    console.log(result);

    URL.revokeObjectURL(url);

    return result;
}