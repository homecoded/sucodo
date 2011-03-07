sucodo
=======

... is a web application written mainly in JavaScript that checks for
plagiarisms in texts. The application runs locally and does not send
any data to any server except to search engines. The search engines will
only get chunks of the original data in a random order to make reconstructing
the text on the side of the search engine provider a bit harder.
The checked texts are not cached in any way.

USABILITY FEEDBACK
==================
* change wording regarding "test group" to something more understandable
* add [i] at some parts to explain what these parts mean
	* Words per test group
	* Explain colors

TODO
====
* do not check last word group in a paragraph if it is significantly smaller than the set wordgroup length 
* remove bing API key and insert a warning if no api key is available
* add Privacy statement
* JSLint check every Javascript file
* initial language support


FEATURE REQUESTS
================
* more heuristic search with additional keywords (input for "site must also contain these words" to increase hit chances for small test groups)
* manual search by selecting the word groups manually
* adding adjustable gaps between the test groups  
* merge edit and analyze mode into one screen (like a rich text editor widget)
* add a sample text that can be used to illustrate how sucodo works
* report after analysis:
    * most use sources
    * percentage indicator of how much text may be plagiarized
* add a sources overview
* add options:
    * ignore correctly quoted sources (deselect from sources overview)

DONE
====

USABILITY FEEDBACK:

* add an edit-text-button to text analyzer
* increase size of "Inspect"-link and add a magnifying-glass icon
* move explanation text in analyzer to top of text field
* rename "Inspect" to "Show search results (opens new window)"
* rename "Close" to "Return to mouse-over mode"
* pull search result window to front (in case user left it open)

TODOs:

* show estimated time left for search
* color the suspicious phrases depending on the number of search results found for it
* FIX: omit double searches (if phrases are identical)
* randomize web search order
* Enable "start analyze" button AFTER unit tests finished (different solution: using test instances of web searchers and text analyzers)
* BUG: global replacement of texts sometimes destroys information (every part has to be identified uniquely)
  reproduce with word group length === 3 and text
  "Lorem Ipsum is ..."
* show number of results as popup
* make results clickable