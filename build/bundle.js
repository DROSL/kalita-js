'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var API_ENDPOINT = "http://192.168.178.23:8080/speak";

var KSelection = /*#__PURE__*/function () {
  function KSelection(selection) {
    _classCallCheck(this, KSelection);

    this.selection = selection;
    this.range = selection.getRangeAt(0);
    this.text = selection.toString();
    this.markNodes = [];
    this.wordNodes = [];
    this.markedWord = null;
    this.timer = null;
  }

  _createClass(KSelection, [{
    key: "_nodes",
    get: function get() {
      var selection = this.selection;
      var parent = this.range.commonAncestorContainer;

      var isVisible = function isVisible(elem) {
        return Boolean(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };

      var recur = function recur(node) {
        var selectedNodes = [];

        if (node.childNodes.length > 0) {
          var _iterator = _createForOfIteratorHelper(node.childNodes),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var childNode = _step.value;
              selectedNodes = selectedNodes.concat(recur(childNode));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.length > 0 && isVisible(node.parentElement) && selection.containsNode(node)) {
          selectedNodes.push(node);
        }

        return selectedNodes;
      };

      return recur(parent);
    }
  }, {
    key: "extend",
    value: function extend() {
      var startOffset = this.range.startOffset;

      while (startOffset > 0 && this.range.startContainer.nodeValue.charAt(startOffset - 1) !== " ") {
        startOffset--;
      }

      this.range.setStart(this.range.startContainer, startOffset);
      var endOffset = this.range.endOffset;

      while (endOffset < this.range.endContainer.length && this.range.endContainer.nodeValue.charAt(endOffset) !== " ") {
        endOffset++;
      }

      this.range.setEnd(this.range.endContainer, endOffset);
      this.text = this.range.toString();
    }
  }, {
    key: "prepare",
    value: function prepare() {
      var _iterator2 = _createForOfIteratorHelper(this._nodes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var node = _step2.value;
          var nodeRange = document.createRange();

          if (node === this.range.startContainer) {
            nodeRange.setStart(node, this.range.startOffset);
          } else {
            nodeRange.setStart(node, 0);
          }

          if (node === this.range.endContainer) {
            nodeRange.setEnd(node, this.range.endOffset);
          } else {
            nodeRange.setEnd(node, node.length);
          }

          var markNode = document.createElement("span");
          nodeRange.surroundContents(markNode);
          this.markNodes.push(markNode);
          var textNode = markNode.lastChild;
          var startOffset = 0;
          var endOffset = 0;

          while (endOffset <= textNode.nodeValue.length) {
            if (textNode.nodeValue.charAt(endOffset) === " " || endOffset === textNode.nodeValue.length) {
              if (endOffset > startOffset) {
                var _nodeRange = document.createRange();

                _nodeRange.setStart(textNode, startOffset);

                _nodeRange.setEnd(textNode, endOffset);

                var wordNode = document.createElement("span");

                _nodeRange.surroundContents(wordNode);

                this.wordNodes.push(wordNode);
                textNode = markNode.lastChild;
                startOffset = 0;
                endOffset = 0;
              }

              startOffset = endOffset + 1;
            }

            endOffset++;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.selection.empty();
    }
  }, {
    key: "highlight",
    value: function highlight() {
      var _iterator3 = _createForOfIteratorHelper(this.markNodes),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var markNode = _step3.value;
          markNode.classList.add("kalita-marked");
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "lowlight",
    value: function lowlight() {
      var _iterator4 = _createForOfIteratorHelper(this.markNodes),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var markNode = _step4.value;
          markNode.classList.remove("kalita-marked");
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "play",
    value: function play(duration) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      clearInterval(this.timer);
      var nowTime = new Date();
      var startTime = new Date(nowTime);
      startTime.setSeconds(startTime.getSeconds() - offset);
      var endTime = new Date(startTime);
      endTime.setSeconds(endTime.getSeconds() + duration);
      var charTotal = this.wordNodes.reduce(function (accumulator, wordNode) {
        return accumulator + wordNode.lastChild.length;
      }, 0);
      var charCount = 0;
      var words = this.wordNodes.map(function (word) {
        var wordTime = new Date(startTime);
        wordTime.setSeconds(wordTime.getSeconds() + charCount / charTotal * duration);
        charCount += word.lastChild.length;
        return {
          object: word,
          startAt: wordTime
        };
      }).filter(function (word) {
        return word.startAt >= nowTime;
      });
      var currentWord = -1;

      var tick = function tick() {
        var tickTime = new Date();

        if (tickTime > endTime) {
          this.markedWord.classList.remove("kalita-word");
          this.markedWord == null;
          clearInterval(this.timer);
        }

        if (currentWord + 1 < words.length && tickTime >= words[currentWord + 1].startAt) {
          if (this.markedWord) {
            this.markedWord.classList.remove("kalita-word");
          }

          this.markedWord = words[++currentWord].object;
          this.markedWord.classList.add("kalita-word");
        }
      };

      this.timer = setInterval(tick, 100);
    }
  }, {
    key: "pause",
    value: function pause() {
      clearInterval(this.timer);
    } // TODO: still a little bit buggy
    // elements do not seem to be really removed from the document

  }, {
    key: "destroy",
    value: function destroy() {
      clearInterval(this.timer);
      var wordNode;

      while (wordNode = this.wordNodes.pop()) {
        var _wordNode;

        (_wordNode = wordNode).replaceWith.apply(_wordNode, _toConsumableArray(wordNode.childNodes));
      }

      var markNode;

      while (markNode = this.markNodes.pop()) {
        var _markNode;

        (_markNode = markNode).replaceWith.apply(_markNode, _toConsumableArray(markNode.childNodes));
      }
    }
  }]);

  return KSelection;
}();

var SELECTION = null;
document.addEventListener("selectstart", function () {
  if (SELECTION) {
    PLAYER.pause(); // TODO: works, but is hacky as it requests /null

    PLAYER.src = null;
    SELECTION.destroy();
  }
}); // TODO: selection by keyboard will not fire event

document.addEventListener("mouseup", function () {
  var selection = window.getSelection();

  if (selection && selection.toString()) {
    SELECTION = new KSelection(selection);
    SELECTION.extend();
    SELECTION.prepare();
    SELECTION.highlight();
    var text = encodeURIComponent(SELECTION.text);
    PLAYER.src = "".concat(API_ENDPOINT, "?text=").concat(text);
  }
});
var PLAYER = document.createElement("audio");
PLAYER.controls = true;
PLAYER.autoplay = true;
PLAYER.addEventListener("play", function () {
  SELECTION.highlight();
  SELECTION.play(PLAYER.duration, PLAYER.currentTime);
});
PLAYER.addEventListener("pause", function () {
  SELECTION.pause();
});
PLAYER.addEventListener("ended", function () {
  SELECTION.lowlight();
});
document.getElementById("kalita-player").appendChild(PLAYER);
