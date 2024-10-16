import { BrowserQRCodeReader } from '@zxing/library';

const video = document.getElementById('video');
const result = document.getElementById('result');
const codeReader = new BrowserQRCodeReader();
let isDecoding = false;

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        await video.play();
    } catch (err) {
        console.error('Error accessing camera: ', err);
        if (err.name === 'NotReadableError') {
            alert('Camera is already in use by another application.');
        } else if (err.name === 'NotAllowedError') {
            alert('Permission to access the camera was denied.');
        } else if (err.name === 'NotFoundError') {
            alert('No camera device found.');
        } else {
            alert('An unknown error occurred while accessing the camera.');
        }
    }
}

async function decodeQRCode() {
    if (isDecoding) return;
    isDecoding = true;
    console.time('decodeQRCode');
    try {
        const result = await codeReader.decodeFromVideoElement(video);
        document.getElementById('result').textContent = result.text;
        console.log('QR Code detected:', result.text);
    } catch (err) {
        console.error('Error decoding QR code: ', err);
    }
    console.timeEnd('decodeQRCode');
    isDecoding = false;

    // Continue decoding while the video is playing
    if (!video.paused && !video.ended) {
        requestAnimationFrame(decodeQRCode);
    }
}

video.addEventListener('play', () => {
    console.log('Video is playing, attempting to decode QR code...');
    decodeQRCode();
});

startCamera();