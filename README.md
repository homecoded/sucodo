sucodo
=======

... is an application written mainly in JavaScript that checks for
plagiarisms in texts. The application runs locally and does not send
any data to any server except to search engines. The search engines will
only get chunks of the original data in a random order to make reconstructing
the text on the side of the search engine provider a bit harder.
The checked texts are not cached in any way on a server. If there is caching, 
it will will be locally on the users machine and under his/her control.

Things to consider if you want to use this software:
====================================================

You may freely use, alter, copy and distribute this software if you keep the Apache license in mind:

* You have to clearly state, what part of your derived work is licensed under Apache2
* State the copyright owner somewhere in your application, as in an about or credit screen (Manuel Rülke, homecoded.com)

You may NOT:

* copy the software, replace the name and pretend it was you who made it ! This would be just sad. For you.

How to Setup
============

- clone repository
- run ```npm install``` in main directory
- run ```npm test``` to run unit tests
- run ```npm start``` to start application stub (not yet functional)
 

License
=======

   Copyright 2017 Manuel Rülke, homecoded.com

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.


