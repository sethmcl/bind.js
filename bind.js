(function (w) {

  w.bind = new Bind();

  function Bind() {}

  /**
   * Create a template function that can be called with a data context
   * @param {HtmlElement} node the html element to use as the template root
   * @returns {function} template function
   */
  Bind.prototype.template = function (node) {
    var datums = this.parseNode(node);

    return function (context) {
      this.render(datums, context);
    }.bind(this);
  };

  /**
   * Parse a DOM node, and keep track of all
   * template variables found in text nodes
   * @param {HtmlElement} node the node to parse
   * @param {Array} datums the variable data, used when called recursively
   * @returns {Array} array of template variables
   */
  Bind.prototype.parseNode = function (node, datums) {
    var textNode = document.TEXT_NODE,
        elementNode = document.ELEMENT_NODE,
        datums = datums || [],
        children,
        i,
        len;

    if (node.nodeType === textNode) {
      return this.parseTextNode(node);
    }

    if (node.nodeType === elementNode) {

      if (node.hasChildNodes) {
        children = Array.prototype.slice.call(node.childNodes);

        for (i = 0, len = children.length; i < len; i++) {
          datums.push(this.parseNode(children[i]));
        }
      }

      return this.parseElementNode(node, datums);
    }

    return datums;
  };

  /**
   * Parse an element node. Loop through attributes, looking for
   * template variables.
   * @param {HtmlElement} node the node to parse
   * @param {Array} datums the template variable data array
   * @returns {Array} array of template variables
   */
  Bind.prototype.parseElementNode = function (node, datums) {
    var attributes = node.attributes,
        attribute,
        i,
        len,
        datums = datums || [],
        datum;

    for (i = 0, len = attributes.length; i < len; i++) {
      datum = this.parseTextNode(attributes[i]);

      if (datum) {
        datums.push(datum);
      }
    }

    return datums;
  };

  /**
   * Parse text node for template variables.
   * @param {HtmlElement} node the node to parse
   * @returns {Object} a template variable node
   *          {HtmlElement} the node
   *          {markup} the template markup
   */
  Bind.prototype.parseTextNode = function (node) {
    var nodeValue = node.nodeValue,
        regEx     = /{{(\w*)}}/g,
        match,
        modelName,
        modelString,
        datum;

    while (match = regEx.exec(nodeValue)) {
      modelName   = match[1];
      placeholder = match[0];

      datum = {
        node: node,
        markup: node.nodeValue
      };

    }

    return datum;
  };

  /**
   * Render a template
   * @param {Array} template the template node data array
   * @param {Object} context the data context with values for the template variables
   */
  Bind.prototype.render = function (template, context) {
    var updatedNodes =  [];

    template.forEach(function (node) {
      node.node.nodeValue = this.renderTemplateMarkup(node.markup, context);
    }, this);
  };

  /**
   * Update a node with new variable values
   * @param {String} templateMarkup the original markup for the node
   * @param {Object} context the data context with values for the template variables
   */
  Bind.prototype.renderTemplateMarkup = function (templateMarkup, context) {
    var output = '',
        orig = templateMarkup,
        startPos = null,
        endPos = null,
        c,
        i,
        len,
        variableName;

    for (i = 0, len = orig.length; i < len; i++) {
      c = orig[i];

      if (c === '{' && orig[i - 1] !== '{') {
        startPos = i;
      }

      if (c === '}' && orig[i + 1] !== '}') {
        endPos = i;
      }

      if (startPos === null) {
        output += c;
      }

      if (startPos !== null && endPos !== null) {
        variableName = orig.substring(startPos + 2, endPos - 1);

        if (context[variableName]) {
          output += context[variableName];
        }

        startPos = null;
        endPos = null;
      }

    }

    return output;
  };

}(window));
