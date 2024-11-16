describe('Página inicial da Autotech', () => {
    it('Deve carregar a página inicial', () => {
      // Visitar a página inicial
      cy.visit('/');
      
      // Verificar se o título está presente
      cy.contains('Autotech');
    });
    it('Deve buscar uma peça', () => {
        cy.visit('/');
        
        // Digitar no campo de busca
        cy.get('#campo-busca').type('Filtro de Óleo');
        
        // Clicar no botão de buscar
        cy.get('#btn-buscar').click();
        
        // Verificar se a peça aparece nos resultados
        cy.contains('Filtro de Óleo').should('be.visible');
      });
      
  });
  