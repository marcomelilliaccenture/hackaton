"""Pattern tables for slop_scan.py — data only, no logic.

Kept separate so the tables can be extended without touching the measurement code, and so
neither file grows past the point where it can be read in one sitting.

Era tags on the vocabulary families matter. The lexical layer of AI writing decays: a
2023-era word is weak evidence in 2026, a current-era one is stronger. Structural measures
in slop_scan.py do not decay the same way, which is why the audit weights them higher
(see references/structure-epistemics.md).

Adding a pattern: put it in the category whose fix it shares, keep it lowercase (all
matching is case-insensitive), and prefer a phrase over a bare common word — a single word
with no context produces false positives the audit then has to argue down.
"""

# --------------------------------------------------------------------------- markers
# Era tags matter: the lexical layer decays, so a 2023-era hit is weaker evidence in 2026
# than a current-era one. See references/humanize.md Category 5.
EN_MARKERS = {
    "opener_cliche": [
        r"in today'?s (fast[- ]paced|rapidly evolving|digital|ever[- ]changing)",
        r"in an era where", r"in the (ever[- ]changing|evolving) (landscape|world)",
        r"let'?s (dive in|explore)", r"without further ado",
        r"have you ever wondered", r"imagine a world where", r"picture this",
        r"it'?s no secret that", r"as we all know", r"we all know that",
        r"in this (article|document|report|deck),? we('| wi)ll (explore|cover|look)",
        r"welcome to (our|this) comprehensive",
        r"whether you'?re a (beginner|novice) or an? (expert|professional)",
    ],
    "filler": [
        r"it'?s (worth|important|crucial|critical|essential) to (note|understand|remember|consider|mention)",
        r"it should be (noted|mentioned) that", r"it goes without saying", r"needless to say",
        r"keep in mind that", r"one must remember", r"results may vary",
        r"at the end of the day", r"when all is said and done",
        r"the fact of the matter is", r"as a matter of fact",
        r"for all intents and purposes", r"by and large", r"all things considered",
        r"in a nutshell", r"(with |having )?that (being |)said",
    ],
    "transition": [
        r"^\s*(furthermore|moreover|additionally|consequently|thus|hence)\b",
        r"\b(furthermore|moreover|additionally),", r"in addition to this",
        r"on top of that", r"first and foremost", r"last but not least",
        r"when it comes to", r"in the (realm|landscape) of", r"at its core",
    ],
    "inflated_significance": [
        r"(stands|serves) as a (testament|reminder)",
        r"plays? a (vital|significant|crucial|pivotal|key) role",
        r"(underscores|highlights) (its|the) (importance|significance)",
        r"reflects? (a |)broader (trends?|debates?|shifts?)",
        r"a (key turning point|pivotal moment)", r"left an indelible mark",
        r"(enduring|lasting) legacy", r"cannot be overstated", r"setting the stage for",
    ],
    "promotional": [
        r"boasts? (a|an|\d)", r"rich (heritage|history|tapestry)", r"\brenowned\b",
        r"nestled in", r"in the heart of", r"breathtaking", r"stunning",
        r"(groundbreaking|cutting[- ]edge|state[- ]of[- ]the[- ]art)",
        r"(diverse array|wide range) of", r"commitment to excellence",
        r"continues to (captivate|inspire)", r"seamlessly", r"effortlessly",
    ],
    "negative_parallelism": [
        r"not just [^.,;]{1,40}(,| but)", r"not only [^.,;]{1,40}, but also",
        r"(it|this|that)'?s not [^.,;]{1,30}, it'?s", r"isn'?t (just |)[^.,;]{1,30}; it'?s",
        r"less about [^.,;]{1,30} than about", r"rather than\b",
        r"[Tt]hat'?s not [A-Za-z][^.!?]{0,40}\.\s+[Tt]hat'?s",
    ],
    "participle_padding": [
        r", (highlighting|underscoring|emphasizing|reflecting|symbolizing|ensuring|showcasing|demonstrating|fostering|cementing|solidifying|contributing to)\b",
    ],
    "vague_attribution": [
        r"experts (argue|believe|note|say)", r"observers have (noted|cited)",
        r"analysts suggest", r"some critics (argue|note)", r"industry reports (show|suggest)",
        r"widely (regarded|recognized) as", r"(several|multiple) (publications|outlets|scholars|sources)",
        r"is described as",
    ],
    "copula_avoidance": [
        r"\bserves as\b", r"\bstands as\b", r"\bacts as\b", r"\bfunctions as\b",
        r"\brepresents\b", r"\bfeatures\b", r"\bboasts\b", r"\bmaintains\b",
        r"\brefers to the (practice|process|concept)", r"holds the distinction of being",
    ],
    "dramatization": [
        r"game[- ]chang", r"changes the game", r"revolutioni[sz]e", r"radically transform",
        r"take (it|this|things) to the next level", r"unlock the full potential",
        r"paradigm shift", r"poised to reshape", r"the future of \w+ is here",
    ],
    "fake_casual": [
        r"honestly,", r"let'?s be (honest|real)", r"here'?s the thing",
        r"spoiler( alert)?:", r"the secret sauce", r"plot twist:", r"here'?s the kicker",
        r"in plain english",
    ],
    "self_summary": [
        r"^\s*(in (conclusion|summary)|to sum up|all in all|overall|to wrap (things |)up)\b",
        r"\b(in conclusion|in summary|to sum up|all in all),", r"as we'?ve seen",
        r"the bottom line is", r"so there you have it",
        r"ultimately, \w+ is more than (just|)",
    ],
    "challenges_template": [
        r"despite (its|these|the) (challenges|limitations|constraints)",
        r"challenges and (future |)(outlook|prospects|directions)",
        r"(only time will tell|the future is bright|exciting times)",
        r"potential future developments",
    ],
    "empty_merism": [
        r"from (startups|start-ups) to enterprises", r"from concept to launch",
        r"from beginners to (professionals|experts)", r"from \w+ to \w+ alike",
    ],
    "chatbot_artifact": [
        r"i hope this helps", r"^\s*(certainly|of course|sure)[!,]", r"you'?re absolutely right",
        r"as of my (last (update|training)|knowledge cutoff)", r"would you like me to",
        r"let me know if", r"based on (the |)available information",
        r"in the provided search results", r"while specific details are (limited|scarce)",
        r"great question", r"as an ai language model",
    ],
    "placeholder": [
        r"\[your name\]", r"\[(describe|insert|add)[^\]]{0,40}\]", r"\[cite: ?\d+\]",
        r"20\d\dXX|20XX-XX", r"INSERT_[A-Z_]+|PASTE_[A-Z_]+",
        r"turn\d+(search|image|view)\d+", r"oai_?cit(ation|e)", r"contentReference",
        r"utm_source=(chatgpt|openai|copilot)", r"referrer=grok",
    ],
    "authority_hook": [
        r"the real question", r"what really matters", r"the deeper issue",
        r"heart of the matter", r"here'?s what (that|this) means in practice",
        r"the part that (matters|got me)", r"let that sink in", r"make no mistake",
        r"take a step back",
    ],
    "verdict_verb": [
        r"\b(quietly )?(kills|demolishes|buries|destroys|obliterates) (the|this|that|any)\b",
        r"\bputs? (it|that|this) to bed\b",
    ],
    "vocab_era_2023": [
        r"\bdelve\b", r"\btapestry\b", r"\btestament\b", r"\bintricate(ly|cies)?\b",
        r"\bmeticulous(ly)?\b", r"\bpivotal\b", r"\bgarner(ed|s)?\b", r"\bbolster(ed|s)?\b",
        r"\binterplay\b", r"\bvibrant\b", r"\benduring\b",
    ],
    "vocab_era_2024": [
        r"\balign(s|ed)? with\b", r"\benhance(s|d)?\b", r"\bfostering\b", r"\brobust\b",
        r"\bunderscore(s|d)?\b", r"\bshowcas(e|es|ing)\b", r"\bleverag(e|es|ing)\b",
        r"\bstreamlin(e|es|ed|ing)\b", r"\bholistic\b", r"\bsynerg(y|ies)\b",
    ],
    "vocab_era_2025": [
        r"\bemphasi[sz]ing\b", r"\bhighlighting\b", r"\bindependent coverage\b",
        r"\bprofiled in\b", r"\bempower(s|ed|ing)?\b", r"\bseamless\b",
    ],
    "vocab_grok": [r"\bcausal\b", r"\bempirical\b", r"\bcorrelate(s|d)?\b"],
}

