(function (w) {

  w.bind = new Bind();

  function Bind() {
    this.models = {};

  }

  Bind.prototype.parseNode = function (node) {
    var textNode = document.TEXT_NODE,
        elementNode = document.ELEMENT_NODE,
        children,
        i,
        len,
        datums = [];

    if (node.nodeType === textNode) {
      return this.parseTextNode(node);
    }

    if (node.nodeType === elementNode) {
      datums.push(this.parseElementNode(node));

      if (node.hasChildNodes) {
        children = Array.prototype.slice.call(node.childNodes);

        for (i = 0, len = children.length; i < len; i++) {
          datums.push(this.parseNode(children[i]));
        }
      }
    }

    return datums;
  }

  Bind.prototype.parseElementNode = function (node) {
    var attributes = node.attributes,
        attribute,
        i,
        len,
        datums = [];

    for (i = 0, len = attributes.length; i < len; i++) {
      datums.push(this.parseTextNode(attributes[i]));
    }

    return datums;
  }

  Bind.prototype.parseTextNode = function (node) {
    var nodeValue = node.nodeValue,
        regEx     = /{{(\w*)}}/g,
        match,
        modelName,
        modelString,
        datum = {};

    while (match = re.exec(value)) {
      modelName   = match[1];
      placeholder = match[0];

      datum = {
        node: node,
        originalValue: node.nodeValue,
        placeholder: placeholder,
        name: modelName
      };

      node.nodeValue = node.nodeValue.replace(placeholder, '');
    }

    return datum;
  }

}(window));
