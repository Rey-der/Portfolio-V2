import sharp from 'sharp';

export const optimizeImage = async (inputPath, outputPath) => {
    await sharp(inputPath)
        .resize({ width: 800 }) // Resize to a maximum width of 800px
        .toFormat('webp', { quality: 80 }) // Convert to WebP format with quality 80
        .toFile(outputPath);
};

export const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Set the src attribute to the data-src value
                img.classList.remove('lazy'); // Remove lazy class
                observer.unobserve(img); // Stop observing the image
            }
        });
    });

    images.forEach(image => {
        imgObserver.observe(image); // Observe each image
    });
};