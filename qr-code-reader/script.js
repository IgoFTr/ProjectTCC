import { BrowserQRCodeReader } from '@zxing/library';

const video = document.getElementById('video');
const result = document.getElementById('result');
const codeReader = new BrowserQRCodeReader();

function logTime(label) {
    console.time(label);
    return () => console.timeEnd(label);
}

async function startCamera() {
    const endLog = logTime('startCamera');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        console.error('Error accessing camera: ', err);
    }
    endLog();
}

async function decodeQRCode() {
    const endLog = logTime('decodeQRCodesksks');
    try {
        const result = await codeReader.decodeFromVideoElement(video);
        document.getElementById('result').textContent = result.text;
    } catch (err) {
        console.error('Error decoding QR code: ', err);
    }
    endLog();
}

video.addEventListener('play', () => {
    decodeQRCode();
});

startCamera();