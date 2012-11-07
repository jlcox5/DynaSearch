% ----------------------------------------------------------------------
% -- Class definition
% ----------------------------------------------------------------------
\NeedsTeXFormat{LaTeX2e}
\DeclareOption{preprint}{\AtBeginDocument{\doublespacing}}
\DeclareOption{review}{\AtBeginDocument{ \pagewiselinenumbers \doublespacing}}
\DeclareOption{equation}{\AtBeginDocument{\numberwithin{equation}{section}}} %numbering equation as section
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions
\LoadClass[onecolumn,twoside,letterpaper,10pt,titlepage]{article}

% ----------------------------------------------------------------------
% -- Packages
% ----------------------------------------------------------------------
\RequirePackage{latexsym}
\RequirePackage{amssymb,amsfonts,amsmath,amsthm}
\RequirePackage[dvips]{graphicx,epsfig}
\RequirePackage[T1]{fontenc}
\RequirePackage{arial}
\RequirePackage{palatino}
\RequirePackage{times}
\RequirePackage{fancyhdr}
\RequirePackage{sectsty}
\usepackage{appendix}
\usepackage{arial}
\usepackage{amsbsy}
\usepackage{amsfonts}
\usepackage{amsmath}
\usepackage{amsthm}
\usepackage{amssymb}
\usepackage{bm}
\usepackage{caption}
\usepackage{changebar}
\usepackage{datetime}
\usepackage{epsfig}
\usepackage{enumerate}
\usepackage{fancybox,amssymb}
\usepackage{fancyhdr}
%\usepackage{floatflt}
\usepackage[OT1]{fontenc}
\usepackage{graphicx}
\usepackage[dvips]{graphicx}
\usepackage{latexsym}
\usepackage{lineno}
\usepackage{longtable}
\usepackage[sort&compress,numbers]{natbib}
\usepackage[nice]{nicefrac}
\usepackage{overpic}
\usepackage{palatino}
\usepackage{pstricks}
\usepackage{setspace}
\usepackage{stfloats}
%\usepackage{subfigure,amsmath}
\usepackage{type1cm}
\usepackage{type1ec}
\usepackage{textfit}
\usepackage{upgreek}
 

%\newfont{\palatb}{pplb8r at 16pt}
\cbcolor{black}
% ----------------------------------------------------------------------
% -- Page settings
% ----------------------------------------------------------------------
%\linespread{1}

\bfseries
\oddsidemargin=1.5mm
\evensidemargin=1.5mm
\setlength{\textwidth}{39pc}
\setlength{\textheight}{8.3in}
\voffset -1pc %верх
\hfuzz2pc
\headsep 3pc
\marginparsep 0pt
\voffset -0.34in
\hoffset -4pt

% ----------------------------------------------------------------------
% -- date
% ----------------------------------------------------------------------

\newdateformat{mydate}{%
\twodigit{\THEMONTH}/\twodigit{\THEDAY}/\THEYEAR}
\newdateformat{myyear}{%
\twodigit{\THEYEAR}}

 

