﻿// =====================================================================
// LAYOUT.JS — Estrutura completa da documentação Nexus
//
// Único script necessário em cada HTML. Faz tudo:
//   1. Injeta CSS (docs.css, highlight.js themes, font-awesome)
//   2. Monta a estrutura (topbar, drawer, content-inner, footer)
//   3. Gera breadcrumb automaticamente a partir do path
//   4. Monta menu lateral e rodapé
//   5. Inicializa componentes (áudio, carrossel, syntax highlight, etc.)
//   6. Restaura estado (drawer, tema, zoom) do localStorage
//
// Cada HTML precisa apenas:
//   <script src="[basePath]js/layout.js"></script>
//
// Incorpora: menu.js + footer.js + docs.js
// =====================================================================

(function() {
'use strict';

// ─── Dados do Menu ─────────────────────────────────────────────────

var MENU = [
    {
        grupo: 'FUNDAMENTOS',
        pagina: 'fundamentos.html',
        subgrupos: [
            { label: 'JAVA',         href: '1-java/java.html',               pasta: '1-java' },
            { label: 'SQL',          href: '2-sql/sql.html',                 pasta: '2-sql' },
            { label: 'MODELO DE REDE',   href: '3-modelo-rede/modelo-rede.html',   pasta: '3-modelo-rede' },
            { label: 'HTML-CSS-JS',  href: '4-html-css-js/html-css-js.html', pasta: '4-html-css-js' },
            { label: 'HARDWARE',     href: '5-hardware/hardware.html',       pasta: '5-hardware' },
            { label: 'GIT',          href: '6-git/git.html',                 pasta: '6-git' },
            { label: 'ALGORITMOS',   href: '10-algoritmos/algoritmos.html',  pasta: '10-algoritmos' },
            { label: 'CS50',         href: '11-cs50/cs50.html',              pasta: '11-cs50' }
        ],
        subpastas: ['1-java', '2-sql', '3-modelo-rede', '4-html-css-js', '5-hardware', '6-git', '10-algoritmos', '11-cs50'],
        pasta: '1-fundamentos'
    },
    {
        grupo: 'CS50',
        pagina: 'cs50.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: '1 - Tudo Vira Número', arquivo: '1-tudo-vira-numero/1-tudo-vira-numero.html', tipo: 'check' },
            { label: '2 - Algoritmo e Pseudocódigo', arquivo: '2-algoritmo-e-pseudocodigo/2-algoritmo-e-pseudocodigo.html', tipo: 'check' },
            { label: '3 - Scratch na Prática', arquivo: '3-scratch-na-pratica/3-scratch-na-pratica.html', tipo: 'check' }
        ],
        pasta: '11-cs50',
        basePath: '1-fundamentos/11-cs50'
    },
    {
        grupo: 'JAVA',
        pagina: 'java.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: '1 - Visão Geral', arquivo: '1-visao-geral/1-visao-geral.html', tipo: 'check' },
            { label: '2 - Classes e Objetos', arquivo: '2-classes-objetos/2-classes-objetos.html', tipo: 'check' },
            { label: '3 - Os 4 Pilares da POO', arquivo: '3-os-4-pilares-poo/3-os-4-pilares-poo.html', tipo: 'check' },
            { label: '4 - Coletor de Lixo', arquivo: '4-coletor-de-lixo/4-coletor-de-lixo.html', tipo: 'check' }
        ],
        pasta: '1-java',
        basePath: '1-fundamentos/1-java'
    },
    {
        grupo: 'Classes e Objetos',
        pagina: '2-classes-objetos.html',
        parent: { label: 'JAVA', href: '1-fundamentos/1-java/java.html' },
        hidden: true,
        items: [
            { label: 'Visão Geral', arquivo: '2-classes-objetos.html', tipo: 'check' },
            { label: 'Molde e Instância', arquivo: '1-molde-e-instancia/1-molde-e-instancia.html', tipo: 'check' },
            { label: 'Anatomia da Classe', arquivo: '2-anatomia-classe/2-anatomia-classe.html', tipo: 'check' }
        ],
        pasta: '2-classes-objetos',
        basePath: '1-fundamentos/1-java/2-classes-objetos'
    },
    {
        grupo: 'SQL',
        pagina: 'sql.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: '1 - Visão Geral',     arquivo: '1-visao-geral/1-visao-geral.html',         tipo: 'check' },
            { label: '2 - Backup',          arquivo: '2-backup/backup.html',                     tipo: 'check' },
            { label: '3 - CRUD',            arquivo: '3-crud/crud.html',                         tipo: 'check' },
            { label: '4 - Relacionamentos', arquivo: '4-relacionamentos/4-relacionamentos.html', tipo: 'check' },
            { label: '5 - Migration',       arquivo: '5-migration/migration.html',               tipo: 'check' },
            { label: '6 - Índices',         arquivo: '6-indices/indices.html',                   tipo: 'check' }
        ],
        pasta: '2-sql',
        basePath: '1-fundamentos/2-sql'
    },
    {
        grupo: 'RELACIONAMENTOS',
        pagina: '4-relacionamentos.html',
        parent: { label: 'SQL', href: '1-fundamentos/2-sql/sql.html' },
        hidden: true,
        items: [
            { label: '1 - Visão Geral', arquivo: '1-visao-geral/1-visao-geral.html', tipo: 'check' }
        ],
        pasta: '4-relacionamentos',
        basePath: '1-fundamentos/2-sql/4-relacionamentos'
    },
    {
        grupo: 'MODELO DE REDE',
        pagina: 'modelo-rede.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: 'Modelo OSI',    arquivo: '1-modelo-osi/1-modelo-osi.html', tipo: 'check' }
        ],
        pasta: '3-modelo-rede',
        basePath: '1-fundamentos/3-modelo-rede'
    },
    {
        grupo: 'MODELO OSI',
        pagina: '1-modelo-osi.html',
        parent: { label: 'MODELO DE REDE', href: '1-fundamentos/3-modelo-rede/modelo-rede.html' },
        hidden: true,
        items: [
            { label: 'Cards',         arquivo: '1-modelo-osi.html', tipo: 'check' },
            { label: 'Visão Geral',   arquivo: '0-visao-geral/0-visao-geral.html', tipo: 'check' },
            { label: 'Aplicação',     arquivo: '7-aplicacao/7-aplicacao.html', tipo: 'check' },
            { label: 'Apresentação',  arquivo: '6-apresentacao/6-apresentacao.html', tipo: 'check' },
            { label: 'Sessão',        arquivo: '5-sessao/5-sessao.html', tipo: 'check' },
            { label: 'Transporte',    arquivo: '4-transporte/4-transporte.html', tipo: 'check' },
            { label: 'Rede',          arquivo: '3-rede/3-rede.html', tipo: 'check' },
            { label: 'Enlace',        arquivo: '2-enlace/2-enlace.html', tipo: 'check' },
            { label: 'Física',        arquivo: '1-fisica/1-fisica.html', tipo: 'check' }
        ],
        pasta: '1-modelo-osi',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi'
    },
    {
        grupo: 'HTML-CSS-JS',
        pagina: 'html-css-js.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: '1 - Visão Geral', arquivo: '1-visao-geral/1-visao-geral.html', tipo: 'check' },
            { label: '2 - HTML',        arquivo: '2-html/2-html.html',               tipo: 'check' },
            { label: '3 - CSS',         arquivo: '3-css/3-css.html',                 tipo: 'check' },
            { label: '4 - JavaScript',  arquivo: '4-javascript/4-javascript.html',   tipo: 'check' },
            { label: '5 - Interfaces Que Se Ajustam', arquivo: '5-interfaces-que-se-ajustam/5-interfaces-que-se-ajustam.html', tipo: 'check' }
        ],
        pasta: '4-html-css-js',
        basePath: '1-fundamentos/4-html-css-js'
    },
    {
        grupo: 'INTERFACES QUE SE AJUSTAM',
        pagina: '5-interfaces-que-se-ajustam.html',
        parent: { label: 'HTML-CSS-JS', href: '1-fundamentos/4-html-css-js/html-css-js.html' },
        hidden: true,
        items: [
            { label: '1 - Por Que o Desenho Corta',     arquivo: '1-por-que-o-desenho-corta/1-por-que-o-desenho-corta.html', tipo: 'check' },
            { label: '2 - Layout Que Preenche o Espaço', arquivo: '2-layout-que-preenche-o-espaco/2-layout-que-preenche-o-espaco.html', tipo: 'check' },
            { label: '3 - Medir Antes de Decidir',       arquivo: '3-medir-antes-de-decidir/3-medir-antes-de-decidir.html', tipo: 'check' },
            { label: '4 - Quando o Dado Some',           arquivo: '4-quando-o-dado-some/4-quando-o-dado-some.html', tipo: 'check' }
        ],
        pasta: '5-interfaces-que-se-ajustam',
        basePath: '1-fundamentos/4-html-css-js/5-interfaces-que-se-ajustam'
    },
    {
        grupo: 'ALGORITMOS',
        pagina: 'algoritmos.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: '1 - Visão Geral',            arquivo: '1-visao-geral/algoritmo.html',                     tipo: 'check' },
            { label: '2 - Estruturas de Controle', arquivo: '2-estruturas-controle/2-estruturas-controle.html', tipo: 'check' },
            { label: '3 - Funções e Recursão',     arquivo: '3-funcoes-recursao/3-funcoes-recursao.html',       tipo: 'check' },
            { label: '4 - Big O',                  arquivo: '4-big-o/4-big-o.html',                             tipo: 'check' },
            { label: '5 - Arrays e Listas',        arquivo: '5-arrays-listas/5-arrays-listas.html',             tipo: 'check' },
            { label: '6 - Pilha e Fila',           arquivo: '6-pilha-fila/6-pilha-fila.html',                   tipo: 'check' },
            { label: '7 - Hash / Dicionário',      arquivo: '7-hash-dicionario/7-hash-dicionario.html',         tipo: 'check' },
            { label: '8 - Árvores',                arquivo: '8-arvores/8-arvores.html',                         tipo: 'check' },
            { label: '9 - Grafos',                 arquivo: '9-grafos/9-grafos.html',                           tipo: 'check' },
            { label: '10 - Busca',                 arquivo: '10-busca/10-busca.html',                           tipo: 'check' },
            { label: '11 - Ordenação',             arquivo: '11-ordenacao/11-ordenacao.html',                   tipo: 'check' },
            { label: '12 - Avançados',             arquivo: '12-avancados/12-avancados.html',                   tipo: 'check' }
        ],
        pasta: '10-algoritmos',
        basePath: '1-fundamentos/10-algoritmos'
    },
    {
        grupo: 'VISÃO GERAL',
        pagina: '0-visao-geral.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '0-visao-geral',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/0-visao-geral'
    },
    {
        grupo: 'REDE',
        pagina: '3-rede.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '3-rede',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/3-rede'
    },
    {
        grupo: 'APRESENTAÇÃO',
        pagina: '6-apresentacao.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '6-apresentacao',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/6-apresentacao'
    },
    {
        grupo: 'SESSÃO',
        pagina: '5-sessao.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '5-sessao',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/5-sessao'
    },
    {
        grupo: 'TRANSPORTE',
        pagina: '4-transporte.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '4-transporte',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/4-transporte'
    },
    {
        grupo: 'ENLACE',
        pagina: '2-enlace.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '2-enlace',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/2-enlace'
    },
    {
        grupo: 'FÍSICA',
        pagina: '1-fisica.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        pasta: '1-fisica',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-fisica'
    },
    {
        grupo: 'APLICAÇÃO',
        pagina: '7-aplicacao.html',
        parent: { label: 'MODELO OSI', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/1-modelo-osi.html' },
        hidden: true,
        items: [
            { label: 'Visão Geral', arquivo: '7-aplicacao.html', tipo: 'check' },
            { label: 'HTTP',        arquivo: 'http/http.html', tipo: 'check' }
        ],
        pasta: '7-aplicacao',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/7-aplicacao'
    },
    {
        grupo: 'HTTP',
        pagina: 'http.html',
        parent: { label: 'APLICAÇÃO', href: '1-fundamentos/3-modelo-rede/1-modelo-osi/7-aplicacao/7-aplicacao.html' },
        hidden: true,
        pasta: 'http',
        basePath: '1-fundamentos/3-modelo-rede/1-modelo-osi/7-aplicacao/http'
    },
    {
        grupo: 'HARDWARE',
        pagina: 'hardware.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        pasta: '5-hardware',
        basePath: '1-fundamentos/5-hardware'
    },
    {
        grupo: 'GIT',
        pagina: 'git.html',
        parent: { label: 'FUNDAMENTOS', href: '1-fundamentos/fundamentos.html' },
        hidden: true,
        items: [
            { label: 'Cards',              arquivo: 'git.html', tipo: 'check' },
            { label: '1 - Visão Geral',    arquivo: '1-visao-geral/visao-geral.html', tipo: 'check' },
            { label: '2 - Setup',          arquivo: '2-setup/2-setup.html', tipo: 'check' },
            { label: '3 - Primeiro ciclo', arquivo: '3-primeiro-ciclo/3-primeiro-ciclo.html', tipo: 'check' },
            { label: '4 - Histórico',      arquivo: '4-historico/4-historico.html', tipo: 'check' }
        ],
        pasta: '6-git',
        basePath: '1-fundamentos/6-git'
    },
    {
        grupo: 'JASAP',
        pagina: 'jasap.html',
        subgrupos: [
            { label: 'NOVO MÓDULO', href: '1-novo-modulo/novo-modulo.html', pasta: '1-novo-modulo' },
            { label: 'CRUD',        href: '2-crud/crud.html',               pasta: '2-crud' },
            { label: 'MANAGER',     href: '1-Manager/1-Manager.html',       pasta: '1-Manager' }
        ],
        subpastas: ['1-novo-modulo', '2-crud', '1-Manager'],
        pasta: '2-jasap'
    },
    {
        grupo: 'NOVO MÓDULO',
        pagina: 'novo-modulo.html',
        parent: { label: 'JASAP', href: '2-jasap/jasap.html' },
        hidden: true,
        items: [
            { label: '1 - Home',     arquivo: '1-DepartamentoHome/1-DepartamentoHome.html',   tipo: 'novo' },
            { label: '2 - Manager',   arquivo: '2-DepartamentoManager/2-DepartamentoManager.html', tipo: 'novo' },
            { label: '3 - MdFactory', arquivo: '3-DepartamentoMdFactory/3-DepartamentoMdFactory.html', tipo: 'novo' },
            { label: '4 - AppsRootModelFactory',  arquivo: '4-AppsRootModelFactory/4-AppsRootModelFactory.html', tipo: 'editar' },
            { label: '5 - PnlCfg',               arquivo: '5-PnlCfg/5-PnlCfg.html',                     tipo: 'editar' },
            { label: '6 - RootManager',           arquivo: '6-RootManager/6-RootManager.html',             tipo: 'editar' },
            { label: '7 - HomeDesk',              arquivo: '7-HomeDesk/7-HomeDesk.html',                   tipo: 'editar' }
        ],
        pasta: '1-novo-modulo',
        basePath: '2-jasap/1-novo-modulo'
    },
    {
        grupo: 'CRUD',
        pagina: 'crud.html',
        parent: { label: 'JASAP', href: '2-jasap/jasap.html' },
        hidden: true,
        subgrupos: [
            { label: 'READ',   href: '1-crud-read/crud-read.html',   pasta: '1-crud-read' },
            { label: 'DELETE', href: '2-crud-delete/crud-delete.html', pasta: '2-crud-delete' },
            { label: 'CREATE', href: '3-crud-create/crud-create.html', pasta: '3-crud-create' },
            { label: 'UPDATE', href: '4-crud-update/crud-update.html', pasta: '4-crud-update' },
            { label: 'FUNCIONALIDADES', href: '5-funcionalidades/funcionalidades.html', pasta: '5-funcionalidades' }
        ],
        subpastas: ['1-crud-read', '2-crud-delete', '3-crud-create', '4-crud-update', '5-funcionalidades'],
        pasta: '2-crud',
        basePath: '2-jasap/2-crud'
    },
    {
        grupo: 'READ',
        pagina: 'crud-read.html',
        parent: { label: 'CRUD', href: '2-jasap/2-crud/crud.html' },
        hidden: true,
        items: [
            { label: '1 - Produto Bean',   arquivo: '1-DepartamentoProdutoBean/1-DepartamentoProdutoBean.html',   tipo: 'novo' },
            { label: '2 - Produto WBean',  arquivo: '2-DepartamentoProdutoWBean/2-DepartamentoProdutoWBean.html', tipo: 'novo' },
            { label: '3 - Produto DAO',    arquivo: '3-DepartamentoProdutoDAO/3-DepartamentoProdutoDAO.html',     tipo: 'novo' },
            { label: '4 - Produto Model',  arquivo: '4-DepartamentoProdutoModel/4-DepartamentoProdutoModel.html', tipo: 'novo' },
            { label: '5 - Produto Action', arquivo: '5-DepartamentoProdutoAction/5-DepartamentoProdutoAction.html', tipo: 'novo' },
            { label: '6 - getManager',                arquivo: '6-getManager/6-getManager.html',                             tipo: 'editar' },
            { label: '7 - MdFactory',     arquivo: '7-DepartamentoMdFactory/7-DepartamentoMdFactory.html',       tipo: 'editar' },
            { label: '8 - Produto List',   arquivo: '8-DepartamentoProdutoList/8-DepartamentoProdutoList.html',   tipo: 'novo' },
            { label: '9 - Home',          arquivo: '9-DepartamentoHome/9-DepartamentoHome.html',                 tipo: 'editar' }
        ],
        pasta: '1-crud-read',
        basePath: '2-jasap/2-crud/1-crud-read'
    },
    {
        grupo: 'CREATE',
        pagina: 'crud-create.html',
        parent: { label: 'CRUD', href: '2-jasap/2-crud/crud.html' },
        hidden: true,
        items: [
            { label: '1 - Produto DAO + Model', arquivo: '1-DepartamentoProdutoDAO/1-DepartamentoProdutoDAO.html', tipo: 'editar' },
            { label: '2 - Produto Action',      arquivo: '2-DepartamentoProdutoAction/2-DepartamentoProdutoAction.html', tipo: 'editar' },
            { label: '3 - Produto Form',        arquivo: '3-DepartamentoProdutoForm/3-DepartamentoProdutoForm.html', tipo: 'novo' },
            { label: '4 - Produto List',        arquivo: '4-DepartamentoProdutoList/4-DepartamentoProdutoList.html', tipo: 'editar' },
            { label: '5 - Manager',            arquivo: '5-DepartamentoManager/5-DepartamentoManager.html', tipo: 'editar' }
        ],
        pasta: '3-crud-create',
        basePath: '2-jasap/2-crud/3-crud-create'
    },
    {
        grupo: 'DELETE',
        pagina: 'crud-delete.html',
        parent: { label: 'CRUD', href: '2-jasap/2-crud/crud.html' },
        hidden: true,
        items: [
            { label: '1 - Produto DAO',  arquivo: '1-DepartamentoProdutoDAO/1-DepartamentoProdutoDAO.html',  tipo: 'editar' },
            { label: '2 - Produto List',  arquivo: '2-DepartamentoProdutoList/2-DepartamentoProdutoList.html',  tipo: 'editar' },
            { label: '3 - Manager',      arquivo: '3-DepartamentoManager/3-DepartamentoManager.html',      tipo: 'editar' }
        ],
        pasta: '2-crud-delete',
        basePath: '2-jasap/2-crud/2-crud-delete'
    },
    {
        grupo: 'UPDATE',
        pagina: 'crud-update.html',
        parent: { label: 'CRUD', href: '2-jasap/2-crud/crud.html' },
        hidden: true,
        items: [
            { label: '1 - Produto DAO + Model', arquivo: '1-DepartamentoProdutoDAO/1-DepartamentoProdutoDAO.html', tipo: 'editar' },
            { label: '2 - Produto Action',      arquivo: '2-DepartamentoProdutoAction/2-DepartamentoProdutoAction.html', tipo: 'editar' },
            { label: '3 - Produto Form',        arquivo: '3-DepartamentoProdutoForm/3-DepartamentoProdutoForm.html', tipo: 'editar' },
            { label: '4 - Produto List',        arquivo: '4-DepartamentoProdutoList/4-DepartamentoProdutoList.html', tipo: 'editar' },
            { label: '5 - Manager',            arquivo: '5-DepartamentoManager/5-DepartamentoManager.html', tipo: 'editar' }
        ],
        pasta: '4-crud-update',
        basePath: '2-jasap/2-crud/4-crud-update'
    },
    {
        grupo: 'FUNCIONALIDADES',
        pagina: 'funcionalidades.html',
        parent: { label: 'CRUD', href: '2-jasap/2-crud/crud.html' },
        hidden: true,
        items: [
            { label: '1 - Sort',           arquivo: '1-sort/sort.html',                   tipo: 'editar' },
            { label: '2 - QuickSearch',    arquivo: '2-quicksearch/quicksearch.html',     tipo: 'check' },
            { label: '3 - Insert Chk',     arquivo: '3-insert-chk/insert-chk.html',       tipo: 'check' },
            { label: '4 - Paginação',      arquivo: '4-paginacao/paginacao.html',         tipo: 'check' },
            { label: '5 - Tabs Status',    arquivo: '5-tabs-status/tabs-status.html',     tipo: 'check' },
            { label: '6 - Delete no Form', arquivo: '6-delete-form/delete-form.html',     tipo: 'editar' },
            { label: '7 - LinkBox',        arquivo: '7-linkbox/linkbox.html',             tipo: 'check' },
            { label: '8 - Master/Detail',  arquivo: '8-master-detail/master-detail.html', tipo: 'check' }
        ],
        pasta: '5-funcionalidades',
        basePath: '2-jasap/2-crud/5-funcionalidades'
    },
    {
        grupo: 'LINKBOX',
        pagina: 'linkbox.html',
        parent: { label: 'FUNCIONALIDADES', href: '2-jasap/2-crud/5-funcionalidades/funcionalidades.html' },
        hidden: true,
        items: [
            { label: 'Visão Geral',                 arquivo: 'linkbox.html',                                                    tipo: 'check' },
            { label: '1 - Produto Bean',   arquivo: '1-DepartamentoProdutoBean/1-DepartamentoProdutoBean.html',     tipo: 'editar' },
            { label: '2 - Pessoa Select',  arquivo: '2-DepartamentoPessoaSelect/2-DepartamentoPessoaSelect.html',   tipo: 'novo' },
            { label: '3 - Produto Form',   arquivo: '3-DepartamentoProdutoForm/3-DepartamentoProdutoForm.html',     tipo: 'editar' },
            { label: '4 - Manager',       arquivo: '4-DepartamentoManager/4-DepartamentoManager.html',             tipo: 'editar' }
        ],
        pasta: '7-linkbox',
        basePath: '2-jasap/2-crud/5-funcionalidades/7-linkbox'
    },
    {
        grupo: 'MASTER/DETAIL',
        pagina: 'master-detail.html',
        parent: { label: 'FUNCIONALIDADES', href: '2-jasap/2-crud/5-funcionalidades/funcionalidades.html' },
        hidden: true,
        items: [
            { label: 'Visão Geral', arquivo: 'master-detail.html', tipo: 'check' }
        ],
        pasta: '8-master-detail',
        basePath: '2-jasap/2-crud/5-funcionalidades/8-master-detail'
    },
    {
        grupo: 'INTERFACE',
        pagina: 'interface.html',
        items: [
            { label: '1 - Visão Geral', arquivo: '1-visao-geral/1-visao-geral.html', tipo: 'check' },
            { label: '2 - Player de Áudio', arquivo: '2-player-de-audio/2-player-de-audio.html', tipo: 'check' },
            { label: '3 - Card de Imagem', arquivo: '3-card-de-imagem/3-card-de-imagem.html', tipo: 'novo' }
        ],
        pasta: '7-interface',
        basePath: '7-interface'
    },
    {
        grupo: 'VMIX',
        pagina: 'vmix.html',
        items: [
            { label: '1 - Visão Geral', arquivo: '1-visao-geral/1-visao-geral.html', tipo: 'check' },
            { label: '2 - Áudio', arquivo: '2-audio/2-audio.html', tipo: 'check' },
            { label: '3 - Decibel e Gain', arquivo: '3-decibel-gain/3-decibel-gain.html', tipo: 'check' },
            { label: '4 - Audio Outputs', arquivo: '4-audio-outputs/4-audio-outputs.html', tipo: 'novo' },
            { label: '5 - Saídas de Áudio', arquivo: '5-saidas-audio/5-saidas-audio.html', tipo: 'novo' }
        ],
        pasta: '12-vmix',
        basePath: '12-vmix'
    },
    {
        grupo: 'OUTROS',
        pagina: 'outros.html',
        items: [
            { label: '1 - Escondendo a Lista do WhatsApp', arquivo: '1-escondendo-a-lista-do-whatsapp/1-escondendo-a-lista-do-whatsapp.html', tipo: 'check' },
            { label: '2 - Um Monitor Flutuante', arquivo: '2-um-monitor-flutuante/2-um-monitor-flutuante.html', tipo: 'check' }
        ],
        pasta: '13-outros',
        basePath: '13-outros'
    },
    {
        grupo: 'CLAUDE',
        pagina: 'claude.html',
        items: [
            { label: '1 - Carta Aberta', arquivo: '1-carta-aberta/1-carta-aberta.html', tipo: 'check' }
        ],
        pasta: '8-claude',
        basePath: '8-claude'
    },
    {
        grupo: 'INGLES',
        pagina: 'ingles.html',
        items: [
            { label: 'Cards', arquivo: 'ingles.html', tipo: 'check' },
            { label: '1 - Starter', arquivo: '1-starter/1-starter.html', tipo: 'check' },
            { label: '1.1 - Mapa Inicial', arquivo: '1-starter/1-mapa-inicial/1-mapa-inicial.html', tipo: 'check' },
            { label: '1.2 - Primeiras Frases', arquivo: '1-starter/2-primeiras-frases/2-primeiras-frases.html', tipo: 'check' }
        ],
        pasta: '9-ingles',
        basePath: '9-ingles'
    },
    {
        grupo: 'ESFERA',
        pagina: 'esfera.html',
        items: [
            { label: 'Cards', arquivo: 'esfera.html', tipo: 'check' },
            { label: '1 - Config PTZ', arquivo: '1-config-ptz/1-config-ptz.html', tipo: 'check' }
        ],
        pasta: '14-esfera',
        basePath: '14-esfera'
    },
    {
        grupo: 'DLA',
        pagina: 'dla.html',
        items: [
            { label: '1 - Dia 1 - Pensamento Algorítmico', arquivo: '1-dia-1/1-dia-1.html', tipo: 'check' }
        ],
        pasta: '15-dla',
        basePath: '15-dla'
    },
    {
        grupo: 'SERVIDOR',
        pagina: 'servidor.html',
        subgrupos: [
            { label: 'VISAO GERAL',         href: '0-visao-geral/visao-geral.html',             pasta: '0-visao-geral' },
            { label: 'ACESSO & SETUP',      href: '1-acesso/acesso.html',                       pasta: '1-acesso' },
            { label: 'SITE EM DOCKER',      href: '6-site-docker/site-docker.html',             pasta: '6-site-docker' },
            { label: 'BACKUP & PERSISTENCIA', href: '7-backup-persistencia/backup-persistencia.html', pasta: '7-backup-persistencia' },
            { label: 'TOMCAT',              href: '2-tomcat/tomcat.html',                       pasta: '2-tomcat' },
            { label: 'POSTGRESQL',          href: '3-postgresql/postgresql.html',               pasta: '3-postgresql' },
            { label: 'TAILSCALE',           href: '4-tailscale/tailscale.html',                 pasta: '4-tailscale' },
            { label: 'CLOUDFLARE TUNNEL',   href: '5-cloudflare/cloudflare.html',               pasta: '5-cloudflare' }
        ],
        subpastas: ['0-visao-geral', '1-acesso', '6-site-docker', '7-backup-persistencia', '2-tomcat', '3-postgresql', '4-tailscale', '5-cloudflare'],
        pasta: '10-servidor'
    },
    {
        grupo: 'NEXUS',
        pagina: 'nexus.html',
        subgrupos: [
            { label: 'COMPONENTES',     href: '1-componentes/componentes.html',  pasta: '1-componentes' },
            { label: 'FASE 0 - SETUP',  href: '2-fase-0/fase-0.html',            pasta: '2-fase-0' },
            { label: 'FASE 1 - MVP',    href: '3-fase-1/fase-1.html',            pasta: '3-fase-1' },
            { label: 'FAXINA - FASE 1', href: '4-fase-1-faxina/fase-1-faxina.html', pasta: '4-fase-1-faxina' }
        ],
        subpastas: ['1-componentes', '2-fase-0', '3-fase-1', '4-fase-1-faxina'],
        pasta: '3-nexus'
    },
    {
        grupo: 'COMPONENTES',
        pagina: 'componentes.html',
        parent: { label: 'NEXUS', href: '3-nexus/nexus.html' },
        hidden: true,
        items: [
            { label: '1 - TOC', arquivo: '1-toc/toc.html', tipo: 'check' }
        ],
        pasta: '1-componentes',
        basePath: '3-nexus/1-componentes'
    },
    {
        grupo: 'FASE 0',
        pagina: 'fase-0.html',
        parent: { label: 'NEXUS', href: '3-nexus/nexus.html' },
        hidden: true,
        items: [
            { label: '1 - Visão Geral',           arquivo: '1-visao-geral/1-visao-geral.html',                         tipo: 'check' },
            { label: '2 - Setup do Ambiente',     arquivo: '2-setup-ambiente/2-setup-ambiente.html',                   tipo: 'check' },
            { label: '3 - Spring Initializr',     arquivo: '3-spring-initializr/3-spring-initializr.html',             tipo: 'check' },
            { label: '4 - application.yml',       arquivo: '4-application-yml/4-application-yml.html',                 tipo: 'check' },
            { label: '5 - Virtual Threads',       arquivo: '5-virtual-threads/5-virtual-threads.html',                 tipo: 'check' },
            { label: '6 - Spring Security',       arquivo: '6-spring-security-inicial/6-spring-security-inicial.html', tipo: 'check' },
            { label: '7 - Health Endpoint',       arquivo: '7-health-endpoint/7-health-endpoint.html',                 tipo: 'check' },
            { label: '8 - SvelteKit Setup',       arquivo: '8-sveltekit-setup/8-sveltekit-setup.html',                 tipo: 'check' },
            { label: '9 - Integração Fim a Fim',  arquivo: '9-integracao-fim-a-fim/9-integracao-fim-a-fim.html',       tipo: 'check' },
            { label: '10 - Carta do Claude',      arquivo: '10-carta-do-claude/10-carta-do-claude.html',               tipo: 'check' }
        ],
        pasta: '2-fase-0',
        basePath: '3-nexus/2-fase-0'
    },
    {
        grupo: 'FASE 1',
        pagina: 'fase-1.html',
        parent: { label: 'NEXUS', href: '3-nexus/nexus.html' },
        hidden: true,
        items: [
            { label: '01 - Visão Geral',         arquivo: '1-visao-geral/1-visao-geral.html',                 tipo: 'check' },
            { label: '02 - User e Migration',    arquivo: '2-user-e-migration/2-user-e-migration.html',       tipo: 'check' },
            { label: '03 - Auth e JWT',          arquivo: '3-auth-e-jwt/3-auth-e-jwt.html',                   tipo: 'check' },
            { label: '04 - Note e CRUD',         arquivo: '4-note-e-crud/4-note-e-crud.html',                 tipo: 'check' },
            { label: '05 - Frontend SvelteKit',  arquivo: '5-frontend-sveltekit/5-frontend-sveltekit.html',   tipo: 'check' },
            { label: '06 - Jornada do Cliente',  arquivo: '6-jornada-do-cliente/6-jornada-do-cliente.html',   tipo: 'check' }
        ],
        pasta: '3-fase-1',
        basePath: '3-nexus/3-fase-1'
    },
    {
        grupo: 'FAXINA - FASE 1',
        pagina: 'fase-1-faxina.html',
        parent: { label: 'NEXUS', href: '3-nexus/nexus.html' },
        hidden: true,
        items: [
            { label: '01 - Visão Geral',          arquivo: 'fase-1-faxina.html', tipo: 'check' },
            { label: '02 - História do Nome',     arquivo: 'fase-1-faxina.html', tipo: 'check' },
            { label: '03 - Validando o Build',    arquivo: 'fase-1-faxina.html', tipo: 'check' },
            { label: '04 - Evoluindo a Note',     arquivo: 'fase-1-faxina.html', tipo: 'check' },
            { label: '05 - Testes da Fase 1',     arquivo: 'fase-1-faxina.html', tipo: 'check' },
            { label: '06 - Refactor saveAndFlush',arquivo: 'fase-1-faxina.html', tipo: 'check' },
            { label: '07 - 401 vs 403',           arquivo: 'fase-1-faxina.html', tipo: 'check' }
        ],
        pasta: '4-fase-1-faxina',
        basePath: '3-nexus/4-fase-1-faxina'
    },
    {
        grupo: 'TESTES',
        pagina: 'testes.html',
        items: [
            { label: 'Visão Geral', arquivo: 'testes.html', tipo: 'check' }
        ],
        pasta: '4-testes',
        basePath: '4-testes'
    }
];

