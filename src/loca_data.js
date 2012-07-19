
var LOCA_ENG = 0,
    LOCA_GER = 1,
    NUM_LANGUAGES = 2,
    loca__dictionary =
{
    "txt_title":
            [
                "sucodo",
                "sucodo"
            ],
            
    "txt_tag_line":
            [
                "Academic Peace Of Mind. For All. For Free.",
                "Akademischer Seelenfrieden. Für Jeden. Kostenlos."
            ],            

    "txt_nav_step1":      
            [
                "1. Enter Text",
                "1. Text eingeben"
            ],

    "txt_nav_step2":
            [
                "2. Analyze Text",
                "2. Text analysieren"
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
                "sucodo will help you find plagiarims in your text. Just click on 'Enter Text' and paste the text into textfield.",
                "sucodo hilft Dir, Plagiate in deinen Texten zu finden. Klicke einfach auf 'Text eingeben' und kopiere deinen Text in das Textfeld."
            ],

    "txt_hint_edit":
            [
                "sucodo examines a text and tells you about possible plagiarisms is finds. Enter or rather copy & paste the text you want to analyze into the text field.<br>You can also <a href='javascript:void(0)' id='link_sample_text'>add some sample text</a> if you just want to give it a spin.",
                "sucodo untersucht einen Text und berichtet über mögliche Plagiate, die es darin findet. Gib den Text, den du analysieren willst, in das Textfeld ein (beziehungsweise benutze Kopieren und Einfügen).<br>Du kannst auch <a href='javascript:void(0)' id='link_sample_text'>einen Beispieltext benutzen</a>, wenn Du es nur mal ausprobieren möchtest."
            ],

    "txt_hint_analyze":
            [
                "sucodo colors any parts of the text it finds suspicious. The more red you see, the more likely the text contains plagiarisms! Use your mouse to inspect them.",
                "sucodo färbt alle Textteile ein, die es als verdächtig eintuft. Je mehr rot im Text zu sehen ist, desto wahrscheinlicher enthält der Text Plagiate. Benutze deine Maus um sie zu untersuchen."
            ],

    "txt_hint_analyze_click":
            [
                "Click on this phrase to select it. Also: try a double-click. This will bring up a list of all possible sources in a new window.",
                "Klicke auf diesen Abschnitt um ihn zu selektieren. Tipp: Benutze einen Doppelklick um eine Liste von allen möglichen Quellen für die Textstelle in einem neuen Fenster zu sehen."
            ],

    "txt_hint":
            [
                "Hint:",
                "Tip:"
            ],

    "txt_please_wait":
            [
                "sucodo is working for you. Please wait ...",
                "sucodo arbeitet für Dich. Bitte warten ..."
            ],

    "txt_enter_some_text":
            [
                "Enter the text you want to analyze into the textfield below.",
                "Gib den Text, den Du untersuchen willst, in das Textfeld ein."
            ],

    "txt_analyze_now":
            [
                "Go!",
                "Los!"
            ],

    "txt_button_edit":
            [
                    "Edit text",
                    "Text editieren"
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
                "Move your mouse over colored text parts to inspect them.",
                "Bewege deinen Mauszeiger über eingefärbte Textteile, um sie zu untersuchen."
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
                "seconds left",
                "Sekunden übrig"
            ],

    "txt_resultinfo_count":
            [
                "Number of possible sources:",
                "Anzahl der möglichen Quellen:"
            ],

    "txt_inspect":
            [
                "Show me all the other possible sources!",
                "Zeige mir die anderen möglichen Quellen!"
            ],
    "txt_privacy":
            [
                "<strong>Privacy Policy:</strong><br>Sucodo is open source and provided free of charge. It does not use cookies. No personal data except IP addresses are logged (Apache access log). Your IP address may be also transmitted to Blekko while executing Blekko search queries. Sucodo does not log any texts or parts of texts processed through it. However, the number of search queries needed for each text are tracked.",
                "<strong>Privatsphäre:</strong><br>Sucodo ist Open Source und wird kostenlos zur Verfügung gestellt. Es werden keine Cookies benutzt und keine persönlichen Daten außer IP-Adressen gespeichert (Server Log). Durch das Ausführen von Suchanfragen über Blekko wird deine IP auch an Blekko übertragen. Sucodo speichert keine damit untersuchte Texte oder Textteile. Es werden jedoch die Anzahl der Suchanfragen, die für eine Text notwendig sind, getrackt."
            ],
    "txt_privacy_see_also":
            [
                "sucodo utilizes Blekko, which is subject to the following terms & conditions:  <a href=\"http://blekko.com/about/terms\">Blekko - Terms & Conditions</a>",
                "sucodo benutzt Blekko. Dafür gelten folgende Nutzungbedingungen: <a href=\"http://blekko.com/about/terms\">Blekko - Terms & Conditions</a>"
            ],

    "txt_sample_text":
            [
                "Let’s have a moment here and talk about plagiarism. The internet is full of readily available information that is there to be grabbed, some might think. These are the ones who simply hand in a copy of an Wikipedia article as their homework, or use a brilliantly written blog post by someone else as their introduction to their scientific paper. Well, why bother thinking for yourself? You can just go and put together a great paper by simply copying text fragments from all over the internet and gluing them back together. A good work is only one Google or blekko search away? Well, maybe not!\n\nStealing other peoples intellectual properties by not giving them due credit is not a new problem. The modern ideals for originality and against plagiarism appeared in the 18th century, in the context of the economic and political history of the book trade, which will be exemplary and influential for the subsequent broader introduction of capitalism. Originality, that traditionally had been deemed as impossible, was turned into an obligation by the emerging ideology of individualism. In 1755 the word made it into Johnson's influential A Dictionary of the English Language, where he was cited in the entry for copier (One that imitates; a plagiary; an imitator. Without invention a painter is but a copier, and a poet but a plagiary of others.), and in its own entry denoting both A thief in literature (one who steals the thoughts or writings of another) and The crime of literary theft. \n\nThe above paragraph has been shamelessly ripped from Wikipedia to illustrate how sucodo can help you identify plagiarized text parts. You will most likely find most of the hits in that paragraph.",
                "Betrachten wir doch mal für einen Moment das Problem der Plagiate. Das Internet heute ist voller leicht verfügbarer Informationen, die einfach nur darauf einfach übernommen zu werden. So zumindest scheinen einige Leute zu denken. Das sind die Leute, die einfach eine Kopie eines Wikipedia-Artikels als Hausarbeit abgeben, oder einen brillant geschriebenen Blog-Post eines anderen als Einleitung für ihre wissenschaftliche Arbeit benutzen. Warum soll man denn überhaupt noch selbst denken? Man kann schließlich recht einfach eine gute Arbeit einfach aus Fragmenten verschiedener Texte aus dem Internet zusammenbauen. Ein schnelles Ende der wissenschaftlichen Arbeit  ist nur eine Google oder blekko -Suche entfernt? Nun vielleicht nicht!\n\nDer Diebstahl geistigen Eigentums durch die Nichtkennzeichnung von Quellen ist ein verbreitetes Problem.  Im Jahr 2002 erregte eine Artikelserie des Spiegels über eine weit verbreitete „Plagiat-Kultur“ an deutschen Hochschulen einiges Aufsehen. Die Autorin Debora Weber-Wulff, Professorin für Medieninformatik in Berlin, stellt vor allem heraus, wie gering das Unrechtsbewusstsein bei deutschen Studenten und Dozenten ausgeprägt ist. Was in Deutschland bestenfalls als Kavaliersdelikt angesehen werde, könne in amerikanischen Hochschulen zur Exmatrikulation führen. Weber-Wulff hat auch eine Anleitung zur Aufdeckung von Plagiaten verfasst. 2006 befragte Sebastian Sattler für seine Soziologie-Diplomarbeit 226 Soziologie-Studenten zum Thema Plagiate in Universitäts-Hausarbeiten. Er testete Arbeiten von 159 Studierenden und fand in 19,5 % der Arbeiten Plagiate. In einem weiteren Fragebogen-gestützten Teil der Studie wurde festgestellt, dass etwa jeder Fünfte bereits im Studium plagiiert hat und etwas mehr als jeder Zweite in der Schule.\n\nDer vorangehende Abschnitt wurde schamlos aus Wikipedia kopiert. Er soll zeigen, wie sucodo helfen kann, kopierte Textteile zu erkennen. Es ist sehr wahrscheinlich, dass die meisten Treffer in diesem Abschnitt zu finden sein werden."
            ],

    "txt_tooltip_help_wordgroup_len":
            [
                "The text is split into word groups (test groups) with a defined number of words in each group. <br>Set the length you want to use for testing.",
                "Der Text wird in Wortgruppen (Testgruppen) geteilt, wobei jede Wortgruppe eine definierte Länge hat.<br> Setze hier die Länge, die Du zum Testen benutzen möchtest."
            ],

    "txt_settings":
            [
                "Settings",
                "Einstellungen"
            ],

    "txt_close":
            [
                "[x]"
            ],

    "txt_settings_close":
            [
                "accept and close",
                "übernehmen und schließen"
            ],

    "txt_most_likely_source":
            [
                "Most likely source:",
                "Wahrscheinlichste Quelle:"
            ],

    "txt_show_results":
            [
                "Results",
                "Ergebnisse"
            ],

    "txt_percent_suspicious":
            [
                "#percent_suspicious# of this text is suspicious.",
                "#percent_suspicious# dieses Textes sind verdächtig.",
                { containsVariables: true }
            ],

    "txt_most_used_sources":
            [
                "Most likely used web sources:",
                "Die wahrscheinlichsten Quellen:"
            ],

    "txt_result_negative":
            [
                "This text seems to be clean. No guaranties, though.",
                "Dieser Text scheint in Ordnung zu sein. Garantien gibt es aber leider keine."
            ],

    "txt_result_suspicious":
            [
                "This text may contain plagiarims.",
                "Dieser Text könnte Plagiate beinhalten."
            ],

    "txt_result_positive":
            [
                "Next steps:<br>You can go through the text below and check any reddish parts by moving your mouse over them or clicking them. You need to manually check if the suspicious text parts were really copied without proper quotes.",
                "Nächste Schritte:<br> Du kannst nun den Text durchgehen und alle rötlichen Textteile untersuchen, in dem Du Deine Maus darüber bewegst oder auf sie klickst. Eine manuelle (menschliche) Untersuchung aller verdächtigen Textstellen ist notwendig, um abschließend klären zu können, ob diese tatsächlich nur kopiert oder doch richtig zitiert wurden."
            ],

    "txt_show_all_sources":
            [
                "Show All Sources",
                "Alle Quellen anzeigen"
            ],

    "txt_show_less_sources":
            [
                "Show Most Likely Sources Only",
                "Zeige wahrscheinlichste Quellen"
            ],

    "txt_ignore":
            [
                "ignore",
                "ignorieren"
            ],

    "txt_include":
            [
                "include",
                "einbeziehen"
            ],

    "last element":
            [
                "",
                ""
            ]
};