IT_MARKERS = {
    "opener_cliche": [
        r"nel panorama (attuale|in continua evoluzione)", r"in un'?epoca in cui",
        r"nell'?era (digitale|moderna)", r"al giorno d'?oggi",
        r"in un mondo (sempre più|in continua)", r"scopriamo insieme",
        r"in questo (articolo|documento),? (esploreremo|vedremo|analizzeremo)",
    ],
    "filler": [
        r"è importante (sottolineare|notare|ricordare|considerare)",
        r"vale la pena (notare|sottolineare|ricordare)", r"occorre (notare|sottolineare)",
        r"va (notato|sottolineato|ricordato) che", r"non si può non", r"come è noto",
        r"in altre parole", r"per così dire", r"in ultima analisi",
    ],
    "transition": [
        r"^\s*(inoltre|pertanto|tuttavia|di conseguenza|in aggiunta)\b",
        r"\b(inoltre|pertanto|altresì),", r"in primis", r"ultimo ma non meno importante",
        r"per quanto riguarda", r"a tal proposito", r"in tal senso",
    ],
    "inflated_significance": [
        r"(riveste|svolge) un ruolo (fondamentale|cruciale|chiave|centrale)",
        r"rappresenta un (punto di svolta|tassello|pilastro)",
        r"testimonia(nza)? (di|dell)", r"lascia(ndo)? un segno indelebile",
        r"non può essere sottovalutat", r"pone le basi per",
    ],
    "promotional": [
        r"all'?avanguardia", r"di eccellenza", r"soluzion[ei] innovativ",
        r"un ampio ventaglio di", r"una vasta gamma di", r"rinomat[oa]",
        r"impegno costante", r"senza soluzione di continuità",
    ],
    "negative_parallelism": [
        r"non solo [^.,;]{1,40}, ma anche", r"non (è|si tratta di) [^.,;]{1,30}, (è|ma)",
        r"più che [^.,;]{1,30}, si tratta di",
    ],
    "participle_padding": [
        r", (evidenziando|sottolineando|garantendo|riflettendo|dimostrando|consolidando|contribuendo a)\b",
    ],
    "vague_attribution": [
        r"gli esperti (sostengono|affermano|ritengono)", r"secondo (alcuni|gli) (osservatori|analisti)",
        r"(studi|report) di settore (indicano|mostrano)", r"è (ampiamente |)considerat[oa]",
        r"diverse font[ei]",
    ],
    "copula_avoidance": [
        r"\bsi configura come\b", r"\bsi pone come\b", r"\bfunge da\b",
        r"\bsi presenta come\b", r"\bfa riferimento a(l|lla)? (pratica|processo|concetto)",
    ],
    "dramatization": [
        r"rivoluzionar(e|io|ia)", r"cambia(re)? le regole del gioco",
        r"portare a un livello superiore", r"sbloccare il (pieno |)potenziale",
        r"cambio di paradigma",
    ],
    "self_summary": [
        r"^\s*(in (conclusione|sintesi)|per concludere|riassumendo|in definitiva)\b",
        r"\b(in conclusione|in sintesi|in definitiva),", r"come abbiamo visto",
        r"tirando le somme",
    ],
    "challenges_template": [
        r"nonostante (le|queste) (sfide|criticità)", r"sfide e (prospettive|opportunità) future",
        r"(solo il tempo|il futuro) (lo )?dirà", r"il futuro è (luminoso|promettente)",
    ],
    "authority_hook": [
        r"la vera domanda", r"ciò che conta (davvero|realmente)", r"il nodo (vero|centrale)",
        r"il punto è (questo|che)", r"facciamo un passo indietro",
    ],
    "vocab_generic": [
        r"\bsinerg(ia|ie|ico)\b", r"\bproattiv[oa]\b", r"\bimplementare\b",
        r"\bottimizzare\b", r"\bvalorizzare\b", r"\babilitare\b", r"\brobust[oa]\b",
        r"\bstrategic[oa]\b", r"\bcruciale\b", r"\bfondamentale\b", r"\bintricato\b",
    ],
}