var FOOTER = {
    episodios: [
        {
            grupo: 'NOVO MÓDULO',
            items: [
                { label: 'Home',     arquivo: '1-DepartamentoHome/1-DepartamentoHome.html' },
                { label: 'Manager',   arquivo: '2-DepartamentoManager/2-DepartamentoManager.html' },
                { label: 'MdFactory', arquivo: '3-DepartamentoMdFactory/3-DepartamentoMdFactory.html' },
                { label: 'AppsRootModelFactory',  arquivo: '4-AppsRootModelFactory/4-AppsRootModelFactory.html' },
                { label: 'PnlCfg',               arquivo: '5-PnlCfg/5-PnlCfg.html' },
                { label: 'RootManager',           arquivo: '6-RootManager/6-RootManager.html' },
                { label: 'HomeDesk',              arquivo: '7-HomeDesk/7-HomeDesk.html' }
            ],
            pasta: '1-novo-modulo'
        },
        {
            grupo: 'READ',
            items: [
                { label: 'Produto Bean',   arquivo: '1-DepartamentoProdutoBean/1-DepartamentoProdutoBean.html' },
                { label: 'Produto WBean',  arquivo: '2-DepartamentoProdutoWBean/2-DepartamentoProdutoWBean.html' },
                { label: 'Produto DAO',    arquivo: '3-DepartamentoProdutoDAO/3-DepartamentoProdutoDAO.html' },
                { label: 'Produto Model',  arquivo: '4-DepartamentoProdutoModel/4-DepartamentoProdutoModel.html' },
                { label: 'Produto Action', arquivo: '5-DepartamentoProdutoAction/5-DepartamentoProdutoAction.html' },
                { label: 'getManager',                arquivo: '6-getManager/6-getManager.html' },
                { label: 'MdFactory',     arquivo: '7-DepartamentoMdFactory/7-DepartamentoMdFactory.html' },
                { label: 'Produto List',   arquivo: '8-DepartamentoProdutoList/8-DepartamentoProdutoList.html' },
                { label: 'Home',          arquivo: '9-DepartamentoHome/9-DepartamentoHome.html' }
            ],
            pasta: '1-crud-read',
            basePath: '2-jasap/2-crud/1-crud-read'
        },
        {
            grupo: 'CREATE',
            items: [
                { label: 'Produto DAO + Model', arquivo: '1-DepartamentoProdutoDAO/1-DepartamentoProdutoDAO.html' },
                { label: 'Produto Action',      arquivo: '2-DepartamentoProdutoAction/2-DepartamentoProdutoAction.html' },
                { label: 'Produto Form',         arquivo: '3-DepartamentoProdutoForm/3-DepartamentoProdutoForm.html' },
                { label: 'Produto List',        arquivo: '4-DepartamentoProdutoList/4-DepartamentoProdutoList.html' },
                { label: 'Manager',            arquivo: '5-DepartamentoManager/5-DepartamentoManager.html' }
            ],
            pasta: '3-crud-create',
            basePath: '2-jasap/2-crud/3-crud-create'
        },
        {
            grupo: 'DELETE',
            items: [
                { label: 'Produto DAO',  arquivo: '1-DepartamentoProdutoDAO/1-DepartamentoProdutoDAO.html' },
                { label: 'Produto List',  arquivo: '2-DepartamentoProdutoList/2-DepartamentoProdutoList.html' },
                { label: 'Manager',      arquivo: '3-DepartamentoManager/3-DepartamentoManager.html' }
            ],
            pasta: '2-crud-delete',
            basePath: '2-jasap/2-crud/2-crud-delete'
        },
        {
            grupo: 'UPDATE',
            items: [
                { label: 'Produto DAO + Model', arquivo: '1-DepartamentoProdutoDAO/1-DepartamentoProdutoDAO.html' },
                { label: 'Produto Action',      arquivo: '2-DepartamentoProdutoAction/2-DepartamentoProdutoAction.html' },
                { label: 'Produto Form',        arquivo: '3-DepartamentoProdutoForm/3-DepartamentoProdutoForm.html' },
                { label: 'Produto List',        arquivo: '4-DepartamentoProdutoList/4-DepartamentoProdutoList.html' },
                { label: 'Manager',            arquivo: '5-DepartamentoManager/5-DepartamentoManager.html' }
            ],
            pasta: '4-crud-update',
            basePath: '2-jasap/2-crud/4-crud-update'
        },
        {
            grupo: 'FUNCIONALIDADES',
            items: [
                { label: 'Sort',           arquivo: '1-sort/sort.html' },
                { label: 'QuickSearch',    arquivo: '2-quicksearch/quicksearch.html' },
                { label: 'Insert Chk',     arquivo: '3-insert-chk/insert-chk.html' },
                { label: 'Paginação',      arquivo: '4-paginacao/paginacao.html' },
                { label: 'Tabs Status',    arquivo: '5-tabs-status/tabs-status.html' },
                { label: 'Delete no Form', arquivo: '6-delete-form/delete-form.html' },
                { label: 'LinkBox',        arquivo: '7-linkbox/linkbox.html' },
                { label: 'Master/Detail',  arquivo: '8-master-detail/master-detail.html' }
            ],
            pasta: '5-funcionalidades',
            basePath: '2-jasap/2-crud/5-funcionalidades'
        },
        {
            grupo: 'LINKBOX',
            items: [
                { label: 'Produto Bean',   arquivo: '1-DepartamentoProdutoBean/1-DepartamentoProdutoBean.html' },
                { label: 'Pessoa Select',  arquivo: '2-DepartamentoPessoaSelect/2-DepartamentoPessoaSelect.html' },
                { label: 'Produto Form',   arquivo: '3-DepartamentoProdutoForm/3-DepartamentoProdutoForm.html' },
                { label: 'Manager',       arquivo: '4-DepartamentoManager/4-DepartamentoManager.html' }
            ],
            pasta: '7-linkbox',
            basePath: '2-jasap/2-crud/5-funcionalidades/7-linkbox'
        },
        {
            grupo: 'MASTER/DETAIL',
            items: [
                { label: 'Visão Geral', arquivo: 'master-detail.html' }
            ],
            pasta: '8-master-detail',
            basePath: '2-jasap/2-crud/5-funcionalidades/8-master-detail'
        }
    ],
    extras: [
        {
            grupo: 'Conceitos',
            items: [
                { label: 'O que é uma Action',     href: '#' },
                { label: 'O que é um Manager',      href: '#' },
                { label: 'O que é um DAO',          href: '#' },
                { label: 'O que é um Bean',         href: '#' },
                { label: 'Fluxo de uma requisição', href: '#' }
            ]
        },
        {
            grupo: 'Padrões',
            items: [
                { label: 'Nomenclatura de arquivos', href: '#' },
                { label: 'Constante ROOT',           href: '#' },
                { label: 'Campo qs_xxx',             href: '#' },
                { label: 'LinkBox e FK',             href: '#' },
                { label: 'Detail e N-N',             href: '#' }
            ]
        },
        {
            grupo: 'Referências',
            items: [
                { label: 'CLAUDE.md',            href: '#' },
                { label: 'Jasap — código-fonte', href: '#' },
                { label: 'app — modelo',         href: '#' },
                { label: 'Banco PRD_TREINAMENTO', href: '#' }
            ]
        }
    ]
};

