function initAudioPlayers(container) {
    container.querySelectorAll('.audio-player').forEach(player => {
        const audio  = player.querySelector('audio');
        const btn    = player.querySelector('.audio-btn');
        const seek   = player.querySelector('.audio-seek');
        const fill   = player.querySelector('.audio-progress-fill');
        const time   = player.querySelector('.audio-time');

        audio.src = player.dataset.src;

        function fmt(s) {
            const m = Math.floor(s / 60);
            return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
        }

        audio.addEventListener('loadedmetadata', () => {
            time.textContent = '0:00 / ' + fmt(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
            fill.style.width = pct + '%';
            seek.value = pct;
            time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
        });

const iconPlay  = `<svg viewBox="0 0 24 24" width="14" height="14" fill="white"><polygon points="5,3 19,12 5,21"/></svg>`;
        const iconPause = `<svg viewBox="0 0 24 24" width="14" height="14" fill="white"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>`;

        btn.innerHTML = iconPlay;

        audio.addEventListener('ended', () => { btn.innerHTML = iconPlay; });

        btn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                btn.innerHTML = iconPause;
            } else {
                audio.pause();
                btn.innerHTML = iconPlay;
            }
        });

        seek.addEventListener('input', () => {
            if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
        });

        // sentinel: div invisível logo antes do player, usada para detectar quando ele grudou no topo
        const sentinel = document.createElement('div');
        sentinel.style.cssText = 'height:1px;margin-bottom:-1px;';
        player.parentNode.insertBefore(sentinel, player);

        new IntersectionObserver(([entry]) => {
            player.classList.toggle('audio-player--stuck', !entry.isIntersecting);
        }, { rootMargin: '-53px 0px 0px 0px', threshold: 0 }).observe(sentinel);
    });
}

function highlightAll(container) {
    const java = hljs.getLanguage('java');
    java.keywords.built_in = (java.keywords.built_in || '') +
        ' regAction regFun preAjax eval update link ok isAjaxCall getInput getOutput ' +
        'getManager getFactory getUser getSession ui isAdmin isAdminXT isUpdate setInsert ' +
        'setUpdate render config row col setContent setStyle setHtmlData ajax modalMax ' +
        'putInteger putString childWindow toHtml btTitle btTitleActive add write';

    container.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });

    const classNames = [
        'ModuloManager','ModuloHome','ModuloMdFactory','PnlManager','AppsRootAction',
        'AppManager','XtPage','SideMenu','Table','TableRow','JasapPage','Response',
        'Effect','Js','LaboratorioManager','LaboratorioHome','LaboratorioMdFactory',
        'LabPessoaList','LabPessoaForm','LabPessoaSelect','LabProdutoList','LabProdutoForm',
        'LabProdutoSelect','LabPerfilList','LabPerfilForm','LabPerfilSelect',
        'Title','MenuItem','MenuInicial'
    ];

    const methods = [
        'regAction','regFun','preAjax','eval','update','link','getManager','getInput',
        'getOutput','getFactory','isAjaxCall','toHtml','ajax','modalMax','putInteger',
        'putString','childWindow','btTitle','btTitleActive','render','config','add',
        'write','row','col','setContent','setStyle','ok','getUser','getSession','ui'
    ];

    container.querySelectorAll('pre code').forEach(block => {
        let html = block.innerHTML;

        // Protege strings literais para não serem recoloridas
        const saved = [];
        html = html.replace(/<span class="hljs-string">[\s\S]*?<\/span>/g, match => {
            saved.push(match);
            return `\x00S${saved.length - 1}\x00`;
        });

        html = html.replace(
            /\b(br\.xt[a-zA-Z0-9._]*)/g,
            `<span class="xt-package">$1</span>`
        );

        html = html.replace(
            /(\.)class\b/g,
            `.<span class="xt-constant">class</span>`
        );

        html = html.replace(
            /\b([A-Z][A-Z0-9_]{2,})\b(?=[^>]*<|[^<>]*$)/g,
            `<span class="xt-constant">$1</span>`
        );

        classNames.forEach(name => {
            html = html.replace(
                new RegExp(`\\b(${name})\\b(?=[^>]*<|[^<>]*$)`, 'g'),
                `<span class="xt-class">$1</span>`
            );
        });

        methods.forEach(name => {
            html = html.replace(
                new RegExp(`\\b(${name})\\b(?=[^>]*<|[^<>]*$)`, 'g'),
                `<span class="xt-method">$1</span>`
            );
        });

        // Restaura strings literais intactas
        saved.forEach((s, i) => { html = html.replace(`\x00S${i}\x00`, s); });

        block.innerHTML = html;
    });
}

