$(document).ready(function() {
    
    var log = function(msg) {
        if(window.console && console.log) {
            console.log(msg);
        }        
    }
    
    var prettyPrintTabsToSpaces = true;
    
    var editor;
    var editorFontSize = 12;
    var editorTabSize = 4;
    
    editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;
    editor.setTheme("ace/theme/monokai");
    editor.setFontSize(editorFontSize);
    editor.session.setMode("ace/mode/java");
    editor.session.setUseSoftTabs(true);
    editor.session.setTabSize(editorTabSize);
    
    // stores a string of spaces equal to the size of `editorTabSize`
    var spaces = '';
    var setSpaces = function() {
        spaces = '';
        for(var i = 0; i < editorTabSize; i++) {
            spaces += ' ';
        }
    };
    
    // initial run
    setSpaces();
    
    // resize the editor to match window height
    var resizeEditor = function() {
        $('#editor').height($(window).height());
    };
    
    // copy text, undo/redo pretty print
    var prettify = function() {
        var editorText = '';
        if(prettyPrintTabsToSpaces) {
            editorText = editor.getValue().replace(/\t/g, spaces);
        } else {
            editorText = editor.getValue();
        }
        $('#pretty-code').text(editorText);
        
        // applies syntax highlighting to all <pre><code>
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    };
    
    // sets the value of the tab size text box
    $('#set-tab-size').val(editorTabSize);
    
    // focus on text box click
    $('#set-tab-size, #set-ppc-font-size').click(function() {
        $(this).select();
    });
    
    // on tab size changed
    $('#set-tab-size').change(function() {
        editorTabSize = $(this).val();
        editor.session.setTabSize(editorTabSize);
        setSpaces();
        prettify();
    });
    
    // change the formatted text font size
    $('#set-ppc-font-size').change(function() {
        var points = $(this).val();
        var pixels = points * 96 / 72;
        $('#pretty-code').css({ 'font-size' : pixels + 'px' });
        //$('#pretty-code')[0].style.fontSize = $(this).val() + "px";
    });
    
    
    $('#display-font-family').change(function() {
        var font = $(this).find("option:selected").text();
        $('#pretty-code').css('font-family', font);
    });
    
    // toggle the display background color
    var toggleDisplayBackground = function() {
        // i'm getting the opposite expected result here - not sure why so ! reverses it
        if(!this.checked) {
            $('#code-container, #pretty-code').removeClass('initial-background-required');
            prettify();
        } else {
            $('#code-container, #pretty-code').addClass('initial-background-required');
            prettify();
        }
    };
    
    // checkbox clears or keeps background color in prettyprint
    $('#require-initial-background').change(toggleDisplayBackground);

    // replaces tabs with spaces and vise versa
    $('#replace-tabs-with-spaces').change(function() {
        if(!this.checked) {
            prettyPrintTabsToSpaces = false;
        } else {
            prettyPrintTabsToSpaces = true;
        }
        prettify();
    });
    
    // select ACE theme
    $('#select-editor-theme').change(function() {
        editor.setTheme('ace/theme/' + this.value);
        resizeEditor();
        prettify();
    });
    
    // select PRETTIFY theme
    $('#select-pretty-theme').change(function() {
        var href = $(this).val();
        $('.css-theme').attr('disabled', 'disabled');
        $('link[href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/' + href + '"]').removeAttr('disabled');
        prettify();
    });
    
    // select language - ACE and PRETTIFY
    $('#select-language').change(function() {
        editor.session.setMode('ace/mode/' + this.value);
        
        $("#pretty-code").removeClass(function (index, css) {
            // http://stackoverflow.com/a/5182103/1161948
            return (css.match (/(^|\s)lang-\S+/g) || []).join(' ');
        });
        
        $("#pretty-code").addClass('lang-' + this.value);

        if(this.value === 'sql') {
            $('#select-pretty-theme').val('monokai.min.css');
            $('#require-initial-background').prop('checked', false);
            toggleDisplayBackground();
            $('#select-pretty-theme').change();
        }
        prettify();
    });
    
    // highlight text from the selected ID
    var selectText = function(containerid) {
        var node = document.getElementById(containerid);
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNodeContents(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    };
    
    // highlight text then copy to clipboard
    $('#copy-to-clipboard').click(function() {
        selectText('pretty-code');
        document.execCommand('copy');
    });

    // copy editor code to prettyprint
    editor.on('input', prettify);

    // resize editor when window changes
    $(window).resize(resizeEditor);
    
    // set initial editor size
    resizeEditor();
});
