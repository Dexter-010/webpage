// DEXTERITY.IT Main JavaScript

// Apply theme immediately to prevent flash of wrong theme
(function() {
    const theme = localStorage.getItem('dexterity-theme');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    updateYear();
    highlightActiveNav();
    hydrateDetailPage();
    initCourseFilters();
    initProgressTracker();
    initDocsLayout();
    initThemeToggle();
    initCodeBlocks();
    initFeedbackControls();
    initDocsHubSearch();
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Navigate to page
function navigateTo(page) {
    if (!page) return;
    if (page === 'index.html' || page === 'home' || page === './') {
        window.location.href = '/';
        return;
    }
    if (page.startsWith('http') || page.startsWith('mailto:')) {
        window.location.href = page;
        return;
    }
    if (!page.startsWith('/')) {
        window.location.href = '/' + page;
    } else {
        window.location.href = page;
    }
}

// Create floating particles for hero section
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Update copyright year
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Highlight active navigation link
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const aliases = {
        'services-detail.html': 'services.html',
        'courses-detail.html': 'courses.html',
        'docs-detail.html': 'docs.html'
    };
    const effectivePage = aliases[currentPage] || currentPage;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === effectivePage || (effectivePage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Copy to clipboard function (for documentation pages)
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textarea);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(to right, #0891b2, #2563eb);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(8, 145, 178, 0.4);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Course filters
function initCourseFilters() {
    const filterPanel = document.querySelector('.course-filters');
    if (!filterPanel) return;

    const selects = filterPanel.querySelectorAll('[data-course-filter]');
    selects.forEach(select => select.addEventListener('change', filterCourses));

    const searchField = document.getElementById('course-search');
    if (searchField) {
        searchField.addEventListener('input', filterCourses);
    }

    const resetBtn = document.getElementById('reset-course-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            selects.forEach(select => select.value = 'all');
            if (searchField) searchField.value = '';
            filterCourses();
        });
    }

    filterCourses();
}

function filterCourses() {
    const cards = document.querySelectorAll('.course-card');
    if (!cards.length) return;

    const difficulty = document.getElementById('difficulty-filter')?.value || 'all';
    const topic = document.getElementById('topic-filter')?.value || 'all';
    const duration = document.getElementById('duration-filter')?.value || 'all';
    const searchValue = document.getElementById('course-search')?.value.toLowerCase() || '';
    let visibleCount = 0;

    cards.forEach(card => {
        const matchesDifficulty = difficulty === 'all' || card.dataset.difficulty === difficulty;
        const matchesTopic = topic === 'all' || card.dataset.topic === topic;
        const matchesDuration = duration === 'all' || card.dataset.duration === duration;
        const keywords = card.dataset.keywords ? card.dataset.keywords.toLowerCase() : '';
        const textMatch = !searchValue ||
            card.querySelector('.course-card-title')?.textContent.toLowerCase().includes(searchValue) ||
            card.querySelector('.course-card-desc')?.textContent.toLowerCase().includes(searchValue) ||
            keywords.includes(searchValue);

        if (matchesDifficulty && matchesTopic && matchesDuration && textMatch) {
            card.style.display = 'flex';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });

    const emptyState = document.getElementById('course-empty-state');
    if (emptyState) {
        emptyState.style.display = visibleCount ? 'none' : 'flex';
    }
}

// Course progress visualisation
function initProgressTracker() {
    const progressItems = document.querySelectorAll('[data-progress]');
    if (!progressItems.length) return;

    progressItems.forEach(item => {
        if (item.dataset.animated === 'true') return;
        const target = parseInt(item.dataset.progress, 10) || 0;
        const bar = item.querySelector('.progress-bar-fill');
        const label = item.querySelector('.progress-value');
        if (!bar) return;

        item.dataset.animated = 'true';
        let current = 0;
        const step = () => {
            current += 2;
            if (current >= target) {
                current = target;
            } else {
                requestAnimationFrame(step);
            }
            bar.style.width = current + '%';
            if (label) label.textContent = current + '%';
        };
        requestAnimationFrame(step);
    });
}

// Documentation experience
function initDocsLayout() {
    const docsLayout = document.querySelector('.docs-layout');
    if (!docsLayout) return;

    setupSidebarControls();
    setupDocSearch();
    buildTableOfContents();
    setupBreadcrumb();
    setupSectionNavigation();
    setupLastUpdatedStamp();
}

function setupSidebarControls() {
    const sidebar = document.getElementById('docs-sidebar');
    if (!sidebar) return;

    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const overlay = document.getElementById('sidebar-overlay');

    const setOpen = (isOpen) => {
        sidebar.classList.toggle('open', isOpen);
        if (overlay) overlay.classList.toggle('visible', isOpen);
        document.body.classList.toggle('sidebar-open', isOpen);
    };

    if (toggleBtn) toggleBtn.addEventListener('click', () => setOpen(true));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    if (overlay) overlay.addEventListener('click', () => setOpen(false));

    sidebar.querySelectorAll('.sidebar-section-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const list = document.getElementById(targetId);
            if (!list) return;
            const collapsed = list.classList.toggle('collapsed');
            button.setAttribute('aria-expanded', String(!collapsed));
        });
    });
}

