sucodo
=======

... is a web application written mainly in JavaScript that checks for
plagiarisms in texts. The application runs locally and does not send
any data to any server except to search engines. The search engines will
only get chunks of the original data in a random order to make reconstructing
the text on the side of the search engine provider a bit harder.
The checked texts are not cached in any way.

TODO
====

* remove bing API key and insert a warning if no api key is available
* add Privacy statement
* add "lock icon" for https
* make results clickable
* JSLint check every Javascript file

DONE
====
* show estimated time left for search
* color the suspicious phrases depending on the number of search results found for it
* FIX: omit double searches (if phrases are identical)
* randomize web search order
* Enable "start analyze" button AFTER unit tests finished (different solution: using test instances of web searchers and text analyzers)
* BUG: global replacement of texts sometimes destroys information (every part has to be identified uniquely)
  reproduce with word group length === 3 and text
  "Lorem Ipsum is ..."
* show number of results as popup
