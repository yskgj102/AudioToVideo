const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const processButton = document.getElementById('processButton');
const audioInput = document.getElementById('audioInput');
const outputVideo = document.getElementById('outputVideo');

processButton.addEventListener('click', async () => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const file = audioInput.files[0];
    const audioData = await fetchFile(file);

    // 入力ファイルをFFmpegの仮想ファイルシステムに書き込み
    ffmpeg.FS('writeFile', 'inputAudio.mp3', audioData);

    // FFmpegで音声ファイルから波形を生成し、動画に変換
    await ffmpeg.run('-i', 'inputAudio.mp3', '-filter_complex', '[0:a]showwaves=s=1280x720', '-pix_fmt', 'yuv420p', '-t', '10', 'output.mp4');

    // 生成された動画を取得して表示
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    outputVideo.src = videoUrl;
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }, (error) => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