// ─── Base path (derivado do src do próprio script) ─────────────────

var BASE = document.currentScript.getAttribute('src').replace('js/layout.js', '');

// ─── Injetar CSS imediatamente (antes do DOM estar pronto) ─────────

(function injectCSS() {
    var head = document.head;

    // Esconder body até layout estar pronto (evita FOUC)
    var hide = document.createElement('style');
    hide.id = 'layout-hide';
    hide.textContent = 'body{visibility:hidden}';
    head.appendChild(hide);

    // Loader: barra fina azul no topo (0 â†’ 100%), página fica branca durante o load
    var loaderStyle = document.createElement('style');
    loaderStyle.id = 'page-loader-style';
    loaderStyle.textContent =
        '#page-loader{position:fixed;top:0;left:0;height:3px;width:0%;z-index:99999;' +
        'background:linear-gradient(90deg,#3b82f6 0%,#2563eb 50%,#1d4ed8 100%);' +
        'box-shadow:0 0 10px rgba(59,130,246,0.7),0 0 5px rgba(59,130,246,0.5);' +
        'transition:width 0.2s ease-out,opacity 0.3s ease;opacity:1}' +
        '#page-loader.done{opacity:0}';
    head.appendChild(loaderStyle);

    // Inicia o loader (barra) — funciona mesmo com body invisible porque fica no <html>
    var addLoader = function() {
        if (document.documentElement) {
            window.__startPageLoader();
        } else {
            setTimeout(addLoader, 0);
        }
    };
    // Funções globais para iniciar/finalizar o loader (também usadas na transição entre páginas)
    window.__pageLoaderTrickle = null;
    window.__startPageLoader = function() {
        if (document.getElementById('page-loader')) return;
        var loader = document.createElement('div');
        loader.id = 'page-loader';
        document.documentElement.appendChild(loader);
        // Progresso simulado: cresce rápido no início, devagar perto de 90%
        var progress = 0;
        window.__pageLoaderTrickle = setInterval(function() {
            var step;
            if (progress < 30)      step = Math.random() * 10 + 5;
            else if (progress < 60) step = Math.random() * 5 + 2;
            else if (progress < 85) step = Math.random() * 2 + 0.5;
            else                    step = Math.random() * 0.5;
            progress += step;
            if (progress > 90) progress = 90;
            loader.style.width = progress + '%';
        }, 180);
    };
    window.__finishPageLoader = function() {
        var loader = document.getElementById('page-loader');
        if (!loader) return;
        if (window.__pageLoaderTrickle) {
            clearInterval(window.__pageLoaderTrickle);
            window.__pageLoaderTrickle = null;
        }
        loader.style.width = '100%';
        setTimeout(function() {
            loader.classList.add('done');
            setTimeout(function() { if (loader.parentNode) loader.remove(); }, 300);
        }, 150);
    };
    addLoader();

    // Promise que resolve quando um <link> termina de carregar (sucesso ou erro)
    var linkReady = function(link) {
        return new Promise(function(resolve) {
            link.addEventListener('load', resolve);
            link.addEventListener('error', resolve);
        });
    };

    // docs.css
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = BASE + 'css/docs.css?v=20260430-card-img-pan-4';
    head.appendChild(css);

    // highlight.js — tema claro
    var hljsLight = document.createElement('link');
    hljsLight.id = 'hljs-light';
    hljsLight.rel = 'stylesheet';
    hljsLight.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/intellij-light.min.css';
    head.appendChild(hljsLight);

    // highlight.js — tema escuro (desabilitado por padrão)
    var hljsDark = document.createElement('link');
    hljsDark.id = 'hljs-dark';
    hljsDark.rel = 'stylesheet';
    hljsDark.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
    hljsDark.disabled = true;
    head.appendChild(hljsDark);

    // font-awesome
    var fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
    head.appendChild(fa);

    // Se tema escuro salvo, trocar hljs imediatamente
    if (localStorage.getItem('theme') === 'dark') {
        hljsLight.disabled = true;
        hljsDark.disabled = false;
    }

    // Espera docs.css + font-awesome + hljs (tema ativo) antes de mostrar o body
    // — evita FOUC em páginas que não têm 'pre code' (ex: index.html)
    var activeHljs = hljsLight.disabled ? hljsDark : hljsLight;
    window.__stylesheetsReady = Promise.all([linkReady(css), linkReady(fa), linkReady(activeHljs)]);
})();

