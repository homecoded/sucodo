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
* add an edit-text-button to text analyzer
* increase size of "Inspect"-link and add a magnifying-glass icon
* move explanation text in analyzer to top of text field
* add [i] at some parts to explain what these parts mean
- Words per test group
- Explain colors
* rename "Inspect" to "Show search results (opens new window)"
* rename "Close" to "Return to mouse-over mode"
* pull search result window to front (in case user left it open)
* use coloring for number of search results

TODO
====
* remove bing API key and insert a warning if no api key is available
* add Privacy statement
* add "lock icon" for https
* JSLint check every Javascript file

FEATURE REQUESTS
================
* more heuristic search with additional keywords
* manual search by selecting the word groups manually
* adding adjustable gaps between the test groups  

DONE
====

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