function setupDocSearch() {
    const searchInput = document.getElementById('docs-search');
    if (!searchInput) return;

    const topics = document.querySelectorAll('.doc-topic');
    const emptyState = document.getElementById('docs-empty-state');

    const runSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        let matches = 0;

        topics.forEach(topic => {
            const keywords = topic.dataset.keywords?.toLowerCase() || '';
            const heading = topic.querySelector('h3')?.textContent.toLowerCase() || '';
            const bodyText = topic.querySelector('.doc-topic-body')?.textContent.toLowerCase() || '';
            const isMatch = !query || heading.includes(query) || bodyText.includes(query) || keywords.includes(query);
            topic.style.display = isMatch ? 'block' : 'none';
            if (isMatch) matches++;
        });

        if (emptyState) {
            emptyState.style.display = matches ? 'none' : 'flex';
        }
    };

    searchInput.addEventListener('input', runSearch);
    runSearch();
}

function buildTableOfContents() {
    const toc = document.getElementById('table-of-contents');
    const article = document.querySelector('.docs-article');
    if (!toc || !article) return;

    const headings = article.querySelectorAll('h3');
    if (!headings.length) return;

    const list = document.createElement('ol');
    list.className = 'toc-list';

    headings.forEach((heading, index) => {
        if (heading.closest('.toc-wrapper')) return;
        if (!heading.id) {
            heading.id = 'doc-heading-' + (index + 1);
        }
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        item.appendChild(link);
        list.appendChild(item);
    });

    toc.innerHTML = '';
    toc.appendChild(list);
}

function setupBreadcrumb() {
    const breadcrumb = document.getElementById('docs-breadcrumb');
    if (!breadcrumb) return;

    const segments = breadcrumb.dataset.trail ? breadcrumb.dataset.trail.split('|') : [];
    if (!segments.length) return;

    const list = document.createElement('ul');
    list.className = 'breadcrumb-list';

    segments.forEach((segment, index) => {
        const [label, url] = segment.split('::');
        const item = document.createElement('li');
        if (url && index !== segments.length - 1) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = label;
            item.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.textContent = label;
            item.appendChild(span);
        }
        list.appendChild(item);
    });

    breadcrumb.innerHTML = '';
    breadcrumb.appendChild(list);
}

function setupSectionNavigation() {
    const nav = document.getElementById('docs-section-nav');
    if (!nav) return;

    nav.querySelectorAll('[data-nav-target]').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.navTarget;
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupLastUpdatedStamp() {
    const stamp = document.querySelector('[data-last-updated]');
    const label = document.getElementById('docs-last-updated');
    if (!stamp || !label) return;

    const iso = stamp.dataset.lastUpdated;
    if (!iso) return;

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return;

    const formatted = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    label.textContent = formatted;
}

// Theme toggle
function initThemeToggle() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    if (!toggles.length) return;

    const updateLabel = () => {
        const isLight = document.body.classList.contains('light-mode');
        toggles.forEach(toggle => {
            toggle.setAttribute('aria-pressed', String(isLight));
            toggle.innerHTML = isLight ? '🌙 Dark mode' : '☀️ Light mode';
        });
    };

    updateLabel();

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const mode = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('dexterity-theme', mode);
            updateLabel();
        });
    });
}