// ─── Helpers ───────────────────────────────────────────────────────

function detectFolder(path) {
    var best = '';
    var bestLen = -1;
    for (var i = 0; i < MENU.length; i++) {
        var search = MENU[i].basePath || MENU[i].pasta;
        if (path.indexOf('/' + search + '/') > -1 && search.length > bestLen) {
            bestLen = search.length;
            best = MENU[i].pasta;
        }
    }
    return best;
}

function findSection(folder) {
    for (var i = 0; i < MENU.length; i++) {
        if (MENU[i].pasta === folder) return MENU[i];
    }
    return null;
}

function findSectionByHref(href) {
    for (var i = 0; i < MENU.length; i++) {
        var s = MENU[i];
        var p = (s.basePath || s.pasta) + '/' + s.pagina;
        if (p === href) return s;
    }
    return null;
}

function buildParentChain(section) {
    var chain = [];
    var current = section;
    var guard = 0;
    while (current && current.parent && guard < 10) {
        chain.unshift(current.parent);
        current = findSectionByHref(current.parent.href);
        guard++;
    }
    return chain;
}

function loadScript(src) {
    return new Promise(function(resolve) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
    });
}

// ─── Montar layout no DOMContentLoaded ─────────────────────────────

document.addEventListener('DOMContentLoaded', async function() {
    var path = location.pathname.replace(/\\/g, '/');
    var currentFile = path.split('/').pop();
    var currentFolder = detectFolder(path);
    var isRoot = (BASE === '' || BASE === './');
    var section = findSection(currentFolder);
    var isSectionIndex = section && currentFile === section.pagina;
    // Detecta se o HTML está numa subpasta dentro do grupo (ex: 1-DepartamentoHome/1-DepartamentoHome.html)
    var isSubFolder = false;
    if (currentFolder) {
        var afterGroup = path.split('/' + currentFolder + '/')[1] || '';
        isSubFolder = afterGroup.indexOf('/') !== -1;
    }

    // Profundidade a partir de pages/ (usado pra calcular prefixos de navegação)
    var pagesIdx = path.indexOf('/pages/');
    var depth = 0;
    if (pagesIdx > -1) {
        var afterPages = path.substring(pagesIdx + 7);
        depth = afterPages.split('/').length - 1;
    }

    // Extrair título da tag <title> (remove sufixo " — Nexus")
    var pageTitle = document.title.replace(/\s*[—–-]\s*Nexus\s*$/, '').trim();

    // Salvar conteúdo original do body
    pageTitle = pageTitle
        .replace(/\s*[\u2014\u2013-]\s*XT\s*-\s*Treinamento\s*$/, '')
        .trim();

    var content = document.body.innerHTML;

    // Aplicar tema escuro antes de mostrar (evita flash branco)
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    // ── Breadcrumb ──
    var breadcrumbHTML = '';
    var upToPages = '../'.repeat(depth);
    if (!isRoot && section) {
        var sectionBasePath = section.basePath || section.pasta;
        var parentPrefix = '';
        var parentChain = buildParentChain(section);
        for (var pc = 0; pc < parentChain.length; pc++) {
            parentPrefix += '<span class="breadcrumb-sep">\u203a</span>';
            parentPrefix += '<a href="' + upToPages + parentChain[pc].href + '">' + parentChain[pc].label + '</a>';
        }
        breadcrumbHTML = '<nav class="breadcrumb-nav">';
        if (isSectionIndex) {
            breadcrumbHTML += parentPrefix;
            breadcrumbHTML += '<span class="breadcrumb-sep">\u203a</span>';
            breadcrumbHTML += '<span class="breadcrumb-current">' + section.grupo + '</span>';
        } else {
            breadcrumbHTML += parentPrefix;
            breadcrumbHTML += '<span class="breadcrumb-sep">\u203a</span>';
            breadcrumbHTML += '<a href="' + upToPages + sectionBasePath + '/' + section.pagina + '">' + section.grupo + '</a>';
            breadcrumbHTML += '<span class="breadcrumb-sep">\u203a</span>';
            breadcrumbHTML += '<span class="breadcrumb-current">' + pageTitle + '</span>';
        }
        breadcrumbHTML += '</nav>';
    } else if (!isRoot && !section) {
        breadcrumbHTML = '<nav class="breadcrumb-nav">';
        breadcrumbHTML += '<span class="breadcrumb-sep">\u203a</span>';
        breadcrumbHTML += '<span class="breadcrumb-current">' + pageTitle + '</span>';
        breadcrumbHTML += '</nav>';
    }

    // ── Zoom controls ──
    var zoomHTML =
        '<div style="display:flex;align-items:center;gap:4px;">' +
            '<button onclick="changeZoom(-0.1)" title="Diminuir zoom" style="background:none;border:none;cursor:pointer;color:#555;font-size:1.1em;padding:4px 8px;line-height:1;" onmouseover="this.style.color=\'#2563eb\'" onmouseout="this.style.color=\'#555\'">\u2212</button>' +
            '<span id="zoom-label" onclick="toggleZoomMenu()" style="cursor:pointer;font-size:0.82em;color:#555;min-width:40px;text-align:center;position:relative;">100%' +
                '<div id="zoom-menu" style="display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #dde1e7;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.1);margin-top:8px;z-index:300;padding:4px 0;white-space:nowrap;">' +
                    '<a onclick="setZoom(0.75)" style="display:block;padding:6px 16px;color:#333;text-decoration:none;font-size:13px;cursor:pointer;">75%</a>' +
                    '<a onclick="setZoom(1)" style="display:block;padding:6px 16px;color:#333;text-decoration:none;font-size:13px;cursor:pointer;">100%</a>' +
                    '<a onclick="setZoom(1.25)" style="display:block;padding:6px 16px;color:#333;text-decoration:none;font-size:13px;cursor:pointer;">125%</a>' +
                    '<a onclick="setZoom(1.5)" style="display:block;padding:6px 16px;color:#333;text-decoration:none;font-size:13px;cursor:pointer;">150%</a>' +
                '</div>' +
            '</span>' +
            '<button onclick="changeZoom(0.1)" title="Aumentar zoom" style="background:none;border:none;cursor:pointer;color:#555;font-size:1.1em;padding:4px 8px;line-height:1;" onmouseover="this.style.color=\'#2563eb\'" onmouseout="this.style.color=\'#555\'">+</button>' +
            '<button id="toggle-all-videos" onclick="toggleAllVideos()" title="Pausar/tocar todos os vídeos" style="display:none;background:none;border:none;cursor:pointer;color:#555;padding:4px 8px;line-height:0;border-radius:4px;margin-left:8px;align-items:center;justify-content:center;" onmouseover="this.style.color=\'#2563eb\'" onmouseout="this.style.color=\'#555\'">' +
                '<svg id="ic-pause-all" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:none;"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' +
                '<svg id="ic-play-all" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>' +
            '</button>' +
            '<button id="theme-toggle" onclick="toggleTheme()" title="Alternar tema" style="background:none;border:none;cursor:pointer;color:#555;font-size:1.1em;padding:4px 10px;border-radius:4px;line-height:1;margin-left:8px;" onmouseover="this.style.color=\'#2563eb\'" onmouseout="this.style.color=\'#555\'">&#9788;</button>' +
        '</div>';

    // ── Montar HTML completo ──
    document.body.innerHTML =
        '<div id="topbar">' +
            '<button id="hamburger" onclick="toggleDrawer()"><span></span><span></span><span></span></button>' +
            '<a id="topbar-title" href="' + BASE + 'index.html">Nexus</a>' +
            breadcrumbHTML +
            '<div id="topbar-grafo-group">' +
                '<a id="topbar-grafo" href="' + BASE + 'grafo.html" title="Ver grafo de páginas (2D)">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<circle cx="5" cy="12" r="3"/>' +
                        '<circle cx="19" cy="5" r="3"/>' +
                        '<circle cx="19" cy="19" r="3"/>' +
                        '<line x1="7.5" y1="10.5" x2="16.5" y2="6.5"/>' +
                        '<line x1="7.5" y1="13.5" x2="16.5" y2="17.5"/>' +
                    '</svg>' +
                    '<span>Gráfico</span>' +
                '</a>' +
                '<a id="topbar-grafo-3d" href="' + BASE + 'grafo-3d.html" title="Ver grafo de páginas (3D)">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' +
                        '<polyline points="3.27 6.96 12 12.01 20.73 6.96"/>' +
                        '<line x1="12" y1="22.08" x2="12" y2="12"/>' +
                    '</svg>' +
                    '<span>3D</span>' +
                '</a>' +
            '</div>' +
            zoomHTML +
        '</div>' +
        '<div id="layout">' +
            '<div id="drawer"><div id="drawer-inner"></div></div>' +
            '<div id="content">' +
                '<div id="content-inner">' + content + '</div>' +
            '</div>' +
        '</div>' +
        '<div id="footer"><div id="footer-inner"></div></div>';

    // ── Menu lateral ──
    buildMenu(currentFile, currentFolder, isSubFolder, depth);

    // ── Footer ──
    buildFooter(currentFolder, isSubFolder, depth);

    // ── Botão global pausar/tocar todos os vídeos ──
    var allVideos = document.querySelectorAll('.card-img video');
    var globalBtn = document.getElementById('toggle-all-videos');
    if (allVideos.length && globalBtn) {
        globalBtn.style.display = 'inline-flex';
        var icPause = document.getElementById('ic-pause-all');
        var icPlay  = document.getElementById('ic-play-all');
        // Toggle puro: estado começa "play" (todos pausados pra usuário). Independe do hover dos cards.
        var globalPlaying = false;
        window.toggleAllVideos = function() {
            globalPlaying = !globalPlaying;
            allVideos.forEach(function(v) {
                if (globalPlaying) v.play().catch(function() {});
                else               v.pause();
            });
            icPause.style.display = globalPlaying ? 'block' : 'none';
            icPlay.style.display  = globalPlaying ? 'none'  : 'block';
        };
    }

    // ── Home cards — menu info toggle ──
    document.querySelectorAll('.card').forEach(function(card) {
        var btn = card.querySelector('.btnMenuCard');
        var info = card.querySelector('.card-info');

        if (btn && info) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                info.classList.toggle('aberto');
                btn.classList.toggle('aberto');
            });
        }

        var cardHref = card.getAttribute('data-href');
        if (cardHref) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('a[href]') || e.target.closest('.btnMenuCard')) return;
                window.location.href = cardHref;
            });
        }


        // Vídeo no card: começa pausado, SÓ o primeiro hover dá play; depois disso o controle é do botão
        var video = card.querySelector('.card-img video');
        if (video) {
            card.addEventListener('mouseenter', function() {
                video.play().catch(function() {});
            }, { once: true });

            // Botão pause/play (canto superior esquerdo)
            var pauseBtn = card.querySelector('.btnPauseCard');
            if (pauseBtn) {
                pauseBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (video.paused) video.play().catch(function() {});
                    else video.pause();
                });
                video.addEventListener('play',  function() { pauseBtn.classList.add('playing'); });
                video.addEventListener('pause', function() { pauseBtn.classList.remove('playing'); });
            }
        }
    });

    // ── Inicializar componentes ──
    var inner = document.getElementById('content-inner');
    var hasCode = inner.querySelector('pre code');

    if (hasCode) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');
        highlightAll(inner);
        initRangeHighlights(inner);
        initLineHighlights(inner);
    }

    highlightTemplates(inner);

    initCopyButtons(inner);
    initAudioPlayers(inner);
    await initCarousel(inner);
    initInfoRowPersist(inner);
    initSideNav(inner);
    initPageToc(inner);

    // ── Restaurar estado do drawer ──
    if (localStorage.getItem('drawerOpen') === 'true') {
        document.getElementById('drawer').classList.add('open');
        document.getElementById('hamburger').classList.add('open');
        document.body.classList.add('drawer-open');
        if (window.innerWidth <= 768) {
            createDrawerOverlay(true);
        }
    }

    // ── Tema — ícone (body.dark já aplicado acima) ──
    if (localStorage.getItem('theme') === 'dark') {
        document.getElementById('theme-toggle').innerHTML = '&#9790;';
    }

    // ── Esperar stylesheets críticos (docs.css, font-awesome, hljs) terminarem ──
    // sem isso, páginas sem 'pre code' (ex: index.html) mostram FOUC
    if (window.__stylesheetsReady) await window.__stylesheetsReady;

    // ── Mostrar body ──
    var hideStyle = document.getElementById('layout-hide');
    if (hideStyle) hideStyle.remove();
    document.body.style.visibility = 'visible';

    // ── Finalizar loader (0â†’100% + fade) ──
    if (window.__finishPageLoader) window.__finishPageLoader();
});

