const ingredientSelector = '[data-testid="ingredient"]';
const constructorSelector = '[data-testid="constructor-element"]';
const modalSelector = '[data-testid="modal"]';
const modalCloseSelector = '[data-testid="modal-close"]';

describe('проверяем доступность приложения', function () {
  beforeEach(() => {
    cy.intercept('GET', `https://norma.nomoreparties.space/api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', `https://norma.nomoreparties.space/api/orders/all`, {
      fixture: 'feed.json'
    }).as('getFeed');
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
      fixture: 'signin.json'
    }).as('loginUser');
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      fixture: 'order-burger.json'
    }).as('orderBurger');

    localStorage.setItem('refreshToken', 'test-access-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.visit('/');
  });

  this.afterAll(() => {
    localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('должны загружаться ингридиенты', () => {
    cy.get(ingredientSelector).should('have.length', 4);
  });

  it('должны добавляться ингридиенты в конструктор', () => {
    cy.get(constructorSelector).as('constructor');

    cy.get(ingredientSelector).each((el, index) => {
      if (index !== 2) {
        cy.wrap(el).within(() => {
          cy.get('button').contains('Добавить').should('exist').as('add');

          cy.get('@add').click();
        });
      }
    });

    cy.get('@constructor').contains('Краторная булка N-200i').should('exist');
    cy.get('@constructor')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('@constructor').contains('Соус Spicy-X').should('exist');
  });

  it('должна открываться модалка с ингридиентом', () => {
    cy.get('[data-testid="ingredient-link-1"]').as('bun-link');

    cy.get('@bun-link').click();

    cy.location('pathname').should('match', /\/ingredients\/.+/);

    cy.get(modalSelector).as('modal');

    cy.get('@modal').within(() => {
      cy.contains('Детали ингридиента').should('exist');
      cy.contains('Краторная булка N-200i').should('exist');
    });

    cy.get('@modal').within(() => {
      cy.get(modalCloseSelector).as('modal-close-butoon').should('exist');

      cy.get('@modal-close-butoon').click();
    });

    cy.get('@modal').should('not.exist');

    cy.get('@bun-link').click();
    cy.get('[data-testid="modal-overlay"]')
      .as('modal-close-overlay')
      .should('exist');

    cy.get('@modal-close-overlay').click({ force: true });

    cy.get('@modal').should('not.exist');

    cy.location('pathname').should('eq', '/');
  });

  it('должен создаться и отправиться заказ', () => {
    cy.get(constructorSelector).as('constructor');

    cy.get(ingredientSelector).each((el, index) => {
      cy.wrap(el).within(() => {
        cy.get('button').contains('Добавить').should('exist').as('add');

        cy.get('@add').click();
      });
    });

    cy.get('@constructor').within(() => {
      cy.get('button').contains('Оформить заказ').should('exist').as('order');
      cy.get('@order').click();
    });

    cy.wait('@orderBurger')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '2', '3', '4']
      });

    cy.get('@orderBurger')
      .its('response.body')
      .should('deep.equal', {
        success: true,
        name: 'Тестовый бургер',
        order: {
          number: 2222
        }
      });

    cy.get(modalSelector).should('exist').as('modal');
    cy.get('@modal').contains('2222');

    cy.get(modalCloseSelector).click();

    cy.get('@modal').should('not.exist');

    cy.get('@constructor').within(() => {
      cy.get('[data-testid="constructor-filled-element"]').should('not.exist');
      cy.get('[data-testid="constructor-empty-element"]').should(
        'have.length',
        3
      );
    });
  });
});