// Code block utilities
function initCodeBlocks() {
    const blocks = document.querySelectorAll('.code-block');
    if (!blocks.length) return;

    blocks.forEach(block => {
        const button = block.querySelector('.code-copy-btn');
        const code = block.querySelector('code');
        if (button && code) {
            button.addEventListener('click', () => {
                copyToClipboard(code.innerText.trim());
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 1500);
            });
        }
    });

    applySyntaxHighlighting();
}

function applySyntaxHighlighting() {
    document.querySelectorAll('code[data-language]').forEach(code => {
        const language = code.dataset.language;
        const source = code.textContent;
        let html = escapeHtml(source);
        switch (language) {
            case 'bash':
                html = highlightTokens(html, /(sudo|apt|systemctl|docker|kubectl|git|cd|rm|cp|mv)\b/g, 'keyword');
                html = highlightTokens(html, /(--[a-z-]+|-{1}[a-z])/gi, 'flag');
                break;
            case 'yaml':
                html = highlightTokens(html, /^(\s*-?\s*[A-Za-z0-9_]+:)/gm, 'keyword');
                break;
            case 'json':
                html = highlightTokens(html, /"([^"]+)":/g, 'keyword');
                break;
            case 'powershell':
                html = highlightTokens(html, /(Get-|Set-|New-|Add-|Remove-)[A-Za-z]+/g, 'keyword');
                html = highlightTokens(html, /\$[A-Za-z0-9_]+/g, 'value');
                break;
            default:
                html = highlightTokens(html, /(function|const|let|var|return|if|else)\b/g, 'keyword');
        }
        code.innerHTML = html;
    });
}

function highlightTokens(source, pattern, cssClass) {
    return source.replace(pattern, match => `<span class="code-${cssClass}">${match}</span>`);
}

function escapeHtml(input) {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Feedback controls
function initFeedbackControls() {
    const buttons = document.querySelectorAll('[data-feedback]');
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const feedback = button.dataset.feedback;
            const message = feedback === 'yes'
                ? 'Thanks! We are glad this helped.'
                : 'Thanks! We will use this to improve the guide.';
            showNotification(message);
        });
    });
}

function initDocsHubSearch() {
    const searchInput = document.getElementById('docs-hub-search');
    const emptyState = document.getElementById('docs-hub-empty-state');

    if (!searchInput) return;

    const tiles = Array.from(document.querySelectorAll('[data-keywords]'));
    const groupedTiles = new Map();
    const branchTiles = new Map();

    tiles.forEach(tile => {
        const group = tile.closest('[data-collection-group]');
        if (!group) return;
        if (!groupedTiles.has(group)) {
            groupedTiles.set(group, []);
        }
        groupedTiles.get(group).push(tile);

        const branch = tile.closest('.docs-tree-branch');
        if (branch) {
            if (!branchTiles.has(branch)) {
                branchTiles.set(branch, []);
            }
            branchTiles.get(branch).push(tile);
        }
    });

    const handleSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        tiles.forEach(tile => {
            const keywords = (tile.dataset.keywords || '').toLowerCase();
            const text = tile.textContent.toLowerCase();
            const isMatch = !query || keywords.includes(query) || text.includes(query);

            if (isMatch) {
                tile.style.display = '';
                visibleCount++;
            } else {
                tile.style.display = 'none';
            }
        });

        groupedTiles.forEach((members, group) => {
            const hasVisibleChild = members.some(tile => tile.style.display !== 'none');
            group.style.display = hasVisibleChild ? '' : 'none';
        });

        branchTiles.forEach((members, branch) => {
            const hasVisibleChild = members.some(tile => tile.style.display !== 'none');
            branch.style.display = hasVisibleChild ? '' : 'none';
            if (hasVisibleChild) {
                branch.open = true;
            }
        });

        if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    searchInput.addEventListener('input', handleSearch);
    handleSearch();
}

// Populate detail templates
function hydrateDetailPage() {
    const page = window.location.pathname.split('/').pop();
    const slug = new URLSearchParams(window.location.search).get('slug');

    if (!slug) return;

    if (page === 'services-detail.html') {
        renderServiceDetail(slug);
    } else if (page === 'courses-detail.html') {
        renderCourseDetail(slug);
    } else if (page === 'docs-detail.html') {
        renderDocDetail(slug);
    }
}

