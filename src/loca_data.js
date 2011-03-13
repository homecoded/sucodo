
var LOCA_ENG = 0;
var LOCA_GER = 1;
var NUM_LANGUAGES = 2;

var loca__dictionary =
{
    "txt_title":
            [
                "sucodo",
                "sucodo"
            ],

    "txt_nav_step1":
            [
                "Enter Text",
                "Text eingeben"
            ],

    "txt_nav_step2":
            [
                "Analyze Text",
                "Text analysieren"
            ],

    "txt_nav_step3":
            [
                "Manual Inspection",
                "Manuelle Überprüfung"
            ],

    "txt_nav_step4":
            [
                "Help / Manual",
                "Hilfe / Anleitung"
            ],

    "txt_nav":
            [
                "Navigation :",
                "Navigation :"
            ],

    "txt_help":
            [
                "Sucodo will help you find plagiarims in your text. Just click on 'Enter Text' and paste the text into textfield.",
                "Sucodo hilft Dir, Plagiate in deinen Texten zu finden. Klicke einfach auf 'Text eingeben' und kopiere deinen Text in das Textfeld."
            ],

    "txt_entertext":
            [
                "Enter or rather copy & paste the text you want to analyze here:",
                "Gib den Text, den du analysieren willst hier ein (beziehungsweise benutze Kopieren und Einfügen):"
            ],

    "txt_process":
            [
                "<strong>What is going to happen?</strong><br>The text will be split up into fix-length word groups. Each word group is checked against a search engine. A word group is suspicious if the search engine returns one or more results for it.",
                "<strong>Was wird passieren?</strong><br> Der Text wird in Wortgruppen mit fester Wortanzahl zerteilt. Jede Gruppe wird über eine Suchmaschine untersucht. Eine Gruppe gilt als verdächtig, wenn die Suchmaschine Ergebnisse für sie liefert."
            ],

    "txt_analyze_now":
            [
                "Give me academic peace of mind! ►",
                "Gib mir akademischen Seelenfrieden! ►"
            ],

    "txt_button_edit":
            [
                    "◄ Edit text",
                    "◄ Text editieren"
            ],

    "txt_lang_select":
            [
                "Select your language:",
                "Wähle Deine Sprache:"
            ],

    "txt_lang_name":
            [
                "English",
                "Deutsch"
            ],

    "txt_resultview":
            [
                "Results",
                "Ergebnisse"
            ],

    "txt_textview":
            [
                "<strong>Colored (non-black) text parts returned search results are therefore suspicious!</strong><br> The more red you see, the more likely the text contains plagiarisms! <br>Use your mouse to inspect them.",
                "<strong>Eingefärbte (nicht schwarze) Textanteile lieferten Suchergebnisse und sind damit verdächtig!</strong><br> Je mehr rot Du siehst, desto wahrscheinlicher beinhaltet der Text Plagiate! <br>Benutze Deine Maus um sie zu untersuchen."
            ],

    "txt_word_group_length":
            [
                "Words per test group:",
                "Wörter pro Testgruppe:"
            ],


    "txt_grouplen3":
            [
                "3  (very small, expect false positives and long execution time)",
                "3  (sehr klein, Falschmeldungen und lange Ausführzeit werden erwartet)"
            ],

    "txt_grouplen4":
            [
                "4",
                "4"
            ],

    "txt_grouplen5":
            [
                "5",
                "5"
            ],

    "txt_grouplen8":
            [
                "8",
                "8"
            ],

    "txt_grouplen10":
            [
                "10",
                "10"
            ],

    "txt_grouplen15":
            [
                "15",
                "15"
            ],

    "txt_grouplen20":
            [
                "20 (very big, may lead to inaccurate results)",
                "20 (sehr groß, kann zu ungenauen Ergebnissen führen)"
            ],

    "txt_time_remaining":
            [
                "sec",
                "Sek"
            ],

    "txt_resultinfo_count":
            [
                "Number of search results:",
                "Anzahl der Suchergebnisse:"
            ],

    "txt_close":
            [
                "Hide extended control ▲",
                "Erweiterte Anzeige verstecken ▲"
            ],

    "txt_stick":
            [
                "Click to select ▼",
                "Klicke um zu selektieren ▼"
            ],

    "txt_inspect":
            [
                "▼  Show all search results (opens new window)",
                "▼  Zeige mir all Suchergebnisse (öffnet neues Fenster)"
            ],
    "txt_privacy":
            [
                "Privacy Policy: sucodo does not collect any personal data. No cookies!",
                "Privatsphäre: sucodo sammelt keine persönlichen Daten. Keine Cookies!"
            ],
    "txt_show_sample_text":
            [
                "Add some sample text",
                "Beispieltext anfügen"
            ],
    "txt_sample_text":
            [
                "Let’s have a moment here and talk about plagiarism. The internet is full of readily available information that is there to be grabbed, some might think. These are the ones who simply hand in a copy of an Wikipedia article as their homework, or use a brilliantly written blog post by someone else as their introduction to their scientific paper. Well, why bother thinking for yourself? You can just go and put together a great paper by simply copying text fragments from all over the internet and gluing them back together. A good work is only one Google or bing search away? Well, maybe not!\n\nStealing other peoples intellectual properties by not giving them due credit is not a new problem. The modern ideals for originality and against plagiarism appeared in the 18th century, in the context of the economic and political history of the book trade, which will be exemplary and influential for the subsequent broader introduction of capitalism. Originality, that traditionally had been deemed as impossible, was turned into an obligation by the emerging ideology of individualism. In 1755 the word made it into Johnson's influential A Dictionary of the English Language, where he was cited in the entry for copier (One that imitates; a plagiary; an imitator. Without invention a painter is but a copier, and a poet but a plagiary of others.), and in its own entry denoting both A thief in literature (one who steals the thoughts or writings of another) and The crime of literary theft. \n\nThe above paragraph has been shamelessly ripped from Wikipedia to illustrate how sucodo can help you identify plagiarized text parts. You will most likely find most of the hits in that paragraph.",
                "Betrachten wir doch mal für einen Moment das Problem der Plagiate. Das Internet heute ist voller leicht verfügbarer Informationen, die einfach nur darauf einfach übernommen zu werden. So zumindest scheinen einige Leute zu denken. Das sind die Leute, die einfach eine Kopie eines Wikipedia-Artikels als Hausarbeit abgeben, oder einen brillant geschriebenen Blog-Post eines anderen als Einleitung für ihre wissenschaftliche Arbeit benutzen. Warum soll man denn überhaupt noch selbst denken? Man kann schließlich recht einfach eine gute Arbeit einfach aus Fragmenten verschiedener Texte aus dem Internet zusammenbauen. Ein schnelles Ende der wissenschaftlichen Arbeit  ist nur eine Google oder bing Suche entfernt? Nun vielleicht nicht!\n\nDer Diebstahl geistigen Eigentums durch die Nichtkennzeichnung von Quellen ist ein verbreitetes Problem.  Im Jahr 2002 erregte eine Artikelserie des Spiegels über eine weit verbreitete „Plagiat-Kultur“ an deutschen Hochschulen einiges Aufsehen. Die Autorin Debora Weber-Wulff, Professorin für Medieninformatik in Berlin, stellt vor allem heraus, wie gering das Unrechtsbewusstsein bei deutschen Studenten und Dozenten ausgeprägt ist. Was in Deutschland bestenfalls als Kavaliersdelikt angesehen werde, könne in amerikanischen Hochschulen zur Exmatrikulation führen. Weber-Wulff hat auch eine Anleitung zur Aufdeckung von Plagiaten verfasst. 2006 befragte Sebastian Sattler für seine Soziologie-Diplomarbeit 226 Soziologie-Studenten zum Thema Plagiate in Universitäts-Hausarbeiten. Er testete Arbeiten von 159 Studierenden und fand in 19,5 % der Arbeiten Plagiate. In einem weiteren Fragebogen-gestützten Teil der Studie wurde festgestellt, dass etwa jeder Fünfte bereits im Studium plagiiert hat und etwas mehr als jeder Zweite in der Schule.\n\nDer vorangehende Abschnitt wurde schamlos aus Wikipedia kopiert. Er soll zeigen, wie sucodo helfen kann, kopierte Textteile zu erkennen. Es ist sehr wahrscheinlich, dass die meisten Treffer in diesem Abschnitt zu finden sein werden."
            ],

    "txt_tooltip_help_wordgroup_len":
            [
                "The text is split into word groups (test groups) with a defined number of words in each group. <br>Set the length you want to use for testing.",
                "Der Text wird in Wortgruppen (Testgruppen) geteilt, wobei jede Wortgruppe eine definierte Länge hat.<br> Setze hier die Länge, die Du zum Testen benutzen möchtest."
            ],

    "txt_tooltip_help_sample_text":
            [
                "Click on this link and to add a small sample text to the input field. <br> The text contains original as well as plagiarized text.",
                "Klicke auf diesen Link um dem Eingabefeld einen kurzen Beispieltext hinzuzufügen. <br> Der Text enthält originalen Text, sowie einen Plagiatsanteil."
            ],

    "txt_tooltip_help_colors":
            [
                "The text will become colored. If a fairly low number of possible sources for a <br>test group is found on the internet, this test group will become dark orange.<br>In case there are many possible sources, it will become bright red.",
                "Der Text wird unterschiedlich eingefärbt. Wenn für eine Testgruppe nur wenige <br>mögliche Quellen im Internet gefunden wurden, dann wird er Textteil Dunkelorange eingefärbt. <br>Werden viele mögliche Quellen gefunden, wird er Hellrot eingefärbt."
            ],

    "last element":
            [
                "",
                ""
            ]
};