// ═══════════════════════════════════════════════════════════════════
// TRANSIÇÃO ENTRE PÁGINAS — reinsere loader ao clicar em link interno
// ═══════════════════════════════════════════════════════════════════

function showTransitionLoader() {
    if (window.__startPageLoader) window.__startPageLoader();
}

document.addEventListener('click', function(e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    // Link <a href=...>
    var link = e.target.closest('a[href]');
    if (link) {
        var href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
            href.startsWith('javascript:') || /^https?:\/\//.test(href) || link.target === '_blank') return;
        showTransitionLoader();
        return;
    }

    // Card com data-href (caso tenha handler JS que navega)
    var card = e.target.closest('[data-href]');
    if (card && !e.target.closest('.btnMenuCard')) {
        // Se clicou no menu de 3 bolinhas, ignora
        var href2 = card.getAttribute('data-href');
        if (href2 && !/^https?:\/\//.test(href2)) {
            showTransitionLoader();
        }
    }
}, true);

// ═══════════════════════════════════════════════════════════════════
// MENU LATERAL (DRAWER)
// ═══════════════════════════════════════════════════════════════════

function buildMenu(currentPage, currentFolder, isSubFolder, depth) {
    var inner = document.getElementById('drawer-inner');
    if (!inner) return;
    var isRoot = (depth === 0);
    var upToPages = '../'.repeat(depth);

    var html = '';
    for (var i = 0; i < MENU.length; i++) {
        var g = MENU[i];
        if (g.hidden) continue;

        var basePath = g.basePath || g.pasta;
        var prefix = isRoot ? 'pages/' + basePath + '/' : upToPages + basePath + '/';

        var isActiveGroup = (currentFolder === g.pasta) ||
            (g.subpastas && g.subpastas.indexOf(currentFolder) !== -1);
        html += '<div class="menu-group' + (isActiveGroup ? '' : ' collapsed') + '">';
        html += '<div class="menu-group-header" onclick="toggleGroup(this)">';
        html += g.grupo;
        html += ' <span class="menu-group-arrow">&#9660;</span>';
        html += '</div>';
        html += '<div class="menu-group-items">';

        function renderItems(items) {
            var out = '';
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                var active = (currentPage === item.arquivo || item.arquivo.indexOf(currentPage) !== -1) ? ' active' : '';
                var badgeHtml = '';
                if (item.tipo === 'novo') {
                    badgeHtml = ' <i class="fa-solid fa-file-circle-plus" style="margin-left:6px;font-size:0.8em;color:#16a34a;" title="novo arquivo"></i>';
                } else if (item.tipo === 'editar') {
                    badgeHtml = ' <i class="fa-solid fa-pen-to-square" style="margin-left:6px;font-size:0.8em;color:#d97706;" title="editar arquivo"></i>';
                } else if (item.tipo === 'check') {
                    badgeHtml = ' <svg style="margin-left:6px;width:1em;height:1em;vertical-align:-0.1em;" viewBox="0 0 640 640" fill="#999" title="não precisa alterar"><path d="M160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/><path d="M168 340L208 300L290 390L510 80L550 120L290 440Z"/></svg>';
                } else if (item.icon) {
                    badgeHtml = ' <i class="' + item.icon + '" style="opacity:0.4;margin-left:6px;font-size:0.85em;"></i>';
                }
                out += '<a class="menu-item' + active + '" href="' + prefix + item.arquivo + '">' + item.label + badgeHtml + '</a>';
            }
            return out;
        }

        if (g.subgrupos) {
            for (var s = 0; s < g.subgrupos.length; s++) {
                var sub = g.subgrupos[s];

                // Subgrupo-link (href) — renderiza como link simples
                if (sub.href) {
                    var subActive = (sub.pasta && currentFolder === sub.pasta) ||
                        (!sub.pasta && currentPage === sub.href);
                    html += '<a class="menu-item menu-subgroup-link' + (subActive ? ' active' : '') + '" href="' + prefix + sub.href + '">';
                    html += sub.label;
                    html += '</a>';
                    continue;
                }

                // Subgrupo desabilitado (sem href, sem items)
                if (sub.disabled) {
                    html += '<span class="menu-item menu-subgroup-link disabled">' + sub.label + '</span>';
                    continue;
                }

                // Subgrupo expandível (com items) — padrão original
                var hasItems = sub.items && sub.items.length > 0;
                var hasActive = false;
                if (hasItems) {
                    for (var k = 0; k < sub.items.length; k++) {
                        if (currentPage === sub.items[k].arquivo || sub.items[k].arquivo.indexOf(currentPage) !== -1) { hasActive = true; break; }
                    }
                }
                var subCollapsed = hasActive ? '' : ' collapsed';
                html += '<div class="menu-subgroup' + subCollapsed + '">';
                html += '<div class="menu-subgroup-label' + (hasItems ? '' : ' disabled') + '" onclick="toggleSubgroup(this)">';
                html += sub.label;
                html += ' <span class="menu-subgroup-arrow">&#9660;</span>';
                html += '</div>';
                html += '<div class="menu-subgroup-items">';
                if (hasItems) html += renderItems(sub.items);
                html += '</div></div>';
            }
        } else if (g.items) {
            html += renderItems(g.items);
        }

        html += '</div></div>';
    }

    inner.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════