const serviceDetails = {
    'cloud-architecture': {
        title: 'Cloud Architecture & Modernization',
        summary: 'Design and deploy secure landing zones, platform services, and guardrails tailored to your governance requirements.',
        bullets: [
            'Blueprint landing zones across Azure, AWS, and GCP with repeatable automation.',
            'Implement identity, networking, and policy baselines aligned to zero-trust principles.',
            'Establish FinOps and monitoring practices to keep environments cost-effective and observable.'
        ]
    },
    'network-cybersecurity': {
        title: 'Network & Cybersecurity Engineering',
        summary: 'Integrate defense-in-depth controls, SOC workflows, and secure connectivity for distributed teams.',
        bullets: [
            'Zero-trust access, SASE, and SD-WAN solutions for hybrid workforces.',
            'SOC design including SIEM, SOAR integrations, and incident runbooks.',
            'Regulatory alignment for PCI-DSS, NIST CSF, CIS, and industry frameworks.'
        ]
    },
    'ai-automation': {
        title: 'AI & Automation Programs',
        summary: 'Build copilots, automation pipelines, and ML workflows that shorten time-to-value.',
        bullets: [
            'Discovery workshops to identify high-impact automation opportunities.',
            'Prototype copilots integrated with internal systems and governance guardrails.',
            'Model lifecycle operations covering prompt evaluation, monitoring, and retraining.'
        ]
    },
    'enterprise-training': {
        title: 'Enterprise Training & Enablement',
        summary: 'Role-based enablement experiences that accelerate adoption of new platforms and processes.',
        bullets: [
            'Curriculum design for architects, operators, and leadership cohorts.',
            'Hands-on labs delivered onsite or virtually with real-world scenarios.',
            'Capability assessments and certification coaching aligned to business goals.'
        ]
    },
    'managed-operations': {
        title: 'Managed Operations & Reliability',
        summary: '24/7 operational coverage with proactive engineering to keep business services resilient.',
        bullets: [
            'Platform monitoring, alert tuning, and runbook automation.',
            'Incident response leadership with clear SLAs and communication templates.',
            'Continuous improvement loops including game days and post-incident reviews.'
        ]
    },
    'fractional-cto': {
        title: 'Fractional CTO & Advisory',
        summary: 'Interim technology leadership to align architecture, delivery, and roadmap decisions.',
        bullets: [
            'Technology strategy, budgeting, and vendor management support.',
            'Operating model design spanning product, platform, and security teams.',
            'Executive-ready reporting to translate engineering outcomes into business insights.'
        ]
    }
};

