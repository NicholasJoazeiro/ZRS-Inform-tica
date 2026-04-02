const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Performance Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            "img-src": ["'self'", "data:", "https://images.unsplash.com"],
            "video-src": ["'self'", "https://player.vimeo.com", "https://www.youtube.com"],
        },
    },
}));
app.use(compression());

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public'))); // Alias for easier access

// Mock Data for Blog
const mockBlogs = [
    {
        id: 1,
        slug: 'como-proteger-sua-empresa-contra-ransomware',
        title: 'Como proteger sua empresa contra Ransomware',
        date: '10 Jun 2026',
        excerpt: 'Descubra as melhores práticas e ferramentas para blindar a rede do seu negócio contra ataques sequestradores de dados.',
        content: '<p>A segurança da informação tornou-se uma pauta crítica para empresas de todos os portes. O <strong>ransomware</strong>, um tipo de malware que criptografa os dados e exige resgate para liberar o acesso, tem sido uma das ameaças mais severas. Para se proteger, invista em firewalls de nova geração, mantenha seus sistemas e softwares rigorosamente atualizados, eduque sua equipe para não clicar em links suspeitos e, acima de tudo, tenha uma política de <strong>backup em nuvem imutável e descentralizada</strong>. Se sua rede for comprometida, um backup limpo é a única garantia de retomada das operações sem perdas financeiras absurdas.</p>'
    },
    {
        id: 2,
        slug: 'vantagens-da-terceirizacao-de-ti-no-vale-do-sinos',
        title: 'Vantagens da Terceirização de TI no Vale do Sinos',
        date: '02 Jun 2026',
        excerpt: 'Entenda por que empresas locais estão migrando para o modelo de atendimento contratual preventivo.',
        content: '<p>Profissionalizar a TI muitas vezes significa parar de "apagar incêndios". O modelo de outsourcing, ou terceirização, permite que indústrias e comércios no Vale do Sinos transfiram a responsabilidade de gerir redes e suporte técnico para especialistas focados em resultados contínuos. As vantagens incluem <strong>redução de custos operacionais (até 30%)</strong>, monitoramento 24/7 para identificar falhas antes que elas parem a sua equipe e o cumprimento total das regulamentações complexas da <strong>LGPD</strong>, garantindo mais previsibilidade financeira do que um suporte pontual "quebra-conserta".</p>'
    },
    {
        id: 3,
        slug: 'o-que-e-cabeamento-estruturado',
        title: 'O que é Cabeamento Estruturado?',
        date: '25 Mai 2026',
        excerpt: 'Um guia rápido sobre a espinha dorsal da sua comunicação de dados e voz.',
        content: '<p>Se o servidor é o cérebro da infraestrutura, o cabeamento é o sistema nervoso. O <strong>cabeamento estruturado</strong> é um método padronizado para desenhar e instalar sistemas de cabeamento de maneira que ele suporte múltiplas aplicações de tráfego, garantindo performance e facilitando manutenções ou futuras expansões. Evite os "fios emaranhados" que causam lentidão extrema e defeitos intermitentes. Um bom projeto padronizado utiliza normas ISO/EIA/TIA, garantindo durabilidade de até 10 anos da rede local.</p>'
    },
    {
        id: 4,
        slug: 'migracao-para-nuvem-por-onde-comecar',
        title: 'Migração para Nuvem: Por onde começar?',
        date: '15 Mai 2026',
        excerpt: 'Saiba quais sistemas do seu ERP ou arquivos locais devem ir primeiro para a Cloud.',
        content: '<p>A jornada para a nuvem não precisa (e nem deve) ser feita toda de uma vez. O caminho mais recomendado é iniciar por serviços periféricos não-críticos, como o e-mail corporativo ou o armazenamento de backups de cold-storage. Com o tempo e o ganho de confiança na disponibilidade do ambiente Cloud, sistemas pesados de ERP e bancos de dados transacionais podem ser mapeados e migrados. Trabalhar com um consultor garante que o processo aconteça sem downtime (tempo de inatividade) para sua equipe.</p>'
    },
    {
        id: 5,
        slug: 'melhorando-o-sinal-wi-fi-na-sua-empresa',
        title: 'Melhorando o sinal Wi-Fi na sua empresa',
        date: '04 Mai 2026',
        excerpt: 'Dicas essenciais para eliminar zonas de sombra de conectividade no ambiente de trabalho.',
        content: '<p>O Wi-Fi da empresa caindo constantemente é um dos maiores gargalos de produtividade. Primeiro: o roteador comum da operadora não foi projetado para dezenas de dispositivos. O investimento em <strong>Access Points (APs) gerenciáveis</strong> de nível corporativo (como os da Cisco ou Ubiquiti) e a elaboração de um <em>site survey</em> resolvem 95% do problema. Esses sistemas corporativos sabem fazer o <em>roaming</em> eficiente (transição entre os roteadores) e dividem o tráfego de convidados da rede interna corporativa.</p>'
    }
];

// Routes
app.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'ZRS Informática | Inteligência em TI',
        blogs: mockBlogs.slice(0, 3) 
    });
});

app.get('/servicos', (req, res) => {
    res.render('pages/servicos', { title: 'Serviços | Estratégia e Segurança' });
});

app.get('/sobre', (req, res) => {
    res.render('pages/sobre', { title: 'Quem Somos | 25 anos de Expertise' });
});

app.get('/suporte', (req, res) => {
    res.render('pages/suporte', { title: 'Suporte e Downloads' });
});

app.get('/blog', (req, res) => {
    res.render('pages/blog', { title: 'Blog', blogs: mockBlogs });
});

app.get('/blog/:slug', (req, res) => {
    const post = mockBlogs.find(b => b.slug === req.params.slug);
    if (!post) {
        return res.status(404).render('pages/404', { title: 'Artigo não encontrado' });
    }
    res.render('pages/post', { title: post.title, post: post });
});

// Error 404
app.use((req, res) => {
    res.status(404).render('pages/404', { title: 'Página não encontrada' });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