# Epistemics rule C2 in structure-epistemics.md: a normative word with no named baseline
# is an invented threshold. Stored as regexes so Italian inflections match without a
# substring rule that would also fire inside unrelated words.
# Parity rule: these two lists are one list in two languages. They were written separately
# once and drifted -- `robust` sat only on the Italian side, so `robust and innovative
# solutions` measured zero unbaselined norms in English while the same sentence flagged in
# Italian. Two runs on two documents hit that hole. When you add a term, add its counterpart
# or mark it `# language-specific:` with the reason, so the next reader can tell drift from
# intent.
#
# Grouped by family, because coverage failed by family rather than by word: the original
# lists were the RAG/finance vocabulary and nothing else, so a deck of ten unbaselined
# ratings scored zero when it happened to phrase them as capability rather than status.
NORM_WORDS_EN = [
    # status and RAG. The traffic-light words are ratings in a status column even though
    # they read as colours, and a bare Amber with no threshold behind it is the same invented
    # threshold as "healthy" -- it was invisible to this list until a workbook of five ratings
    # measured zero.
    r"\bhealthy\b", r"\bstrong\b", r"\bsolid\b", r"\bacceptable\b", r"\bon track\b",
    r"\bunder control\b", r"\bno (material |)concerns?\b", r"\bmanageable\b",
    r"\bstable\b", r"\bpositive\b",
    r"\b(red|amber|green)\b", r"\bRAG\b", r"\bat risk\b", r"\boff track\b",
    # measurement against an unnamed reference
    r"\bin line with\b", r"\bwell within\b", r"\bwithin range\b", r"\bon budget\b",
    r"\bbest practice\b", r"\bindustry standard\b", r"\bbenchmark\b",
    # schedule and delivery
    r"\bon schedule\b", r"\bon time\b", r"\bahead of schedule\b", r"\btimely\b",
    # capability and quality
    r"\brobust\b", r"\bmature\b", r"\bsustainable\b", r"\breasonable\b",
    r"\badequate\b", r"\brealistic\b", r"\bconservative\b", r"\bscalable\b",
    r"\befficient\b", r"\boptimal\b", r"\bproven\b", r"\bbest[- ]in[- ]class\b",
    r"\bworld[- ]class\b", r"\bindustry[- ]leading\b",
    # risk
    r"\blow risk\b", r"\bminimal risk\b", r"\bwithin (our |)risk appetite\b",
]
NORM_WORDS_IT = [
    # stato e RAG
    r"\bsan[oaie]\b", r"\bfort[ei]\b", r"\bsolid[oaie]\b", r"\baccettabil[ei]\b",
    r"\bin linea\b", r"\bsotto controllo\b", r"\bnessuna criticità\b",
    r"\bgestibil[ei]\b", r"\bstabil[ei]\b", r"\bpositiv[oaie]\b",
    r"\b(rosso|giallo|ambra|verde)\b", r"\bRAG\b", r"\ba rischio\b",
    r"\bfuori (piano|rotta)\b",
    # misura rispetto a un riferimento non nominato
    r"\bin linea con\b", r"\bnei limiti\b", r"\bnella norma\b", r"\ba budget\b",
    r"\bbest practice\b", r"\bstandard di settore\b", r"\bbenchmark\b",
    # tempi e consegna
    r"\bnei tempi\b", r"\bin orario\b", r"\bin anticipo\b", r"\bpuntual[ei]\b",
    # capacità e qualità
    r"\brobust[oaie]\b", r"\bmatur[oaie]\b", r"\bsostenibil[ei]\b",
    r"\bragionevol[ei]\b", r"\badeguat[oaie]\b", r"\brealistic[oaie]\b",
    r"\bprudenzial[ei]\b", r"\bscalabil[ei]\b", r"\befficient[ei]\b",
    r"\bottimal[ei]\b", r"\bcollaudat[oaie]\b", r"\bdi eccellenza\b",
    r"\ball'avanguardia\b", r"\bleader di mercato\b",
    # rischio
    r"\brischio (contenuto|basso|limitato)\b", r"\brischio nella norma\b",
]
BASELINE_WORDS = [
    r"\btarget\b", r"\bbudget\b", r"\bplan(ned)?\b", r"\bpiano\b", r"\bobiettiv[oi]\b",
    r"\bbaseline\b", r"\bsla\b", r"\bcontract\b", r"\bcontratto\b", r"\bprior year\b",
    r"\banno precedente\b", r"\bbenchmark\b", r"\bforecast\b", r"\bthreshold\b",
    r"\bsoglia\b", r"\blimite\b", r"\bvs\.?\b", r"\bversus\b", r"\bcompared (to|with)\b",
    r"\brispetto a\b", r"\bguidance\b", r"\bcovenant\b", r"\bpolicy\b",
    r"\bagainst\b", r"\bof plan\b", r"\bdi piano\b", r"\byoy\b",
    r"\byear on year\b", r"\banno su anno\b",
]
# Word-boundary regexes, not substrings: "about" must not fire inside "about the migration"
# and "may" must not fire on "May 2026". The Italian set is deliberately as long as the
# English one — an undercounted Italian hedge ratio reads as uniform confidence, which costs
# 20 points in the clean-slop table.
HEDGES_EN = [
    r"\bprobably\b", r"\bperhaps\b", r"\bmaybe\b", r"\broughly\b", r"\bapproximately\b",
    r"\babout (?=\d)", r"\bwe think\b", r"\bwe believe\b", r"\bappears? to\b",
    r"\bseems?\b", r"\blikely\b", r"\bunlikely\b", r"\bmay\b(?! \d)(?!\s+20\d\d)",
    r"\bmight\b", r"\bcould\b", r"\bwe do not know\b", r"\bwe don't know\b",
    r"\bunclear\b", r"\btends? to\b", r"\bin our view\b", r"\bestimated?\b",
    r"\bso far\b", r"\bat this stage\b", r"\bsubject to\b",
]
HEDGES_IT = [
    r"\bprobabilmente\b", r"\bforse\b", r"\bcirca (?=\d)", r"\bintorno a\b",
    r"\bsembr(a|ano|erebbe)\b", r"\bpare (che|di)\b", r"\bpotrebbe(ro)?\b",
    r"\bdovrebbe(ro)?\b", r"\briteniamo\b", r"\bnon è chiaro\b", r"\bstim(a|iamo|ato)\b",
    r"\bindicativamente\b", r"\btendenzialmente\b", r"\bpresumibilmente\b",
    r"\bverosimilmente\b", r"\bin linea di massima\b", r"\bsalvo\b", r"\ba oggi\b",
    r"\bper ora\b", r"\bal momento\b", r"\bipotesi\b",
]
MONTHS = (r"january|february|march|april|may|june|july|august|september|october|november|december|"
          r"gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre")
IT_STOPWORDS = ["il ", "la ", "di ", "che ", "per ", "con ", "non ", "una ", "dei ", "delle ", "sono ", " è "]
EN_STOPWORDS = ["the ", " of ", " and ", " to ", " in ", " that ", " is ", " for ", " with ", " are "]
