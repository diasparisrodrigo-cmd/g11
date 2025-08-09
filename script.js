// Funcionalidade básica para os botões
document.addEventListener('DOMContentLoaded', function() {
    
    // Funcionalidade dos botões "SOLICITE AGORA"
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Solicitação enviada! Em breve entraremos em contato.');
        });
    });

    // Funcionalidade dos cards de notícias
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            alert(`Carregando notícia: ${title}`);
        });
    });

    // Funcionalidade do menu hamburger
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
        });
    }

    console.log('Site G1 carregado!');
}); 