const courseDetails = {
    'network-fundamentals': {
        title: 'Network Fundamentals',
        summary: 'Understand IP addressing, subnetting, and core topologies before moving into advanced design.',
        meta: 'Domain: Networking • Format: Guided labs',
        bullets: [
            'Plan IPv4/IPv6 addressing schemes with subnet calculators and validation labs.',
            'Design resilient LAN/WAN architectures using Packet Tracer and physical diagrams.',
            'Deploy DHCP and DNS services with repeatable, automation-ready configs.'
        ]
    },
    'routing-switching': {
        title: 'Routing & Switching',
        summary: 'Level up Cisco CLI proficiency with multi-protocol routing labs and VLAN segmentation exercises.',
        meta: 'Domain: Networking • Format: CLI deep dives',
        bullets: [
            'Implement static routes, RIP, and OSPF across branch and data center gear.',
            'Configure VLAN trunking, EtherChannel, and spanning-tree protections.',
            'Troubleshoot Frame Relay, PPP, and DHCP relay using structured runbooks.'
        ]
    },
    'virtual-networking': {
        title: 'Virtual Networking',
        summary: 'Blend virtual switches, bridges, and automation to unify on-prem and cloud workloads.',
        meta: 'Domain: Networking • Format: Automation labs',
        bullets: [
            'Deploy VMware and Proxmox vSwitches with tagged segments and overlays.',
            'Automate Netplan YAML and Bash scripts to provision lab networks at scale.',
            'Integrate cloud topologies with on-prem firewalls for hybrid lab scenarios.'
        ]
    },
    'advanced-networking': {
        title: 'Advanced Networking',
        summary: 'Design multi-site architectures with IPv6, VPN, and load balancing for production-readiness.',
        meta: 'Domain: Networking • Format: Architecture playbooks',
        bullets: [
            'Execute IPv6 adoption plans with dual-stack validation suites.',
            'Engineer multi-site routing with dynamic failover and site-to-site VPNs.',
            'Analyze Siege & Filiale case studies to benchmark enterprise deployments.'
        ]
    },
    'linux-administration': {
        title: 'Linux Administration',
        summary: 'Master daily operations, automation, and networking on Linux servers.',
        meta: 'Domain: Operating Systems • Format: CLI + scripting',
        bullets: [
            'Harden users, groups, and permissions with sudo and audit policies.',
            'Automate services and reporting with Bash, cron, and systemd timers.',
            'Configure Netplan and systemd-networkd for reliable network stacks.'
        ]
    },
    'windows-server-management': {
        title: 'Windows Server Management',
        summary: 'Operate Active Directory, DNS, and file services with production-grade procedures.',
        meta: 'Domain: Operating Systems • Format: GUI + PowerShell labs',
        bullets: [
            'Deploy AD DS, Group Policy, and DNS-integrated zones.',
            'Deliver DHCP, IIS, and SMB file services with high availability.',
            'Script routine administration with PowerShell remoting and modules.'
        ]
    },
    'virtualization-deployment': {
        title: 'Virtualization & Deployment',
        summary: 'Provision repeatable lab and production clusters across VMware and Proxmox.',
        meta: 'Domain: Operating Systems • Format: Platform integrations',
        bullets: [
            'Configure compute, storage, and networking for mixed hypervisor estates.',
            'Automate snapshots, backups, and template rollouts.',
            'Integrate pfSense edges and Active Directory services for hybrid labs.'
        ]
    },
    'cybersecurity-essentials': {
        title: 'Cybersecurity Essentials',
        summary: 'Build defensive muscle memory with policy, tooling, and monitoring workflows.',
        meta: 'Domain: Security • Format: Defensive labs',
        bullets: [
            'Map threat models using the CIA triad and risk scoring matrices.',
            'Deploy Snort and Suricata sensors with actionable alerting.',
            'Author security policies, RBAC, and entitlement reviews.'
        ]
    },
    'ethical-hacking': {
        title: 'Penetration Testing & Ethical Hacking',
        summary: 'Execute controlled offensive operations with modern open-source tooling.',
        meta: 'Domain: Security • Format: Offensive labs',
        bullets: [
            'Enumerate networks with Nmap, Hydra, and advanced scanning profiles.',
            'Exploit vulnerabilities using Metasploit frameworks and manual techniques.',
            'Compete in CTF-style exercises with debrief templates for stakeholders.'
        ]
    },
    'network-security-defense': {
        title: 'Network Security & Defense',
        summary: 'Defend edge networks with layered routing, firewall, and IDS strategies.',
        meta: 'Domain: Security • Format: Blue-team runbooks',
        bullets: [
            'Design VPNs, ACLs, and DDoS protections aligned to business SLAs.',
            'Build pfSense firewall policies with automation hooks and alerting.',
            'Operationalize IDS telemetry and dashboards for rapid response.'
        ]
    },
    'cloud-compliance': {
        title: 'Cloud & Compliance',
        summary: 'Align Azure security controls with governance frameworks and audit preparation.',
        meta: 'Domain: Security • Format: Governance toolkits',
        bullets: [
            'Implement RBAC and IAM guardrails following shared responsibility models.',
            'Map workloads to GRC requirements across SOC 2, ISO 27001, and CIS benchmarks.',
            'Generate evidence packs and workflows for ongoing compliance operations.'
        ]
    }
};