function buildFooter(currentFolder, isSubFolder, depth) {
    var inner = document.getElementById('footer-inner');
    if (!inner) return;
    var isRoot = (depth === 0);
    var upToPages = '../'.repeat(depth);

    var html = '';

    for (var i = 0; i < FOOTER.episodios.length; i++) {
        var ep = FOOTER.episodios[i];
        var basePath = ep.basePath || ep.pasta;
        var prefix = isRoot ? 'pages/' + basePath + '/' : upToPages + basePath + '/';

        html += '<div><h3>' + ep.grupo + '</h3>';
        for (var j = 0; j < ep.items.length; j++) {
            html += '<a href="' + prefix + ep.items[j].arquivo + '">' + ep.items[j].label + '</a>';
        }
        html += '</div>';
    }

    for (var k = 0; k < FOOTER.extras.length; k++) {
        var ex = FOOTER.extras[k];
        html += '<div><h3>' + ex.grupo + '</h3>';
        for (var l = 0; l < ex.items.length; l++) {
            html += '<a href="' + ex.items[l].href + '">' + ex.items[l].label + '</a>';
        }
        html += '</div>';
    }

    inner.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// UI CONTROLS — Drawer, Tema, Zoom
// ═══════════════════════════════════════════════════════════════════

// ── Drawer ──

function createDrawerOverlay(show) {
    var overlay = document.getElementById('drawer-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'drawer-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:149;';
        overlay.addEventListener('click', function() { toggleDrawer(); });
        document.body.appendChild(overlay);
    }
    overlay.style.display = show ? 'block' : 'none';
}

function toggleDrawer() {
    var drawer = document.getElementById('drawer');
    var isOpen = drawer.classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
    document.body.classList.toggle('drawer-open', isOpen);
    localStorage.setItem('drawerOpen', isOpen);

    if (window.innerWidth <= 768) {
        createDrawerOverlay(isOpen);
    }
}

// ── Tema ──

function toggleTheme() {
    var dark = document.body.classList.toggle('dark');
    document.getElementById('theme-toggle').innerHTML = dark ? '&#9790;' : '&#9788;';
    var hljsLight = document.getElementById('hljs-light');
    var hljsDark  = document.getElementById('hljs-dark');
    if (hljsLight) hljsLight.disabled = dark;
    if (hljsDark)  hljsDark.disabled  = !dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// ── Zoom ──

var zoom = 1;

function changeZoom(delta) { setZoom(zoom + delta); }

function setZoom(value) {
    zoom = Math.min(2, Math.max(0.5, value));
    document.getElementById('content').style.fontSize = zoom + 'em';
    document.getElementById('zoom-label').childNodes[0].textContent = Math.round(zoom * 100) + '%';
    document.getElementById('zoom-menu').style.display = 'none';
}

function toggleZoomMenu() {
    var menu = document.getElementById('zoom-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('click', function(e) {
    var label = document.getElementById('zoom-label');
    if (label && !label.contains(e.target)) {
        var menu = document.getElementById('zoom-menu');
        if (menu) menu.style.display = 'none';
    }
});

// ── Toggle helpers (usados via onclick no HTML) ──

function toggleGroup(header) {
    header.closest('.menu-group').classList.toggle('collapsed');
}

function toggleSubgroup(label) {
    label.closest('.menu-subgroup').classList.toggle('collapsed');
}

function toggleInfoRow(btn) {
    var row = btn.closest('.info-row');
    row.classList.toggle('open');
}

function toggleChapter(header) {
    var clicked = header.closest('.chapter');
    var isCollapsed = clicked.classList.contains('collapsed');
    document.querySelectorAll('.chapter').forEach(function(c) { c.classList.add('collapsed'); });
    if (isCollapsed) {
        clicked.classList.remove('collapsed');
        setTimeout(function() {
            var top = clicked.getBoundingClientRect().top + window.scrollY - 52 - 24;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }, 10);
    }
}

// ── Expor funções globais (necessárias para onclick no HTML) ──

window.toggleDrawer   = toggleDrawer;
window.toggleTheme    = toggleTheme;
window.changeZoom     = changeZoom;
window.setZoom        = setZoom;
window.toggleZoomMenu = toggleZoomMenu;
window.toggleGroup    = toggleGroup;
window.toggleSubgroup = toggleSubgroup;
window.toggleInfoRow  = toggleInfoRow;
window.toggleChapter  = toggleChapter;

// ═══════════════════════════════════════════════════════════════════
// INIT FUNCTIONS — Audio, Copy, Highlight, Carousel, SideNav, TopNav
// ═══════════════════════════════════════════════════════════════════

// ── Audio Players ──

function initAudioPlayers(container) {
    container.querySelectorAll('.audio-player').forEach(function(player) {
        var audio = player.querySelector('audio');
        var btn   = player.querySelector('.audio-btn');
        var seek  = player.querySelector('.audio-seek');
        var fill  = player.querySelector('.audio-progress-fill');
        var time  = player.querySelector('.audio-time');

        var tracks = null;
        if (player.dataset.tracks) {
            try { tracks = JSON.parse(player.dataset.tracks); }
            catch (e) { tracks = null; }
        }

        var tabsWrap = null;
        if (tracks && tracks.length) {
            tabsWrap = document.createElement('div');
            tabsWrap.className = 'audio-tracks';
            tracks.forEach(function(t, i) {
                var tab = document.createElement('button');
                tab.className = 'audio-track-tab' + (i === 0 ? ' active' : '');
                tab.textContent = t.label;
                tab.dataset.src = t.src;
                tabsWrap.appendChild(tab);
            });
            player.insertBefore(tabsWrap, player.firstChild);
            audio.src = tracks[0].src;
        } else {
            audio.src = player.dataset.src;
        }

        function fmt(s) {
            var m = Math.floor(s / 60);
            return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
        }

        audio.addEventListener('loadedmetadata', function() {
            time.textContent = '0:00 / ' + fmt(audio.duration);
        });

        audio.addEventListener('timeupdate', function() {
            var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
            fill.style.width = pct + '%';
            seek.value = pct;
            time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
        });

        var iconPlay  = '<svg viewBox="0 0 24 24" width="14" height="14" fill="white"><polygon points="5,3 19,12 5,21"/></svg>';
        var iconPause = '<svg viewBox="0 0 24 24" width="14" height="14" fill="white"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>';

        btn.innerHTML = iconPlay;

        // botão -10s
        var btnBack = document.createElement('button');
        btnBack.className = 'audio-skip audio-back';
        btnBack.title = 'Voltar 10s';
        btnBack.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>';
        btnBack.addEventListener('click', function() { audio.currentTime = Math.max(0, audio.currentTime - 10); });

        // botão +10s
        var btnFwd = document.createElement('button');
        btnFwd.className = 'audio-skip audio-fwd';
        btnFwd.title = 'Avançar 10s';
        btnFwd.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>';
        btnFwd.addEventListener('click', function() { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); });

        btn.before(btnBack);
        btn.after(btnFwd);

        audio.addEventListener('ended', function() { btn.innerHTML = iconPlay; });

        btn.addEventListener('click', function() {
            if (audio.paused) { audio.play(); btn.innerHTML = iconPause; }
            else              { audio.pause(); btn.innerHTML = iconPlay; }
        });

        seek.addEventListener('input', function() {
            if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
        });

        // velocidade
        var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
        var speedLabels = {0.75: '0.7', 1.25: '1.2'};
        function speedLabel(s) { return (speedLabels[s] || s) + 'x'; }
        var speedWrap = document.createElement('div');
        speedWrap.className = 'audio-speed-wrap';
        var btnSpeed = document.createElement('button');
        btnSpeed.className = 'audio-skip audio-speed';
        btnSpeed.title = 'Velocidade';
        btnSpeed.textContent = '1x';
        var speedMenu = document.createElement('div');
        speedMenu.className = 'audio-speed-menu';
        speeds.forEach(function(s) {
            var opt = document.createElement('button');
            opt.textContent = speedLabel(s);
            opt.className = 'audio-speed-opt' + (s === 1 ? ' active' : '');
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                audio.playbackRate = s;
                btnSpeed.textContent = speedLabel(s);
                speedMenu.querySelectorAll('.audio-speed-opt').forEach(function(o) { o.classList.remove('active'); });
                opt.classList.add('active');
                speedMenu.classList.remove('show');
            });
            speedMenu.append(opt);
        });
        btnSpeed.addEventListener('click', function(e) { e.stopPropagation(); speedMenu.classList.toggle('show'); });
        document.addEventListener('click', function() { speedMenu.classList.remove('show'); });
        speedWrap.append(btnSpeed, speedMenu);
        time.after(speedWrap);

        // volume
        var iconVolOn  = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.5v7a4.47 4.47 0 0 0 2.5-3.5zM14 3.23v2.06a6.51 6.51 0 0 1 0 13.42v2.06A8.5 8.5 0 0 0 14 3.23z"/></svg>';
        var iconVolOff = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 8.5v2.09l2.41 2.41c.06-.31.09-.65.09-1zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.46 8.46 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.46 8.46 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4l-1.88 1.88L12 7.76V4z"/></svg>';
        var volWrap = document.createElement('div');
        volWrap.className = 'audio-vol-wrap';
        var volBtn = document.createElement('button');
        volBtn.className = 'audio-skip audio-vol-btn';
        volBtn.title = 'Volume';
        volBtn.innerHTML = iconVolOn;
        function updateVolIcon() {
            volBtn.innerHTML = (audio.muted || audio.volume === 0) ? iconVolOff : iconVolOn;
        }
        var volSlider = document.createElement('input');
        volSlider.type = 'range';
        volSlider.className = 'audio-vol-slider';
        volSlider.min = '0';
        volSlider.max = '100';
        volSlider.value = '100';
        volSlider.addEventListener('input', function() {
            audio.volume = volSlider.value / 100;
            audio.muted = volSlider.value == 0;
            updateVolIcon();
        });
        volBtn.addEventListener('click', function() {
            audio.muted = !audio.muted;
            volSlider.value = audio.muted ? 0 : audio.volume * 100;
            updateVolIcon();
        });
        volWrap.append(volBtn, volSlider);
        speedWrap.after(volWrap);

        // download
        var btnDl = document.createElement('a');
        btnDl.className = 'audio-skip audio-download';
        btnDl.title = 'Download';
        btnDl.href = audio.src;
        btnDl.download = '';
        btnDl.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
        volWrap.after(btnDl);

        // troca de track (multi-src)
        if (tabsWrap) {
            tabsWrap.addEventListener('click', function(e) {
                var tab = e.target.closest('.audio-track-tab');
                if (!tab || tab.classList.contains('active')) return;
                var wasPlaying = !audio.paused;
                tabsWrap.querySelectorAll('.audio-track-tab').forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                audio.src = tab.dataset.src;
                btnDl.href = tab.dataset.src;
                btn.innerHTML = iconPlay;
                if (wasPlaying) audio.play().then(function() { btn.innerHTML = iconPause; }).catch(function(){});
            });
        }

        // sentinel: div invisível para detectar quando o player grudou no topo
        var sentinel = document.createElement('div');
        sentinel.style.cssText = 'height:1px;margin-bottom:-1px;';
        player.parentNode.insertBefore(sentinel, player);

        // spacer: substitui o espaço do player no mobile quando vira fixed
        var spacer = document.createElement('div');
        spacer.style.display = 'none';
        player.parentNode.insertBefore(spacer, player.nextSibling);

        new IntersectionObserver(function(entries) {
            var stuck = !entries[0].isIntersecting;
            player.classList.toggle('audio-player--stuck', stuck);
            if (window.innerWidth <= 768) {
                spacer.style.display = stuck ? 'block' : 'none';
                spacer.style.height  = stuck ? player.offsetHeight + 'px' : '0';
            }
        }, { rootMargin: '-53px 0px 0px 0px', threshold: 0 }).observe(sentinel);
    });
}