% ----------------------------------------------------------------------
% -- Title
% ----------------------------------------------------------------------
%\providecommand{\address}[1]{\date{\small\it#1}}
%\providecommand{\email}[2]{\footnote[0]{\sups{#1}\small\texttt{#2}}}
\def\authorhead#1{\gdef\@authorhead{#1}}
\def\titlehead#1{\gdef\@titlehead{#1}}
%\def\address#1{\gdef\@address{#1}}
%\def\email#1{\gdef\@email{#1}}
\def\dataO#1{\gdef\@dataO{#1}}
\def\dataF#1{\gdef\@dataF{#1}}
\def\volume#1{\gdef\@volume{#1}}
 

\let\comma\@empty
\let\tnotesep\@empty
\def\title#1{\gdef\@title{#1}}
\let\@title\@empty

\def\begLabel#1{\@bsphack\protected@write\@auxout{}%
         {\string\Newlabel{#1}{\@currentlabel}}\@esphack}
\def\Newlabel#1#2{\expandafter\xdef\csname X@#1\endcsname{#2}}

\def\begRef#1{\@ifundefined{X@#1}{0}{\csname X@#1\endcsname}%
}

\def\elsRef#1{\@ifundefined{X@#1}{0}{\csname X@#1\endcsname}%
}

\def\tnotemark[#1]{\textsuperscript{\@for\@@tmark:=#1\do{%
      \edef\tnotenum{\@ifundefined{X@\@@tmark}{1}{\elsRef{\@@tmark}}}%
      \ifcase\tnotenum\or\ding{73}\or,\ding{73}\ding{73}\fi}}%
}
\let\@tnotemark\@empty

\let\@tnotes\@empty
\RequirePackage{pifont}
\newcounter{tnote}
\def\tnotetext[#1]#2{\g@addto@macro\@tnotes{%
  \refstepcounter{tnote}\elsLabel{#1}%
   \def\thefootnote{\ifcase\c@tnote\or\ding{73}\or\ding{73}\ding{73}\fi}%
    \footnotetext{#2}}}

\let\@nonumnotes\@empty
\def\nonumnote#1{\g@addto@macro\@nonumnotes{%
     \let\thefootnote\relax\footnotetext{#1}}}

\newcounter{fnote}
\def\fnmark[#1]{\let\comma\@empty
    \def\@fnmark{\@for\@@fnmark:=#1\do{%
    \edef\fnotenum{\@ifundefined{X@\@@fnmark}{1}{\elsRef{\@@fnmark}}}%
  \unskip\comma\fnotenum\let\comma,}}%
}

\let\@fnotes\@empty\let\@fnmark\@empty
\def\fntext[#1]#2{\g@addto@macro\@fnotes{%
     \refstepcounter{fnote}\elsLabel{#1}%
   \def\thefootnote{\thefnote}%
   \global\setcounter{footnote}{\thefnote}%
   \footnotetext{#2}}}

\def\cormark[#1]{\edef\cnotenum{\elsRef{#1}}%
    \unskip\textsuperscript{\sep\ifcase\cnotenum\or
       $\ast$\or$\ast\ast$\fi\hspace{-1pt}}\let\sep=,}

\let\@cormark\@empty
\let\@cornotes\@empty
\newcounter{cnote}
\def\cortext[#1]#2{\g@addto@macro\@cornotes{%
    \refstepcounter{cnote}\elsLabel{#1}%
    \def\thefootnote{\ifcase\thecnote\or$\ast$\or
    $\ast\ast$\fi}%
    \footnotetext{#2}}}

\let\@corref\@empty
\def\corref#1{\edef\cnotenum{\elsRef{#1}}%
    \edef\@corref{\ifcase\cnotenum\or
         $\ast$\or$\ast\ast$\fi\hskip-1pt}}

\def\fnref#1{\fnmark[#1]}
\def\tnoteref#1{\tnotemark[#1]}

\def\resetTitleCounters{\c@cnote=0
   \c@fnote=0 \c@tnote=0 \c@footnote=0}

 

\let\emailsep\@empty
\let\@allNonCorrEmail\@empty        %%kk
\let\@beguads\@empty
\let\@cormark\@empty
\def\hashchar{\expandafter\@gobble\string\~}
\def\underscorechar{\expandafter\@gobble\string\_}
\def\lbracechar{\expandafter\@gobble\string\{}
\def\rbracechar{\expandafter\@gobble\string\}}

\def\email{\@ifnextchar[{\@uad}{\@email}}
\gdef\@email#1{\bgroup\def\_{\string\underscorechar\space}%
  \def\{{\string\lbracechar\space}%
   \def~{\hashchar\space}%
   \def\}{\string\rbracechar\space}%
   \edef\tmp{\the\@emailauthor}
   \immediate\write\@auxout{\string\emailauthor
     {#1}{\expandafter\strip@prefix\meaning\tmp}}%
  \egroup
}


%\newcounter{email}
%\gdef\emailcorrauthor#1#2{\stepcounter{email}%
%     \g@addto@macro\@allemail{\raggedright%
%      \let\corref\@gobble
%      \emailsep{#2} E-mail: #1\def\emailsep{\unskip \space\space and \space}}%
      %\emailsep E-mail: #1\def\emailsep{\unskip \space\space and \space}}%
%}
\newcounter{email}
\gdef\emailauthor#1#2{\stepcounter{email}%
     \g@addto@macro\@allNonCorrEmail{\raggedright%      %%sk
      \let\corref\@gobble
      \emailsep{#2} E-mail: #1\def\emailsep{\unskip \space\space and \space}}%
      %\emailsep E-mail: #1\def\emailsep{\unskip \space\space and \space}}%
}

\def\begauthors{}
\def\pprinttitle{}
\let\authorsep\@empty
\let\sep\@empty
\newcounter{author}
\def\author{\stepcounter{author}\@ifnextchar[{\@@author}{\@author}}
\newcounter{corrauthor}
\def\corrauthor{\@ifnextchar[{\@@corrauthor}{\@corrauthor}}


%\tracingmacros=1
\def\authorCommaList{}
\let\authorAndSep\@empty

\newtoks\@emailauthor
\def\@@author[#1]#2{
    \let\begauthors=\authorCommaList
    \g@addto@macro\begauthors{%%
        \def\baselinestretch{1}%%
        \gdef\tempSuperscript{\textsuperscript{\@for\@@affmark:=#1\do{\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}\unskip\sep\affnum\let\sep=,}}}
        \authorAndSep#2\unskip\tempSuperscript%\textsuperscript{%%
            %\@for\@@affmark:=#1\do{%
            %\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            %\unskip\sep\affnum\let\sep=,}%
         %}%%
    }
    \g@addto@macro\authorCommaList{%
         \def\baselinestretch{1}%%
         \authorsep#2\unskip\comma\textsuperscript{%%
            \@for\@@affmark:=#1\do{%
            \edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            \unskip\sep\affnum\let\sep=,}%%
         }\space %%
        %\def\authorsep{\unskip, \space}%%
        \def\authorAndSep{\unskip\space \& \space}%%
    }
    \@emailauthor={#2}
}


\def\@author#1{
    \let\begauthors=\authorCommaList
    \g@addto@macro\begauthors{%%
        \def\baselinestretch{1}%%
        \authorAndSep#1\unskip\textsuperscript{%%
            %\@for\@@affmark:=#1\do{%
            %\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            %\unskip\sep $^*$\let\sep=,%}%
         }%%
    }
    \g@addto@macro\authorCommaList{%
         \def\baselinestretch{1}%%
         \authorsep#1\unskip\comma\textsuperscript{%%
            %\@for\@@affmark:=#1\do{%
            %\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            \unskip\sep \let\sep=,%}%%
         }\space %%
        %\def\authorsep{\unskip, \space}%%
        \def\authorAndSep{\unskip\space \& \space}%%
    }
    \@emailauthor={#1}
    
    }
    
    \def\authorsep{%
\ifnum \c@author = 2%
   \def\comma{}%
      \else%
    \def\comma{,}%
     \fi}


%\tracingmacros=1

%%%kk

\def\corrAuthorName{}
\def\corrAuthorEmail{}
\def\@@corrauthor[#1]#2{\stepcounter{author}%fix for counter author
    %\author[#1]{#2}
        \let\begauthors=\authorCommaList
    \g@addto@macro\begauthors{%%
        \def\baselinestretch{1}%%
        \authorAndSep#2\unskip\textsuperscript{%%
            \@for\@@affmark:=#1\do{%
            \edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            \unskip\sep\affnum,\let\sep=,}%
            $*$
         }
    }
    \g@addto@macro\authorCommaList{%
         \def\baselinestretch{1}%%
         \authorsep#2\unskip\comma\textsuperscript{%%
            \@for\@@affmark:=#1\do{%
            \edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            \unskip\sep\affnum\let\sep=,}%%
         }\unskip\textsuperscript{,$*$}\space %%
        %\def\authorsep{\unskip, \space}%%
        \def\authorAndSep{\unskip\space \& \space}%%
    }
    \@emailauthor={#2}
    \def\corrAuthorName{#2}     % use |corrAuthorName|
}


\def\@corrauthor#1{\stepcounter{author}%fix for counter author
        \let\begauthors=\authorCommaList
    \g@addto@macro\begauthors{%%
        \def\baselinestretch{1}%%
        \authorAndSep#1\unskip\textsuperscript{%%
            %\@for\@@affmark:=#1\do{%
            %\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            %\unskip\sep\affnum,$*$\let\sep=,}%
            $*$
         }%%
    }
    \g@addto@macro\authorCommaList{%
         \def\baselinestretch{1}%%
         \authorsep#1\unskip\comma\textsuperscript{%%
            %\@for\@@affmark:=#1\do{%
            %\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\begRef{\@@affmark}}}%
            %\unskip\sep\affnum,$*$\let\sep=,}%%
            $*$
         }\space %%
        %\def\authorsep{\unskip, \space}%%
        \def\authorAndSep{\unskip\space \& \space}%%
    }
    
    
    \@emailauthor={#1}
    \def\corrAuthorName{#1}     % use |corrAuthorName|
}
\def\corremail#1{
    \def\corrAuthorEmail{#1}     % use |corrAuthorEmail|
}
\def\corrAuthorUrl{}
\def\corrurl#1{
    \def\corrAuthorUrl{#1}     % use |corrAuthorUrl|
}




\def\addressCorrespondenceText{\vspace*{-15pt}\rule[1mm]{4cm}{0.5pt}%
\newline
 \small   %$^*$Address all correspondence to  \corrAuthorName \space E-mail: \corrAuthorEmail    %%kk
          $^*$Correspond to: \corrAuthorName, \space E-mail: \corrAuthorEmail\corrAuthorUrlText
           \newline\newline  %%kk
    }
 
 \def\corrAuthorUrlText{%
       \ifx\corrAuthorUrl\@empty\else{\small,\space
 URL: \corrAuthorUrl } \fi% %kk
}
    
\def\addressOtherCorrespondenceText{
       \ifx\@allNonCorrEmail\@empty \else {\newline
\small Other address  \@allNonCorrEmail \newline\newline} \fi% %kk
}
%%%kk



\newcommand\fottitle{
\addressCorrespondenceText
%\addressOtherCorrespondenceText
 \scriptsize 2152--5080/10/\$35.00\quad \copyright~\myyear\today~  by Begell House,
  Inc. 
}

\def\title#1{
\uppercase{\def\uptitle{#1}}
}



\def\begaddress{}
\def\addsep{\par\vskip10pt}
\def\address{\@ifnextchar[{\@@address}{\@address}}

\def\@alph#1{%
  \ifcase#1\or 1\or 2\or 3\or 4\or 5\or 6\or 7\or 8\or 9\or 10\or 11\or 12
    \else\@ctrerr\fi}

\newcounter{affn}
\renewcommand\theaffn{\alph{affn}}

\long\def\@@address[#1]#2{\g@addto@macro\begaddress{%
    \def\baselinestretch{1}%
     \refstepcounter{affn}
     \xdef\@currentlabel{\theaffn}
     \begLabel{#1}%
        \textsuperscript{\theaffn}#2\vspace{5pt}\par}}


%\long\def\@address#1{\g@addto@macro\begauthors{%
%    \def\baselinestretch{1}%
%    \addsep\footnotesize\itshape#1\def\addsep{\par\vskip6pt}%
%    \def\authorsep{\par\vskip8pt}}}

\long\def\@address#1{\g@addto@macro\begaddress{%
    \def\baselinestretch{1}%
      \xdef\@currentlabel{\theaffn}
     \begLabel{#1}%
    \textsuperscript{\theaffn}#1\par}}


  \setlength{\changebarsep}{70pt}

\def\cb@positions{%
  \global\cb@odd@left=\hoffset
  \global\cb@even@left\cb@odd@left
  \global\advance\cb@odd@left by \oddsidemargin
  \global\cb@odd@right\cb@odd@left
  \global\advance\cb@odd@right by \textwidth
  \global\advance\cb@odd@right by -\changebarsep
  \global\advance\cb@odd@right by -0.5\changebarwidth
  \global\advance\cb@odd@left by \changebarsep
  \global\advance\cb@odd@left by 0.5\changebarwidth
 
}
 \footskip  0pc   
\gdef\@authorhead{\texttt{no authorhead given}}
% -- new maketitle
\headsep 2pc
\footskip  0pc
\renewcommand\maketitle{
\clearpage
   \thispagestyle{plain}
  \let\footnotesize\small
  %\let\footnoterule\relax
  %\let \footnote \thanks
\setlength{\textwidth}{39pc}
\setlength{\textheight}{8.2in}
\topmargin 0pt
\footskip  0pc
{
\newcommand{\PalatinoItalicLar}{\fontencoding{T1}\fontfamily{ppl}\fontseries{b}\fontshape{n}\fontsize{16pt}{18pt}\selectfont}
\newcommand{\PalatinoItalicFiveten}{\fontencoding{T1}\fontfamily{ppl}\fontseries{b}\fontshape{it}\fontsize{13pt}{15pt}\selectfont}
\newcommand{\PalatinoItalicEleven}{\fontencoding{T1}\fontfamily{ppl}\fontseries{m}\fontshape{it}\fontsize{11pt}{13pt}\selectfont}
\newcommand{\PalatinoItalicTen}{\fontencoding{T1}\fontfamily{ppl}\fontseries{b}\fontshape{n}\fontsize{10pt}{12pt}\selectfont}
\newcommand{\PalatinoItalicNor}{\fontencoding{T1}\fontfamily{ppl}\fontseries{m}\fontshape{it}\fontsize{10pt}{12pt}\selectfont}
\newcommand{\PalatinoItalicNine}{\fontencoding{T1}\fontfamily{ppl}\fontseries{m}\fontshape{it}\fontsize{9pt}{11pt}\selectfont}
 \parbox{31pc}
{%\vtspace*{30pt}
\rule{0pt}{20pt}
\hskip -0.4cm
 \centering \begin{tabular}{|l}
  \hskip 0.3cm
  \vspace*{-10pt}
   \parbox{15cm}{
   {\vspace*{-15pt}\section*     {\PalatinoItalicLar\uptitle } \par}
    \vskip 0.6cm%
    \hskip 0cm\parbox{15cm}{ {\PalatinoItalicFiveten \begauthors}
    \vskip 0.6cm%
      {\PalatinoItalicEleven \begaddress }

  \vskip 0.2cm%


 {\PalatinoItalicEleven     Original Manuscript Submitted: \@dataO; Final Draft Received: \@dataF
}
  \vskip 0.5cm%

% -- abstract
\newenvironment{@wqabs}
{\list{}{\listparindent 0em%
         \itemindent \listparindent
         \leftmargin 0in%
         \rightmargin \leftmargin
         \parsep \z@ \@plus \p@}%
         \item\relax}
{\endlist}

\begin{@wqabs}\centering
\parbox{15cm}{%
 {\PalatinoItalicNine \@abstract}\hskip 0cm\par
\vskip 1pc%
{\centering\PalatinoItalicTen KEY WORDS:}
 {\PalatinoItalicNor \@keywords}
}
\end{@wqabs}\vspace*{-8pt}
}}


   \end{tabular} \rule{0pt}{30pt} }
 }

\vskip 0pt
  \@thanks
     \pagestyle{fancy}
\setlength{\columnsep}{1pc}
\setlength{\textwidth}{39pc}
\setlength{\textheight}{8.3in}
\topmargin 5pt
\footskip  3.5pc%posle teksta pered nomerom str.
\headsep 2.5pc%mejdy nomerom str. i nachalom tekcta 
\voffset -0.34in
\hoffset -4pt
  \setcounter{footnote}{0}%
  \global\let\thanks\relax
  \global\let\maketitle\relax
  \global\let\and\relax
}

\topmargin 5pt
\footskip  3.5pc%posle teksta pered nomerom str.
\headsep 2.5pc%mejdy nomerom str. i nachalom tekcta 
\voffset -0.34in
\hoffset -4pt
\renewcommand{\abstract}[1]{\def\@abstract{#1}}
\providecommand{\keywords}[1]{\def\@keywords{#1}} %\topmargin 0in
%
%----------------------------------------------------------------------
% -- Headers and footers %
%----------------------------------------------------------------------
\renewcommand{\headrulewidth}{0pt} \fancyhf{}
\fancyhf[FRE]{\small\textit{International Journal for Uncertainty Quantification}}
\fancyhf[FLO]{\small\textbf{\@volume}}
\fancyhf[HRO,HLE]{\fontsize{9}{9}\selectfont{\bf\thepage}}
\fancyhf[HRE]{\fontsize{9}{9}\selectfont{{\@authorhead}}}
\fancyhf[HLO]{\fontsize{9}{9}\selectfont{{\@titlehead}}} %
%----------------------------------------------------------------------
% -- Numbering %
%----------------------------------------------------------------------
%\numberwithin{equation}{section}
\renewcommand{\theenumi}{\roman{enumi}}
\renewcommand{\theenumii}{\roman{enumi}.\arabic{enumii}}
\renewcommand{\labelenumii}{\theenumii.}
\renewcommand{\labelitemi}{\labelitemii} %
%----------------------------------------------------------------------
% -- Sectioning %
%----------------------------------------------------------------------
% \def\@seccntformat#1{\csname the#1\endcsname.\;\,}

\def\@seccntformat#1{\csname pre#1\endcsname\csname
the#1\endcsname
                \csname post#1\endcsname}
\let\@Tocseccntformat\@seccntformat
\def\@postskip@{\hskip.5em\relax} \def\postsection{.\@postskip@}
\def\postsubsection{.\@postskip@}
\def\postsubsubsection{.\@postskip@}
\def\postparagraph{.\@postskip@}
\def\postsubparagraph{.\@postskip@} \def\presection{}
\def\presubsection{} \def\presubsubsection{} \def\preparagraph{}
\def\presubparagraph{}


\renewcommand\section{\@startsection{section}{1}{\z@}%
                                   {-3.5ex \@plus -1ex \@minus -.2ex}%
                                   {1.5ex \@plus.2ex}%
                                   {\sf\normalsize\bfseries\uppercase}}
\renewcommand\subsection{\@startsection{subsection}{2}{\z@}%
                                     {-3.25ex\@plus -1ex \@minus -.2ex}%
                                     {1.5ex \@plus .2ex}%
                                     {\sf\normalsize\bfseries}
                                     }
\renewcommand\subsubsection{\@startsection{subsubsection}{3}{\z@}%
                                     {-3.25ex\@plus -1ex \@minus -.2ex}%
                                     {1.5ex \@plus .2ex}%
                                     {\sf\it}}
                                   
                                     
\renewcommand\appendix{\par
  \setcounter{section}{0}%
  \setcounter{subsection}{0}%
  \setcounter{equation}{0}
  \gdef\thefigure{\@Alph\c@section.\arabic{figure}}%
  \gdef\thetable{\@Alph\c@section.\arabic{table}}%
  \gdef\thesection{\appendixname\@Alph\c@section}%
  \@addtoreset{equation}{section}%
  \gdef\theequation{\@Alph\c@section.\arabic{equation}}%
}
\def\appendixname{APPENDIX }


\newcommand\acknowledgements{\section* {ACKNOWLEDGMENTS}%
}





% ----------------------------------------------------------------------
% -- Mathematical environment
% ----------------------------------------------------------------------
% -- theorems & related topics
\theoremstyle{plain}
\newtheorem{theo}{Theorem}[section]
%\newtheorem{prop}[theo]{Proposition}
\newtheorem{lemm}[theo]{Lemma}
\newtheorem{coro}[theo]{Corollary}
% -- definitions & examples
\theoremstyle{definition}
\newtheorem{defi}{Definition}[section]
\newtheorem{axio}{Axiom}[section]
% -- remarks & axioms
\theoremstyle{remark}
\newtheorem{rema}{Remark}[section]
\newtheorem{exam}{Example}[section]
% -- algorithms
\newtheoremstyle{algostyle}% name
  {}%      Space above, empty = `usual value'
  {}%      Space below
  {}%         Body font
  {}%         Indent amount (empty = no indent, \parindent = para indent)
  {\bfseries}% Thm head font
  {}%        Punctuation after thm head
  {\newline}% Space after thm head: \newline = linebreak
  {\thmname{#1}\thmnumber{ #2.}{ \texttt{[#3]}}}% Thm head spec
\theoremstyle{algostyle}
\newtheorem{algo}{Algorithm}
%
\def\ten#1{{\oalign{$\bf #1$\crcr\hidewidth$\scriptscriptstyle\sim$\hidewidth}}}
\def\tenq#1{\ten{\ten{#1}}} % tenseur d'ordre 4
\def\dten#1{\dot\ten{#1}} % derivee tenseur d'ordre 2
%
%\renewcommand\vec[1]{{\bf \underline{#1}}}
\newcommand\vect[1]{\vec{#1}}
\def\dvec#1{\dot\vect{#1}} % derivee vecteur
\def\FE2{$\hbox{FE}^2$}
%
%
\def\espacev{\vbox to 5mm{\vfill\vfill}}
\def\fe2{{\smash{$\hbox{FE}^2$}}}
\def\trace#1{\hbox{\bf Tr}#1}
\def\ronde#1{{\cal #1}}
\def\trans#1{{}^t#1}
\def\transp#1{{}^t#1}
\def\norm#1{||#1||}
\def\rang#1{\hbox{\bf rang}#1}
%
%
\def\code#1{{\tt #1}}
\def\zebu{{\bf Z\'eBuLoN}\xspace}
%
%\def\double{\baselineskip=35pt}
%\def\simple{\baselineskip=35pt}
%
\def\ds{\displaystyle}
%
\def\bblref#1{\ref{#1}}
\def\zebu{Z\'eBuLoN}
% ----------------------------------------------------------------------
% -- Text macros
% ----------------------------------------------------------------------
\providecommand{\sups}[1]{\raisebox{1ex}{\tiny #1}}
\providecommand{\subs}[1]{\raisebox{-.5ex}{\tiny #1}}
\providecommand{\ie}{i.e.,\;}
\providecommand{\eg}{e.g.,\;}
\providecommand{\ca}{ca.\;}
\providecommand{\cf}{cf.\;}
\providecommand{\etc}{etc.\;}
    \renewcommand{\postsection}{.\;\,}
    \renewcommand{\postsubsection}{\;\,}
    \renewcommand{\postsubsubsection}{\;\,}
    \renewcommand{\scriptsize}{\fontsize{8}{10pt}\selectfont}
    \renewcommand{\small}{\fontsize{9}{11pt}\selectfont}
    \renewcommand{\large}{\fontsize{11}{13pt}\selectfont}
    \renewcommand{\Large}{\fontsize{13}{15pt}\selectfont}
    \renewcommand{\LARGE}{\fontsize{16}{18pt}\selectfont}
\renewcommand{\@makefnmark}{\mathsurround=0pt 
$^{\@thefnmark}$} 
\renewcommand{\@makefntext}[1]{\parindent=1em\noindent {\@makefnmark}#1}

% ----------------------------------------------------------------------
% -- Tables
% ----------------------------------------------------------------------
\captionsetup{labelfont=bf, figurename=FIG., tablename=TABLE}

\renewcommand{\bibsep}{3pt}
    \renewcommand{\bibnumfmt}[1] {\text{#1}. }
    %\renewcommand{\thefootnote}{*}
    \renewcommand{\refname} {\text REFERENCES}
\providecommand{\wstretch}[1]{\def\arraystretch{#1}}


\def\element#1{
 \def\elem{#1}
 }
\def\opis#1{
\def\opi{#1}
}

\def\nomenclature#1{
\def\element#1{
 \def\elem{#1}
 }
\def\opis#1{
\def\opi{#1}
}
 \begin{table*}[!t]\vspace{-2pt}
\centering\begin{tabular}{|llll|} \hline&&&\\[2pt]
\multicolumn{4}{|c|}{{\bf NOMENCLATURE}}  \\&&&\\[0pt]
\elem&
\opi\\
&&&\\[0pt]
\hline
\end{tabular}\vspace{3pt}
\end{table*} 
}



% ----------------------------------------------------------------------
% -- Greek
% ----------------------------------------------------------------------
\renewcommand{\alpha}{\upalpha}
\renewcommand{\beta}{\upbeta}
\renewcommand{\gamma}{\upgamma}
\renewcommand{\delta}{\updelta}
\renewcommand{\epsilon}{\upepsilon}
\renewcommand{\varepsilon}{\upvarepsilon}
\renewcommand{\zeta}{\upzeta}
\renewcommand{\eta}{\upeta}
\renewcommand{\theta}{\uptheta}
\renewcommand{\vartheta}{\upvartheta}
\renewcommand{\iota}{\upiota}
\renewcommand{\kappa}{\upkappa}
\renewcommand{\lambda}{\uplambda}
\renewcommand{\mu}{\upmu}
\renewcommand{\nu}{\upnu}
\renewcommand{\xi}{\upxi}
\renewcommand{\pi}{\uppi}
\renewcommand{\varpi}{\upvarpi}
\renewcommand{\rho}{\uprho}
%\renewcommand{\varrho}{\upvarrho}
\renewcommand{\sigma}{\upsigma}
%\renewcommand{\varsigma}{\upvarsigma}
\renewcommand{\tau}{\uptau}
\renewcommand{\upsilon}{\upupsilon}
\renewcommand{\phi}{\upphi}
\renewcommand{\varphi}{\upvarphi}
\renewcommand{\chi}{\upchi}
\renewcommand{\psi}{\uppsi}
\renewcommand{\omega}{\upomega}