const docDetails = {
    'azure-landing-zone': {
        title: 'Azure Landing Zone Blueprint',
        summary: 'Comprehensive reference covering design decisions, Bicep modules, and policy assignments.',
        tags: ['Azure', 'IaC', 'Governance'],
        bullets: [
            'Architecture diagrams and decision matrix for hub-spoke vs. virtual WAN.',
            'Modular Bicep templates for subscriptions, networking, and security controls.',
            'Operational guidance for monitoring, backup, and cost governance.'
        ],
        primaryAction: { label: 'Download blueprint', url: 'files/azure-landing-zone-blueprint.zip' },
        copyUrl: 'https://dexterity.it/docs/azure-landing-zone'
    },
    'zero-trust-playbook': {
        title: 'Zero Trust Incident Playbook',
        summary: 'Runbook for threat detection, triage, and containment in zero-trust environments.',
        tags: ['Security', 'Incident Response', 'Zero Trust'],
        bullets: [
            'Incident classification criteria and escalation matrix.',
            'Containment workflows for identities, endpoints, and network segments.',
            'Post-incident review checklist and lessons learned template.'
        ],
        primaryAction: { label: 'View playbook', url: 'files/zero-trust-playbook.pdf' },
        copyUrl: 'https://dexterity.it/docs/zero-trust-playbook'
    },
    'copilot-adoption': {
        title: 'Copilot Adoption Guide',
        summary: 'Structured approach to launching copilots safely across the organization.',
        tags: ['AI', 'Change Management', 'Copilot'],
        bullets: [
            'Stakeholder mapping and communication plan for pilot cohorts.',
            'Guardrail design including data loss prevention and responsible AI principles.',
            'Metrics and feedback loops to scale adoption confidently.'
        ],
        primaryAction: { label: 'Open guide', url: 'files/copilot-adoption-guide.pdf' },
        copyUrl: 'https://dexterity.it/docs/copilot-adoption'
    },
    'sre-runbook': {
        title: 'SRE On-Call Runbook',
        summary: 'Operational handbook for on-call engineers supporting critical services.',
        tags: ['Operations', 'SRE', 'Observability'],
        bullets: [
            'Triage decision trees and communication templates.',
            'Golden signals dashboard definitions and alert routing.',
            'Blameless post-incident process with sample report outline.'
        ],
        primaryAction: { label: 'Download runbook', url: 'files/sre-oncall-runbook.pdf' },
        copyUrl: 'https://dexterity.it/docs/sre-runbook'
    },
    'network-fundamentals': {
        title: 'Network Fundamentals Lab Guide',
        summary: 'Hands-on workbook covering IP design, subnetting drills, and LAN/WAN build guides.',
        tags: ['Networking', 'Foundations', 'Labs'],
        bullets: [
            'Step-by-step subnetting challenges with answer keys.',
            'Packet Tracer topologies for LAN, WAN, DHCP, and DNS services.',
            'Wireshark captures annotated for protocol deep dives.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/network-fundamentals' },
        copyUrl: 'https://dexterity.it/docs/network-fundamentals'
    },
    'routing-switching': {
        title: 'Routing & Switching Playbook',
        summary: 'Cisco-centric labs exploring core routing protocols, VLAN segmentation, and troubleshooting.',
        tags: ['Networking', 'Cisco', 'Routing'],
        bullets: [
            'Configuration snippets for static, RIP, and OSPF rollouts.',
            'VLAN trunking, EtherChannel, and spanning tree hardening guides.',
            'CLI troubleshooting checklists and common fault isolation patterns.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/routing-switching' },
        copyUrl: 'https://dexterity.it/docs/routing-switching'
    },
    'ccna-configuration': {
        title: 'CCNA Configuration Lab Pack',
        summary: 'Hands-on labs covering Layer 2/3 Cisco IOS setups, verification commands, and Packet Tracer topologies.',
        tags: ['Networking', 'Cisco', 'CCNA'],
        bullets: [
            'Step-by-step switch and router base configuration with hostname, VLAN, and interface templates.',
            'Routing scenarios for static routes, OSPF, and inter-VLAN gateways with validation commands.',
            'Packet Tracer topology walkthroughs plus troubleshooting checklists for common misconfigurations.'
        ],
        primaryAction: { label: 'Open HTML guide', url: 'files/ccna-configuration-guide.html' },
        copyUrl: 'https://dexterity.it/docs/ccna-configuration'
    },
    'frame-relay-lab': {
        title: 'Frame Relay Configuration Lab',
        summary: 'Deploy a hub-and-spoke Frame Relay WAN, map DLCIs, and validate reachability between spokes.',
        tags: ['Networking', 'WAN', 'Labs'],
        bullets: [
            'Establish Frame Relay encapsulation with the correct LMI type and verify PVC status.',
            'Map static and dynamic DLCIs to router subinterfaces and confirm adjacency formation.',
            'Capture verification commands for routing convergence plus a troubleshooting checklist for common errors.'
        ],
        primaryAction: { label: 'View Notion lab', url: 'https://www.notion.so/Frame-Relay-config-29b3c102a17980908808e04806ec344a?source=copy_link' },
        copyUrl: 'https://www.notion.so/Frame-Relay-config-29b3c102a17980908808e04806ec344a?source=copy_link'
    },
    'virtual-networking': {
        title: 'Virtual Networking Workbook',
        summary: 'Blueprints for VMware, Proxmox, and cloud network integrations with automation hooks.',
        tags: ['Networking', 'Virtualization', 'Automation'],
        bullets: [
            'vSwitch, bridge, and overlay templates for mixed hypervisor estates.',
            'Netplan YAML samples and Bash automation scripts.',
            'Hybrid cloud interconnect diagrams with pfSense integrations.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/virtual-networking' },
        copyUrl: 'https://dexterity.it/docs/virtual-networking'
    },
    'advanced-networking': {
        title: 'Advanced Networking Case Files',
        summary: 'Deep dives into IPv6, multi-site routing, VPN, and load-balancing architectures.',
        tags: ['Networking', 'Enterprise', 'IPv6'],
        bullets: [
            'Dual-stack migration plan with validation workloads.',
            'Multi-site VPN designs referencing Siege & Filiale projects.',
            'Load-balancing topologies with health-check automation.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/advanced-networking' },
        copyUrl: 'https://dexterity.it/docs/advanced-networking'
    },
    'linux-administration': {
        title: 'Linux Administration Field Guide',
        summary: 'Operational checklists, scripts, and diagrams for administering Linux fleets.',
        tags: ['Linux', 'Automation', 'Ops'],
        bullets: [
            'User, group, and sudo policy templates with audit notes.',
            'Bash automation snippets for backups, logging, and service health.',
            'Netplan and systemd-networkd profiles for multi-NIC hosts.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/linux-administration' },
        copyUrl: 'https://dexterity.it/docs/linux-administration'
    },
    'windows-server-management': {
        title: 'Windows Server Management Runbook',
        summary: 'End-to-end guides for Active Directory, DNS, DHCP, IIS, and automation tasks.',
        tags: ['Windows', 'Active Directory', 'PowerShell'],
        bullets: [
            'Forest deployment checklist with Group Policy baselines.',
            'PowerShell modules for DHCP, DNS, and IIS administration.',
            'File services hardening, SMB shares, and audit policy scripts.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/windows-server-management' },
        copyUrl: 'https://dexterity.it/docs/windows-server-management'
    },
    'virtualization-deployment': {
        title: 'Virtualization & Deployment Playbook',
        summary: 'VMware and Proxmox reference architectures with backup and automation workflows.',
        tags: ['Virtualization', 'VMware', 'Proxmox'],
        bullets: [
            'Cluster sizing calculators for compute, memory, and storage.',
            'Automation scripts for template deployment and snapshot management.',
            'Integration patterns with pfSense and Active Directory services.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/virtualization-deployment' },
        copyUrl: 'https://dexterity.it/docs/virtualization-deployment'
    },
    'cybersecurity-essentials': {
        title: 'Cybersecurity Essentials Handbook',
        summary: 'Defensive frameworks, worksheets, and IDS deployment guides.',
        tags: ['Security', 'Defensive', 'Governance'],
        bullets: [
            'Threat modeling templates mapped to the CIA triad.',
            'Snort and Suricata deployment with alert tuning labs.',
            'Policy starter kits for RBAC, least privilege, and access reviews.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/cybersecurity-essentials' },
        copyUrl: 'https://dexterity.it/docs/cybersecurity-essentials'
    },
    'ethical-hacking': {
        title: 'Penetration Testing & Ethical Hacking Labs',
        summary: 'Offensive security methodologies, tooling cheat-sheets, and CTF exercises.',
        tags: ['Security', 'Offensive', 'Labs'],
        bullets: [
            'Reconnaissance and enumeration workflows with Nmap and Hydra.',
            'Metasploit exploitation playbooks with post-exploitation steps.',
            'Capture the Flag lab scenarios with scoring and write-ups.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/ethical-hacking' },
        copyUrl: 'https://dexterity.it/docs/ethical-hacking'
    },
    'network-security-defense': {
        title: 'Network Security & Defense Runbook',
        summary: 'Firewall, VPN, and IDS operations guide for blue-team practitioners.',
        tags: ['Security', 'Networking', 'Blue Team'],
        bullets: [
            'ACL and VPN design templates for branch and remote access.',
            'pfSense automation scripts and monitoring dashboards.',
            'Incident response checklists for edge attacks and DoS events.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/network-security-defense' },
        copyUrl: 'https://dexterity.it/docs/network-security-defense'
    },
    'cloud-compliance': {
        title: 'Cloud & Compliance Toolkit',
        summary: 'Azure security configurations mapped to compliance frameworks and audit evidence packs.',
        tags: ['Security', 'Compliance', 'Azure'],
        bullets: [
            'RBAC and IAM configuration patterns aligned to shared responsibility.',
            'Controls mapping for SOC 2, ISO 27001, CIS, and AZ-900 objectives.',
            'Evidence collection worksheets for ongoing compliance operations.'
        ],
        primaryAction: { label: 'Open Notion workspace', url: 'https://notion.so/dexterity-it/cloud-compliance' },
        copyUrl: 'https://dexterity.it/docs/cloud-compliance'
    }
};

