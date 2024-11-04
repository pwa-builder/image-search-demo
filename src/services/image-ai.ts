import { ImageToTextPipeline, ImageClassificationPipeline, pipeline } from "@huggingface/transformers";

let captioner: ImageToTextPipeline | undefined = undefined;
let ocrPipeline: ImageToTextPipeline | undefined = undefined;
let classifyPipeline: ImageClassificationPipeline | undefined = undefined;

self.onmessage = async (e) => {
    if (e.data.type === 'caption') {
        return new Promise(async (resolve) => {
            const classification = await classifyImage(e.data.blob);

            const imageData = {
                caption: "",
                text: "",
                classification
            };

            self.postMessage({
                type: 'processed',
                data: imageData
            });
            resolve(imageData);
        })
    }
    else {
        return Promise.reject('Unknown message type');
    }
}

async function classifyImage(blob: Blob) {
   if (!classifyPipeline) {
      classifyPipeline = await pipeline('image-classification', 'onnx-community/mobilenet_v2_1.4_224', {
        device: "webnn"
      })
   }

   const url = URL.createObjectURL(blob);

   const result = await classifyPipeline(url);
   console.log('classifyResult', result);
   URL.revokeObjectURL(url);

   return result;
}

async function getTextFromImage(blob: Blob) {
    if (!ocrPipeline) {
        ocrPipeline = await pipeline('image-to-text', 'Xenova/trocr-small-printed', {
            device: "webnn"
        });
    }

    const url = URL.createObjectURL(blob);

    const result = await ocrPipeline(url);
    console.log("ocr result", result);
    URL.revokeObjectURL(url);

    return result;
}

async function captionImage(blob: Blob) {
    if (!captioner) {
        captioner = await pipeline('image-to-text', 'xenova/vit-gpt2-image-captioning', {
            device: "webnn"
        });
    }

    const url = URL.createObjectURL(blob);

    const result = await captioner(url);
    console.log(result);

    URL.revokeObjectURL(url);

    return result;
}