// ── Copy Buttons ──

function initCopyButtons(container) {
    var iconCopy = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
    var iconOk   = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';

    container.querySelectorAll('pre').forEach(function(pre) {
        var btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.title = 'Copiar';
        btn.innerHTML = iconCopy;
        pre.appendChild(btn);

        btn.addEventListener('click', function() {
            var code = pre.querySelector('code');
            var text = code ? code.innerText : pre.innerText;
            navigator.clipboard.writeText(text).then(function() {
                btn.innerHTML = iconOk;
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.innerHTML = iconCopy;
                    btn.classList.remove('copied');
                }, 1500);
            });
        });
    });
}

// ── Range Highlights (// ADICIONAR ... // FIM) ──

function initRangeHighlights(container) {
    container.querySelectorAll('pre code').forEach(function(code) {
        var lines = code.innerHTML.split('\n');
        var result = [];
        var i = 0;

        while (i < lines.length) {
            var plain = lines[i].replace(/<[^>]+>/g, '');

            if (plain.includes('// ADICIONAR')) {
                var fimIdx = -1;
                for (var k = i + 1; k < lines.length; k++) {
                    var kPlain = lines[k].replace(/<[^>]+>/g, '');
                    if (kPlain.includes('// ADICIONAR')) break;
                    if (kPlain.includes('// FIM')) { fimIdx = k; break; }
                }

                var group = [lines[i]];
                i++;

                if (fimIdx !== -1) {
                    while (i <= fimIdx) { group.push(lines[i]); i++; }
                } else {
                    while (i < lines.length) {
                        if (lines[i].replace(/<[^>]+>/g, '').trim() === '') break;
                        group.push(lines[i]);
                        i++;
                    }
                }

                result.push('<span class="line-add">' + group.join('\n') + '</span>');
            } else {
                result.push(lines[i]);
                i++;
            }
        }

        code.innerHTML = result.join('\n');
    });
}

// ── Line Highlights (data-add) ──

function initLineHighlights(container) {
    container.querySelectorAll('pre[data-add]').forEach(function(pre) {
        var code = pre.querySelector('code');
        if (!code) return;

        var targets = pre.dataset.add.split('|').map(function(s) {
            var m = s.trim().match(/^(.*?)(\+\d+)?$/);
            return { text: m[1], extra: m[2] ? parseInt(m[2].slice(1)) : -1 };
        });

        var lines = code.innerHTML.split('\n');
        var result = [];
        var i = 0;
        while (i < lines.length) {
            var plain = lines[i].replace(/<[^>]+>/g, '');
            var matchedTarget = targets.find(function(t) { return plain.includes(t.text); });
            if (matchedTarget) {
                var group = [lines[i]];
                var j = i + 1;
                if (matchedTarget.extra >= 0) {
                    for (var n = 0; n < matchedTarget.extra && j < lines.length; n++, j++) {
                        group.push(lines[j]);
                    }
                } else {
                    while (j < lines.length) {
                        var nextPlain = lines[j].replace(/<[^>]+>/g, '');
                        if (targets.some(function(t) { return nextPlain.includes(t.text); })) {
                            group.push(lines[j]);
                            j++;
                        } else {
                            break;
                        }
                    }
                }
                result.push('<span class="line-add">' + group.join('\n') + '</span>');
                i = j;
            } else {
                result.push(lines[i]);
                i++;
            }
        }
        // Junta sem \n extra após line-add (display:block já quebra a linha)
        var html = '';
        for (var k = 0; k < result.length; k++) {
            if (k > 0 && !result[k - 1].startsWith('<span class="line-add">')) {
                html += '\n';
            }
            html += result[k];
        }
        code.innerHTML = html;
    });
}

// ── Syntax Highlight (highlight.js + tokens customizados) ──

function highlightAll(container) {
    var java = hljs.getLanguage('java');
    java.keywords.built_in = (java.keywords.built_in || '') +
        ' regAction regFun preAjax eval update link ok isAjaxCall getInput getOutput ' +
        'getManager getFactory getUser getSession ui isAdmin isAdminXT isUpdate setInsert ' +
        'setUpdate render config row col setContent setStyle setHtmlData ajax modalMax ' +
        'putInteger putString childWindow toHtml btTitle btTitleActive add write';

    container.querySelectorAll('pre code').forEach(function(block) {
        hljs.highlightElement(block);
    });

    var classNames = [
        'ModuloManager','ModuloHome','ModuloMdFactory','PnlManager','AppsRootAction',
        'AppManager','XtPage','SideMenu','Table','TableRow','JasapPage','Response',
        'Effect','Js','LaboratorioManager','LaboratorioHome','LaboratorioMdFactory',
        'LabPessoaList','LabPessoaForm','LabPessoaSelect','LabProdutoList','LabProdutoForm',
        'LabProdutoSelect','LabPerfilList','LabPerfilForm','LabPerfilSelect',
        'Title','MenuItem','MenuInicial',
        'Check','JasapList','DomainValue','PcfgModel','PnlCfg','PainelMdFactory',
        'AppsRootModelFactory','ContatosMdFactory','GedMdFactory','TransactionFilter',
        'JasapRootManager','DataBase','DataBaseFilter','PerfFilter','EffectFilter',
        'AAFilter','ErrorFilter','PermissaoFilter','HomeManager','GedManager',
        'AppsUpdateProgress','RootManager'
    ];

    var methods = [
        'regAction','regFun','preAjax','eval','update','link','getManager','getInput',
        'getOutput','getFactory','isAjaxCall','toHtml','ajax','modalMax','putInteger',
        'putString','childWindow','btTitle','btTitleActive','render','config','add',
        'write','row','col','setContent','setStyle','ok','getUser','getSession','ui',
        'setLabel','setValue','setSelected','getValue','getSetting','insert','cfgModel',
        'painel','modulo','laboratorio','ged','contatos','setManager','getList',
        'hasModulo','isAdminXT','getString','getGlobalFilters','sessionConfig',
        'configGlobalFilters','line','concat'
    ];

    container.querySelectorAll('pre code').forEach(function(block) {
        var html = block.innerHTML;

        // Protege strings literais para não serem recoloridas
        var saved = [];
        html = html.replace(/<span class="hljs-string">[\s\S]*?<\/span>/g, function(match) {
            saved.push(match);
            return '\x00S' + (saved.length - 1) + '\x00';
        });

        html = html.replace(
            /(\.)class\b/g,
            '.<span class="xt-constant">class</span>'
        );

        html = html.replace(
            /(?<!\x00)\b([A-Z][A-Z0-9_]{2,})\b(?=[^>]*<|[^<>]*$)/g,
            '<span class="xt-constant">$1</span>'
        );

        classNames.forEach(function(name) {
            html = html.replace(
                new RegExp('\\b(' + name + ')\\b(?=[^>]*<|[^<>]*$)', 'g'),
                '<span class="xt-class">$1</span>'
            );
        });

        methods.forEach(function(name) {
            html = html.replace(
                new RegExp('\\b(' + name + ')\\b(?=[^>]*<|[^<>]*$)', 'g'),
                '<span class="xt-method">$1</span>'
            );
        });

        // Departamento* — placeholders de template (marca-texto)
        // Aluno troca "Departamento" pelo nome real do módulo (Estoque, Financeiro, etc.)
        // Boundary custom (não usa \b) pra pegar DEPARTAMENTO mesmo cercado de _, ex: __DEPARTAMENTO_MID
        var templateRe = /(?<![A-Za-z0-9])(Departamento\w*|departamento|DEPARTAMENTO)(?![A-Za-z0-9])(?=[^>]*<|[^<>]*$)/g;
        html = html.replace(templateRe, '<span class="xt-template">$1</span>');

        // Aplica o mesmo highlight dentro das strings literais que foram protegidas
        saved = saved.map(function(s) {
            return s.replace(templateRe, '<span class="xt-template">$1</span>');
        });

        // Restaura strings literais (agora com o highlight do Departamento já dentro)
        saved.forEach(function(s, i) { html = html.replace('\x00S' + i + '\x00', s); });

        block.innerHTML = html;
    });
}

// Highlight dos placeholders "Departamento*" fora de <pre><code>
// Roda sempre (mesmo se a página não tem bloco de código)
function highlightTemplates(container) {
    var re = /(?<![A-Za-z0-9])(Departamento\w*|departamento|DEPARTAMENTO)(?![A-Za-z0-9])(?=[^>]*<|[^<>]*$)/g;

    // Inline <code> em parágrafos/listas — pula <pre> e tabelas de explicação
    container.querySelectorAll('code').forEach(function(block) {
        if (block.closest('pre')) return;   // já processado em highlightAll
        if (block.closest('table')) return; // tabelas de explicação não precisam
        block.innerHTML = block.innerHTML.replace(re, '<span class="xt-template">$1</span>');
    });
}

// ── Carousel ──

