document.addEventListener('DOMContentLoaded', () => {
    // Typewriter Effect
    const typewriter = document.getElementById('typewriter');
    const text = typewriter.innerText;
    typewriter.innerText = '';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            typewriter.innerText += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    type();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Orbit Animation Logic
    const orbits = document.querySelectorAll('.orbit-icon');
    orbits.forEach((orbit, index) => {
        const angle = (index / orbits.length) * Math.PI * 2;
        const radius = 150;
        
        let currentAngle = angle;
        function animate() {
            currentAngle += 0.005;
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;
            
            orbit.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(animate);
        }
        animate();
    });
});