function renderServiceDetail(slug) {
    const detail = serviceDetails[slug];
    renderDetail({
        detail,
        notFoundFallback: {
            title: 'Service not found',
            summary: 'The requested service is unavailable. Please return to the services page.',
            bullets: []
        }
    });
}

function renderCourseDetail(slug) {
    const detail = courseDetails[slug];
    renderDetail({
        detail,
        metaId: 'detail-meta',
        notFoundFallback: {
            title: 'Course not found',
            summary: 'The requested course could not be located. Please return to the courses page.',
            bullets: []
        }
    });
}

function renderDocDetail(slug) {
    const detail = docDetails[slug];
    const titleEl = document.getElementById('detail-title');
    const summaryEl = document.getElementById('detail-summary');
    const tagsEl = document.getElementById('detail-tags');
    const contentEl = document.getElementById('detail-content');
    const primaryBtn = document.getElementById('detail-primary-action');
    const copyBtn = document.getElementById('detail-copy-action');

    if (!titleEl || !summaryEl || !tagsEl || !contentEl || !primaryBtn || !copyBtn) return;

    if (!detail) {
        titleEl.textContent = 'Document not found';
        summaryEl.textContent = 'The requested document is unavailable. Please return to the documentation library.';
        tagsEl.textContent = '';
        contentEl.innerHTML = '';
        primaryBtn.style.display = 'none';
        copyBtn.style.display = 'none';
        return;
    }

    titleEl.textContent = detail.title;
    summaryEl.textContent = detail.summary;
    tagsEl.textContent = `Tags: ${detail.tags.join(', ')}`;
    contentEl.innerHTML = buildDetailHtml(detail.bullets);

    primaryBtn.textContent = detail.primaryAction.label;
    primaryBtn.onclick = () => window.open(detail.primaryAction.url, '_blank');
    primaryBtn.style.display = 'inline-flex';

    copyBtn.onclick = () => copyToClipboard(detail.copyUrl);
    copyBtn.style.display = 'inline-flex';
}

function renderDetail({ detail, notFoundFallback, metaId }) {
    const titleEl = document.getElementById('detail-title');
    const summaryEl = document.getElementById('detail-summary');
    const contentEl = document.getElementById('detail-content');
    const metaEl = metaId ? document.getElementById(metaId) : null;

    if (!titleEl || !summaryEl || !contentEl) return;

    const payload = detail || notFoundFallback;

    titleEl.textContent = payload.title;
    summaryEl.textContent = payload.summary;

    if (metaEl) {
        metaEl.textContent = detail && detail.meta ? detail.meta : '';
    }

    contentEl.innerHTML = buildDetailHtml(payload.bullets);
}

function buildDetailHtml(bullets = []) {
    if (!bullets.length) return '';
    const items = bullets.map(item => `<li>${item}</li>`).join('');
    return `<ul>${items}</ul>`;
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
