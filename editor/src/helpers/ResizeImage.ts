const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

export const ResizeImage = (blob: Blob, target: { x: number; y: number }) => {
  const url = URL.createObjectURL(blob);
  return new Promise<Uint8Array>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('error', reject);
    image.addEventListener('load', () => {
      const targetAspect = target.x / target.y;
      const imageAspect = image.width / image.height;
      let x = 0;
      let y = 0;
      let width = target.x;
      let height = target.y;
      if (targetAspect > imageAspect) {
        height = image.height * target.x / image.width;
        y = (height - target.y) * -0.5;
      } else {
        width = image.width * target.y / image.height;
        x = (width - target.x) * -0.5;
      }
      canvas.width = target.x;
      canvas.height = target.y;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, image.width, image.height, x, y, width, height);
      canvas.toBlob((resized) => {
        if (!resized) {
          reject();
          return;
        }
        const reader = new FileReader();
        reader.addEventListener('error', reject);
        reader.addEventListener('load', () => resolve(new Uint8Array(reader.result as ArrayBuffer)));
        reader.readAsArrayBuffer(resized);
      }, 'image/jpeg', 1);
    });
    image.src = url;
  })
  .finally(() => {
    URL.revokeObjectURL(url);
  });
};