async function show(id, el) {
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    if (el) {
        el.classList.add('active');
    } else {
        const item = document.querySelector(`.menu-item[data-page="${id}"]`);
        if (item) item.classList.add('active');
    }

    const topnav = document.getElementById('topnav');
    topnav.classList.remove('visible');
    topnav.innerHTML = '';
    document.body.classList.remove('has-topnav');

    const inner = document.getElementById('content-inner');
    inner.innerHTML = '<p style="color:#888;padding:20px 0;">Carregando...</p>';

    const response = await fetch('pages/' + id + '.html');
    const html = await response.text();
    inner.innerHTML = html;

    highlightAll(inner);
    initAudioPlayers(inner);

    // Gera nav a partir dos h2 da página
    const topoLink = document.createElement('a');
    topoLink.href = '#';
    topoLink.textContent = '↑ início';
    topoLink.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    topnav.appendChild(topoLink);

    const headings = inner.querySelectorAll('h2');
    headings.forEach((h, i) => {
        if (!h.id) h.id = 'nav-' + i;
        const a = document.createElement('a');
        a.href = '#' + h.id;
        const text = h.textContent.trim();
        a.textContent = h.dataset.nav || (text.length > 24 ? text.slice(0, 24) + '…' : text);
        a.title = text;
        topnav.appendChild(a);
    });

    if (headings.length > 0) {
        setTimeout(() => {
            topnav.classList.add('visible');
            if (window.innerWidth <= 768) document.body.classList.add('has-topnav');
        }, 50);

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const isH1 = entry.target.tagName === 'H1';
                    topnav.querySelectorAll('a').forEach(a => {
                        a.classList.toggle('active', !isH1 && a.getAttribute('href') === '#' + entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-52px 0px -70% 0px', threshold: 0 });

        const h1 = inner.querySelector('h1');
        if (h1) { h1.id = h1.id || 'page-top'; observer.observe(h1); }
        headings.forEach(h => observer.observe(h));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let zoom = 1;

function changeZoom(delta) {
    setZoom(zoom + delta);
}

function setZoom(value) {
    zoom = Math.min(2, Math.max(0.5, value));
    document.getElementById('content').style.fontSize = zoom + 'em';
    document.getElementById('zoom-label').childNodes[0].textContent = Math.round(zoom * 100) + '%';
    document.getElementById('zoom-menu').style.display = 'none';
}

function toggleZoomMenu() {
    const menu = document.getElementById('zoom-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('click', function(e) {
    if (!document.getElementById('zoom-label').contains(e.target)) {
        document.getElementById('zoom-menu').style.display = 'none';
    }
});

function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
    localStorage.setItem('drawerOpen', drawer.classList.contains('open'));
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('drawerOpen') === 'true') {
        document.getElementById('drawer').classList.add('open');
        document.getElementById('hamburger').classList.add('open');
    }
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('theme-toggle').innerHTML = '&#9790;';
        document.getElementById('hljs-light').disabled = true;
        document.getElementById('hljs-dark').disabled  = false;
    }
});

function toggleGroup(header) {
    header.closest('.menu-group').classList.toggle('collapsed');
}

function toggleTheme() {
    const dark = document.body.classList.toggle('dark');
    document.getElementById('theme-toggle').innerHTML = dark ? '&#9790;' : '&#9788;';
    document.getElementById('hljs-light').disabled = dark;
    document.getElementById('hljs-dark').disabled  = !dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

function setTopActive(el) {
    document.querySelectorAll('#topnav a').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
}

