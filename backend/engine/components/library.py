# ──────────────────────────────────────────────
# Scalera AI Component Library (Atomic UI)
# ──────────────────────────────────────────────

COMPONENTS = {
    "hero": {
        "modern": {
            "html": """
<section class="hero-modern">
    <div class="container">
        <div class="hero-content">
            <h1 class="reveal">[HERO_TITLE]</h1>
            <p class="reveal subtitle">[HERO_SUBTITLE]</p>
            <div class="hero-actions reveal">
                <a href="#contact" class="btn-primary">[CTA_TEXT]</a>
                <a href="#work" class="btn-secondary">View Work</a>
            </div>
        </div>
    </div>
</section>
""",
            "css": """
.hero-modern { min-height: 90vh; display: flex; align-items: center; padding: 120px 0; background: radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.1), transparent); }
.hero-modern h1 { font-size: clamp(3rem, 8vw, 5.5rem); line-height: 1.1; margin-bottom: 2rem; font-weight: 800; letter-spacing: -0.03em; }
.hero-modern .subtitle { font-size: 1.25rem; color: var(--text-muted); max-width: 600px; margin-bottom: 3rem; line-height: 1.6; }
"""
        },
        "split": {
            "html": """
<section class="hero-split">
    <div class="container split-grid">
        <div class="hero-text">
            <span class="tag reveal">[TAGLINE]</span>
            <h1 class="reveal">[HERO_TITLE]</h1>
            <p class="reveal">[HERO_SUBTITLE]</p>
            <a href="#contact" class="btn-primary reveal">[CTA_TEXT]</a>
        </div>
        <div class="hero-image reveal">
            <div class="glass-image-card">
                <img src="[HERO_IMAGE]" alt="Hero">
            </div>
        </div>
    </div>
</section>
""",
            "css": """
.hero-split { min-height: 100vh; display: flex; align-items: center; padding: 100px 0; }
.split-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: center; }
.hero-text h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); margin: 1rem 0 2rem; }
.hero-image .glass-image-card { position: relative; border-radius: 24px; overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
@media (max-width: 991px) { .split-grid { grid-template-columns: 1fr; text-align: center; } .hero-image { order: -1; } }
"""
        }
    },
    "about": {
        "modern": {
            "html": """
<section id="about" class="about-section">
    <div class="container">
        <div class="about-grid">
            <div class="about-content">
                <h2 class="section-title reveal">The Story</h2>
                <div class="reveal">[ABOUT_TEXT]</div>
            </div>
            <div class="about-stats reveal">
                <div class="stat-card glass-card">
                    <h3>10+</h3>
                    <p>Years Experience</p>
                </div>
                <div class="stat-card glass-card">
                    <h3>150+</h3>
                    <p>Projects Done</p>
                </div>
            </div>
        </div>
    </div>
</section>
""",
            "css": """
.about-section { padding: 100px 0; }
.about-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 80px; align-items: center; }
.about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.stat-card { padding: 30px; text-align: center; }
.stat-card h3 { font-size: 2.5rem; color: var(--accent-color); margin-bottom: 0.5rem; }
@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } }
"""
        }
    },
    "services": {
        "grid": {
            "html": """
<section id="services" class="services-section">
    <div class="container">
        <h2 class="section-title reveal">Services</h2>
        <div class="services-grid">
            [SERVICES_ITEMS]
        </div>
    </div>
</section>
""",
            "item_html": """
<div class="service-card glass-card reveal">
    <div class="icon">[ICON]</div>
    <h3>[TITLE]</h3>
    <p>[DESC]</p>
</div>
""",
            "css": """
.services-section { padding: 100px 0; background: rgba(var(--accent-rgb), 0.02); }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
.service-card { padding: 40px; transition: transform 0.3s ease; }
.service-card:hover { transform: translateY(-10px); border-color: var(--accent-color); }
.service-card .icon { font-size: 2rem; margin-bottom: 1.5rem; }
"""
        }
    },
    "contact": {
        "glass": {
            "html": """
<section id="contact" class="contact-section">
    <div class="container">
        <div class="contact-card glass-card reveal">
            <div class="contact-header">
                <h2>Let's Collaborate</h2>
                <p>Have a vision? Let's bring it to life.</p>
            </div>
            <form class="contact-form">
                <input type="text" placeholder="Name" class="glass-input">
                <input type="email" placeholder="Email" class="glass-input">
                <textarea placeholder="Tell us about your project" class="glass-input"></textarea>
                <button type="submit" class="btn-primary">Send Message</button>
            </form>
        </div>
    </div>
</section>
""",
            "css": """
.contact-section { padding: 120px 0; background: radial-gradient(circle at bottom left, rgba(var(--accent-rgb), 0.05), transparent); }
.contact-card { max-width: 800px; margin: 0 auto; padding: 60px; }
.contact-header { text-align: center; margin-bottom: 40px; }
.contact-form { display: grid; gap: 20px; }
.glass-input { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 15px; border-radius: 12px; color: #fff; width: 100%; }
"""
        }
    }
}

