document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('videoFile');
    const videoPreview = document.getElementById('videoPreview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const previewImage = document.getElementById('previewImage');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const restartBtn = document.getElementById('restartBtn');

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            const section = document.getElementById(sectionId);

            // Toggle the clicked section
            contentSections.forEach(s => {
                if (s.id === sectionId) {
                    s.classList.toggle('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Video upload and preview
    videoInput.addEventListener('change', () => {
        const file = videoInput.files[0];
        if (file) {
            // Show video preview
            videoPreview.style.display = 'block';
            videoPreview.src = URL.createObjectURL(file);
            analyzeBtn.style.display = 'inline-block';
            previewImage.style.display = 'none';
            restartBtn.style.display = 'none';
        } else {
            videoPreview.style.display = 'none';
            analyzeBtn.style.display = 'none';
        }
    });

    // Analysis
    analyzeBtn.addEventListener('click', async () => {
        const file = videoInput.files[0];
        if (!file) {
            alert('Please select a video file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            loading.style.display = 'block';
            result.textContent = '';
            previewImage.style.display = 'none';
            analyzeBtn.style.display = 'none';
            videoPreview.style.display = 'none';

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                // Display the extracted frame
                previewImage.src = data.frame_url;
                previewImage.style.display = 'block';

                // Show the result with color coding
                const predictionText = `Prediction: ${data.prediction} (Confidence: ${data.confidence}%)`;
                result.textContent = predictionText;
                result.style.color = data.prediction.toLowerCase() === 'real' ? '#10b981' : '#ef4444';
                
                // Show restart button
                restartBtn.style.display = 'inline-block';
            } else {
                alert(data.error || 'Analysis failed');
            }
        } catch (error) {
            alert('Error during analysis');
        } finally {
            loading.style.display = 'none';
        }
    });

    // Restart functionality
    restartBtn.addEventListener('click', () => {
        // Reset file input
        videoInput.value = '';
        
        // Reset preview
        videoPreview.style.display = 'none';
        videoPreview.src = '';
        previewImage.style.display = 'none';
        previewImage.src = '';
        
        // Reset buttons
        analyzeBtn.style.display = 'none';
        restartBtn.style.display = 'none';
        
        // Clear result
        result.textContent = '';
        result.style.color = '';
    });
});