async function initCarousel(container) {
    for (var carousel of container.querySelectorAll('.carousel')) {
        var path = carousel.dataset.path;
        if (!path) continue;

        var srcs = await new Promise(function(resolve) {
            var found = [];
            function tryNext(i) {
                var img = new Image();
                img.onload  = function() { found.push(path + i + '.png'); tryNext(i + 1); };
                img.onerror = function() { resolve(found); };
                img.src = path + i + '.png';
            }
            tryNext(1);
        });

        if (srcs.length === 0) continue;
        var count = srcs.length;

        var track = document.createElement('div');
        track.className = 'carousel-track';

        var slides = [];
        for (var i = 0; i < count; i++) {
            var slide = document.createElement('div');
            slide.className = 'carousel-slide';
            var img = document.createElement('img');
            img.src = srcs[i];
            img.alt = 'Imagem ' + (i + 1) + ' de ' + count;
            slide.appendChild(img);
            track.appendChild(slide);
            slides.push(slide);
        }

        var svgL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
        var svgR = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

        var btnPrev = document.createElement('button');
        btnPrev.className = 'carousel-btn carousel-btn--prev';
        btnPrev.title     = 'Anterior';
        btnPrev.innerHTML = svgL;

        var btnNext = document.createElement('button');
        btnNext.className = 'carousel-btn carousel-btn--next';
        btnNext.title     = 'Próxima';
        btnNext.innerHTML = svgR;

        var dotsWrap = document.createElement('div');
        dotsWrap.className = 'carousel-dots';
        var dots = [];
        for (var d = 0; d < count; d++) {
            var dot = document.createElement('button');
            dot.className = 'carousel-dot' + (d === 0 ? ' active' : '');
            dot.title     = 'Imagem ' + (d + 1);
            dotsWrap.appendChild(dot);
            dots.push(dot);
        }

        carousel.appendChild(track);
        carousel.appendChild(btnPrev);
        carousel.appendChild(btnNext);
        carousel.appendChild(dotsWrap);

        var current = 0;

        var goTo = (function(track, dots, count) {
            var cur = 0;
            return function(idx) {
                cur = (idx + count) % count;
                track.style.transform = 'translateX(-' + (cur * 100) + '%)';
                dots.forEach(function(d, i) { d.classList.toggle('active', i === cur); });
                return cur;
            };
        })(track, dots, count);

        current = goTo(0);

        (function(btnPrev, btnNext, dots, goTo, slides, srcs, count) {
            var current = 0;

            btnPrev.addEventListener('click', function() { current = goTo(current - 1); });
            btnNext.addEventListener('click', function() { current = goTo(current + 1); });
            dots.forEach(function(dot, i) { dot.addEventListener('click', function() { current = goTo(i); }); });

            // Lightbox
            function openLightbox(idx) {
                var lbIdx = idx;
                var lb = document.createElement('div');
                lb.className = 'carousel-lightbox';

                var img = document.createElement('img');
                img.src = srcs[lbIdx];
                img.alt = 'Imagem ' + (lbIdx + 1);

                var lbPrev = document.createElement('button');
                lbPrev.className = 'carousel-lb-btn carousel-lb-btn--prev';
                lbPrev.title     = 'Anterior';
                lbPrev.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

                var lbNext = document.createElement('button');
                lbNext.className = 'carousel-lb-btn carousel-lb-btn--next';
                lbNext.title     = 'Próxima';
                lbNext.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

                function lbGoTo(newIdx) {
                    lbIdx   = (newIdx + count) % count;
                    img.src = srcs[lbIdx];
                    current = goTo(lbIdx);
                }

                lbPrev.addEventListener('click', function(e) { e.stopPropagation(); lbGoTo(lbIdx - 1); });
                lbNext.addEventListener('click', function(e) { e.stopPropagation(); lbGoTo(lbIdx + 1); });

                lb.appendChild(lbPrev);
                lb.appendChild(img);
                lb.appendChild(lbNext);
                lb.addEventListener('click', function() { lb.remove(); });

                document.addEventListener('keydown', function lbKey(e) {
                    if (e.key === 'Escape')     { lb.remove(); document.removeEventListener('keydown', lbKey); }
                    if (e.key === 'ArrowLeft')  lbGoTo(lbIdx - 1);
                    if (e.key === 'ArrowRight') lbGoTo(lbIdx + 1);
                });

                document.body.appendChild(lb);
            }

            slides.forEach(function(slide, i) { slide.addEventListener('click', function() { openLightbox(i); }); });

            // Teclado: â† â†’
            var carouselEl = slides[0].closest('.carousel');
            carouselEl.setAttribute('tabindex', '0');
            carouselEl.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft')  current = goTo(current - 1);
                if (e.key === 'ArrowRight') current = goTo(current + 1);
            });
        })(btnPrev, btnNext, dots, goTo, slides, srcs, count);
    }
}

// ── TopNav (navegação por h2) ──

function initTopnav(inner) {
    var topnav = document.getElementById('topnav');
    if (!topnav) return;
    topnav.classList.remove('visible');
    topnav.innerHTML = '';

    var topoLink = document.createElement('a');
    topoLink.href = '#';
    topoLink.textContent = '\u2191 início';
    topoLink.addEventListener('click', function(e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    topnav.appendChild(topoLink);

    var headings = inner.querySelectorAll('h2');
    headings.forEach(function(h, i) {
        if (!h.id) h.id = 'nav-' + i;
        var a = document.createElement('a');
        a.href = '#' + h.id;
        var text = h.textContent.trim();
        a.textContent = h.dataset.nav || (text.length > 24 ? text.slice(0, 24) + '\u2026' : text);
        a.title = text;
        topnav.appendChild(a);
    });

    if (headings.length > 0) {
        setTimeout(function() {
            topnav.classList.add('visible');
            if (window.innerWidth <= 768) document.body.classList.add('has-topnav');
        }, 50);

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var isH1 = entry.target.tagName === 'H1';
                    topnav.querySelectorAll('a').forEach(function(a) {
                        a.classList.toggle('active', !isH1 && a.getAttribute('href') === '#' + entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-52px 0px -70% 0px', threshold: 0 });

        var h1 = inner.querySelector('h1');
        if (h1) { h1.id = h1.id || 'page-top'; observer.observe(h1); }
        headings.forEach(function(h) { observer.observe(h); });
    }
}

// ── Persistência do estado aberto/fechado dos info-row ──

function initInfoRowPersist(inner) {
    var rows = inner.querySelectorAll('.info-row');
    if (rows.length === 0) return;

    rows.forEach(function(row, i) {
        if (!row.id) row.id = 'section-' + i;
        var key = 'infoRow:' + location.pathname + ':' + row.id;
        var saved = localStorage.getItem(key);
        if (saved === 'open') row.classList.add('open');
        else if (saved === 'closed') row.classList.remove('open');

        var header = row.querySelector('.info-row-header');
        if (!header) return;
        header.addEventListener('click', function() {
            localStorage.setItem(key, row.classList.contains('open') ? 'open' : 'closed');
        });
    });
}

// ── SideNav (índice lateral para páginas com info-row) ──

function initSideNav(inner) {
    // Se a página tem <nav class="page-toc">, o componente TOC substitui o sidenav
    if (document.querySelector('.page-toc')) return;

    var rows = inner.querySelectorAll('.info-row');
    if (rows.length === 0) return;

    var nav = document.createElement('nav');
    nav.id = 'sidenav';

    var navInner = document.createElement('div');
    navInner.id = 'sidenav-inner';

    rows.forEach(function(row, i) {
        var titleEl = row.querySelector('.info-row-title');
        if (!titleEl) return;

        if (!row.id) row.id = 'section-' + i;

        var a = document.createElement('a');
        a.href = '#' + row.id;
        var fullText = titleEl.textContent;
        var dashIdx = fullText.indexOf(' — ');
        a.textContent = dashIdx > 0 ? fullText.substring(0, dashIdx) : fullText;

        a.addEventListener('click', function(e) {
            e.preventDefault();
            if (!row.classList.contains('open')) {
                row.classList.add('open');
            }
            setTimeout(function() {
                var top = row.getBoundingClientRect().top + window.scrollY - 60;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }, 50);
        });
        navInner.appendChild(a);
    });

    nav.appendChild(navInner);

    var layout = document.getElementById('layout');
    layout.appendChild(nav);

    // Hamburger toggle
    var arrow = document.createElement('div');
    arrow.id = 'sidenav-toggle-arrow';
    arrow.innerHTML = '<span></span><span></span><span></span>';
    arrow.title = 'Mostrar/ocultar índice';

    arrow.addEventListener('click', function() {
        var isOpen = nav.classList.toggle('open');
        arrow.classList.toggle('open', isOpen);
        document.body.classList.toggle('sidenav-open', isOpen);
        localStorage.setItem('sidenavOpen', isOpen);
    });
    document.body.appendChild(arrow);

    // Restaurar estado salvo (aberto por padrão)
    if (localStorage.getItem('sidenavOpen') !== 'false') {
        nav.classList.add('open');
        arrow.classList.add('open');
        document.body.classList.add('sidenav-open');
    }

    // Scroll spy
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            var a = navInner.querySelector('a[href="#' + entry.target.id + '"]');
            if (a) a.classList.toggle('active', entry.isIntersecting);
        });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

    rows.forEach(function(row) { observer.observe(row); });
}

// ═══════════════════════════════════════════════════════════════════
// PAGE TOC — Table of Contents lateral auto-gerado a partir dos <h2>
// Ativado pela presença de <nav class="page-toc"></nav> vazia no HTML.
// Suporta override: se o nav já tiver conteúdo, preserva.
// Atributos opcionais no <h2>:
//   data-sub="..."         â†’ subtítulo menor em cinza claro
//   data-toc-title="..."   â†’ título no TOC (se diferente do h2)
// ═══════════════════════════════════════════════════════════════════

function initPageToc(inner) {
    var nav = document.querySelector('.page-toc');
    if (!nav) return;

    // Override manual: se já tem conteúdo, não sobrescreve
    if (nav.children.length > 0) return;

    // Fonte primária: <h2> da página. Fallback: .info-row (quando a página usa info-accordion).
    var items = [];
    var h2s = inner.querySelectorAll('h2');
    if (h2s.length >= 2) {
        h2s.forEach(function(h2, i) {
            if (!h2.id) {
                var slug = h2.textContent.trim().toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .substring(0, 40);
                h2.id = slug || ('sec-' + (i + 1));
            }
            if (!h2.style.scrollMarginTop) h2.style.scrollMarginTop = '80px';
            items.push({
                id: h2.id,
                title: h2.dataset.tocTitle || h2.textContent.trim(),
                sub: h2.dataset.sub || ''
            });
        });
    } else {
        // Fallback: usa os .info-row como seções (compatível com info-accordion)
        // Ignora info-rows aninhados dentro de outros info-rows (ex: Resumo/Material dentro de cada episódio)
        var rows = Array.from(inner.querySelectorAll('.info-row')).filter(function(r) {
            return !r.parentElement.closest('.info-row');
        });
        if (rows.length < 2) return;
        rows.forEach(function(row, i) {
            var titleEl = row.querySelector('.info-row-title');
            if (!titleEl) return;
            if (!row.id) row.id = 'row-' + (i + 1);
            if (!row.style.scrollMarginTop) row.style.scrollMarginTop = '80px';
            var fullText = titleEl.textContent.trim();
            var dashIdx = fullText.indexOf(' — ');
            items.push({
                id: row.id,
                title: row.dataset.tocTitle || (dashIdx > 0 ? fullText.substring(0, dashIdx) : fullText),
                sub: row.dataset.tocSub || (dashIdx > 0 ? fullText.substring(dashIdx + 3).trim() : '')
            });
        });
    }

    if (items.length < 2) return;

    var ulHtml = '<ul>';
    ulHtml += '<li><a href="#" data-toc-top="1">Topo</a></li>';
    items.forEach(function(item) {
        var subHtml = item.sub ? '<span class="toc-sub">' + item.sub + '</span>' : '';
        ulHtml += '<li><a href="#' + item.id + '">' + item.title + subHtml + '</a></li>';
    });
    ulHtml += '<li><a href="#" data-toc-bottom="1">Rodapé</a></li>';
    ulHtml += '</ul>';

    nav.innerHTML = '<div class="page-toc-title">Nesta página</div>' + ulHtml;

    // Delays em cascata (0.25s base pra esperar a barra entrar + 0.05s por item)
    var lis = nav.querySelectorAll('li');
    lis.forEach(function(li, i) {
        li.style.animationDelay = (0.25 + i * 0.05) + 's';
    });

    // Botão toggle (hamburger / X)
    var btn = document.createElement('button');
    btn.className = 'page-toc-toggle active';
    btn.setAttribute('aria-label', 'Alternar menu');
    btn.innerHTML =
        '<svg class="toc-icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<line x1="3" y1="6" x2="21" y2="6"/>' +
            '<line x1="3" y1="12" x2="21" y2="12"/>' +
            '<line x1="3" y1="18" x2="21" y2="18"/>' +
        '</svg>' +
        '<svg class="toc-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<line x1="18" y1="6" x2="6" y2="18"/>' +
            '<line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>';
    btn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('collapsed');
    });
    nav.parentNode.insertBefore(btn, nav);

    // Em tela <=1440px, menu começa escondido — hamburger fica visível pra abrir sob demanda
    if (window.innerWidth <= 1440) {
        nav.classList.add('collapsed');
        btn.classList.remove('active');
    }

    // Em tela <=1440px, clicar num link fecha o menu automaticamente
    // (menu sobrepõe conteúdo; depois de escolher a seção, some pra revelar)
    nav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function(e) {
            if (a.dataset.tocTop) {
                e.preventDefault();
                document.querySelectorAll('.info-row.open').forEach(function(row) {
                    row.classList.remove('open');
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (a.dataset.tocBottom) {
                e.preventDefault();
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
            } else {
                // Se o target é (ou está dentro de) um info-row fechado, abre antes do scroll
                var href = a.getAttribute('href');
                if (href && href.length > 1 && href.charAt(0) === '#') {
                    var target = document.getElementById(href.substring(1));
                    if (target) {
                        var row = target.classList.contains('info-row') ? target : target.closest('.info-row');
                        if (row && !row.classList.contains('open')) {
                            row.classList.add('open');
                        }
                    }
                }
            }
            if (window.innerWidth <= 1440) {
                nav.classList.add('collapsed');
                btn.classList.remove('active');
            }
        });
    });
}

})();
