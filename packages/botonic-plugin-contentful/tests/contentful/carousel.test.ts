import { testContentful, testContext } from './contentful.helper';
import * as cms from '../../src';
import { expectImgUrlIs } from './image.test';

const TEST_CAROUSEL_MAIN_ID = '2yR9f3stNAEqdamUr8VtfD';

function assertElementDudasPrevias(element: cms.Element) {
  expect(element.title).toBe('Dudas previas a la compra');
  expect(element.subtitle).toBe(
    'Le ayudaré con sus compras en la tienda online.'
  );
  expectImgUrlIs(element.imgUrl!, 'blue.jpg');
  expect(element.buttons).toHaveLength(1);
  expect(element.buttons[0].callback.payload).toBe(
    'text$79aRfznNCyN2VGdGDQZBf3'
  );
  expect(element.buttons[0].text).toBe('Ver opciones');
}

test('TEST: contentful carousel', async () => {
  const sut = testContentful();

  // act
  const carousel = await sut.carousel(TEST_CAROUSEL_MAIN_ID, testContext());

  // assert
  expect(carousel.elements).toHaveLength(3);
  expect(carousel.name).toEqual('INICIO');
  expect(carousel.keywords).toEqual(['Inicio', 'menu', 'empezar']);
  expect(carousel.shortText).toEqual('Menú de Inicio');
  assertElementDudasPrevias(carousel.elements[0]);
});
