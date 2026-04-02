const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const viewsDir = path.join(__dirname, 'views');
const pagesDir = path.join(viewsDir, 'pages');
const publicDir = path.join(__dirname, 'public');

// Create dist directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Mock Data (from server.js)
const mockBlogs = [
    {
        id: 1,
        slug: 'como-proteger-sua-empresa-contra-ransomware',
        title: 'Como proteger sua empresa contra Ransomware',
        date: '02 Abr 2026',
        excerpt: 'Descubra as melhores práticas e ferramentas para blindar a rede do seu negócio contra ataques sequestradores de dados.',
        content: '<p>A segurança da informação tornou-se uma pauta crítica para empresas de todos os portes. O <strong>ransomware</strong>, um tipo de malware que criptografa os dados e exige resgate para liberar o acesso, tem sido uma das ameaças mais severas. Para se proteger, invista em firewalls de nova geração, mantenha seus sistemas e softwares rigorosamente atualizados, eduque sua equipe para não clicar em links suspeitos e, acima de tudo, tenha uma política de <strong>backup em nuvem imutável e descentralizada</strong>. Se sua rede for comprometida, um backup limpo é a única garantia de retomada das operações sem perdas financeiras absurdas.</p>'
    },
    {
        id: 2,
        slug: 'vantagens-da-terceirizacao-de-ti-no-vale-do-sinos',
        title: 'Vantagens da Terceirização de TI no Vale do Sinos',
        date: '02 Abr 2026',
        excerpt: 'Entenda por que empresas locais estão migrando para o modelo de atendimento contratual preventivo.',
        content: '<p>Profissionalizar a TI muitas vezes significa parar de "apagar incêndios". O modelo de outsourcing, ou terceirização, permite que indústrias e comércios no Vale do Sinos transfiram a responsabilidade de gerir redes e suporte técnico para especialistas focados em resultados contínuos. As vantagens incluem <strong>redução de custos operacionais (até 30%)</strong>, monitoramento 24/7 para identificar falhas antes que elas parem a sua equipe e o cumprimento total das regulamentações complexas da <strong>LGPD</strong>, garantindo mais previsibilidade financeira do que um suporte pontual "quebra-conserta".</p>'
    },
    {
        id: 3,
        slug: 'o-que-e-cabeamento-estruturado',
        title: 'O que é Cabeamento Estruturado?',
        date: '02 Abr 2026',
        excerpt: 'Um guia rápido sobre a espinha dorsal da sua comunicação de dados e voz.',
        content: '<p>Se o servidor é o cérebro da infraestrutura, o cabeamento é o sistema nervoso. O <strong>cabeamento estruturado</strong> é um método padronizado para desenhar e instalar sistemas de cabeamento de maneira que ele suporte múltiplas aplicações de tráfego, garantindo performance e facilitando manutenções ou futuras expansões. Evite os "fios emaranhados" que causam lentidão extrema e defeitos intermitentes. Um bom projeto padronizado utiliza normas ISO/EIA/TIA, garantindo durabilidade de até 10 anos da rede local.</p>'
    },
    {
        id: 4,
        slug: 'migracao-para-nuvem-por-onde-comecar',
        title: 'Migração para Nuvem: Por onde começar?',
        date: '02 Abr 2026',
        excerpt: 'Saiba quais sistemas do seu ERP ou arquivos locais devem ir primeiro para a Cloud.',
        content: '<p>A jornada para a nuvem não precisa (e nem deve) ser feita toda de uma vez. O caminho mais recomendado é iniciar por serviços periféricos não-críticos, como o e-mail corporativo ou o armazenamento de backups de cold-storage. Com o tempo e o ganho de confiança na disponibilidade do ambiente Cloud, sistemas pesados de ERP e bancos de dados transacionais podem ser mapeados e migrados. Trabalhar com um consultor garante que o processo aconteça sem downtime (tempo de inatividade) para sua equipe.</p>'
    },
    {
        id: 5,
        slug: 'melhorando-o-sinal-wi-fi-na-sua-empresa',
        title: 'Melhorando o sinal Wi-Fi na sua empresa',
        date: '02 Abr 2026',
        excerpt: 'Dicas essenciais para eliminar zonas de sombra de conectividade no ambiente de trabalho.',
        content: '<p>O Wi-Fi da empresa caindo constantemente é um dos maiores gargalos de produtividade. Primeiro: o roteador comum da operadora não foi projetado para dezenas de dispositivos. O investimento em <strong>Access Points (APs) gerenciáveis</strong> de nível corporativo (como os da Cisco ou Ubiquiti) e a elaboração de um <em>site survey</em> resolvem 95% do problema. Esses sistemas corporativos sabem fazer o <em>roaming</em> eficiente (transição entre os roteadores) e dividem o tráfego de convidados da rede interna corporativa.</p>'
    },
    {
        id: 6,
        slug: 'montagem-de-maquinas-performance-sob-medida',
        title: 'Montagem de Máquinas: Performance sob medida',
        date: '02 Abr 2026',
        excerpt: 'Por que o hardware customizado é a melhor escolha para engenharia, design e servidores.',
        content: '<p>Muitas vezes, as estações de trabalho "de prateleira" não entregam o desempenho necessário para softwares pesados de renderização ou grandes bases de dados. A <strong>consultoria em hardware</strong> foca em entender o gargalo da sua operação — seja ele processamento, memória ou I/O de disco — para montar máquinas que entregam o máximo de ROI. O uso de componentes certificados garante não só velocidade, mas a <strong>estabilidade térmica e longevidade</strong> que sua empresa precisa.</p>'
    },
    {
        id: 7,
        slug: 'suporte-ti-para-sistemas-erp',
        title: 'Suporte TI para Sistemas ERP (SAP, Totvs, etc)',
        date: '02 Abr 2026',
        excerpt: 'Como uma TI especializada ajuda na comunicação com as software-houses.',
        content: '<p>Um dos maiores problemas das empresas é a "briga" entre o suporte do sistema de gestão e a infraestrutura de rede. Nossa equipe atua como a <strong>ponte técnica</strong>, garantindo que o banco de dados esteja otimizado, que as permissões de rede estejam corretas e que a latência não atrapalhe o fechamento do mês. Ter um suporte de TI que entende as necessidades de um ERP economiza horas de chamados inúteis e garante que seu sistema nunca pare por culpa da rede.</p>'
    },
    {
        id: 8,
        slug: 'backup-hibrido-a-estrategia-vencedora',
        title: 'Backup Híbrido: A Estratégia Vencedora',
        date: '02 Abr 2026',
        excerpt: 'Entenda por que você deve ter cópias locais e na nuvem simultaneamente.',
        content: '<p>A regra 3-2-1 de backup continua sendo o padrão ouro: 3 cópias, em 2 mídias diferentes, sendo 1 fora do site. O <strong>backup híbrido</strong> une a velocidade de recuperação do backup local (via NAS ou Servidor dedicado) com a segurança extrema da imutabilidade na nuvem (Cloud). Em caso de um desastre físico, seus dados estão seguros fora da empresa. Em caso de uma deleção acidental, a recuperação é instantânea via rede local.</p>'
    },
    {
        id: 9,
        slug: 'gestao-de-servidores-estabilidade-e-lucro',
        title: 'Gestão de Servidores: Estabilidade é Lucro',
        date: '02 Abr 2026',
        excerpt: 'Monitoramento proativo que evita paradas inesperadas na sua produção.',
        content: '<p>Um servidor que para por 1 hora pode significar milhares de reais em prejuízo. A <strong>gestão proativa de servidores</strong> utiliza ferramentas de monitoramento em tempo real que nos avisam sobre falhas de hardware iminentes, falta de espaço em disco ou picos excessivos de carga antes que eles causem um travamento. Manter o ambiente atualizado e seguro não é opcional, é o que garante que sua equipe de vendas e produção continue faturando sem interrupções.</p>'
    },
    {
        id: 10,
        slug: 'outsourcing-de-ti-o-parceiro-estratégico',
        title: 'Outsourcing de TI: O Parceiro Estratégico',
        date: '02 Abr 2026',
        excerpt: 'Como transformar a tecnologia de centro de custo em motor de crescimento.',
        content: '<p>Contratar uma consultoria de TI completa (Outsourcing) é permitir que sua empresa foque no que ela faz de melhor. Nós assumimos a responsabilidade total pela governança digital, desde o suporte ao usuário final até o planejamento do orçamento anual de tecnologia. Com reuniões de alinhamento estratégico, garantimos que a TI esteja sempre um passo à frente das necessidades do negócio, antecipando investimentos e evitando "sustos" financeiros com infraestrutura.</p>'
    }
];

