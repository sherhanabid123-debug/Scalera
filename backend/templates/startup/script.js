document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            if (navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#040408';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Interactive CLI Sandbox Toggles
    const consoleTabs = document.querySelectorAll('.console-tab');
    const consoleCode = document.querySelector('.terminal-code pre');

    const commands = {
        'search': `// Querying semantic context indexes...
$ krypton search --query "quantum computing" --top-k 1

[SUCCESS] Found 1 match (distance: 0.142)
{
  "id": "doc_99182",
  "text": "Superconducting qubits reach coherence limit thresholds.",
  "metadata": {"subject": "physics", "author": "Vance"}
}`,
        'insert': `// Inserting vector embeddings...
$ krypton insert --id "doc_10291" --text "Zero-leak topological gates"

[SUCCESS] Embedding generated (1536 dimensions)
[SUCCESS] Index matrix compiled in 14ms
{
  "status": "indexed",
  "nodes_synced": 12
}`,
        'status': `// Checking cluster synchronization metrics...
$ krypton status

[HEALTHY] Cluster Node Matrix status: Active
- Replicas: 12 (US-East, EU-Central, AP-South)
- Vector Count: 14,289,390
- Query Latency P99: 0.85ms
- Memory Load: 24.6%`
    };

    consoleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cmd = tab.getAttribute('data-cmd');

            // Remove active states
            consoleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update text
            if (consoleCode && commands[cmd]) {
                consoleCode.textContent = commands[cmd];
            }
        });
    });

    // 3. Navbar scroll size updates
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.height = '65px';
            navbar.style.background = '#040408';
        } else {
            navbar.style.height = '80px';
            navbar.style.background = 'rgba(4, 4, 8, 0.85)';
        }
    });
});
