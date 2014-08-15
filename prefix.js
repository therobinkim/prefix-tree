// this is our Node, of which we will create many
// it stores 1 character in this._currentLetter
// it knows whether it's the end of a real word or not
// it knows 
var Node = function(currentLetter, isWord) {
  this._currentLetter = currentLetter;
  this._isWord = isWord;
  this._children = {};
};

Node.prototype.getCurrentLetter = function() {
  return this._currentLetter;
};

// if we give isWord a new value, then set it and return that value
// if we don't give isWord a new value, just return this._isWord
Node.prototype.isWord = function(isWord) {
  if(arguments.length > 0) {
    this._isWord = isWord;
  }
  return this._isWord;
};

Node.prototype.addChildNode = function(childNode) {
  var index = childNode.getCurrentLetter();
  this._children[index] = childNode;
};

Node.prototype.hasChildNode = function(letter) {
  return this._children[letter] !== undefined;
};

Node.prototype.getChildNodes = function() {
  return this._children;
};

Node.prototype.getNumChildNodes = function() {
  return Object.keys(this._children).length;
};

Node.prototype.removeChildNode = function(childNode) {
  var index = childNode.getCurrentLetter();
  delete this._children[index];
};






// this is is our Prefix tree
// it starts with the root node
// and has three functions listed below
var Prefix = function() {
  this._rootNode = new Node();
};


// accepts a word (in string format)
// adds that word to the tree
// returns true if does not exist, returns false if already exists
//    hence we didn't really need to add
Prefix.prototype.addWord = function(newWord) {
  var currentNode = this._rootNode;
  var currentLetter;
  var nextNode;
  var isEndOfWord;

  // otherwise we gotta add it :(
  // for each letter of the new word
  for(var i = 0; i < newWord.length; i++) {
    // we will have to traverse the tree
    currentLetter = newWord[i];
    isEndOfWord = i === (newWord.length - 1);

    // first check to see if the childNode w/ letter currentLetter exists
    if(currentNode.hasChildNode(currentLetter)) {
      currentNode = currentNode.getChildNodes()[currentLetter];
      // if we're at the end of the word, but the node already exists
      if(isEndOfWord) {
      // set that node's "isWord" property to TRUE!
        currentNode.isWord(true);
      }
    } else {
      // create it as Node(currentLetter, false)
      // on our last letter, we create the finalNode as Node(currentLetter, true)
      nextNode = new Node(currentLetter, isEndOfWord);
      // add it as a childNode
      currentNode.addChildNode(nextNode);
      // that childNode becomes our new currentNode
      currentNode = nextNode;
      if(isEndOfWord) {
        // we just added the last letter! return true because we added the word
        return true;
      }
    }
  }
};

Prefix.prototype.containsWord = function(word) {
  var currentNode = this._rootNode;
  var currentLetter;
  var isEndOfWord;
  // for each letter
  for(var i = 0; i < word.length; i++) {
    // grab the current letter i for the word
    currentLetter = word[i];
    // are we at the end of the word?
    isEndOfWord = i === (word.length - 1);
    // if yes, return currentNode.getChildNodes()[currentLetter].isWord()
    if(isEndOfWord) {
      if(currentNode.getChildNodes()[currentLetter] !== undefined) {
        return currentNode.getChildNodes()[currentLetter].isWord();
      }
      return false;
    }
    // if no...
    else {
      // find out if currentNode.hasChildNode(currentLetter)
      if(currentNode.hasChildNode(currentLetter) === false) {
        // if no, return false!
        return false;
      }
      // if yes, currentNode = that child node so we can keep traversing
      else {
        currentNode = currentNode.getChildNodes()[currentLetter];
      }
    }
  }
};

// accepts several letters (in string format)
// returns possible autocompletions (in array format)
// returns null if the prefix does not exist
//   aka nothing in our dictionary starts with that prefix
Prefix.prototype.autocomplete = function(pre) {
  var currentNode = this._rootNode;
  var nextNode;
  var currentLetter;
  var isEndOfPre;
  // for each letter
  for(var i = 0; i < pre.length; i++) {
    // grab the current letter i for the pre
    currentLetter = pre[i];
    isEndOfPre = i === (pre.length - 1);
    nextNode = currentNode.getChildNodes()[currentLetter];
    // if isEndOfPre
    if(isEndOfPre) {
      // arrayOfSuggestions
      return this._getAllWords(nextNode, pre.substring(0, i));
    } else {
      // if prefix doesn't exist in the tree, return null
      if(nextNode === null) {
        return [];
      }
      // traverse down the tree
      currentNode = nextNode;
    }
  }
};

Prefix.prototype._getAllWords = function(node, wordSoFar) {
  var currentNode = node;
  var currentLetter = currentNode.getCurrentLetter();
  var isWord = currentNode.isWord();
  var arrayOfSuggestions = [];
  var children;
  // if currentNode is end of word, add to arrayOfSuggestions
  if(isWord) {
    arrayOfSuggestions.push(wordSoFar + '' + currentLetter);
  }
  // for each childNode
  children = node.getChildNodes();
  for(var i in children) {
    // add the result of this._getAllWords(childNode[i]) to arrayOfSuggestions
    arrayOfSuggestions = arrayOfSuggestions.concat(this._getAllWords(children[i], wordSoFar + currentLetter));
  }
  return arrayOfSuggestions;
};

// accepts a word (in string format)
// removes it from the tree
// returns true if found, false if not found
//   hence we didn't really need to remove
Prefix.prototype.deleteWord = function(oldWord) {

};