const pages = [
    { name: 'index', title: 'ZRS Informática | Inteligência em TI', template: 'pages/index.ejs', data: { blogs: mockBlogs.slice(0, 3) } },
    { name: 'servicos', title: 'Serviços | Estratégia e Segurança', template: 'pages/servicos.ejs', data: {} },
    { name: 'sobre', title: 'Quem Somos | 25 anos de Expertise', template: 'pages/sobre.ejs', data: {} },
    { name: 'suporte', title: 'Suporte e Downloads', template: 'pages/suporte.ejs', data: {} },
    { name: 'blog', title: 'Blog', template: 'pages/blog.ejs', data: { blogs: mockBlogs } },
];

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

async function build() {
    console.log('Building static site...');

    // Render pages
    for (const page of pages) {
        const filePath = path.join(viewsDir, page.template);
        const html = await ejs.renderFile(filePath, { 
            title: page.title, 
            ...page.data,
            // Path helper for static files
            basePath: '.' 
        }, {
            views: [viewsDir]
        });
        
        fs.writeFileSync(path.join(distDir, `${page.name}.html`), html);
        console.log(`- Generated ${page.name}.html`);
    }

    // Render blog posts
    const blogDir = path.join(distDir, 'blog');
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir);

    for (const post of mockBlogs) {
        const filePath = path.join(viewsDir, 'pages/post.ejs');
        const html = await ejs.renderFile(filePath, { 
            title: post.title, 
            post: post,
            basePath: '..' 
        }, {
            views: [viewsDir]
        });
        
        fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), html);
        console.log(`- Generated blog/${post.slug}.html`);
    }

    // Copy public files
    copyDir(publicDir, path.join(distDir, 'assets'));
    
    // Copy favicon if exists in public
    const faviconPath = path.join(publicDir, 'favicon.png');
    if (fs.existsSync(faviconPath)) {
        fs.copyFileSync(faviconPath, path.join(distDir, 'favicon.png'));
    }

    console.log('Build complete!');
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