GLOBAL_STYLES = """
:root {
    --bg-main: #080808;
    --text-main: #ffffff;
    --text-muted: #a0a0a0;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --accent-color: #dcb480;
    --accent-rgb: 220, 180, 128;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg-main); color: var(--text-main); font-family: 'Inter', sans-serif; line-height: 1.5; overflow-x: hidden; }
.container { max-width: 1300px; margin: 0 auto; padding: 0 40px; }
.reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }

.glass-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; backdrop-filter: blur(10px); }
.btn-primary { background: var(--accent-color); color: #000; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease; }
.btn-primary:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.3); }

.section-title { font-size: 3rem; font-weight: 800; margin-bottom: 3rem; letter-spacing: -0.02em; }

/* In-Context Editor Styles */
.editable-section { position: relative; transition: all 0.3s ease; }
.editable-section:hover { box-shadow: inset 0 0 50px rgba(var(--accent-rgb), 0.05); }
.editable-section::after { 
    content: ''; position: absolute; inset: 0; 
    border: 1px solid transparent; border-radius: 12px; 
    pointer-events: none; transition: border-color 0.3s ease; 
}
.editable-section:hover::after { border-color: rgba(var(--accent-rgb), 0.2); }

.ai-edit-trigger {
    position: absolute; top: 20px; right: 20px;
    z-index: 1000; padding: 8px 16px;
    background: rgba(var(--accent-rgb), 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(var(--accent-rgb), 0.3);
    border-radius: 100px; color: #fff;
    font-size: 0.75rem; font-weight: 600;
    cursor: pointer; opacity: 0; transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex; align-items: center; gap: 6px;
}
.editable-section:hover .ai-edit-trigger { opacity: 1; transform: translateY(0); }
.ai-edit-trigger:hover { background: var(--accent-color); color: #000; box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.4); }
"""

GLOBAL_JS = """
document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Inject Edit Buttons
    document.querySelectorAll('.editable-section').forEach(section => {
        const btn = document.createElement('button');
        btn.className = 'ai-edit-trigger';
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit with AI`;
        btn.onclick = (e) => {
            e.stopPropagation();
            const sectionId = section.id;
            const sectionType = section.dataset.type;
            const content = section.innerHTML;
            
            console.log(`[Iframe] Edit clicked for section: ${sectionId}`);
            
            // Post message to parent window (Scalera AI)
            window.parent.postMessage({
                type: 'OPEN_AI_EDITOR',
                sectionId,
                sectionType,
                content
            }, '*');
        };
        section.appendChild(btn);
    });

    // 3. Listen for section updates from Parent (Scalera AI)
    window.addEventListener('message', (event) => {
        if (event.data.type === 'UPDATE_SECTION_HTML') {
            const section = document.getElementById(event.data.sectionId);
            if (section) {
                // Fade out
                section.style.opacity = '0';
                setTimeout(() => {
                    section.innerHTML = event.data.newHtml;
                    // Re-inject edit button
                    const btn = document.createElement('button');
                    btn.className = 'ai-edit-trigger';
                    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit with AI`;
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        window.parent.postMessage({
                            type: 'OPEN_AI_EDITOR',
                            sectionId: section.id,
                            sectionType: section.dataset.type,
                            content: section.innerHTML
                        }, '*');
                    };
                    section.appendChild(btn);
                    // Fade in
                    section.style.opacity = '1';
                }, 300);
            }
        }
    });
});
"""
