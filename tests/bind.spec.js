/**
 * @venus-library mocha
 * @venus-include ../bind.js
 * @venus-fixture bind.fixture.html
 */
describe('bind library', function () {

  describe('parseNode', function () {
    var node, result;

    before(function () {
      node = document.getElementById('fixture-1');
      result = window.bind.parseNode(node);
    });

    it('should parse two nodes containing variables', function () {
      expect(result.length).to.be(2);
    });

    it('should parse node', function () {
      expect(result[0].node).to.be.a('object');
    });

    it('should parse template markup', function () {
      expect(result[0].markup).to.be('Hi {{name}}, how does it feel to be {{age}} years old?');
    });

  });

  describe('create template', function () {
    var node, template;

    beforeEach(function () {
      node = document.getElementById('fixture-1');
      template = window.bind.template(node);
    });

    it('should be a function', function () {
      expect(template).to.be.a('function');
    });

    it('should render inner text', function () {
      template({name: 'Seth', age: 78});
      expect(node.innerText).to.be('Hi Seth, how does it feel to be 78 years old?');
    });

    it('should render attributes', function () {
      template({name: 'Seth', age: 78});
      expect(node.className).to.be('Seth');
    });

  });

});
