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

        // spacer: substitui o espaço do player no mobile quando ele vira fixed
        const spacer = document.createElement('div');
        spacer.style.display = 'none';
        player.parentNode.insertBefore(spacer, player.nextSibling);

        new IntersectionObserver(([entry]) => {
            const stuck = !entry.isIntersecting;
            player.classList.toggle('audio-player--stuck', stuck);
            if (window.innerWidth <= 768) {
                spacer.style.display = stuck ? 'block' : 'none';
                spacer.style.height   = stuck ? player.offsetHeight + 'px' : '0';
            }
        }, { rootMargin: '-53px 0px 0px 0px', threshold: 0 }).observe(sentinel);
    });
}

function initCopyButtons(container) {
    const iconCopy = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>`;
    const iconOk   = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;

    container.querySelectorAll('pre').forEach(pre => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.title = 'Copiar';
        btn.innerHTML = iconCopy;
        pre.appendChild(btn);

        btn.addEventListener('click', () => {
            const code = pre.querySelector('code');
            const text = code ? code.innerText : pre.innerText;
            navigator.clipboard.writeText(text).then(() => {
                btn.innerHTML = iconOk;
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = iconCopy;
                    btn.classList.remove('copied');
                }, 1500);
            });
        });
    });
}

function initRangeHighlights(container) {
    container.querySelectorAll('pre code').forEach(code => {
        const lines = code.innerHTML.split('\n');
        const result = [];
        let i = 0;

        while (i < lines.length) {
            const plain = lines[i].replace(/<[^>]+>/g, '');

            if (plain.includes('// ADICIONAR')) {
                // Procura // FIM antes do próximo // ADICIONAR
                let fimIdx = -1;
                for (let k = i + 1; k < lines.length; k++) {
                    const kPlain = lines[k].replace(/<[^>]+>/g, '');
                    if (kPlain.includes('// ADICIONAR')) break;
                    if (kPlain.includes('// FIM')) { fimIdx = k; break; }
                }

                const group = [lines[i]];
                i++;

                if (fimIdx !== -1) {
                    // Range: coleta até o // FIM (inclusive)
                    while (i <= fimIdx) { group.push(lines[i]); i++; }
                } else {
                    // Sem FIM: coleta até a próxima linha em branco
                    while (i < lines.length) {
                        if (lines[i].replace(/<[^>]+>/g, '').trim() === '') break;
                        group.push(lines[i]);
                        i++;
                    }
                }

                result.push(`<span class="line-add">${group.join('\n')}</span>`);
            } else {
                result.push(lines[i]);
                i++;
            }
        }

        code.innerHTML = result.join('\n');
    });
}

function initLineHighlights(container) {
    container.querySelectorAll('pre[data-add]').forEach(pre => {
        const code = pre.querySelector('code');
        if (!code) return;
        const targets = pre.dataset.add.split('|').map(s => s.trim());
        const lines = code.innerHTML.split('\n');

        const result = [];
        let i = 0;
        while (i < lines.length) {
            const plain = lines[i].replace(/<[^>]+>/g, '');
            const match = targets.some(t => plain.includes(t));
            if (match) {
                const group = [lines[i]];
                let j = i + 1;
                while (j < lines.length) {
                    const nextPlain = lines[j].replace(/<[^>]+>/g, '');
                    if (targets.some(t => nextPlain.includes(t))) {
                        group.push(lines[j]);
                        j++;
                    } else {
                        break;
                    }
                }
                result.push(`<span class="line-add">${group.join('\n')}</span>`);
                i = j;
            } else {
                result.push(lines[i]);
                i++;
            }
        }
        code.innerHTML = result.join('\n');
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

async function initCarousel(container) {
    for (const carousel of container.querySelectorAll('.carousel')) {
        const path = carousel.dataset.path;
        if (!path) continue;

        // Auto-detecta imagens tentando carregar em sequência até a primeira falhar
        const srcs = await new Promise(resolve => {
            const found = [];
            function tryNext(i) {
                const img = new Image();
                img.onload  = () => { found.push(`${path}${i}.png`); tryNext(i + 1); };
                img.onerror = () => resolve(found);
                img.src = `${path}${i}.png`;
            }
            tryNext(1);
        });

        if (srcs.length === 0) continue;
        const count = srcs.length;

        const track = document.createElement('div');
        track.className = 'carousel-track';

        const slides = [];
        for (let i = 0; i < count; i++) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.src = srcs[i];
            img.alt = `Imagem ${i + 1} de ${count}`;
            slide.appendChild(img);
            track.appendChild(slide);
            slides.push(slide);
        }

        const svgL = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
        const svgR = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

        const btnPrev = document.createElement('button');
        btnPrev.className = 'carousel-btn carousel-btn--prev';
        btnPrev.title     = 'Anterior';
        btnPrev.innerHTML = svgL;

        const btnNext = document.createElement('button');
        btnNext.className = 'carousel-btn carousel-btn--next';
        btnNext.title     = 'Próxima';
        btnNext.innerHTML = svgR;

        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'carousel-dots';
        const dots = [];
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.title     = `Imagem ${i + 1}`;
            dotsWrap.appendChild(dot);
            dots.push(dot);
        }

        carousel.appendChild(track);
        carousel.appendChild(btnPrev);
        carousel.appendChild(btnNext);
        carousel.appendChild(dotsWrap);

        let current = 0;

        function goTo(idx) {
            current = (idx + count) % count;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        btnPrev.addEventListener('click', () => goTo(current - 1));
        btnNext.addEventListener('click', () => goTo(current + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

        // Lightbox
        function openLightbox(idx) {
            let lbIdx = idx;
            const lb  = document.createElement('div');
            lb.className = 'carousel-lightbox';

            const img = document.createElement('img');
            img.src = srcs[lbIdx];
            img.alt = `Imagem ${lbIdx + 1}`;

            const lbPrev = document.createElement('button');
            lbPrev.className = 'carousel-lb-btn carousel-lb-btn--prev';
            lbPrev.title     = 'Anterior';
            lbPrev.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

            const lbNext = document.createElement('button');
            lbNext.className = 'carousel-lb-btn carousel-lb-btn--next';
            lbNext.title     = 'Próxima';
            lbNext.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

            function lbGoTo(newIdx) {
                lbIdx    = (newIdx + count) % count;
                img.src  = srcs[lbIdx];
                goTo(lbIdx);
            }

            lbPrev.addEventListener('click', e => { e.stopPropagation(); lbGoTo(lbIdx - 1); });
            lbNext.addEventListener('click', e => { e.stopPropagation(); lbGoTo(lbIdx + 1); });

            lb.appendChild(lbPrev);
            lb.appendChild(img);
            lb.appendChild(lbNext);
            lb.addEventListener('click', () => lb.remove());

            document.addEventListener('keydown', function lbKey(e) {
                if (e.key === 'Escape')     { lb.remove(); document.removeEventListener('keydown', lbKey); }
                if (e.key === 'ArrowLeft')  lbGoTo(lbIdx - 1);
                if (e.key === 'ArrowRight') lbGoTo(lbIdx + 1);
            });

            document.body.appendChild(lb);
        }

        slides.forEach((slide, i) => slide.addEventListener('click', () => openLightbox(i)));

        // Teclado: ← →
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft')  goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });
    }
}

function initTopnav(inner) {
    const topnav = document.getElementById('topnav');
    if (!topnav) return;
    topnav.classList.remove('visible');
    topnav.innerHTML = '';

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
    const isOpen = drawer.classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
    localStorage.setItem('drawerOpen', isOpen);

    if (window.innerWidth <= 768) {
        let overlay = document.getElementById('drawer-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'drawer-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:149;';
            overlay.addEventListener('click', () => toggleDrawer());
            document.body.appendChild(overlay);
        }
        overlay.style.display = isOpen ? 'block' : 'none';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('drawerOpen') === 'true') {
        document.getElementById('drawer').classList.add('open');
        document.getElementById('hamburger').classList.add('open');
        if (window.innerWidth <= 768) {
            const overlay = document.createElement('div');
            overlay.id = 'drawer-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:149;';
            overlay.addEventListener('click', () => toggleDrawer());
            document.body.appendChild(overlay);
            overlay.style.display = 'block';
        }
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

function toggleChapter(header) {
    const clicked = header.closest('.chapter');
    const isCollapsed = clicked.classList.contains('collapsed');
    document.querySelectorAll('.chapter').forEach(c => c.classList.add('collapsed'));
    if (isCollapsed) {
        clicked.classList.remove('collapsed');
        setTimeout(() => {
            const top = clicked.getBoundingClientRect().top + window.scrollY - 52 - 24;
            window.scrollTo({ top, behavior: 'smooth' });
        }, 10);
    }
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

